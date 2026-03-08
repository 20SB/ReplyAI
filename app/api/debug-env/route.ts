/**
 * Debug Environment Variables
 * GET /api/debug-env
 */

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriLength: process.env.MONGODB_URI?.length || 0,
    mongoUriPrefix: process.env.MONGODB_URI?.substring(0, 20) || 'NOT SET',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    nodeEnv: process.env.NODE_ENV,
  })
}
