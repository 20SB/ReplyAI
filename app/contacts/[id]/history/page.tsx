'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

interface Conversation {
  _id: string
  contactName: string
  messages: Array<{
    role: string
    content: string
    timestamp: Date
  }>
  aiSuggestions: string[]
  selectedReply: string | null
  userActualReply: string | null
  timestamp: Date
  metadata: {
    tone: string
  }
}

interface Contact {
  _id: string
  name: string
  relation: string
}

export default function ConversationHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [contact, setContact] = useState<Contact | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContactAndHistory()
  }, [])

  const fetchContactAndHistory = async () => {
    try {
      // Fetch contact
      const contactRes = await fetch(`/api/contacts/${resolvedParams.id}`)
      const contactData = await contactRes.json()
      if (contactData.success) {
        setContact(contactData.contact)
      }

      // Fetch conversation history
      const historyRes = await fetch(
        `/api/conversations?contactId=${resolvedParams.id}`
      )
      const historyData = await historyRes.json()
      if (historyData.success) {
        setConversations(historyData.conversations)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Contact not found</p>
          <button
            onClick={() => router.push('/contacts')}
            className="text-blue-500 hover:underline"
          >
            ← Back to Contacts
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/contacts')}
            className="text-gray-600 hover:text-gray-900 mb-2"
          >
            ← Back to Contacts
          </button>
          <h1 className="text-2xl font-bold">
            Conversation History with {contact.name}
          </h1>
          {contact.relation && (
            <p className="text-gray-600 mt-1">{contact.relation}</p>
          )}
        </div>
      </div>

      {/* Conversation List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {conversations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-2">No conversation history yet</p>
            <p className="text-sm">
              Start generating replies with this contact to see history here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {conversations.map((conv) => (
              <div
                key={conv._id}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                {/* Timestamp */}
                <div className="text-xs text-gray-500 mb-4">
                  {new Date(conv.timestamp).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

                {/* Incoming Message */}
                {conv.messages.map((msg, i) => (
                  <div key={i} className="mb-4">
                    {msg.role === 'incoming' && (
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">
                          {contact.name} wrote:
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4">
                          <p className="text-gray-900">{msg.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* AI Suggestions */}
                {conv.aiSuggestions.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      AI Suggested Replies:
                    </div>
                    <div className="space-y-2">
                      {conv.aiSuggestions.map((suggestion, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg text-sm ${
                            conv.selectedReply === suggestion
                              ? 'bg-blue-50 border-2 border-blue-500'
                              : 'bg-gray-50'
                          }`}
                        >
                          {suggestion}
                          {conv.selectedReply === suggestion && (
                            <span className="ml-2 text-xs text-blue-600 font-medium">
                              ✓ Selected
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* User's Actual Reply */}
                {conv.userActualReply && (
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      You actually sent:
                    </div>
                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                      <p className="text-gray-900">{conv.userActualReply}</p>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                  Tone: <strong>{conv.metadata.tone}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
