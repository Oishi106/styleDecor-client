/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import * as chatApi from '../api/chatApi'
import { getConversationId, resolveConversationPeer } from '../utils/chatUtils'

const ChatContext = createContext()

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // ✅ ref দিয়ে currentConversation track করো — useEffect dependency থেকে বাদ
  const currentConversationRef = useRef(null)
  useEffect(() => {
    currentConversationRef.current = currentConversation
  }, [currentConversation])

  // ✅ Fetch all conversations
  const fetchConversations = useCallback(async (options = {}) => {
    const { silent = false } = options
    try {
      if (!silent) setLoading(true)
      setError(null)
      const data = await chatApi.getConversations()
      const conversationList = Array.isArray(data) ? data : []
      setConversations(conversationList)

      const count = conversationList.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0)
      setUnreadCount(count)
    } catch (err) {
      if (!silent) setError(err?.message || 'Failed to fetch conversations')
      setConversations([])
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  // ✅ Fetch single conversation detail
  const fetchConversationDetail = useCallback(async (conversationId, options = {}) => {
    const { silent = false } = options
    if (!conversationId) return
    try {
      if (!silent) setLoading(true)
      setError(null)

      let conversation = null
      try {
        conversation = await chatApi.getConversation(conversationId)
      } catch {
        // fallback: list থেকে খোঁজো
        const data = await chatApi.getConversations()
        const list = Array.isArray(data) ? data : []
        conversation = list.find((item) => getConversationId(item) === conversationId) || null
      }

      if (!conversation) throw new Error('Conversation not found')

      setCurrentConversation(conversation)
      setMessages(Array.isArray(conversation.messages) ? conversation.messages : [])

      // Mark as read
      if ((conversation.unreadCount || 0) > 0) {
        try {
          await chatApi.markMessagesAsRead(conversationId)
        } catch { /* ignore */ }
      }

      // conversations list এ unread badge সরাও
      setConversations(prev =>
        prev.map(conv =>
          getConversationId(conv) === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      )
    } catch (err) {
      if (!silent) setError(err?.message || 'Failed to fetch conversation')
      setMessages([])
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  // ✅ Send message
  const sendNewMessage = useCallback(async (conversationId, text, senderEmail = '') => {
    try {
      setError(null)
      const response = await chatApi.sendMessage(conversationId, { text })

      const normalizedMessage = {
        text: response?.text || text,
        sender: response?.sender || senderEmail,
        timestamp: response?.timestamp || new Date().toISOString(),
        _id: response?._id,
      }

      setMessages(prev => [...prev, normalizedMessage])

      setConversations(prev =>
        prev.map(conv =>
          getConversationId(conv) === conversationId
            ? {
                ...conv,
                lastUpdated: new Date(),
                messages: [...(conv.messages || []), normalizedMessage]
              }
            : conv
        )
      )

      return normalizedMessage
    } catch (err) {
      setError(err?.message || 'Failed to send message')
      throw err
    }
  }, [])

  // ✅ Start new conversation
  const startNewConversation = useCallback(async (participantId, participantName = 'Participant') => {
    try {
      setError(null)
      const conversation = await chatApi.startConversation(participantId, participantName)
      if (!conversation) throw new Error('Conversation could not be created')

      const newId = getConversationId(conversation)
      setConversations(prev => {
        const exists = prev.some(c => getConversationId(c) === newId)
        return exists ? prev : [conversation, ...prev]
      })
      setCurrentConversation(conversation)
      setMessages(Array.isArray(conversation.messages) ? conversation.messages : [])
      return conversation
    } catch (err) {
      setError(err?.message || 'Failed to start conversation')
      throw err
    }
  }, [])

  // ✅ Get or create conversation
  const getOrCreateConversation = useCallback(async (participantId, participantName = 'Participant') => {
    try {
      setError(null)
      const normalizedTarget = String(participantId || '').toLowerCase().trim()

      const existing = conversations.find(conv => {
        if (Array.isArray(conv?.participants)) {
          return conv.participants.some(p => {
            if (typeof p === 'string') return p.toLowerCase() === normalizedTarget
            if (p && typeof p === 'object') {
              return String(p.email || '').toLowerCase() === normalizedTarget
            }
            return false
          })
        }
        return false
      })

      if (existing) return existing

      const conversation = await chatApi.startConversation(participantId, participantName)
      if (!conversation) throw new Error('Conversation could not be created')

      setConversations(prev => [conversation, ...prev])
      return conversation
    } catch (err) {
      setError(err?.message || 'Failed to get or create conversation')
      throw err
    }
  }, [conversations])

  // ✅ Delete conversation
  const deleteConvConversation = useCallback(async (conversationId) => {
    try {
      setError(null)
      await chatApi.deleteConversation(conversationId)
      setConversations(prev => prev.filter(c => getConversationId(c) !== conversationId))
      if (getConversationId(currentConversationRef.current) === conversationId) {
        setCurrentConversation(null)
        setMessages([])
      }
    } catch (err) {
      setError(err?.message || 'Failed to delete conversation')
      throw err
    }
  }, [])

  // ✅ Initial fetch — একবারই চলবে
  useEffect(() => {
    fetchConversations()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ Background refresh — 15 seconds — silent
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations({ silent: true })
    }, 15000)
    return () => clearInterval(interval)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ Active conversation polling — ref দিয়ে করছি তাই infinite loop নেই
  useEffect(() => {
    const interval = setInterval(() => {
      const activeId = getConversationId(currentConversationRef.current)
      if (!activeId) return
      fetchConversationDetail(activeId, { silent: true })
    }, 5000)
    return () => clearInterval(interval)
  }, [fetchConversationDetail])

  const value = {
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    loading,
    error,
    unreadCount,
    fetchConversations,
    fetchConversationDetail,
    sendMessage: sendNewMessage,
    startNewConversation,
    getOrCreateConversation,
    deleteConversation: deleteConvConversation,
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider