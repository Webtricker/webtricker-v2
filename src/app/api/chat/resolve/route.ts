import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ChatSession from '@/models/ChatSession';

export async function POST(req: NextRequest) {
  const { sessionId, satisfactionRating, wasResolved } = await req.json();
  if (!sessionId) return NextResponse.json({ error: 'Session ID required' }, { status: 400 });

  await dbConnect();
  const updateData: Record<string, unknown> = { status: 'RESOLVED' };
  if (satisfactionRating !== undefined && satisfactionRating !== null) {
    updateData.satisfactionRating = satisfactionRating;
  }
  if (wasResolved !== undefined && wasResolved !== null) {
    updateData.wasResolved = wasResolved;
  }

  await ChatSession.findOneAndUpdate({ sessionId }, updateData);
  return NextResponse.json({ success: true });
}
