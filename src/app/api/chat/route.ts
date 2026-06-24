import { google } from '@ai-sdk/google';
import { streamText, tool, convertToModelMessages, stepCountIs } from 'ai';
import { z } from 'zod';
import { NextRequest, after } from 'next/server';
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
  try {
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
      stopWhen: stepCountIs(3),
      system: `You are a professional, helpful support assistant for Webtricker LLC — a web development and digital agency. You can answer questions on any topic naturally and helpfully. When topics relate to Webtricker's services, pricing, or capabilities, use the knowledge base below as your authoritative source.

CRITICAL IDENTITY RULE: You represent ONLY "Webtricker LLC". Never mention, reference, or name any other company, agency, or brand. If asked who you work for, the answer is always "Webtricker LLC".

LANGUAGE RULE: Always reply in the same language the visitor writes in. If they write in Bengali, reply in Bengali. If they write in Hindi, reply in Hindi. Follow their language naturally. Default to English only if the language is unclear.

FORMATTING RULE: Write in short, natural paragraphs. Separate paragraphs with a blank line. Do NOT use markdown headers, bullet points, dashes, or numbered lists — plain conversational text only. Keep responses brief.

PRICING RULE: Never hallucinate prices or invent package details. If asked about pricing details not listed below, say you'd be happy to get them a custom quote from the team. Use ONLY the following knowledge base for pricing:

PRICING PACKAGES
Essential: Technical SEO, WordPress/Shopify Maintenance & Security, up to 25 Hours of Dev Tasks/month, Basic Content Updates, Monthly Report, Email Support.
Agency Retainer: Everything in Essential, plus a Dedicated Senior Engineer, Full-Stack Development (Next.js, Laravel), 1 Active Request at a Time, Advanced Technical SEO, Slack Channel Access, 24hr response time.
Enterprise: Headless E-Commerce Migrations, Custom SaaS, Multi-platform APIs, Dedicated Team Pod, NDA and White-label available. Custom Scope / Fixed Price.

FREQUENTLY ASKED QUESTIONS
Can I cancel? Yes, with 30 days notice.
Can I pause? Yes, once per quarter for up to 30 days.
Do unused hours roll over? No, they do not.
White-label for agencies? Yes, we work as a silent partner with NDA.

TRAINING COURSES
For any question about training, courses, learning programs, or internships — call "getTrainingInfo" to get live, accurate data. Our training is rolling enrollment (join anytime) with personal, guided mentorship — never imply fixed batches, cohorts, or enrollment deadlines.

LEAD CAPTURE (Conversational)
On your VERY FIRST response — regardless of topic — after your answer, append one short low-pressure sentence asking for their name and email. Example: "By the way, what's your name and best email so our team can follow up?" Keep it natural, never salesy.
If the visitor shares their name and/or email at ANY point, immediately call "captureUserInfo" silently. Do NOT confirm saving it — just call the tool and continue the conversation naturally.
If they decline or skip, say "No worries!" and do NOT ask again.
When escalating: if you already have their name and email, use those in "escalateToHuman" — do not ask twice.

ESCALATION — only call escalateToHuman when:
- The user explicitly asks to speak to a human or live agent
- The user agrees when you offer to connect them with a human
- The request genuinely requires a human (custom enterprise scope, contract negotiations, or something you truly cannot help with)
- The user wants a custom price quote beyond the listed packages

For off-topic questions, general questions, or anything outside web development — answer helpfully from your general knowledge. Do not escalate just because a question is off-topic.`,
      messages: await convertToModelMessages(
        messages.map((m: any) => ({
          ...m,
          parts: m.parts || (m.content ? [{ type: 'text', text: m.content }] : [])
        }))
      ),
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
            await dbConnect();
            await ChatSession.findOneAndUpdate(
              { sessionId },
              { status: 'ESCALATED', userName, userEmail },
              { new: true }
            );

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
            return 'Info saved. Continue the conversation naturally.';
          },
        }),
        getTrainingInfo: tool({
          description: 'Fetch live information about Webtricker Training courses — names, descriptions, packages, and pricing. Call this whenever the user asks about training, courses, learning programs, internships, or anything education/skills-related. Do NOT answer training questions from memory — always call this tool first.',
          parameters: z.object({
            courseQuery: z.string().optional().describe("Optional: a specific course name or topic the user is asking about. Leave empty to fetch all courses."),
          }),
          // @ts-ignore - Bypass strict typecheck for AI SDK v6 tool execute overload
          execute: async () => {
            try {
              await dbConnect();
              const Training = (await import('@/models/Training')).default;
              const courses = await Training.find({ published: true })
                .select('title description packages')
                .lean();

              if (!courses.length) {
                return "No training course data is currently available — let the user know you'll need to check with the team for exact details.";
              }

              // Safe formatter — .lean() strips Mongoose defaults, so numeric fields may be
              // undefined on old documents; calling .toLocaleString() on undefined throws.
              const fmt = (n: unknown): string =>
                typeof n === 'number' ? n.toLocaleString() : '?';

              const formatted = (courses as any[]).map((course) => {
                const pkgLines = (course.packages ?? []).map((pkg: any) => {
                  const lines = [
                    `  • ${pkg.name ?? 'Package'} (${pkg.tier ?? ''}) — ${pkg.duration ?? ''}`,
                    `    Online: ৳${fmt(pkg.totalFee)} = ৳${fmt(pkg.registrationFee)} registration + ৳${fmt(pkg.installmentAmount)}×${pkg.installmentCount ?? '?'} installments`,
                  ];
                  if (pkg.offlineTotalFee) {
                    lines.push(`    Offline: ৳${fmt(pkg.offlineTotalFee)}`);
                  }
                  return lines.join('\n');
                });

                const pkgSection = pkgLines.length ? pkgLines.join('\n\n') : '  No packages listed.';
                return `== ${course.title ?? 'Course'} ==\n${course.description ?? ''}\n\nPackages:\n${pkgSection}`;
              });

              const header = 'NOTE: Webtricker training is rolling enrollment — students can join anytime, with personal, guided, one-on-one mentorship and day-to-day hands-on practice from day one. This is not a fixed-batch or fixed-schedule program.\n\n';
              return header + formatted.join('\n\n---\n\n');
            } catch (err) {
              console.error('[chat/route] getTrainingInfo tool error:', err);
              return "I'm having trouble fetching course details right now. Let me connect you with our team who can share the latest course information directly.";
            }
          },
        }),
      },
      onError: ({ error }) => {
        console.error('[chat/route] streamText error:', {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          cause: error instanceof Error ? (error as any).cause : undefined,
        });

        // after() guarantees this runs to completion even after the response stream
        // closes. The old void-IIFE was dropped by Vercel before Pusher could fire,
        // leaving the session ESCALATED in DB while the widget stayed in AI_MODE —
        // causing every subsequent request to get a 403 and appear broken.
        after(async () => {
          try {
            await dbConnect();
            const errorSession = await ChatSession.findOne({ sessionId });
            if (!errorSession || errorSession.status !== 'AI_MODE') return;

            const fallbackMsg = {
              role: 'assistant' as const,
              content: "I'm having a little trouble right now — let me get one of our team members to help you instead.",
              createdAt: new Date(),
            };
            errorSession.status = 'ESCALATED';
            errorSession.messages.push(fallbackMsg);
            await errorSession.save();

            await pusherServer.trigger('admin-chat', 'chat-escalated', {
              sessionId,
              userName: errorSession.userName ?? null,
              userEmail: errorSession.userEmail ?? null,
              reason: 'AI error — automatic escalation',
            });
            await pusherServer.trigger(`chat-${sessionId}`, 'new-message', fallbackMsg);

            // Admin alert email — isolated so a send failure never affects the above
            try {
              const { getChatErrorAlertTemplate } = await import('@/utils/mailTemplate');
              const { default: transporter } = await import('@/services/mail');
              const lastMsg = messages[messages.length - 1];
              const lastText = extractMessageText(lastMsg) ?? '(unavailable)';
              await transporter.sendMail({
                from: `"Webtricker Chat" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_TO,
                subject: '⚠️ Chat Widget Error — Session Needs Review',
                html: getChatErrorAlertTemplate({
                  sessionId,
                  lastMessage: lastText,
                  timestamp: new Date().toISOString(),
                  errorMessage: error instanceof Error ? error.message : String(error),
                }),
              });
            } catch (emailErr) {
              console.error('[chat/route] Admin alert email failed:', emailErr);
            }
          } catch (bgErr) {
            console.error('[chat/route] Error fallback handler failed:', bgErr);
          }
        });
      },
      async onFinish({ text }) {
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
  } catch (error: unknown) {
    console.error('[chat/route] POST handler error:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? (error as any).cause : undefined,
    });
    return new Response('Internal server error', { status: 500 });
  }
}
