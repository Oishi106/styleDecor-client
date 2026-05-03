export const getConversationId = (conversation) => conversation?._id || conversation?.id || ''

export const getMessageText = (message) => {
  if (!message || typeof message !== 'object') return ''
  return message.text || message.message || message.body || ''
}

export const getMessageTimestamp = (message) => {
  if (!message || typeof message !== 'object') return null
  return message.timestamp || message.createdAt || message.sentAt || null
}

export const getMessageSender = (message) => {
  if (!message || typeof message !== 'object') return ''

  if (typeof message.sender === 'string') return message.sender
  if (typeof message.senderEmail === 'string') return message.senderEmail
  if (typeof message.from === 'string') return message.from

  if (message.sender && typeof message.sender === 'object') {
    return message.sender.email || message.sender.id || message.sender._id || ''
  }

  return ''
}

const normalizePerson = (person, fallbackRole) => {
  if (!person) return null

  if (typeof person === 'string') {
    return {
      name: person,
      email: person.includes('@') ? person : '',
      role: fallbackRole || '',
    }
  }

  if (typeof person !== 'object') return null

  const email = person.email || person.userEmail || person.decoratorEmail || person.adminEmail || ''
  const id = person.id || person._id || ''

  return {
    name: person.name || person.displayName || person.fullName || email || id || 'Participant',
    email,
    id,
    role: person.role || fallbackRole || '',
  }
}

const titleCase = (value) => {
  if (!value) return ''
  const v = String(value).toLowerCase()
  return v.charAt(0).toUpperCase() + v.slice(1)
}

export const resolveConversationPeer = (conversation, currentUserEmail = '') => {
  const me = (currentUserEmail || '').toLowerCase()

  const directCandidates = [
    normalizePerson(conversation?.otherUser, conversation?.otherUserRole),
    normalizePerson(conversation?.decorator, 'decorator'),
    normalizePerson(conversation?.user, 'user'),
    normalizePerson(conversation?.admin, 'admin'),
  ].filter(Boolean)

  let participantCandidates = []
  if (Array.isArray(conversation?.participants)) {
    participantCandidates = conversation.participants
      .map((p) => normalizePerson(p, ''))
      .filter(Boolean)
  }

  const byEmail = [...directCandidates, ...participantCandidates].find((p) => {
    const email = (p?.email || '').toLowerCase()
    if (!email) return false
    return email !== me
  })

  const byId = [...directCandidates, ...participantCandidates].find((p) => {
    const id = String(p?.id || '')
    if (!id || !me) return false
    return id !== me
  })

  const fallbackName =
    conversation?.otherUserName ||
    conversation?.decoratorName ||
    conversation?.userName ||
    conversation?.adminName ||
    ''

  const fallbackEmail =
    conversation?.otherUserEmail ||
    conversation?.decoratorEmail ||
    conversation?.userEmail ||
    conversation?.adminEmail ||
    ''

  const chosen = byEmail || byId || directCandidates[0] || participantCandidates[0] || null

  const name = chosen?.name || fallbackName || chosen?.email || 'Participant'
  const email = chosen?.email || fallbackEmail || ''
  const role = chosen?.role || conversation?.otherUserRole || ''
  const roleLabel = role ? titleCase(role) : 'Participant'

  return { name, email, role, roleLabel }
}
