import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ChatSession from '@/models/ChatSession';
import { pusherServer } from '@/utils/pusher-server';

// Fetch chat history for a session
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
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
  const { sessionId, role, content } = await req.json();

  if (!sessionId || !role || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Allow all for now

  await dbConnect();
  const session = await ChatSession.findOne({ sessionId });

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const newMessage = {
    role,
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
