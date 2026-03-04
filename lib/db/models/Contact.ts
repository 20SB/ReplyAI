/**
 * Contact Model
 * Stores contact information and communication context
 */

import mongoose, { Schema, model, models } from 'mongoose'

export interface IContact extends mongoose.Document {
  userId: string
  name: string
  relation?: string
  platform?: string
  tone: 'professional' | 'friendly' | 'funny' | 'casual' | 'formal'
  emojiLevel: 'none' | 'low' | 'medium' | 'high'
  replySpeed: 'instant' | 'fast' | 'medium' | 'slow'
  notes: string[]
  topics: string[]
  insideJokes: string[]
  lastMessageDate?: Date
  messageCount: number
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<IContact>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    relation: { type: String },
    platform: { type: String },
    tone: {
      type: String,
      enum: ['professional', 'friendly', 'funny', 'casual', 'formal'],
      default: 'friendly',
    },
    emojiLevel: {
      type: String,
      enum: ['none', 'low', 'medium', 'high'],
      default: 'medium',
    },
    replySpeed: {
      type: String,
      enum: ['instant', 'fast', 'medium', 'slow'],
      default: 'medium',
    },
    notes: [{ type: String }],
    topics: [{ type: String }],
    insideJokes: [{ type: String }],
    lastMessageDate: { type: Date },
    messageCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

// Indexes
ContactSchema.index({ userId: 1, name: 1 })

const Contact = models.Contact || model<IContact>('Contact', ContactSchema)

export default Contact
