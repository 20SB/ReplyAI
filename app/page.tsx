'use client'

/**
 * ReplyAI - Main Page
 * AI Contextual Reply Assistant
 */

import { useState } from 'react'

export default function Home() {
  const [inputMessage, setInputMessage] = useState('')
  const [contactName, setContactName] = useState('')
  const [selectedTone, setSelectedTone] = useState<string>('friendly')
  const [replies, setReplies] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

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
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate replies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            ✨ ReplyAI
          </h1>
          <p className="text-gray-600 text-lg">
            Your smart contextual reply assistant
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          {/* Contact Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who are you replying to? (Optional)
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g., John, Sarah, Boss, Friend..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-blue-600 mb-2">
                      Option {index + 1}
                    </div>
                    <p className="text-gray-900 text-lg leading-relaxed">
                      {reply}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(reply, index)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      copiedIndex === index
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    {copiedIndex === index ? '✓ Copied!' : '📋 Copy'}
                  </button>
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
