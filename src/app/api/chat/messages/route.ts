import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ChatSession from '@/models/ChatSession';
import { pusherServer } from '@/utils/pusher-server';
import { verifyAdmin } from '@/utils/validator';
import { isSameOrigin, readJsonBody } from '@/lib/security/guard';
import { getClientIp, rateLimit } from '@/lib/security/rateLimit';
import { cleanText, isUuid } from '@/lib/security/sanitize';

// Fetch chat history for a session
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('sessionId');

  if (!isUuid(sessionId)) {
    return NextResponse.json({ error: 'A valid sessionId is required' }, { status: 400 });
  }

  await dbConnect();
  const session = await ChatSession.findOne({ sessionId });

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  // Auto-resolve sessions inactive for more than 10 minutes
  const TEN_MINUTES = 10 * 60 * 1000;
  if (['AI_MODE', 'ESCALATED'].includes(session.status)) {
    const lastActivity = new Date(session.updatedAt).getTime();
    if (Date.now() - lastActivity > TEN_MINUTES) {
      session.status = 'RESOLVED';
      await session.save();
    }
  }

  return NextResponse.json({ session });
}

// Send a message (User or Agent)
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Request rejected' }, { status: 403 });
  }

  const body = await readJsonBody(req, 10_000);
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const sessionId = body.sessionId;
  const role = body.role;
  const content = cleanText(body.content, 2000);

  if (!isUuid(sessionId) || !content || (role !== 'user' && role !== 'agent')) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }

  // Only signed-in staff may speak as the agent; visitors can only post as themselves.
  if (role === 'agent') {
    try {
      await verifyAdmin(req);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else {
    const [perIp, perSession] = await Promise.all([
      rateLimit('chat-msg-ip', getClientIp(req), 40, 600),
      rateLimit('chat-msg-session', sessionId, 30, 600),
    ]);
    if (!perIp.allowed || !perSession.allowed) {
      return NextResponse.json({ error: 'Too many messages. Please slow down.' }, { status: 429 });
    }
  }

  await dbConnect();
  const session = await ChatSession.findOne({ sessionId });

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const newMessage = {
    role: role as 'user' | 'agent',
    content,
    createdAt: new Date()
  };

  session.messages.push(newMessage);
  await session.save();

  // Trigger pusher event to the specific chat channel
  // The channel name is specific to the session: `chat-${sessionId}`
  await pusherServer.trigger(`chat-${sessionId}`, 'new-message', newMessage);

  // Also trigger a global event so the admin dashboard list updates
  if (role === 'user') {
    await pusherServer.trigger('admin-chat', 'user-reply', {
      sessionId,
      content,
      userName: session.userName
    });
  }

  return NextResponse.json({ success: true, message: newMessage });
}
