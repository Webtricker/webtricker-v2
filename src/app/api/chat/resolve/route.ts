import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ChatSession from '@/models/ChatSession';
import { pusherServer } from '@/utils/pusher-server';
import { isSameOrigin, readJsonBody } from '@/lib/security/guard';
import { getClientIp, rateLimit } from '@/lib/security/rateLimit';
import { isUuid } from '@/lib/security/sanitize';

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: 'Request rejected' }, { status: 403 });

  const body = await readJsonBody(req, 2_000);
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const { sessionId, satisfactionRating, wasResolved } = body;
  if (!isUuid(sessionId)) return NextResponse.json({ error: 'Valid session ID required' }, { status: 400 });

  const limited = await rateLimit('chat-resolve', getClientIp(req), 20, 600);
  if (!limited.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  await dbConnect();
  const updateData: Record<string, unknown> = { status: 'RESOLVED' };
  if (typeof satisfactionRating === 'number' && satisfactionRating >= 1 && satisfactionRating <= 5) {
    updateData.satisfactionRating = Math.round(satisfactionRating);
  }
  if (typeof wasResolved === 'boolean') {
    updateData.wasResolved = wasResolved;
  }

  await ChatSession.findOneAndUpdate({ sessionId }, updateData);

  // Notify the widget so it transitions to ended state in real time
  await pusherServer.trigger(`chat-${sessionId}`, 'session-resolved', {});

  return NextResponse.json({ success: true });
}
