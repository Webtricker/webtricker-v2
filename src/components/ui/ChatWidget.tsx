'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { pusherClient } from '@/utils/pusher-client';
import { IoChatbubblesOutline, IoCloseOutline } from 'react-icons/io5';

function getMessageText(m: any): string {
  if (Array.isArray(m.parts)) {
    return m.parts
      .filter((p: any) => p.type === 'text')
      .map((p: any) => p.text)
      .join('');
  }
  return m.content || '';
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [mode, setMode] = useState<'AI_MODE' | 'ESCALATED'>('AI_MODE');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef('');

  // Custom manual messages for ESCALATED mode
  const [humanMessages, setHumanMessages] = useState<any[]>([]);
  const [humanInput, setHumanInput] = useState('');

  // AI input state — managed manually in v6
  const [aiInput, setAiInput] = useState('');

  // Transport created once; body reads sessionId from ref so it stays current
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        credentials: 'include',
        body: () => ({ sessionId: sessionIdRef.current }),
      }),
    []
  );

  const { messages: aiMessages, sendMessage, status, error: aiError } = useChat({ transport });

  const isAiBusy = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    let sid = localStorage.getItem('chat_session_id');
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem('chat_session_id', sid);
    }
    sessionIdRef.current = sid;
    setSessionId(sid);

    fetch(`/api/chat/messages?sessionId=${sid}`)
      .then(res => res.json())
      .then(data => {
        if (data.session?.status === 'ESCALATED') {
          setMode('ESCALATED');
          setHumanMessages(data.session.messages);
        }
      });
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    const channel = pusherClient.subscribe(`chat-${sessionId}`);

    channel.bind('new-message', (data: any) => {
      setMode('ESCALATED');
      setHumanMessages(prev => {
        const exists = prev.find(m => m.content === data.content && m.role === data.role);
        if (exists) return prev;
        return [...prev, data];
      });
    });

    return () => {
      pusherClient.unsubscribe(`chat-${sessionId}`);
    };
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, humanMessages, isOpen]);

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = aiInput.trim();
    if (!text || isAiBusy) return;
    setAiInput('');
    sendMessage({ text });
  };

  const handleHumanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanInput.trim()) return;

    const messageContent = humanInput;
    setHumanInput('');

    setHumanMessages(prev => [...prev, { role: 'user', content: messageContent }]);

    await fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, role: 'user', content: messageContent }),
    });
  };

  const currentMessages = mode === 'AI_MODE' ? aiMessages : humanMessages;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#FFC107] text-black p-4 rounded-full shadow-lg hover:opacity-90 transition-all flex items-center justify-center"
        >
          {isOpen ? <IoCloseOutline size={28} /> : <IoChatbubblesOutline size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white dark:bg-[var(--clr-bg-body-dark)] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-900 p-4 flex justify-between items-center shrink-0">
            <div>
              <div className="font-bold text-lg">
                {mode === 'AI_MODE' ? 'Webtricker LLC' : 'Webtricker Live Support'}
              </div>
              <div className="text-xs text-zinc-300 dark:text-zinc-600 font-medium mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {mode === 'AI_MODE' ? 'Online - We reply instantly' : 'You are speaking with a human.'}
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white dark:text-zinc-900 hover:opacity-70">
              <IoCloseOutline size={24} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain p-4 space-y-4 custom-scrollbar bg-zinc-50 dark:bg-[var(--clr-bg-body-dark)]">
            {currentMessages.length === 0 && (
              <div className="text-center text-zinc-500 mt-10 text-sm px-2 leading-relaxed">
                👋 Hi! Let us know your requirements or any pain points you&apos;re facing. We&apos;re here to solve them!
              </div>
            )}

            {currentMessages.map((m: any, index: number) => (
              <div key={m.id || index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    m.role === 'user'
                      ? 'bg-[#FFC107] text-black rounded-br-none'
                      : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none shadow-sm border border-zinc-100 dark:border-zinc-800'
                  }`}
                >
                  {getMessageText(m)}
                </div>
              </div>
            ))}
            {aiError && mode === 'AI_MODE' && (
              <div className="flex justify-start">
                <div className="max-w-[85%] p-3 rounded-2xl text-sm bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-bl-none border border-red-200 dark:border-red-800">
                  Something went wrong. Please try again.
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 shrink-0 bg-white dark:bg-[var(--clr-bg-body-dark)]">
            {mode === 'AI_MODE' ? (
              <form onSubmit={handleAiSubmit} className="flex gap-2">
                <input
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  value={aiInput}
                  placeholder="Type your message..."
                  onChange={e => setAiInput(e.target.value)}
                  disabled={isAiBusy}
                />
                <button
                  type="submit"
                  className="bg-[#FFC107] text-black px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                  disabled={!aiInput.trim() || isAiBusy}
                >
                  Send
                </button>
              </form>
            ) : (
              <form onSubmit={handleHumanSubmit} className="flex gap-2">
                <input
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  value={humanInput}
                  placeholder="Reply to live agent..."
                  onChange={e => setHumanInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-[#FFC107] text-black px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                  disabled={!humanInput.trim()}
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
