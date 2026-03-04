/**
 * Conversation Model
 * Stores message history for context
 */

import mongoose, { Schema, model, models } from 'mongoose'

export interface IMessage {
  role: 'user' | 'contact' | 'assistant'
  content: string
  timestamp: Date
}

export interface IConversation extends mongoose.Document {
  userId: string
  contactId: mongoose.Types.ObjectId
  contactName: string
  messages: IMessage[]
  lastMessageDate: Date
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'contact', 'assistant'],
      required: true,
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
)

const ConversationSchema = new Schema<IConversation>(
  {
    userId: { type: String, required: true, index: true },
    contactId: { type: Schema.Types.ObjectId, ref: 'Contact', required: true },
    contactName: { type: String, required: true },
    messages: [MessageSchema],
    lastMessageDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

// Indexes
ConversationSchema.index({ userId: 1, contactId: 1 })
ConversationSchema.index({ userId: 1, lastMessageDate: -1 })

const Conversation =
  models.Conversation || model<IConversation>('Conversation', ConversationSchema)

export default Conversation
