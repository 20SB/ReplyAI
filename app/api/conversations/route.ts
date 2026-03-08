/**
 * Conversations API Routes
 * GET /api/conversations - List conversations (optionally by contact)
 * POST /api/conversations - Create/update conversation entry
 */

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongoose'
import Conversation from '@/lib/db/models/Conversation'

// GET conversations
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('contactId')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = {}
    if (contactId) {
      query = { contactId }
    }

    const conversations = await Conversation.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('contactId', 'name relation')

    return NextResponse.json({
      success: true,
      conversations,
    })
  } catch (error: any) {
    console.error('Get conversations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations', details: error.message },
      { status: 500 }
    )
  }
}

// POST create conversation entry
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const {
      contactId,
      contactName,
      incomingMessage,
      aiSuggestions,
      selectedReply,
      userActualReply,
      tone,
    } = body

    if (!incomingMessage) {
      return NextResponse.json(
        { error: 'Incoming message is required' },
        { status: 400 }
      )
    }

    const conversation = await Conversation.create({
      contactId: contactId || null,
      contactName: contactName || 'Unknown',
      messages: [
        {
          role: 'incoming',
          content: incomingMessage,
          timestamp: new Date(),
        },
      ],
      aiSuggestions: aiSuggestions || [],
      selectedReply: selectedReply || null,
      userActualReply: userActualReply || null,
      metadata: {
        tone: tone || 'friendly',
      },
    })

    return NextResponse.json({
      success: true,
      conversation,
      message: 'Conversation saved',
    })
  } catch (error: any) {
    console.error('Create conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation', details: error.message },
      { status: 500 }
    )
  }
}
