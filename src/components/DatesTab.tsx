import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { getRoomId, getMyRole } from '@/lib/room';
import { supabase } from '@/integrations/supabase/client';
import type { KeyDate } from '@/lib/types';
import { differenceInDays, parseISO, startOfDay, format } from 'date-fns';
import { Plus, Heart, Cake, Star } from 'lucide-react';
import BottomSheet from './BottomSheet';

const DatesTab: React.FC = () => {
  const { t } = useTranslation();
  const roomId = getRoomId();
  const [keyDates, setKeyDates] = useState<KeyDate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [dateType, setDateType] = useState('custom');
  const [repeatYearly, setRepeatYearly] = useState(true);

  useEffect(() => {
    if (!roomId) return;
    loadDates();
    const channel = supabase
      .channel('dates-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'key_dates', filter: `room_id=eq.${roomId}` }, () => loadDates())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  const loadDates = async () => {
    if (!roomId) return;
    const { data } = await supabase.from('key_dates').select('*').eq('room_id', roomId).order('date');
    setKeyDates((data as any[]) || []);
  };

  const handleSave = async () => {
    if (!title.trim() || !date) return;
    await supabase.from('key_dates').insert({
      room_id: roomId!,
      title: title.trim(),
      date,
      key_date_type: dateType,
      repeat_yearly: repeatYearly,
    });
    setTitle(''); setDate(''); setShowForm(false);
    loadDates();
  };

  const getIcon = (type: string) => {
    if (type === 'anniversary') return <Heart size={16} />;
    if (type === 'birthday') return <Cake size={16} />;
    return <Star size={16} />;
  };

  return (
    <div className="pb-20 pt-4 px-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
          {t('dates.title')}
        </h2>
        <button onClick={() => setShowForm(true)} className="p-2 rounded-full" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          <Plus size={18} />
        </button>
      </div>

      {keyDates.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ background: 'var(--surface)' }}>
          <Heart size={32} className="mx-auto mb-3" style={{ color: 'var(--text-3)' }} />
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>{t('dates.add')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {keyDates.map(kd => {
            const dDays = differenceInDays(parseISO(kd.date), startOfDay(new Date()));
            return (
              <div key={kd.id} className="rounded-xl p-4 flex items-center gap-4" style={{ background: 'var(--surface)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  {getIcon(kd.key_date_type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{kd.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>{format(parseISO(kd.date), 'yyyy.MM.dd')}</p>
                </div>
                <span className="text-sm font-mono font-semibold" style={{ color: dDays === 0 ? 'var(--accent)' : dDays > 0 ? 'var(--text-2)' : 'var(--text-3)' }}>
                  {dDays === 0 ? 'D-Day' : dDays > 0 ? `D-${dDays}` : `D+${Math.abs(dDays)}`}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <BottomSheet onClose={() => setShowForm(false)} title={t('dates.add')}>
          <div className="flex flex-col gap-4">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder={t('event.title_placeholder')}
              className="w-full h-12 rounded-lg px-4" style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '16px' }} />
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full h-12 rounded-lg px-4" style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '16px' }} />
            <div className="flex gap-2">
              {['anniversary', 'birthday', 'custom'].map(dt => (
                <button key={dt} onClick={() => setDateType(dt)}
                  className="flex-1 h-10 rounded-full text-xs font-medium"
                  style={{ background: dateType === dt ? 'var(--accent)' : 'var(--surface)', color: dateType === dt ? 'white' : 'var(--text-2)', border: `1px solid ${dateType === dt ? 'var(--accent)' : 'var(--border)'}` }}>
                  {t(`dates.${dt}`)}
                </button>
              ))}
            </div>
            <button onClick={handleSave} disabled={!title.trim() || !date}
              className="w-full h-12 rounded-full text-white font-medium disabled:opacity-50" style={{ background: 'var(--accent)' }}>
              {t('common.save')}
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
};

export default DatesTab;
