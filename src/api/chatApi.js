import axiosInstance from './axiosInstance'

// Get all conversations for a user
export const getConversations = async () => {
  try {
    const response = await axiosInstance.get('/chat/conversations')
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Get messages for a specific conversation
export const getMessages = async (conversationId) => {
  try {
    const response = await axiosInstance.get(`/chat/conversations/${conversationId}/messages`)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Send a message
export const sendMessage = async (conversationId, messageData) => {
  try {
    const response = await axiosInstance.post(`/chat/conversations/${conversationId}/messages`, messageData)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Start a new conversation with a decorator
export const startConversation = async (decoratorId) => {
  try {
    const response = await axiosInstance.post('/chat/conversations/start', {
      decoratorId
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Mark messages as read
export const markMessagesAsRead = async (conversationId) => {
  try {
    const response = await axiosInstance.put(`/chat/conversations/${conversationId}/read`)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Delete a conversation
export const deleteConversation = async (conversationId) => {
  try {
    const response = await axiosInstance.delete(`/chat/conversations/${conversationId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Get conversation by decorator ID
export const getConversationByDecoratorId = async (decoratorId) => {
  try {
    const response = await axiosInstance.get(`/chat/conversations/decorator/${decoratorId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}
