import React, { useState } from 'react'
import { FaComments, FaPlus } from 'react-icons/fa'
import { useChat } from '../context/ChatProvider'
import Chat from './Chat'

const ChatList = () => {
  const { 
    conversations, 
    currentConversation, 
    setCurrentConversation,
    loading, 
    unreadCount,
    fetchMessages 
  } = useChat()
  const [selectedId, setSelectedId] = useState(null)

  const handleSelectConversation = async (conversation) => {
    setSelectedId(conversation._id)
    setCurrentConversation(conversation)
    await fetchMessages(conversation._id)
  }

  const handleBack = () => {
    setSelectedId(null)
    setCurrentConversation(null)
  }

  // If a conversation is selected, show the chat interface
  if (selectedId) {
    return (
      <Chat 
        conversationId={selectedId} 
        onBack={handleBack}
      />
    )
  }

  return (
    <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-primary text-primary-content border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaComments className="text-2xl" />
            <div>
              <h2 className="text-xl font-bold">Messages</h2>
              {unreadCount > 0 && (
                <p className="text-xs opacity-75">{unreadCount} unread</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="max-h-96 overflow-y-auto">
        {loading && conversations.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-base-content/50">
            <FaComments className="text-4xl mx-auto mb-2 opacity-30" />
            <p>No conversations yet</p>
            <p className="text-sm">Start a chat with a decorator to begin</p>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((conversation) => (
              <button
                key={conversation._id}
                onClick={() => handleSelectConversation(conversation)}
                className="w-full text-left p-4 hover:bg-base-200 transition-colors duration-200 focus:outline-none focus:bg-base-200"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold">{conversation.decoratorName}</h3>
                  {conversation.unreadCount > 0 && (
                    <div className="badge badge-primary badge-sm">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
                <p className="text-sm text-base-content/70 line-clamp-1">
                  {conversation.lastMessage?.text || 'No messages yet'}
                </p>
                <p className="text-xs text-base-content/50 mt-1">
                  {conversation.lastMessageAt
                    ? new Date(conversation.lastMessageAt).toLocaleDateString()
                    : 'Today'}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatList
