/**
 * User Profile Model
 * Stores user's personal information for personalized AI replies
 */

import mongoose from 'mongoose'

const UserProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      default: 'default_user',
    },
    
    // Basic Info
    name: {
      type: String,
      required: true,
    },
    age: Number,
    location: String,
    profession: String,
    
    // Professional Background
    currentRole: String,
    currentCompany: String,
    experience: String, // e.g., "2+ years"
    skills: [String],
    expertise: [String],
    
    // Communication Style
    communicationStyle: {
      type: String,
      enum: ['professional', 'casual', 'friendly', 'technical', 'mixed'],
      default: 'mixed',
    },
    tonePreferences: {
      formality: {
        type: String,
        enum: ['very_formal', 'professional', 'casual', 'very_casual'],
        default: 'casual',
      },
      humor: {
        type: Boolean,
        default: true,
      },
      emojis: {
        type: String,
        enum: ['none', 'minimal', 'moderate', 'frequent'],
        default: 'minimal',
      },
      responseLength: {
        type: String,
        enum: ['very_short', 'short', 'medium', 'detailed'],
        default: 'short',
      },
    },
    
    // Personal traits
    commonPhrases: [String],
    interests: [String],
    values: [String],
    
    // Context for AI
    bio: String, // Full resume/bio text
    personalityTraits: [String],
    
    // Learning from feedback
    replyExamples: [
      {
        context: String,
        originalMessage: String,
        userReply: String,
        timestamp: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.UserProfile ||
  mongoose.model('UserProfile', UserProfileSchema)
