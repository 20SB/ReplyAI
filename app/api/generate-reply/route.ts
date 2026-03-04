/**
 * Generate Reply API Route
 * POST /api/generate-reply
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateReplies } from '@/lib/ai/reply-generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, contactName, tone } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Build contact context if name provided
    const contact = contactName
      ? {
          name: contactName,
          tone: 'friendly',
          emojiLevel: 'medium',
        }
      : undefined

    // Generate replies
    const replies = await generateReplies({
      message,
      contact,
      tone: tone || 'friendly',
    })

    return NextResponse.json({
      success: true,
      replies,
      message: 'Generated successfully',
    })
  } catch (error) {
    console.error('Generate reply error:', error)
    return NextResponse.json(
      { error: 'Failed to generate replies' },
      { status: 500 }
    )
  }
}
