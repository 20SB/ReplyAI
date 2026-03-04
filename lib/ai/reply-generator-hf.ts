/**
 * AI Reply Generator - Hugging Face Version
 * Using Hugging Face Inference API (FREE)
 */

import { HfInference } from '@huggingface/inference'

// Use free Hugging Face models (no API key needed for public models)
// But better with API token for higher rate limits
const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN)

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
 * Generate multiple reply options using Hugging Face
 */
export async function generateReplies(
  options: ReplyOptions
): Promise<string[]> {
  try {
    const prompt = buildPrompt(options)

    // Using Mistral-7B-Instruct (free, fast, good quality)
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
      },
    })

    const text = response.generated_text

    // Parse replies
    const replies = parseReplies(text)

    return replies.length > 0 ? replies : [text.trim()]
  } catch (error: any) {
    console.error('HF Reply generation error:', error)
    console.error('Error message:', error?.message)
    
    // Fallback to basic replies if AI fails
    return generateFallbackReplies(options)
  }
}

/**
 * Build prompt for Hugging Face model
 */
function buildPrompt(options: ReplyOptions): string {
  const { message, contact, tone } = options

  let prompt = `<s>[INST] You are a helpful assistant that generates natural reply options for messages.

Message received: "${message}"
`

  if (contact) {
    prompt += `Recipient: ${contact.name}\n`
    prompt += `Relationship: ${contact.relation || 'friend'}\n`
  }

  const toneInstructions = {
    professional: 'formal and business-appropriate',
    friendly: 'warm and casual',
    funny: 'humorous and lighthearted',
    short: 'brief and concise',
    detailed: 'thorough and comprehensive',
    polite: 'respectful and courteous',
  }

  prompt += `Tone: ${toneInstructions[tone || 'friendly']}\n`
  prompt += `\nGenerate 3 different reply options. Format as:
1. [first reply]
2. [second reply]
3. [third reply]

Only provide the numbered replies, nothing else. [/INST]`

  return prompt
}

/**
 * Parse replies from model output
 */
function parseReplies(text: string): string[] {
  const lines = text.split('\n').filter((line) => line.trim())
  const replies: string[] = []

  for (const line of lines) {
    // Match numbered patterns: "1.", "1)", etc.
    const match = line.match(/^\d+[\.\)]\s*(.+)/)
    if (match && match[1]) {
      replies.push(match[1].trim())
    }
  }

  // If no numbered list, split by empty lines or take first 3 sentences
  if (replies.length === 0) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
    replies.push(...sentences.slice(0, 3).map(s => s.trim() + '.'))
  }

  return replies.slice(0, 5)
}

/**
 * Fallback replies when AI fails
 */
function generateFallbackReplies(options: ReplyOptions): string[] {
  const { message, tone } = options

  // Simple rule-based fallbacks
  const isQuestion = message.includes('?')
  
  if (tone === 'professional') {
    return [
      "Thank you for your message. I'll get back to you shortly.",
      "I appreciate you reaching out. Let me review this and respond soon.",
      "Thanks for the update. I'll follow up on this."
    ]
  }

  if (isQuestion) {
    return [
      "Let me check and get back to you!",
      "Good question! Give me a moment to think about it.",
      "I'll look into this and let you know soon."
    ]
  }

  return [
    "Thanks for letting me know!",
    "Got it, thanks!",
    "Sounds good!"
  ]
}

/**
 * Edit a reply (simplified version for HF)
 */
export async function editReply(
  originalReply: string,
  editType: 'shorten' | 'expand' | 'professional' | 'friendly' | 'funny' | 'polite'
): Promise<string> {
  try {
    const editInstructions = {
      shorten: 'Make this shorter and more concise',
      expand: 'Make this more detailed',
      professional: 'Rewrite in a professional tone',
      friendly: 'Rewrite in a friendly tone',
      funny: 'Add humor to this',
      polite: 'Make this more polite',
    }

    const prompt = `<s>[INST] ${editInstructions[editType]}: "${originalReply}"

Provide only the rewritten version. [/INST]`

    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        return_full_text: false,
      },
    })

    return response.generated_text.trim()
  } catch (error) {
    console.error('Edit error:', error)
    // Return original if edit fails
    return originalReply
  }
}

/**
 * Detect message intent (simplified)
 */
export async function detectIntent(message: string): Promise<string> {
  // Simple rule-based intent detection
  const lower = message.toLowerCase()
  
  if (lower.includes('?')) return 'question'
  if (lower.includes('meet') || lower.includes('schedule')) return 'meeting_scheduling'
  if (lower.includes('thanks') || lower.includes('thank')) return 'thanks'
  if (lower.includes('hello') || lower.includes('hi')) return 'greeting'
  if (lower.includes('sorry') || lower.includes('can\'t')) return 'rejection'
  if (lower.includes('urgent') || lower.includes('asap')) return 'urgent'
  
  return 'casual_chat'
}
