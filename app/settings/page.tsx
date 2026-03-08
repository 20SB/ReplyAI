'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  name: string
  profession: string
  location: string
  bio: string
  communicationStyle: string
  tonePreferences: {
    formality: string
    humor: boolean
    emojis: string
    responseLength: string
  }
  commonPhrases: string[]
  personalityTraits: string[]
}

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    location: '',
    bio: '',
    communicationStyle: 'mixed',
    formality: 'casual',
    humor: true,
    emojis: 'minimal',
    responseLength: 'short',
    commonPhrases: '',
    personalityTraits: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user-profile')
      const data = await res.json()
      if (data.success) {
        const p = data.profile
        setProfile(p)
        setFormData({
          name: p.name || '',
          profession: p.profession || '',
          location: p.location || '',
          bio: p.bio || '',
          communicationStyle: p.communicationStyle || 'mixed',
          formality: p.tonePreferences?.formality || 'casual',
          humor: p.tonePreferences?.humor ?? true,
          emojis: p.tonePreferences?.emojis || 'minimal',
          responseLength: p.tonePreferences?.responseLength || 'short',
          commonPhrases: p.commonPhrases?.join(', ') || '',
          personalityTraits: p.personalityTraits?.join(', ') || '',
        })
      }
    } catch (error) {
      console.error('Fetch profile error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/user-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          profession: formData.profession,
          location: formData.location,
          bio: formData.bio,
          communicationStyle: formData.communicationStyle,
          tonePreferences: {
            formality: formData.formality,
            humor: formData.humor,
            emojis: formData.emojis,
            responseLength: formData.responseLength,
          },
          commonPhrases: formData.commonPhrases
            .split(',')
            .map((p) => p.trim())
            .filter(Boolean),
          personalityTraits: formData.personalityTraits
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      })

      const data = await res.json()
      if (data.success) {
        alert('Profile updated successfully!')
        router.push('/')
      } else {
        alert('Failed to update profile')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-900 mb-2"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold">⚙️ Settings</h1>
          <p className="text-gray-600 mt-2">
            Customize how AI generates replies for you
          </p>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              
              <div className="space-y-4">
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
                    Profession
                  </label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) =>
                      setFormData({ ...formData, profession: e.target.value })
                    }
                    placeholder="e.g., Software Developer"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., Gurgaon, India"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Brief description about yourself..."
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Communication Style */}
            <div className="pt-6 border-t">
              <h2 className="text-xl font-semibold mb-4">
                Communication Style
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Overall Style
                  </label>
                  <select
                    value={formData.communicationStyle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        communicationStyle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                    <option value="technical">Technical</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Formality Level
                  </label>
                  <select
                    value={formData.formality}
                    onChange={(e) =>
                      setFormData({ ...formData, formality: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="very_formal">Very Formal</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="very_casual">Very Casual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Emoji Usage
                  </label>
                  <select
                    value={formData.emojis}
                    onChange={(e) =>
                      setFormData({ ...formData, emojis: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">None</option>
                    <option value="minimal">Minimal</option>
                    <option value="moderate">Moderate</option>
                    <option value="frequent">Frequent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Default Reply Length
                  </label>
                  <select
                    value={formData.responseLength}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        responseLength: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="very_short">Very Short</option>
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="detailed">Detailed</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.humor}
                      onChange={(e) =>
                        setFormData({ ...formData, humor: e.target.checked })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium">
                      Use humor when appropriate
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Personality */}
            <div className="pt-6 border-t">
              <h2 className="text-xl font-semibold mb-4">
                Personality & Phrases
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Common Phrases (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.commonPhrases}
                    onChange={(e) =>
                      setFormData({ ...formData, commonPhrases: e.target.value })
                    }
                    placeholder="e.g., Sure thing, Got it, Let me check"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Phrases you commonly use in messages
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Personality Traits (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.personalityTraits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalityTraits: e.target.value,
                      })
                    }
                    placeholder="e.g., Direct, Problem solver, Detail-oriented"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    How would you describe your communication personality?
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 px-4 py-3 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
