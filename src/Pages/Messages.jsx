import React, { useState } from 'react'
import ChatList from '../components/ChatList'
import StartConversationModal from '../components/StartConversationModal'
import { FaPlus } from 'react-icons/fa'
import { useAuth } from '../context/AuthProvider'

const MessagesPage = () => {
  const { role } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const subtitle =
    role === 'admin'
      ? 'Chat with decorators and users to manage assignments and support'
      : role === 'decorator'
        ? 'Chat with admin and users about jobs and project updates'
        : 'Chat with decorators about your bookings and projects'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Messages</h2>
          <p className="text-base-content/60">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary gap-2"
        >
          <FaPlus /> New Chat
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ChatList />
      </div>

      <StartConversationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default MessagesPage
