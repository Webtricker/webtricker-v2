import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ChatSession from '@/models/ChatSession';

export async function GET(req: NextRequest) {
  // Allow all for now
  await dbConnect();
  
  // Fetch all escalated or resolved sessions (sorted by newest first)
  const sessions = await ChatSession.find({ status: { $in: ['ESCALATED', 'RESOLVED'] } })
    .sort({ updatedAt: -1 })
    .lean();

  return NextResponse.json({ sessions });
}
