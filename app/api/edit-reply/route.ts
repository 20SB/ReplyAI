/**
 * Edit Reply API Route
 * POST /api/edit-reply
 * Modifies an existing reply (shorten, expand, change tone)
 */

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { originalReply, editType, newTone } = body

    if (!originalReply) {
      return NextResponse.json(
        { error: 'Original reply is required' },
        { status: 400 }
      )
    }

    if (!editType) {
      return NextResponse.json(
        { error: 'Edit type is required' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    let prompt = ''

    if (editType === 'shorten') {
      prompt = `Make this reply shorter and more concise (keep it under 20 words):\n\n"${originalReply}"\n\nProvide only the shortened version, no explanations.`
    } else if (editType === 'expand') {
      prompt = `Make this reply more detailed and elaborate:\n\n"${originalReply}"\n\nProvide only the expanded version, no explanations.`
    } else if (editType === 'change_tone') {
      const toneMap: Record<string, string> = {
        professional: 'formal and business-appropriate',
        friendly: 'warm, casual, and approachable',
        funny: 'humorous and lighthearted',
        short: 'very brief (under 15 words)',
        detailed: 'thorough with explanations',
        polite: 'courteous and respectful',
      }

      const toneDesc = toneMap[newTone] || 'natural'
      prompt = `Rewrite this reply in a ${toneDesc} tone:\n\n"${originalReply}"\n\nProvide only the rewritten version, no explanations.`
    } else {
      return NextResponse.json(
        { error: 'Invalid edit type' },
        { status: 400 }
      )
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    const editedReply = response.text().trim()

    return NextResponse.json({
      success: true,
      editedReply,
      message: 'Reply edited successfully',
    })
  } catch (error: any) {
    console.error('Edit reply error:', error)
    return NextResponse.json(
      { error: 'Failed to edit reply', details: error.message },
      { status: 500 }
    )
  }
}
