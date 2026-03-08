/**
 * User Profile API Routes
 * GET /api/user-profile - Get user profile
 * PUT /api/user-profile - Update user profile
 */

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongoose'
import UserProfile from '@/lib/db/models/UserProfile'
import { subhaProfile } from '@/lib/db/seed-profile'

// GET user profile
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    let profile = await UserProfile.findOne({ userId: 'default_user' })

    // If no profile exists, create from seed data
    if (!profile) {
      profile = await UserProfile.create(subhaProfile)
    }

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error: any) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: error.message },
      { status: 500 }
    )
  }
}

// PUT update user profile
export async function PUT(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()

    let profile = await UserProfile.findOne({ userId: 'default_user' })

    if (!profile) {
      // Create new profile
      profile = await UserProfile.create({
        userId: 'default_user',
        ...body,
      })
    } else {
      // Update existing
      profile = await UserProfile.findOneAndUpdate(
        { userId: 'default_user' },
        body,
        { new: true, runValidators: true }
      )
    }

    return NextResponse.json({
      success: true,
      profile,
      message: 'Profile updated successfully',
    })
  } catch (error: any) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile', details: error.message },
      { status: 500 }
    )
  }
}
