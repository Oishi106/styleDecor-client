import React, { useEffect, useState } from 'react'
import { FaComments, FaTimes, FaSearch, FaUser } from 'react-icons/fa'
import { useChat } from '../context/chatContext'
import { useAuth } from '../context/AuthProvider'
import axiosInstance from '../api/axiosInstance'

const roleLabel = (role) => {
  if (role === 'admin') return 'Admin'
  if (role === 'decorator') return 'Decorator'
  return 'User'
}

const roleBadgeClass = (role) => {
  if (role === 'admin') return 'badge-error'
  if (role === 'decorator') return 'badge-primary'
  return 'badge-success'
}

const StartConversationModal = ({ isOpen, onClose }) => {
  const { startNewConversation } = useChat()
  const { user } = useAuth()

  const [contacts, setContacts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')

  // Modal খুললে contact list load করো
  useEffect(() => {
    if (!isOpen) return
    setSelected(null)
    setSearch('')
    setError('')

    const fetchContacts = async () => {
      setFetching(true)
      try {
        const res = await axiosInstance.get('/users/contacts')
        const list = Array.isArray(res.data) ? res.data : []
        setContacts(list)
        setFiltered(list)
      } catch (err) {
        setError('Failed to load contacts')
      } finally {
        setFetching(false)
      }
    }

    fetchContacts()
  }, [isOpen])

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(contacts)
      return
    }
    const q = search.toLowerCase()
    setFiltered(
      contacts.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q)
      )
    )
  }, [search, contacts])

  const handleStartChat = async () => {
    if (!selected) {
      setError('Please select a contact')
      return
    }
    if (!user) {
      setError('Please log in to start a conversation')
      return
    }

    try {
      setLoading(true)
      setError('')
      await startNewConversation(selected.email, selected.name || selected.email)
      setSelected(null)
      setSearch('')
      onClose()
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (typeof err === 'string' ? err : '')
      setError(msg || 'Failed to start conversation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <FaComments className="text-2xl text-primary" />
            <h2 className="text-xl font-bold">Start a Conversation</h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <FaTimes />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full pl-10"
          />
        </div>

        {/* Contact List */}
        <div className="max-h-64 overflow-y-auto border border-base-200 rounded-lg mb-4">
          {fetching ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-base-content/50">
              <FaUser className="text-3xl mx-auto mb-2 opacity-30" />
              <p>No contacts found</p>
            </div>
          ) : (
            filtered.map((contact) => (
              <button
                key={contact._id || contact.email}
                onClick={() => setSelected(contact)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-base-200 transition-colors border-b border-base-200 last:border-0 ${
                  selected?.email === contact.email ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                  {contact.photoURL ? (
                    <img src={contact.photoURL} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    (contact.name || contact.email || 'U').charAt(0).toUpperCase()
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{contact.name || '—'}</p>
                  <p className="text-xs text-base-content/60 truncate">{contact.email}</p>
                </div>

                {/* Role Badge */}
                <span className={`badge badge-sm ${roleBadgeClass(contact.role)}`}>
                  {roleLabel(contact.role)}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Selected Preview */}
        {selected && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 mb-4 flex items-center gap-3">
            <FaComments className="text-primary" />
            <div>
              <p className="font-semibold text-sm">Starting chat with:</p>
              <p className="text-sm text-base-content/70">{selected.name} ({selected.email})</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-error mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartChat}
            className="btn btn-primary gap-2"
            disabled={loading || !selected}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Starting...
              </>
            ) : (
              <>
                <FaComments /> Start Chat
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StartConversationModal