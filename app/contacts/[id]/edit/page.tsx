'use client'

import { useState, useEffect, use } from 'react'
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

export default function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [contact, setContact] = useState<Contact | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    tone: 'friendly',
    emojiLevel: 'medium',
    replySpeed: 'medium',
    notes: '',
    topics: '',
    insideJokes: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchContact()
  }, [])

  const fetchContact = async () => {
    try {
      const res = await fetch(`/api/contacts/${resolvedParams.id}`)
      const data = await res.json()
      if (data.success) {
        const c = data.contact
        setContact(c)
        setFormData({
          name: c.name,
          relation: c.relation || '',
          tone: c.tone,
          emojiLevel: c.emojiLevel,
          replySpeed: c.replySpeed,
          notes: c.notes.join(', '),
          topics: c.topics.join(', '),
          insideJokes: c.insideJokes.join(', '),
        })
      }
    } catch (error) {
      console.error('Fetch contact error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/contacts/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          notes: formData.notes.split(',').map((n) => n.trim()).filter(Boolean),
          topics: formData.topics.split(',').map((t) => t.trim()).filter(Boolean),
          insideJokes: formData.insideJokes
            .split(',')
            .map((j) => j.trim())
            .filter(Boolean),
        }),
      })

      const data = await res.json()
      if (data.success) {
        router.push('/contacts')
      } else {
        alert('Failed to update contact')
      }
    } catch (error) {
      console.error('Update contact error:', error)
      alert('Failed to update contact')
    } finally {
      setSaving(false)
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/contacts')}
            className="text-gray-600 hover:text-gray-900 mb-2"
          >
            ← Back to Contacts
          </button>
          <h1 className="text-2xl font-bold">Edit Contact</h1>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Relationship
              </label>
              <input
                type="text"
                placeholder="e.g., Manager, Friend, Colleague"
                value={formData.relation}
                onChange={(e) =>
                  setFormData({ ...formData, relation: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tone</label>
                <select
                  value={formData.tone}
                  onChange={(e) =>
                    setFormData({ ...formData, tone: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Emoji Level
                </label>
                <select
                  value={formData.emojiLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, emojiLevel: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">None</option>
                  <option value="low">Low</option>
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
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, topics: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Inside Jokes (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g., Coffee addict, Always late"
                value={formData.insideJokes}
                onChange={(e) =>
                  setFormData({ ...formData, insideJokes: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push('/contacts')}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Update Contact'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
