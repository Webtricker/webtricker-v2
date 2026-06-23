import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant' | 'agent';
  content: string;
  createdAt: Date;
}

export interface IChatSession extends Document {
  sessionId: string;
  userEmail?: string;
  userName?: string;
  status: 'AI_MODE' | 'ESCALATED' | 'RESOLVED';
  satisfactionRating?: 'not_happy' | 'satisfactory' | 'very_happy';
  wasResolved?: boolean;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    role: { type: String, enum: ['user', 'assistant', 'agent'], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatSessionSchema = new Schema<IChatSession>(
  {
    sessionId: { type: String, required: true, unique: true },
    userEmail: { type: String },
    userName: { type: String },
    status: { type: String, enum: ['AI_MODE', 'ESCALATED', 'RESOLVED'], default: 'AI_MODE' },
    satisfactionRating: { type: String, enum: ['not_happy', 'satisfactory', 'very_happy'] },
    wasResolved: { type: Boolean },
    messages: { type: [ChatMessageSchema], default: [] },
  },
  { timestamps: true }
);

const ChatSession: Model<IChatSession> = mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);

export default ChatSession;
