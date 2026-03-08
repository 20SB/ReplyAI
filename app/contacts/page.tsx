'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Contact {
  _id: string
  name: string
  relation: string
  tone: string
  emojiLevel: string
  replySpeed: string
  notes: string[]
  topics: string[]
  insideJokes: string[]
}

export default function ContactsPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [search])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const url = search
        ? `/api/contacts?search=${encodeURIComponent(search)}`
        : '/api/contacts'
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) {
        setContacts(data.contacts)
      }
    } catch (error) {
      console.error('Fetch contacts error:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteContact = async (id: string) => {
    if (!confirm('Delete this contact?')) return

    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchContacts()
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Contacts</h1>
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
            >
              + Add Contact
            </button>
          </div>
        </div>
      </div>

      {/* Contact List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {search ? 'No contacts found' : 'No contacts yet'}
            </p>
            {!search && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Your First Contact
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {contact.name}
                    </h3>
                    {contact.relation && (
                      <p className="text-sm text-gray-600 mt-1">
                        {contact.relation}
                      </p>
                    )}

                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                      <span>
                        Tone: <strong>{contact.tone}</strong>
                      </span>
                      <span>
                        Emojis: <strong>{contact.emojiLevel}</strong>
                      </span>
                    </div>

                    {contact.notes.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          <strong>Notes:</strong> {contact.notes.join(', ')}
                        </p>
                      </div>
                    )}

                    {contact.topics.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {contact.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/contacts/${contact._id}/history`)}
                      className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                    >
                      📜 History
                    </button>
                    <button
                      onClick={() => router.push(`/contacts/${contact._id}/edit`)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteContact(contact._id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchContacts()
          }}
        />
      )}
    </div>
  )
}

// Add Contact Modal Component
function AddContactModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    tone: 'friendly',
    emojiLevel: 'medium',
    replySpeed: 'normal',
    notes: '',
    topics: '',
    insideJokes: '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          notes: formData.notes.split(',').map((n) => n.trim()).filter(Boolean),
          topics: formData.topics.split(',').map((t) => t.trim()).filter(Boolean),
          insideJokes: formData.insideJokes.split(',').map((j) => j.trim()).filter(Boolean),
        }),
      })

      const data = await res.json()
      if (data.success) {
        onSuccess()
      } else {
        alert('Failed to create contact')
      }
    } catch (error) {
      console.error('Create contact error:', error)
      alert('Failed to create contact')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-4">Add New Contact</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Relationship</label>
            <input
              type="text"
              placeholder="e.g., Manager, Friend, Colleague"
              value={formData.relation}
              onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tone</label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Emoji Level</label>
              <select
                value={formData.emojiLevel}
                onChange={(e) => setFormData({ ...formData, emojiLevel: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="minimal">Minimal</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Notes (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g., Prefers quick replies, Likes technical details"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Common Topics (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g., React, Database, DevOps"
              value={formData.topics}
              onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
