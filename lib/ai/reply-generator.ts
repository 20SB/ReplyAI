/**
 * AI Reply Generator
 * Core engine for generating contextual replies
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface ContactContext {
  name: string
  relation?: string
  tone: string
  emojiLevel: string
  notes?: string[]
  topics?: string[]
  insideJokes?: string[]
}

export interface ConversationHistory {
  role: string
  content: string
}

export interface ReplyOptions {
  message: string
  contact?: ContactContext
  history?: ConversationHistory[]
  userPersonality?: string
  tone?: 'professional' | 'friendly' | 'funny' | 'short' | 'detailed' | 'polite'
}

/**
 * Generate multiple reply options
 */
export async function generateReplies(
  options: ReplyOptions
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = buildPrompt(options)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse multiple options (expecting numbered list)
    const replies = parseReplies(text)

    return replies.length > 0 ? replies : [text.trim()]
  } catch (error) {
    console.error('Reply generation error:', error)
    throw new Error('Failed to generate replies')
  }
}

/**
 * Build prompt for AI
 */
function buildPrompt(options: ReplyOptions): string {
  const { message, contact, history, userPersonality, tone } = options

  let prompt = `You are a smart AI reply assistant. Generate ${tone === 'short' ? '1-2 sentence' : '2-3'} reply options for the following message.\n\n`

  // Add message
  prompt += `**Message received:**\n"${message}"\n\n`

  // Add contact context
  if (contact) {
    prompt += `**About recipient (${contact.name}):**\n`
    if (contact.relation) prompt += `- Relationship: ${contact.relation}\n`
    prompt += `- Preferred tone: ${contact.tone}\n`
    prompt += `- Emoji usage: ${contact.emojiLevel}\n`
    if (contact.notes && contact.notes.length > 0) {
      prompt += `- Notes: ${contact.notes.join(', ')}\n`
    }
    if (contact.topics && contact.topics.length > 0) {
      prompt += `- Common topics: ${contact.topics.join(', ')}\n`
    }
    if (contact.insideJokes && contact.insideJokes.length > 0) {
      prompt += `- Inside jokes: ${contact.insideJokes.join(', ')}\n`
    }
    prompt += '\n'
  }

  // Add conversation history
  if (history && history.length > 0) {
    prompt += `**Recent conversation:**\n`
    history.slice(-5).forEach((msg) => {
      const role = msg.role === 'contact' ? contact?.name || 'Them' : 'You'
      prompt += `${role}: ${msg.content}\n`
    })
    prompt += '\n'
  }

  // Add user personality
  if (userPersonality) {
    prompt += `**Your communication style:**\n${userPersonality}\n\n`
  }

  // Add tone instruction
  if (tone) {
    const toneInstructions = {
      professional: 'formal, clear, and business-appropriate',
      friendly: 'warm, casual, and approachable',
      funny: 'humorous, lighthearted, with wit',
      short: 'brief, concise, to-the-point',
      detailed: 'thorough, comprehensive, with explanations',
      polite: 'respectful, courteous, and considerate',
    }
    prompt += `**Requested tone:** ${toneInstructions[tone]}\n\n`
  }

  // Instructions
  prompt += `Generate 3-5 different reply options. Each reply should:
1. Be contextually appropriate
2. Match the recipient's communication style
3. Be natural and conversational
4. Consider the relationship and history

Format as a numbered list:
1. [reply option 1]
2. [reply option 2]
3. [reply option 3]
...

Only provide the replies, no explanations.`

  return prompt
}

/**
 * Parse replies from AI response
 */
function parseReplies(text: string): string[] {
  // Try to extract numbered list
  const lines = text.split('\n').filter((line) => line.trim())
  const replies: string[] = []

  for (const line of lines) {
    // Match patterns like "1. ", "1) ", "• ", etc.
    const match = line.match(/^[\d\*\-\•]\s*[\.\)]\s*(.+)/)
    if (match) {
      replies.push(match[1].trim())
    } else if (line.match(/^\d+\.\s+(.+)/)) {
      replies.push(line.replace(/^\d+\.\s+/, '').trim())
    }
  }

  // If no numbered list found, split by double newlines
  if (replies.length === 0) {
    const parts = text.split('\n\n').filter((p) => p.trim())
    replies.push(...parts.map((p) => p.trim()))
  }

  return replies.slice(0, 5) // Max 5 options
}

/**
 * Edit a draft reply
 */
export async function editReply(
  originalReply: string,
  editType: 'shorten' | 'expand' | 'professional' | 'friendly' | 'funny' | 'polite'
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const editInstructions = {
      shorten: 'Make this reply shorter and more concise',
      expand: 'Make this reply more detailed and elaborate',
      professional: 'Rewrite this in a professional, formal tone',
      friendly: 'Rewrite this in a friendly, casual tone',
      funny: 'Rewrite this with humor and wit',
      polite: 'Rewrite this in a more polite and courteous way',
    }

    const prompt = `${editInstructions[editType]}:\n\n"${originalReply}"\n\nProvide only the rewritten version, no explanations.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return text.trim()
  } catch (error) {
    console.error('Reply edit error:', error)
    throw new Error('Failed to edit reply')
  }
}

/**
 * Detect message intent
 */
export async function detectIntent(message: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Analyze this message and identify the primary intent. Choose ONE from:
- question
- request
- meeting_scheduling
- negotiation
- greeting
- thanks
- rejection
- follow_up
- complaint
- casual_chat
- urgent

Message: "${message}"

Respond with ONLY the intent keyword, nothing else.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const intent = response.text().trim().toLowerCase()

    return intent
  } catch (error) {
    console.error('Intent detection error:', error)
    return 'unknown'
  }
}
