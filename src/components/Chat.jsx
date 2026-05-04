import React, { useState, useEffect, useRef } from 'react'
import { FaPaperPlane, FaArrowLeft, FaTrash } from 'react-icons/fa'
import { useAuth } from '../context/AuthProvider'
import { useChat } from '../context/chatContext'
import { getMessageSender, getMessageText, getMessageTimestamp, resolveConversationPeer } from '../utils/chatUtils'

const Chat = ({ conversationId, onBack }) => {
  const { user } = useAuth()
  const { 
    messages, 
    sendMessage, 
    loading, 
    error, 
    fetchConversationDetail, 
    currentConversation,
    deleteConversation 
  } = useChat()
  const [messageText, setMessageText] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (conversationId) {
      fetchConversationDetail(conversationId)
    }
  }, [conversationId, fetchConversationDetail])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim() || !conversationId) return

    setSending(true)
    try {
      await sendMessage(conversationId, messageText, user?.email || '')
      setMessageText('')
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSending(false)
    }
  }

  const handleDeleteConversation = async () => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        await deleteConversation(conversationId)
        onBack()
      } catch (err) {
        console.error('Error deleting conversation:', err)
      }
    }
  }

  if (loading && messages.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  const peer = resolveConversationPeer(currentConversation, user?.email)

  return (
    <div className="flex flex-col h-full bg-base-100 rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-primary text-primary-content border-b">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h3 className="font-bold text-lg">{peer.name}</h3>
            <p className="text-xs opacity-75">{peer.roleLabel}</p>
          </div>
        </div>
        <button
          onClick={handleDeleteConversation}
          className="btn btn-ghost btn-sm btn-circle text-error"
          aria-label="Delete conversation"
          title="Delete conversation"
        >
          <FaTrash />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-base-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-base-content/50">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const sender = getMessageSender(message)
            const myEmail = String(user?.email || '').toLowerCase()
            const isOwn = String(sender || '').toLowerCase() === myEmail
            const messageText = getMessageText(message)
            const timestamp = getMessageTimestamp(message)
            return (
              <div
                key={message._id || index}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn
                      ? 'bg-primary text-primary-content rounded-br-none'
                      : 'bg-base-200 text-base-content rounded-bl-none'
                  }`}
                >
                  <p className="break-all">{messageText}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'opacity-70' : 'opacity-60'}`}>
                    {timestamp
                      ? new Date(timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error alert-sm mx-4 mt-2">
          <p>{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-base-100 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={sending}
            className="input input-bordered flex-1 input-sm"
          />
          <button
            type="submit"
            disabled={!messageText.trim() || sending}
            className="btn btn-primary btn-sm gap-2"
          >
            {sending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <FaPaperPlane /> Send
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat
