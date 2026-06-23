import { google } from '@ai-sdk/google';
import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ChatSession from '@/models/ChatSession';
import { pusherServer } from '@/utils/pusher-server';

export const maxDuration = 30;

// AI SDK v6 sends UIMessage format where text lives in parts[], not content.
// This extracts all text parts and joins them. Falls back to plain .content for
// any code path that sends CoreMessage format.
function extractMessageText(message: any): string | null {
  if (Array.isArray(message.parts)) {
    const text = message.parts
      .filter((p: any) => p.type === 'text')
      .map((p: any) => p.text as string)
      .join('');
    return text || null;
  }
  if (typeof message.content === 'string' && message.content) {
    return message.content;
  }
  return null;
}

export async function POST(req: NextRequest) {
  const { messages, sessionId } = await req.json();

  if (!sessionId) {
    return new Response('Session ID is required', { status: 400 });
  }

  // Ensure ChatSession exists in DB
  await dbConnect();
  let session = await ChatSession.findOne({ sessionId });
  if (!session) {
    session = await ChatSession.create({ sessionId, status: 'AI_MODE', messages: [] });
  }

  // If the session is already escalated or resolved, the AI should not respond.
  // The frontend shouldn't hit this endpoint if it's escalated, but just in case:
  if (session.status !== 'AI_MODE') {
    return new Response('Chat is no longer in AI mode.', { status: 403 });
  }

  // Save the user's latest message to the DB
  const latestMessage = messages[messages.length - 1];
  const userText = extractMessageText(latestMessage);

  if (!userText) {
    console.error('[chat/route] Empty or malformed message:', JSON.stringify(latestMessage));
    return new Response('Message content is required.', { status: 400 });
  }

  session.messages.push({
    role: 'user',
    content: userText,
    createdAt: new Date(),
  });
  await session.save();

  const result = streamText({
    model: google('gemini-2.5-flash-lite'),
    system: `You are a professional, helpful support assistant for Webtricker LLC.
Your goal is to answer questions about our web development services, pricing, and capabilities.
CRITICAL IDENTITY RULE: You represent ONLY "Webtricker LLC". Never mention, reference, or name any other company, agency, or brand under any circumstances. If asked who you work for, the answer is always "Webtricker LLC".
You must NOT hallucinate prices. Use ONLY the following knowledge base:

## Pricing Packages
- **Essential:** Technical SEO, WordPress/Shopify Maintenance & Security, Up to 25 Hours of Dev Tasks/month, Basic Content Updates, Monthly Report, Email Support.
- **Agency Retainer:** Everything in Essential + Dedicated Senior Engineer, Full-Stack Development (Next.js, Laravel), 1 Active Request at a Time, Advanced Technical SEO, Slack Channel Access, 24hr response time.
- **Enterprise:** Headless E-Commerce Migrations, Custom SaaS, Multi-platform APIs, Dedicated Team Pod, NDA + White-label available. (Custom Scope/Fixed Price).

## Frequently Asked Questions
- Can I cancel? Yes, 30 days notice.
- Pause subscription? Yes, once per quarter up to 30 days.
- Unused hours? They do not roll over.
- White-label for agencies? Yes, we work as a silent partner with NDA.

## Lead Capture (Conversational)
After answering the visitor's FIRST substantive question, add one short, low-pressure follow-up sentence asking for their name and email — e.g. "By the way, what's your name and best email so our team can send you more details?" Keep it natural, never salesy.
If the visitor shares their name and/or email at ANY point, immediately and silently call the "captureUserInfo" tool. Do NOT mention saving it, do NOT say "I've noted that" — just call the tool and continue the conversation exactly as you normally would.
If they decline or skip the question, say "No worries!" and do NOT ask again for the rest of the conversation.
When escalating to a human: if you don't already have their name and email, ask naturally first. If you already collected them earlier, use those same values in "escalateToHuman" — do not ask twice.

## Escalation
If the user asks a question outside of this scope, or asks for a custom quotation, gently say you need to connect them with a human.
If they explicitly ask to speak to a human, or agree when you offer, call the "escalateToHuman" tool.
Keep your responses extremely concise and professional. Use short paragraphs.`,
    messages: await convertToModelMessages(messages),
    tools: {
      escalateToHuman: tool({
        description: 'Call this tool when the user explicitly asks to speak to a human, live agent, or when they want a custom quote that you cannot provide.',
        parameters: z.object({
          userName: z.string().describe("The user's name. Ask for it if they haven't provided it."),
          userEmail: z.string().email().describe("The user's email address. Ask for it if they haven't provided it."),
          reason: z.string().describe("A brief summary of why they are being escalated to a human."),
        }),
        // @ts-ignore - Bypass strict typecheck for AI SDK v6 tool execute overload
        execute: async ({ userName, userEmail, reason }) => {
          // Update the session status
          await dbConnect();
          const currentSession = await ChatSession.findOneAndUpdate(
            { sessionId },
            { 
              status: 'ESCALATED',
              userName,
              userEmail
            },
            { new: true }
          );

          // Trigger a pusher event to the admin dashboard
          await pusherServer.trigger('admin-chat', 'chat-escalated', {
            sessionId,
            userName,
            userEmail,
            reason
          });

          return `I have notified our live team! An agent has been pinged and will join this chat in just a moment. (If no one is available right now, they will email you at ${userEmail}).`;
        },
      }),
      captureUserInfo: tool({
        description: 'Silently save the name and/or email the visitor mentioned in the conversation. Call this the moment they share either one — do NOT announce it to the user or confirm saving. Just call it and keep the conversation going naturally.',
        parameters: z.object({
          userName: z.string().optional().describe("The visitor's name if they provided it"),
          userEmail: z.string().optional().describe("The visitor's email address if they provided it"),
        }),
        // @ts-ignore - Bypass strict typecheck for AI SDK v6 tool execute overload
        execute: async ({ userName, userEmail }) => {
          await dbConnect();
          const updateData: Record<string, string> = {};
          if (userName?.trim()) updateData.userName = userName.trim();
          if (userEmail?.trim()) updateData.userEmail = userEmail.trim();
          if (Object.keys(updateData).length > 0) {
            await ChatSession.findOneAndUpdate({ sessionId }, updateData);
          }
          return '';
        },
      }),
    },
    async onFinish({ text, toolCalls, toolResults }) {
      // Save the AI's response to the DB once the stream finishes
      await dbConnect();
      const currentSession = await ChatSession.findOne({ sessionId });
      if (currentSession) {
        currentSession.messages.push({
          role: 'assistant',
          content: text || 'Tool execution result.',
          createdAt: new Date()
        });
        await currentSession.save();
      }
    }
  });

  return result.toUIMessageStreamResponse();
}
