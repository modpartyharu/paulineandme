import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { getRoomId, getMyRole } from '@/lib/room';
import { supabase } from '@/integrations/supabase/client';
import type { CalendarEvent, Category } from '@/lib/types';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, parseISO, isSameDay, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import BottomSheet from './BottomSheet';
import EventForm from './EventForm';

const CalendarTab: React.FC = () => {
  const { t, lang } = useTranslation();
  const roomId = getRoomId();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);

  const dayKeys = ['day.mon', 'day.tue', 'day.wed', 'day.thu', 'day.fri', 'day.sat', 'day.sun'];

  useEffect(() => {
    if (!roomId) return;
    loadEvents();
    loadCategories();

    const channel = supabase
      .channel('calendar-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events', filter: `room_id=eq.${roomId}` }, () => loadEvents())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId, currentMonth]);

  const loadEvents = async () => {
    if (!roomId) return;
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('room_id', roomId)
      .gte('start_time', start.toISOString())
      .lte('start_time', end.toISOString());
    setEvents((data as any[]) || []);
  };

  const loadCategories = async () => {
    if (!roomId) return;
    const { data } = await supabase.from('categories').select('*').eq('room_id', roomId).order('sort_order');
    setCategories((data as any[]) || []);
  };

  // Build calendar grid (Monday start)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(e => isSameDay(parseISO(e.start_time), date));
  };

  const monthName = t(`month.${currentMonth.getMonth() + 1}`);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowEventForm(true);
  };

  return (
    <div className="pb-20 pt-4 px-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} className="p-2" style={{ color: 'var(--text-2)' }}>
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-medium" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
          {monthName} {currentMonth.getFullYear()}
        </h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2" style={{ color: 'var(--text-2)' }}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {dayKeys.map(key => (
          <div key={key} className="text-center text-xs py-1" style={{ color: 'var(--text-3)' }}>
            {t(key)}
          </div>
        ))}
      </div>

      {/* Calendar grid - NO vertical lines */}
      <div className="flex flex-col">
        {weeks.map((week, wi) => (
          <div
            key={wi}
            className="grid grid-cols-7"
            style={{ borderTop: wi > 0 ? '0.5px solid var(--border)' : 'none' }}
          >
            {week.map((date, di) => {
              const dayEvents = getEventsForDate(date);
              const inMonth = isSameMonth(date, currentMonth);
              const today = isToday(date);

              return (
                <button
                  key={di}
                  onClick={() => handleDateClick(date)}
                  className="flex flex-col items-center py-2 min-h-[52px]"
                >
                  <span
                    className="w-7 h-7 flex items-center justify-center rounded-full text-sm"
                    style={{
                      background: today ? 'var(--accent)' : 'transparent',
                      color: today ? 'white' : inMonth ? 'var(--text)' : 'var(--text-3)',
                      fontWeight: today ? 600 : 400,
                    }}
                  >
                    {date.getDate()}
                  </span>
                  {/* Event dots */}
                  <div className="flex gap-0.5 mt-1">
                    {dayEvents.slice(0, 3).map((e, i) => {
                      const cat = categories.find(c => c.id === e.category_id);
                      return (
                        <div
                          key={i}
                          className="w-[5px] h-[5px] rounded-full"
                          style={{ background: cat?.color || e.color_override || 'var(--accent)' }}
                        />
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <span className="text-[8px]" style={{ color: 'var(--text-3)' }}>+{dayEvents.length - 3}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => { setSelectedDate(new Date()); setShowEventForm(true); }}
        className="fixed bottom-20 right-5 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40"
        style={{ background: 'var(--accent)' }}
      >
        <Plus size={22} color="white" />
      </button>

      {/* Event form bottom sheet */}
      {showEventForm && selectedDate && (
        <BottomSheet onClose={() => setShowEventForm(false)} title={t('calendar.new_event')}>
          <EventForm
            date={selectedDate}
            categories={categories}
            onSave={() => { setShowEventForm(false); loadEvents(); }}
            onClose={() => setShowEventForm(false)}
          />
        </BottomSheet>
      )}
    </div>
  );
};

export default CalendarTab;
