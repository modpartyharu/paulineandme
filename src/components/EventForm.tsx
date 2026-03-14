import React, { useState } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { getRoomId, getMyRole } from '@/lib/room';
import { supabase } from '@/integrations/supabase/client';
import type { Category } from '@/lib/types';
import { format } from 'date-fns';

interface EventFormProps {
  date: Date;
  categories: Category[];
  onSave: () => void;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ date, categories, onSave, onClose }) => {
  const { t, lang } = useTranslation();
  const roomId = getRoomId()!;
  const myRole = getMyRole()!;

  const [title, setTitle] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState(format(date, "yyyy-MM-dd'T'09:00"));
  const [endTime, setEndTime] = useState(format(date, "yyyy-MM-dd'T'10:00"));
  const [personTag, setPersonTag] = useState<'user1' | 'user2' | 'both'>('both');
  const [categoryId, setCategoryId] = useState<string>('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);

  const getCategoryName = (cat: Category) => {
    if (lang === 'ko') return cat.name_ko;
    if (lang === 'de') return cat.name_de;
    return cat.name_en;
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);

    const startDate = allDay ? new Date(format(date, 'yyyy-MM-dd') + 'T00:00:00') : new Date(startTime);
    const endDate = allDay ? new Date(format(date, 'yyyy-MM-dd') + 'T23:59:59') : new Date(endTime);

    await supabase.from('events').insert({
      room_id: roomId,
      created_by: myRole,
      title: title.trim(),
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      all_day: allDay,
      person_tag: personTag,
      category_id: categoryId || null,
      location: location || null,
      is_new_for_user1: myRole === 'user2',
      is_new_for_user2: myRole === 'user1',
    });

    setSaving(false);
    onSave();
  };

  const inputStyle: React.CSSProperties = {
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '16px',
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-2)' }}>{t('event.title')}</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder={t('event.title_placeholder')}
          className="w-full h-12 rounded-lg px-4"
          style={inputStyle}
          autoFocus
        />
      </div>

      {/* All day toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: 'var(--text)' }}>{t('event.all_day')}</span>
        <button
          onClick={() => setAllDay(!allDay)}
          className="w-12 h-7 rounded-full relative transition-colors"
          style={{ background: allDay ? 'var(--accent)' : 'var(--border)' }}
        >
          <div
            className="w-5 h-5 rounded-full bg-white absolute top-1 transition-all"
            style={{ left: allDay ? '26px' : '4px' }}
          />
        </button>
      </div>

      {/* Time inputs */}
      {!allDay && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-2)' }}>{t('event.start')}</label>
            <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)}
              className="w-full h-12 rounded-lg px-3" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-2)' }}>{t('event.end')}</label>
            <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)}
              className="w-full h-12 rounded-lg px-3" style={inputStyle} />
          </div>
        </div>
      )}

      {/* Person tag */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-2)' }}>{t('event.who')}</label>
        <div className="flex gap-2">
          {(['user1', 'user2', 'both'] as const).map(tag => (
            <button
              key={tag}
              onClick={() => setPersonTag(tag)}
              className="flex-1 h-10 rounded-full text-sm font-medium transition-all"
              style={{
                background: personTag === tag
                  ? tag === 'user1' ? 'var(--me)' : tag === 'user2' ? 'var(--partner)' : 'var(--together)'
                  : 'var(--surface)',
                color: personTag === tag ? 'white' : 'var(--text-2)',
                border: `1px solid ${personTag === tag ? 'transparent' : 'var(--border)'}`,
              }}
            >
              {tag === 'user1' ? t('event.me') : tag === 'user2' ? t('event.partner') : t('event.both')}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-2)' }}>{t('event.category')}</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryId(categoryId === cat.id ? '' : cat.id)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: categoryId === cat.id ? cat.color : 'var(--surface)',
                color: categoryId === cat.id ? 'white' : 'var(--text-2)',
                border: `1px solid ${categoryId === cat.id ? cat.color : 'var(--border)'}`,
              }}
            >
              {getCategoryName(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-2)' }}>{t('event.location')}</label>
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full h-12 rounded-lg px-4"
          style={inputStyle}
        />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={!title.trim() || saving}
        className="w-full h-12 rounded-full text-white font-medium mt-2 disabled:opacity-50"
        style={{ background: 'var(--accent)' }}
      >
        {saving ? t('common.loading') : t('event.save')}
      </button>
    </div>
  );
};

export default EventForm;
