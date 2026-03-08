/**
 * Personalized AI Reply Generator
 * Generates replies in the user's voice using their profile
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface UserProfile {
  name: string
  profession: string
  location?: string
  currentRole?: string
  currentCompany?: string
  experience?: string
  bio?: string
  communicationStyle?: string
  tonePreferences?: {
    formality?: string
    humor?: boolean
    emojis?: string
    responseLength?: string
  }
  personalityTraits?: string[]
  commonPhrases?: string[]
  interests?: string[]
  skills?: string[]
}

export interface ContactContext {
  name: string
  relation?: string
  notes?: string[]
}

export interface ReplyOptions {
  message: string
  userProfile: UserProfile
  contact?: ContactContext
  conversationHistory?: Array<{ role: string; content: string }>
  tone?: 'professional' | 'friendly' | 'funny' | 'short' | 'detailed' | 'polite'
}

/**
 * Generate personalized replies as the user
 */
export async function generatePersonalizedReplies(
  options: ReplyOptions
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const prompt = buildPersonalizedPrompt(options)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const replies = parseReplies(text)
    return replies.length > 0 ? replies : [text.trim()]
  } catch (error: any) {
    console.error('Personalized reply generation error:', error)
    throw error
  }
}

/**
 * Build personalized prompt
 */
function buildPersonalizedPrompt(options: ReplyOptions): string {
  const { message, userProfile, contact, conversationHistory, tone } = options

  let prompt = `You are replying AS ${userProfile.name}, not generating generic options. 
This must sound EXACTLY like ${userProfile.name} wrote it, based on their profile below.\n\n`

  // User Profile Context
  prompt += `**WHO YOU ARE (${userProfile.name}):**\n`
  if (userProfile.profession) prompt += `- Profession: ${userProfile.profession}\n`
  if (userProfile.currentRole && userProfile.currentCompany) {
    prompt += `- Current Role: ${userProfile.currentRole} at ${userProfile.currentCompany}\n`
  }
  if (userProfile.experience) prompt += `- Experience: ${userProfile.experience}\n`
  if (userProfile.location) prompt += `- Location: ${userProfile.location}\n`
  
  if (userProfile.bio) {
    prompt += `\n**Background:**\n${userProfile.bio}\n`
  }

  // Communication Style
  if (userProfile.communicationStyle) {
    prompt += `\n**Your Communication Style:** ${userProfile.communicationStyle}\n`
  }
  
  if (userProfile.tonePreferences) {
    const prefs = userProfile.tonePreferences
    prompt += `**Tone Preferences:**\n`
    if (prefs.formality) prompt += `- Formality: ${prefs.formality}\n`
    if (prefs.humor !== undefined) prompt += `- Humor: ${prefs.humor ? 'Yes, when appropriate' : 'Keep it professional'}\n`
    if (prefs.emojis) prompt += `- Emojis: ${prefs.emojis}\n`
    if (prefs.responseLength) prompt += `- Reply Length: ${prefs.responseLength}\n`
  }

  // Personality traits
  if (userProfile.personalityTraits && userProfile.personalityTraits.length > 0) {
    prompt += `\n**Personality Traits:**\n${userProfile.personalityTraits.map(t => `- ${t}`).join('\n')}\n`
  }

  // Common phrases
  if (userProfile.commonPhrases && userProfile.commonPhrases.length > 0) {
    prompt += `\n**Phrases you commonly use:**\n${userProfile.commonPhrases.join(', ')}\n`
  }

  // Skills/Expertise (for context)
  if (userProfile.skills && userProfile.skills.length > 0) {
    prompt += `\n**Technical Skills:** ${userProfile.skills.slice(0, 10).join(', ')}\n`
  }

  // Message to reply to
  prompt += `\n\n**MESSAGE TO REPLY TO:**\n"${message}"\n\n`

  // Contact context
  if (contact) {
    prompt += `**About the person (${contact.name}):**\n`
    if (contact.relation) prompt += `- Relationship: ${contact.relation}\n`
    if (contact.notes && contact.notes.length > 0) {
      prompt += `- Notes: ${contact.notes.join(', ')}\n`
    }
    prompt += '\n'
  }

  // Conversation history
  if (conversationHistory && conversationHistory.length > 0) {
    prompt += `**Recent conversation:**\n`
    conversationHistory.slice(-5).forEach((msg) => {
      const speaker = msg.role === 'contact' ? contact?.name || 'Them' : 'You'
      prompt += `${speaker}: ${msg.content}\n`
    })
    prompt += '\n'
  }

  // Tone override
  const toneInstructions: Record<string, string> = {
    professional: 'more formal and business-appropriate than usual',
    friendly: 'extra warm and approachable',
    funny: 'lighthearted with some humor',
    short: 'very brief (5-15 words max)',
    detailed: 'thorough with explanations',
    polite: 'especially courteous and respectful',
  }
  
  if (tone && toneInstructions[tone]) {
    prompt += `**IMPORTANT:** Make this reply ${toneInstructions[tone]}.\n\n`
  }

  // Final instructions
  prompt += `**YOUR TASK:**
Generate 3-5 DIFFERENT reply options that ${userProfile.name} would actually write.

CRITICAL RULES:
1. Write AS ${userProfile.name}, not as a generic assistant
2. Match ${userProfile.name}'s communication style, personality, and tone
3. Sound natural and authentic - like ${userProfile.name} is typing this
4. Each reply should be distinctly different in approach
5. Use phrases and language ${userProfile.name} would actually use
6. Consider the context and relationship
7. Be conversational and human

Format as numbered list:
1. [first reply option]
2. [second reply option]
3. [third reply option]
...

Only provide the replies, no explanations or meta-commentary.`

  return prompt
}

/**
 * Parse replies from AI response
 */
function parseReplies(text: string): string[] {
  const lines = text.split('\n').filter((line) => line.trim())
  const replies: string[] = []

  for (const line of lines) {
    const match = line.match(/^[\d\*\-\•]\s*[\.\)]\s*(.+)/)
    if (match) {
      replies.push(match[1].trim())
    } else if (line.match(/^\d+\.\s+(.+)/)) {
      replies.push(line.replace(/^\d+\.\s+/, '').trim())
    }
  }

  if (replies.length === 0) {
    const parts = text.split('\n\n').filter((p) => p.trim())
    replies.push(...parts.map((p) => p.trim()))
  }

  return replies.slice(0, 5)
}
