/**
 * Individual Contact API Routes
 * GET /api/contacts/[id] - Get single contact
 * PUT /api/contacts/[id] - Update contact
 * DELETE /api/contacts/[id] - Delete contact
 */

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongoose'
import Contact from '@/lib/db/models/Contact'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET single contact
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await dbConnect()
    const { id } = await context.params

    const contact = await Contact.findById(id)

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      contact,
    })
  } catch (error: any) {
    console.error('Get contact error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact', details: error.message },
      { status: 500 }
    )
  }
}

// PUT update contact
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await dbConnect()
    const { id } = await context.params
    const body = await request.json()

    const contact = await Contact.findByIdAndUpdate(
      id,
      {
        name: body.name,
        relation: body.relation,
        tone: body.tone || 'friendly',
        emojiLevel: body.emojiLevel || 'medium',
        replySpeed: body.replySpeed || 'medium', // Changed from 'normal' to 'medium'
        notes: body.notes || [],
        topics: body.topics || [],
        insideJokes: body.insideJokes || [],
      },
      { new: true, runValidators: true }
    )

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      contact,
      message: 'Contact updated successfully',
    })
  } catch (error: any) {
    console.error('Update contact error:', error)
    return NextResponse.json(
      { error: 'Failed to update contact', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE contact
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await dbConnect()
    const { id } = await context.params

    const contact = await Contact.findByIdAndDelete(id)

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete contact error:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact', details: error.message },
      { status: 500 }
    )
  }
}
