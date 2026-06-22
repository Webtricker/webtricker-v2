import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ChatSession from '@/models/ChatSession';
import { pusherServer } from '@/utils/pusher-server';

export const maxDuration = 30;

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
  session.messages.push({
    role: 'user',
    content: latestMessage.content,
    createdAt: new Date(),
  });
  await session.save();

  const result = streamText({
    model: google('models/gemini-1.5-flash-latest'),
    system: `You are a professional, helpful support assistant for Webtricker LLC and MarkupMarvel Agency. 
Your goal is to answer questions about our web development services, pricing, and capabilities. 
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

If the user asks a question outside of this scope, or asks for a custom quotation, you MUST gently tell them that you need to connect them with a human agent or our lead developer. 
If they explicitly ask to speak to a human, or if you ask to connect them and they say yes, you MUST call the "escalateToHuman" tool.
Keep your responses extremely concise and professional. Use short paragraphs.`,
    messages,
    tools: {
      escalateToHuman: tool({
        description: 'Call this tool when the user explicitly asks to speak to a human, live agent, or when they want a custom quote that you cannot provide.',
        parameters: z.object({
          userName: z.string().describe("The user's name. Ask for it if they haven't provided it."),
          userEmail: z.string().email().describe("The user's email address. Ask for it if they haven't provided it."),
          reason: z.string().describe("A brief summary of why they are being escalated to a human."),
        }),
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

  return result.toDataStreamResponse();
}
