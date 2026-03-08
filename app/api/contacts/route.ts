/**
 * Contacts API Routes
 * GET /api/contacts - List all contacts
 * POST /api/contacts - Create new contact
 */

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongoose'
import Contact from '@/lib/db/models/Contact'

// GET all contacts
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let query: any = { userId: 'default_user' } // Filter by user
    if (search) {
      query = {
        userId: 'default_user',
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { relation: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } },
        ],
      }
    }

    const contacts = await Contact.find(query).sort({ name: 1 })

    return NextResponse.json({
      success: true,
      contacts,
    })
  } catch (error: any) {
    console.error('Get contacts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts', details: error.message },
      { status: 500 }
    )
  }
}

// POST create new contact
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { name, relation, tone, emojiLevel, replySpeed, notes, topics, insideJokes } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Contact name is required' },
        { status: 400 }
      )
    }

    const contact = await Contact.create({
      userId: 'default_user', // Single user for MVP
      name,
      relation: relation || '',
      tone: tone || 'friendly',
      emojiLevel: emojiLevel || 'medium',
      replySpeed: replySpeed || 'normal',
      notes: notes || [],
      topics: topics || [],
      insideJokes: insideJokes || [],
    })

    return NextResponse.json({
      success: true,
      contact,
      message: 'Contact created successfully',
    })
  } catch (error: any) {
    console.error('Create contact error:', error)
    return NextResponse.json(
      { error: 'Failed to create contact', details: error.message },
      { status: 500 }
    )
  }
}
