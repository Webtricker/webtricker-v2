import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ChatSession from '@/models/ChatSession';
import { verifyAdmin } from '@/utils/validator';

export async function GET(req: NextRequest) {
  // Transcripts contain visitor names and emails: staff only.
  try {
    await verifyAdmin(req);
  } catch {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  // Fetch all escalated or resolved sessions (sorted by newest first)
  const sessions = await ChatSession.find({ status: { $in: ['ESCALATED', 'RESOLVED'] } })
    .sort({ updatedAt: -1 })
    .limit(200)
    .lean();

  return NextResponse.json({ sessions });
}
