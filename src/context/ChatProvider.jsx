import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import * as chatApi from '../api/chatApi'
import Swal from 'sweetalert2'
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
  const previousUnreadCountRef = useRef(0)

  const extractConversationFromResponse = useCallback((payload) => {
    if (!payload) return null
    if (payload?.data?.conversation && typeof payload.data.conversation === 'object') return payload.data.conversation
    if (payload?.data && typeof payload.data === 'object') return payload.data
    if (payload?.conversation && typeof payload.conversation === 'object') return payload.conversation
    if (typeof payload === 'object') return payload
    return null
  }, [])

  const extractMessageFromResponse = useCallback((payload) => {
    if (!payload) return null
    if (payload?.data?.message && typeof payload.data.message === 'object') return payload.data.message
    if (payload?.message && typeof payload.message === 'object') return payload.message
    if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) return payload.data
    if (typeof payload === 'object' && !Array.isArray(payload)) return payload
    return null
  }, [])

  // Fetch all conversations
  const fetchConversations = useCallback(async (options = {}) => {
    const { silent = false } = options
    try {
      if (!silent) setLoading(true)
      setError(null)
      const data = await chatApi.getConversations()
      const conversationList = Array.isArray(data) ? data : []
      setConversations(conversationList)
      
      // Count total unread messages
      const count = conversationList.reduce((sum, conv) => {
        return sum + (conv.unreadCount || 0)
      }, 0)
      setUnreadCount(count)

      // Show notification if new conversation with unread messages
      conversationList.forEach(conv => {
        if (conv.unreadCount > 0) {
          const senderName = resolveConversationPeer(conv).name || 'Someone'
          // Only show if this is a new conversation (check localStorage)
          const seenConversations = JSON.parse(localStorage.getItem('seenConversations') || '{}')
          const conversationId = getConversationId(conv)
          if (!conversationId) return
          if (!seenConversations[conversationId]) {
            seenConversations[conversationId] = true
            localStorage.setItem('seenConversations', JSON.stringify(seenConversations))
            
            Swal.fire({
              icon: 'info',
              title: 'New Message',
              text: `${senderName} sent you a message`,
              position: 'top-end',
              toast: true,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })
          }
        }
      })
    } catch (err) {
      setError(err?.message || 'Failed to fetch conversations')
      setConversations([])
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  // Fetch a specific conversation from the conversations list.
  // The backend exposes /chat/conversations but not a single-conversation GET route.
  const fetchConversationDetail = useCallback(async (conversationId, options = {}) => {
    const { silent = false } = options
    try {
      if (!silent) setLoading(true)
      setError(null)

      let conversation = null
      try {
        const detail = await chatApi.getConversation(conversationId)
        conversation = extractConversationFromResponse(detail)
      } catch {
        const data = await chatApi.getConversations()
        const conversationList = Array.isArray(data) ? data : []
        conversation = conversationList.find((item) => getConversationId(item) === conversationId) || null
      }

      if (!conversation) {
        throw new Error('Conversation not found')
      }

      if (!silent || getConversationId(currentConversation) !== conversationId) {
        setCurrentConversation(conversation)
      }
      setMessages(Array.isArray(conversation.messages) ? conversation.messages : [])
      
      // Mark as read
      if ((conversation.unreadCount || 0) > 0) {
        await chatApi.markMessagesAsRead(conversationId)
      }
      
      // Update conversations list to remove unread badge
      setConversations(prev => 
        prev.map(conv => 
          getConversationId(conv) === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      )
    } catch (err) {
      setError(err?.message || 'Failed to fetch conversation')
      setMessages([])
    } finally {
      if (!silent) setLoading(false)
    }
  }, [extractConversationFromResponse, currentConversation])

  // Send a message
  const sendNewMessage = useCallback(async (conversationId, text, senderEmail = '') => {
    try {
      setError(null)
      const response = await chatApi.sendMessage(conversationId, { text })
      const message = extractMessageFromResponse(response) || {}

      const normalizedMessage = {
        ...message,
        text: message.text || text,
        sender: message.sender || message.senderEmail || senderEmail || '',
        timestamp: message.timestamp || message.createdAt || new Date().toISOString(),
      }
      
      // Add message to local state
      setMessages(prev => [...prev, normalizedMessage])
      
      // Update conversation last message
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
  }, [extractMessageFromResponse])

  // Start a new conversation
  const startNewConversation = useCallback(async (participantId, participantName = 'Participant') => {
    try {
      setError(null)
      const response = await chatApi.startConversation(participantId, participantName)
      const conversation = extractConversationFromResponse(response)
      if (!conversation) {
        throw new Error('Conversation could not be created')
      }
      const newConversationId = getConversationId(conversation)
      setConversations(prev => {
        const exists = prev.some((conv) => getConversationId(conv) === newConversationId)
        if (exists) return prev
        return [conversation, ...prev]
      })
      setCurrentConversation(conversation)
      setMessages(Array.isArray(conversation.messages) ? conversation.messages : [])
      return conversation
    } catch (err) {
      setError(err?.message || 'Failed to start conversation')
      throw err
    }
  }, [])

  // Get or create conversation with decorator
  const getOrCreateConversation = useCallback(async (participantId, participantName = 'Participant') => {
    try {
      setError(null)
      const normalizedTarget = String(participantId || '').toLowerCase().trim()
      const existing = conversations.find((conv) => {
        const peer = resolveConversationPeer(conv)
        const peerEmail = String(peer?.email || '').toLowerCase()
        if (peerEmail && normalizedTarget) return peerEmail === normalizedTarget
        if (Array.isArray(conv?.participants)) {
          return conv.participants.some((p) => {
            if (typeof p === 'string') return p.toLowerCase() === normalizedTarget
            if (p && typeof p === 'object') {
              const email = String(p.email || p.userEmail || '').toLowerCase()
              const id = String(p.id || p._id || '').toLowerCase()
              return email === normalizedTarget || id === normalizedTarget
            }
            return false
          })
        }
        return false
      })
      if (existing) {
        return existing
      }
      const response = await chatApi.startConversation(participantId, participantName)
      const conversation = extractConversationFromResponse(response)
      if (!conversation) {
        throw new Error('Conversation could not be created')
      }
      setConversations(prev => [conversation, ...prev])
      return conversation
    } catch (err) {
      setError(err?.message || 'Failed to get or create conversation')
      throw err
    }
  }, [conversations, extractConversationFromResponse])

  // Delete conversation
  const deleteConvConversation = useCallback(async (conversationId) => {
    try {
      setError(null)
      await chatApi.deleteConversation(conversationId)
      setConversations(prev => prev.filter(conv => getConversationId(conv) !== conversationId))
      if (getConversationId(currentConversation) === conversationId) {
        setCurrentConversation(null)
        setMessages([])
      }
    } catch (err) {
      setError(err?.message || 'Failed to delete conversation')
      throw err
    }
  }, [currentConversation])

  // Initial fetch on mount - do this once with empty dependency array
  useEffect(() => {
    let mounted = true
    const initFetch = async () => {
      if (mounted) {
        await fetchConversations({ silent: false })
      }
    }
    initFetch()
    return () => { mounted = false }
  }, [])

  // Background refresh for conversation list every 10 seconds
  useEffect(() => {
    const listRefresh = setInterval(() => {
      fetchConversations({ silent: true })
    }, 10000)

    return () => clearInterval(listRefresh)
  }, [])

  // Poll active conversation messages without reloading full page state
  useEffect(() => {
    const activeConversationId = getConversationId(currentConversation)
    if (!activeConversationId) return

    const interval = setInterval(() => {
      fetchConversationDetail(activeConversationId, { silent: true })
    }, 4000)

    return () => clearInterval(interval)
  }, [currentConversation, fetchConversationDetail, getConversationId])

  // Show notification when new messages arrive
  useEffect(() => {
    if (unreadCount > previousUnreadCountRef.current && previousUnreadCountRef.current > 0) {
      const newMessageCount = unreadCount - previousUnreadCountRef.current
      Swal.fire({
        icon: 'info',
        title: 'New Message',
        text: `${newMessageCount} new message${newMessageCount > 1 ? 's' : ''} received`,
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
    }
    previousUnreadCountRef.current = unreadCount
  }, [unreadCount])

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

