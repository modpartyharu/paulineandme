import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/i18n/LanguageContext';
import { getRoomId, getMyRole } from '@/lib/room';
import { supabase } from '@/integrations/supabase/client';
import type { Profile, CalendarEvent, KeyDate } from '@/lib/types';
import { differenceInDays, format, isToday, parseISO, startOfDay } from 'date-fns';
import { CalendarDays, Plus } from 'lucide-react';
import AvatarCircle from './AvatarCircle';

const HomeTab: React.FC = () => {
  const { t, lang } = useTranslation();
  const roomId = getRoomId();
  const myRole = getMyRole();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);
  const [anniversary, setAnniversary] = useState<string | null>(null);
  const [keyDates, setKeyDates] = useState<KeyDate[]>([]);

  useEffect(() => {
    if (!roomId) return;
    loadData();

    const channel = supabase
      .channel('home-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events', filter: `room_id=eq.${roomId}` }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `room_id=eq.${roomId}` }, () => loadData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  const loadData = async () => {
    if (!roomId) return;
    const today = startOfDay(new Date()).toISOString();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [profilesRes, eventsRes, roomRes, keyDatesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('room_id', roomId),
      supabase.from('events').select('*').eq('room_id', roomId).gte('start_time', today).lte('start_time', endOfDay.toISOString()).order('start_time'),
      supabase.from('rooms').select('anniversary_date').eq('id', roomId).single(),
      supabase.from('key_dates').select('*').eq('room_id', roomId).order('date'),
    ]);

    setProfiles((profilesRes.data as any[]) || []);
    setTodayEvents((eventsRes.data as any[]) || []);
    setAnniversary(roomRes.data?.anniversary_date || null);
    setKeyDates((keyDatesRes.data as any[]) || []);
  };

  const myProfile = profiles.find(p => p.role === myRole);
  const partnerProfile = profiles.find(p => p.role !== myRole);
  const daysCount = anniversary ? differenceInDays(new Date(), parseISO(anniversary)) + 1 : null;

  return (
    <div className="pb-20 pt-4 px-5">
      {/* Header with avatars */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {myProfile && <AvatarCircle profile={myProfile} size={36} />}
          {partnerProfile && <AvatarCircle profile={partnerProfile} size={36} />}
          {!partnerProfile && (
            <div className="w-9 h-9 rounded-full border-2 border-dashed flex items-center justify-center" style={{ borderColor: 'var(--border)' }}>
              <Plus size={14} style={{ color: 'var(--text-3)' }} />
            </div>
          )}
        </div>
        <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
          {format(new Date(), 'MMM d')}
        </span>
      </div>

      {/* D-Day counter */}
      {daysCount !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 mb-6"
          style={{ background: 'var(--accent-light)' }}
        >
          <p className="text-xs mb-1" style={{ color: 'var(--accent-dark)' }}>
            {t('home.together')}
          </p>
          <p className="text-3xl font-semibold" style={{ color: 'var(--accent-dark)', fontFamily: 'var(--font-display)' }}>
            {daysCount} {t('home.days')}
          </p>
        </motion.div>
      )}

      {/* Today's events */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-3)' }}>
          {t('home.today')}
        </h3>
        {todayEvents.length === 0 ? (
          <div className="rounded-xl p-6 text-center" style={{ background: 'var(--surface)' }}>
            <CalendarDays size={32} className="mx-auto mb-2" style={{ color: 'var(--text-3)' }} />
            <p className="text-sm" style={{ color: 'var(--text-3)' }}>{t('home.no_events')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {todayEvents.map(event => (
              <div
                key={event.id}
                className="rounded-xl p-4"
                style={{ background: 'var(--surface)', borderLeft: `3px solid ${event.color_override || 'var(--accent)'}` }}
              >
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{event.title}</p>
                {!event.all_day && (
                  <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
                    {format(parseISO(event.start_time), 'HH:mm')} - {format(parseISO(event.end_time), 'HH:mm')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Key dates D-Day */}
      {keyDates.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-3)' }}>
            {t('home.dday')}
          </h3>
          <div className="flex flex-col gap-2">
            {keyDates.slice(0, 5).map(kd => {
              const dDays = differenceInDays(parseISO(kd.date), startOfDay(new Date()));
              return (
                <div key={kd.id} className="rounded-xl p-4 flex justify-between items-center" style={{ background: 'var(--surface)' }}>
                  <span className="text-sm" style={{ color: 'var(--text)' }}>{kd.title}</span>
                  <span className="text-sm font-mono font-medium" style={{ color: dDays === 0 ? 'var(--accent)' : 'var(--text-2)' }}>
                    {dDays === 0 ? t('dates.today_is') : dDays > 0 ? `D-${dDays}` : `D+${Math.abs(dDays)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeTab;
