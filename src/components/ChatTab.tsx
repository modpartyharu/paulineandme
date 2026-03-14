import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { getRoomId, getMyRole } from '@/lib/room';
import { supabase } from '@/integrations/supabase/client';
import type { Message, Profile } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Send } from 'lucide-react';
import AvatarCircle from './AvatarCircle';

const ChatTab: React.FC = () => {
  const { t } = useTranslation();
  const roomId = getRoomId();
  const myRole = getMyRole();
  const [messages, setMessages] = useState<Message[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomId) return;
    loadData();
    const channel = supabase
      .channel('chat-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  const loadData = async () => {
    if (!roomId) return;
    const [msgRes, profRes] = await Promise.all([
      supabase.from('messages').select('*').eq('room_id', roomId).order('created_at', { ascending: true }).limit(200),
      supabase.from('profiles').select('*').eq('room_id', roomId),
    ]);
    setMessages((msgRes.data as any[]) || []);
    setProfiles((profRes.data as any[]) || []);
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 100);
  };

  const handleSend = async () => {
    if (!input.trim() || !roomId || !myRole) return;
    const text = input.trim();
    setInput('');
    await supabase.from('messages').insert({
      room_id: roomId,
      sender: myRole,
      content: text,
    });
  };

  const getProfile = (role: string) => profiles.find(p => p.role === role);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-4 pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        {messages.map(msg => {
          const isMine = msg.sender === myRole;
          const profile = getProfile(msg.sender);
          return (
            <div key={msg.id} className={`flex mb-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[75%]`}>
                {!isMine && profile && (
                  <div className="flex items-center gap-2 mb-1">
                    <AvatarCircle profile={profile} size={20} />
                    <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>{profile.name}</span>
                  </div>
                )}
                <div
                  className="px-4 py-2.5 rounded-2xl text-sm"
                  style={{
                    background: isMine ? 'var(--accent)' : 'var(--surface-2)',
                    color: isMine ? 'white' : 'var(--text)',
                    borderBottomRightRadius: isMine ? '4px' : '16px',
                    borderBottomLeftRadius: isMine ? '16px' : '4px',
                  }}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] mt-0.5 px-1" style={{ color: 'var(--text-3)' }}>
                  {format(parseISO(msg.created_at), 'HH:mm')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="px-4 py-3 flex items-center gap-2 mb-16" style={{ borderTop: '0.5px solid var(--border)', background: 'var(--surface)' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={t('chat.placeholder')}
          className="flex-1 h-10 rounded-full px-4 text-sm"
          style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '16px' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40"
          style={{ background: 'var(--accent)' }}
        >
          <Send size={16} color="white" />
        </button>
      </div>
    </div>
  );
};

export default ChatTab;
