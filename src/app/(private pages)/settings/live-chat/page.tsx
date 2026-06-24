'use client';

import { useState, useEffect, useRef } from 'react';
import { pusherClient } from '@/utils/pusher-client';
import { IoCheckmarkDoneOutline, IoSend, IoPersonCircleOutline } from 'react-icons/io5';
import { getCodename } from '@/utils/codename';

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function renderMessageContent(text: string) {
  if (!text) return null;
  const parts = text.split(URL_REGEX);
  if (parts.length === 1) return text;
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline break-all opacity-90 hover:opacity-100">
            {part}
          </a>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function LiveChatDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any | null>(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch initial sessions
  useEffect(() => {
    fetch('/api/chat/admin/sessions')
      .then(res => res.json())
      .then(data => {
        if (data.sessions) {
          setSessions(data.sessions);
        }
      });
  }, []);

  // 2. Listen for global admin events (new escalations)
  useEffect(() => {
    const adminChannel = pusherClient.subscribe('admin-chat');
    
    adminChannel.bind('chat-escalated', (data: any) => {
      // Add the new session to the top of the list
      setSessions(prev => {
        // Prevent duplicates
        if (prev.find(s => s.sessionId === data.sessionId)) return prev;
        return [{
          sessionId: data.sessionId,
          userName: data.userName,
          userEmail: data.userEmail,
          status: 'ESCALATED',
          updatedAt: new Date().toISOString(),
          messages: [] // Not fully loaded until clicked
        }, ...prev];
      });
    });

    return () => {
      pusherClient.unsubscribe('admin-chat');
    };
  }, []);

  // 3. Listen for specific chat events when a session is active
  useEffect(() => {
    if (!activeSession) return;
    
    // Fetch full message history when a session is clicked
    fetch(`/api/chat/messages?sessionId=${activeSession.sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.session) {
          setActiveSession(data.session);
        }
      });

    const chatChannel = pusherClient.subscribe(`chat-${activeSession.sessionId}`);
    
    chatChannel.bind('new-message', (data: any) => {
      setActiveSession((prev: any) => {
        if (!prev) return prev;
        // Prevent duplicates
        if (prev.messages.find((m: any) => m.content === data.content && m.role === data.role)) return prev;
        return {
          ...prev,
          messages: [...prev.messages, data]
        };
      });
    });

    return () => {
      pusherClient.unsubscribe(`chat-${activeSession.sessionId}`);
    };
  }, [activeSession?.sessionId]);

  // 4. Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeSession) return;

    const messageContent = input;
    setInput('');
    
    // Optimistic UI update
    setActiveSession((prev: any) => ({
      ...prev,
      messages: [...prev.messages, { role: 'agent', content: messageContent }]
    }));

    await fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: activeSession.sessionId,
        role: 'agent',
        content: messageContent
      })
    });
  };

  const handleResolve = async () => {
    if (!activeSession) return;
    await fetch('/api/chat/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: activeSession.sessionId }),
    });
    setSessions(prev =>
      prev.map(s =>
        s.sessionId === activeSession.sessionId ? { ...s, status: 'RESOLVED' } : s
      )
    );
    setActiveSession((prev: any) => prev ? { ...prev, status: 'RESOLVED' } : prev);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden mt-6">
      
      {/* Sidebar (List of Sessions) */}
      <div className="w-1/3 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50 dark:bg-zinc-900">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">Active Chats</h2>
          <p className="text-xs text-zinc-500">Live escalating users</p>
        </div>
        
        <div data-lenis-prevent className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain custom-scrollbar">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500">No active chats.</div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.sessionId}
                onClick={() => setActiveSession(session)}
                className={`w-full p-4 flex items-start gap-3 border-b border-zinc-100 dark:border-zinc-800 transition-colors text-left
                  ${activeSession?.sessionId === session.sessionId 
                    ? 'bg-indigo-50/50 dark:bg-indigo-500/10' 
                    : 'hover:bg-white dark:hover:bg-zinc-800/50'
                  }`}
              >
                <div className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 p-2 rounded-full shrink-0">
                  <IoPersonCircleOutline size={24} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {session.userName || session.userEmail || getCodename(session.sessionId)}
                    </span>
                    <span className="text-[10px] text-zinc-400 shrink-0">
                      {new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0"></span>
                    <span className="truncate">{session.status}</span>
                  </div>
                  {(session.satisfactionRating || session.wasResolved !== undefined && session.wasResolved !== null) && (
                    <div className="flex items-center gap-1 mt-1">
                      {session.satisfactionRating && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          session.satisfactionRating === 'very_happy' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' :
                          session.satisfactionRating === 'satisfactory' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400' :
                          'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                        }`}>
                          {session.satisfactionRating === 'very_happy' ? 'Very Happy' :
                           session.satisfactionRating === 'satisfactory' ? 'Satisfactory' : 'Not Happy'}
                        </span>
                      )}
                      {session.wasResolved !== undefined && session.wasResolved !== null && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          session.wasResolved ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                        }`}>
                          {session.wasResolved ? 'Resolved' : 'Unresolved'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950">
        {activeSession ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-950 shadow-sm z-10">
              <div>
                <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">
                  {activeSession.userName || getCodename(activeSession.sessionId)}
                </h2>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {activeSession.userEmail && (
                    <p className="text-xs text-zinc-500">{activeSession.userEmail}</p>
                  )}
                  {activeSession.satisfactionRating && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      activeSession.satisfactionRating === 'very_happy' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' :
                      activeSession.satisfactionRating === 'satisfactory' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400' :
                      'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                    }`}>
                      {activeSession.satisfactionRating === 'very_happy' ? 'Very Happy' :
                       activeSession.satisfactionRating === 'satisfactory' ? 'Satisfactory' : 'Not Happy'}
                    </span>
                  )}
                  {activeSession.wasResolved !== undefined && activeSession.wasResolved !== null && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      activeSession.wasResolved ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                    }`}>
                      {activeSession.wasResolved ? 'Resolved' : 'Unresolved'}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={handleResolve}
                className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
              >
                <IoCheckmarkDoneOutline /> Mark Resolved
              </button>
            </div>

            {/* Messages */}
            <div data-lenis-prevent className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain p-6 space-y-4 custom-scrollbar">
              {activeSession.messages?.map((m: any, idx: number) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl text-sm whitespace-pre-line
                      ${m.role === 'user'
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none shadow-sm'
                        : m.role === 'agent'
                          ? 'bg-[#4F46E5] text-white rounded-tr-none shadow-sm'
                          : 'bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 rounded-tr-none text-xs border border-zinc-200 dark:border-zinc-800'
                      }
                    `}
                  >
                    {m.role === 'assistant' && <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1">AI Agent</div>}
                    {m.role === 'agent' && <div className="text-[10px] uppercase font-bold text-indigo-200 mb-1">You</div>}
                    {renderMessageContent(m.content)}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <form onSubmit={handleSend} className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a message to the user..."
                  className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim()}
                  className="bg-[#4F46E5] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <span>Send</span>
                  <IoSend size={16} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600">
            <IoChatbubblesOutline size={48} className="mb-4 opacity-20" />
            <p>Select a chat from the sidebar to view transcript</p>
            <p className="text-xs mt-2">Live updates will appear automatically</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { IoChatbubblesOutline } from 'react-icons/io5';
