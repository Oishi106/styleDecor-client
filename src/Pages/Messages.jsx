import React from 'react'
import ChatList from '../components/ChatList'

const MessagesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Messages</h2>
        <p className="text-base-content/60">Chat with decorators about your bookings and projects</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ChatList />
      </div>
    </div>
  )
}

export default MessagesPage
