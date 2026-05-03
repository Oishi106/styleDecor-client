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

// Get a single conversation (with messages)
export const getConversation = async (conversationId) => {
  try {
    const response = await axiosInstance.get(`/chat/conversations/${conversationId}`)
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

// Start a new conversation with any participant (decorator/admin/user)
export const startConversation = async (participantId, participantName = 'Participant') => {
  try {
    const response = await axiosInstance.post('/chat/conversations/start', {
      // Backward compatible keys
      decoratorId: participantId,
      decoratorName: participantName,
      // Generic keys for admin/decorator/user chat
      participantId,
      participantName,
      participantEmail: participantId,
      recipientEmail: participantId,
      recipientName: participantName,
      targetEmail: participantId,
      targetName: participantName,
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
