import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as chatApi from '../api/chatApi'

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

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await chatApi.getConversations()
      setConversations(Array.isArray(data) ? data : [])
      
      // Count unread messages
      const count = (Array.isArray(data) ? data : []).reduce((sum, conv) => {
        return sum + (conv.unreadCount || 0)
      }, 0)
      setUnreadCount(count)
    } catch (err) {
      setError(err?.message || 'Failed to fetch conversations')
      setConversations([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId) => {
    try {
      setLoading(true)
      setError(null)
      const data = await chatApi.getMessages(conversationId)
      setMessages(Array.isArray(data) ? data : [])
      
      // Mark as read
      await chatApi.markMessagesAsRead(conversationId)
      
      // Update conversations list to remove unread badge
      setConversations(prev => 
        prev.map(conv => 
          conv._id === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      )
    } catch (err) {
      setError(err?.message || 'Failed to fetch messages')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Send a message
  const sendMessage = useCallback(async (conversationId, text) => {
    try {
      setError(null)
      const message = await chatApi.sendMessage(conversationId, { text })
      
      // Add message to local state
      setMessages(prev => [...prev, message])
      
      // Update conversation last message
      setConversations(prev =>
        prev.map(conv =>
          conv._id === conversationId
            ? { ...conv, lastMessage: message, lastMessageAt: new Date() }
            : conv
        )
      )
      
      return message
    } catch (err) {
      setError(err?.message || 'Failed to send message')
      throw err
    }
  }, [])

  // Start a new conversation
  const startNewConversation = useCallback(async (decoratorId) => {
    try {
      setError(null)
      const conversation = await chatApi.startConversation(decoratorId)
      setConversations(prev => [conversation, ...prev])
      setCurrentConversation(conversation)
      setMessages([])
      return conversation
    } catch (err) {
      setError(err?.message || 'Failed to start conversation')
      throw err
    }
  }, [])

  // Get or create conversation with decorator
  const getOrCreateConversation = useCallback(async (decoratorId) => {
    try {
      setError(null)
      const existing = conversations.find(conv => conv.decoratorId === decoratorId)
      if (existing) {
        return existing
      }
      const conversation = await chatApi.startConversation(decoratorId)
      setConversations(prev => [conversation, ...prev])
      return conversation
    } catch (err) {
      setError(err?.message || 'Failed to get or create conversation')
      throw err
    }
  }, [conversations])

  // Delete conversation
  const deleteConversation = useCallback(async (conversationId) => {
    try {
      setError(null)
      await chatApi.deleteConversation(conversationId)
      setConversations(prev => prev.filter(conv => conv._id !== conversationId))
      if (currentConversation?._id === conversationId) {
        setCurrentConversation(null)
        setMessages([])
      }
    } catch (err) {
      setError(err?.message || 'Failed to delete conversation')
      throw err
    }
  }, [currentConversation])

  // Auto-fetch conversations on mount
  useEffect(() => {
    fetchConversations()
    
    // Optional: Poll for new messages every 3 seconds
    const interval = setInterval(() => {
      if (currentConversation) {
        fetchMessages(currentConversation._id)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [fetchConversations, currentConversation, fetchMessages])

  const value = {
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    loading,
    error,
    unreadCount,
    fetchConversations,
    fetchMessages,
    sendMessage,
    startNewConversation,
    getOrCreateConversation,
    deleteConversation,
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}
