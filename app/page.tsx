'use client'

/**
 * ReplyAI - Main Page
 * AI Contextual Reply Assistant
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Contact {
  _id: string
  name: string
  relation: string
  tone: string
  emojiLevel: string
}

export default function Home() {
  const router = useRouter()
  const [inputMessage, setInputMessage] = useState('')
  const [contactName, setContactName] = useState('')
  const [selectedContactId, setSelectedContactId] = useState<string>('')
  const [selectedTone, setSelectedTone] = useState<string>('friendly')
  const [replies, setReplies] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [selectedReplyIndex, setSelectedReplyIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts')
      const data = await res.json()
      if (data.success) {
        setContacts(data.contacts)
      }
    } catch (error) {
      console.error('Fetch contacts error:', error)
    }
  }

  const handleContactSelect = (contactId: string) => {
    setSelectedContactId(contactId)
    const contact = contacts.find((c) => c._id === contactId)
    if (contact) {
      setContactName(contact.name)
      // Auto-set tone based on contact preference
      setSelectedTone(contact.tone)
    } else {
      setContactName('')
    }
  }

  const tones = [
    { value: 'professional', label: 'Professional', emoji: '💼' },
    { value: 'friendly', label: 'Friendly', emoji: '😊' },
    { value: 'funny', label: 'Funny', emoji: '😄' },
    { value: 'short', label: 'Short', emoji: '⚡' },
    { value: 'detailed', label: 'Detailed', emoji: '📝' },
    { value: 'polite', label: 'Polite', emoji: '🙏' },
  ]

  const handleGenerate = async () => {
    if (!inputMessage.trim()) {
      alert('Please enter a message')
      return
    }

    setLoading(true)
    setReplies([])

    try {
      const response = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          contactName: contactName || 'Someone',
          tone: selectedTone,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate replies')
      }

      const data = await response.json()
      setReplies(data.replies || [])

      // Save conversation to history
      if (data.replies && data.replies.length > 0) {
        await saveConversation(data.replies)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate replies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const saveConversation = async (aiSuggestions: string[]) => {
    try {
      await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: selectedContactId || null,
          contactName: contactName || 'Someone',
          incomingMessage: inputMessage,
          aiSuggestions,
          selectedReply: null, // User hasn't selected yet
          userActualReply: null, // User hasn't sent yet
          tone: selectedTone,
        }),
      })
    } catch (error) {
      console.error('Save conversation error:', error)
      // Don't alert - this is background save
    }
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleEditReply = async (
    originalReply: string,
    index: number,
    editType: 'shorten' | 'expand' | 'change_tone',
    newTone?: string
  ) => {
    setEditingIndex(index)
    try {
      const response = await fetch('/api/edit-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalReply,
          editType,
          newTone,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to edit reply')
      }

      const data = await response.json()
      if (data.success) {
        // Update the reply in the list
        const newReplies = [...replies]
        newReplies[index] = data.editedReply
        setReplies(newReplies)
      }
    } catch (error) {
      console.error('Edit error:', error)
      alert('Failed to edit reply. Please try again.')
    } finally {
      setEditingIndex(null)
    }
  }

  const markAsUsed = (index: number) => {
    setSelectedReplyIndex(index)
    // Could also update the conversation in the database here
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/settings')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
            >
              ⚙️ Settings
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              ✨ ReplyAI
            </h1>
            <button
              onClick={() => router.push('/contacts')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
            >
              👥 Contacts
            </button>
          </div>
          <p className="text-gray-600 text-lg">
            Your smart contextual reply assistant
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          {/* Contact Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who are you replying to?
            </label>
            <div className="flex gap-2">
              <select
                value={selectedContactId}
                onChange={(e) => handleContactSelect(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a saved contact or type manually...</option>
                {contacts.map((contact) => (
                  <option key={contact._id} value={contact._id}>
                    {contact.name}
                    {contact.relation ? ` (${contact.relation})` : ''}
                  </option>
                ))}
              </select>
              <button
                onClick={() => router.push('/contacts')}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium whitespace-nowrap"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Manual Contact Name (shown when no contact selected) */}
          {!selectedContactId && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or type manually (Optional)
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g., John, Sarah, Boss, Friend..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Message Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste the message you received
            </label>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="e.g., Hey! Are you free tomorrow evening?"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Tone Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select reply tone
            </label>
            <div className="grid grid-cols-3 gap-2">
              {tones.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => setSelectedTone(tone.value)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedTone === tone.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{tone.emoji}</div>
                  <div className="text-sm font-medium">{tone.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !inputMessage.trim()}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-colors ${
              loading || !inputMessage.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating replies...
              </span>
            ) : (
              '✨ Generate AI Replies'
            )}
          </button>
        </div>

        {/* Reply Options */}
        {replies.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              Reply Options ({replies.length})
            </h2>
            {replies.map((reply, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all ${
                  selectedReplyIndex === index ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-sm font-medium text-blue-600">
                        Option {index + 1}
                      </div>
                      {selectedReplyIndex === index && (
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                          ✓ Selected
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 text-lg leading-relaxed">
                      {reply}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleCopy(reply, index)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                        copiedIndex === index
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                    >
                      {copiedIndex === index ? '✓ Copied!' : '📋 Copy'}
                    </button>
                    <button
                      onClick={() => markAsUsed(index)}
                      disabled={selectedReplyIndex === index}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                        selectedReplyIndex === index
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {selectedReplyIndex === index ? 'Used' : '✓ Mark as Used'}
                    </button>
                  </div>
                </div>

                {/* Edit Tools */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleEditReply(reply, index, 'shorten')}
                    disabled={editingIndex === index}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50"
                  >
                    {editingIndex === index ? '⏳' : '✂️'} Shorten
                  </button>
                  <button
                    onClick={() => handleEditReply(reply, index, 'expand')}
                    disabled={editingIndex === index}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50"
                  >
                    {editingIndex === index ? '⏳' : '📝'} Expand
                  </button>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleEditReply(reply, index, 'change_tone', e.target.value)
                        e.target.value = '' // Reset
                      }
                    }}
                    disabled={editingIndex === index}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50"
                  >
                    <option value="">🎨 Change Tone...</option>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="funny">Funny</option>
                    <option value="polite">Polite</option>
                    <option value="short">Short</option>
                    <option value="detailed">Detailed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Context-Aware</h3>
            <p className="text-sm text-gray-600">
              AI understands your relationship and communication style
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Replies</h3>
            <p className="text-sm text-gray-600">
              Get multiple reply options in seconds
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Tones</h3>
            <p className="text-sm text-gray-600">
              Professional, friendly, funny, or custom tone
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
