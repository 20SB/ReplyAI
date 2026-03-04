/**
 * Generate Reply API Route
 * POST /api/generate-reply
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateReplies } from '@/lib/ai/reply-generator'

export async function POST(request: NextRequest) {
  try {
    // Check if API key is set
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not set')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { message, contactName, tone } = body

    console.log('Request:', { message: message?.substring(0, 50), contactName, tone })

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
          tone: 'friendly' as const,
          emojiLevel: 'medium' as const,
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
  } catch (error: any) {
    console.error('Generate reply error:', error)
    console.error('Error details:', error.message, error.stack)
    return NextResponse.json(
      { 
        error: 'Failed to generate replies',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
