import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { Home, CalendarDays, Heart, MessageCircle, MoreHorizontal } from 'lucide-react';

export type TabName = 'home' | 'calendar' | 'dates' | 'chat' | 'more';

interface BottomNavProps {
  active: TabName;
  onChange: (tab: TabName) => void;
}

const tabs: { key: TabName; icon: React.ElementType; labelKey: string }[] = [
  { key: 'home', icon: Home, labelKey: 'nav.home' },
  { key: 'calendar', icon: CalendarDays, labelKey: 'nav.calendar' },
  { key: 'dates', icon: Heart, labelKey: 'nav.dates' },
  { key: 'chat', icon: MessageCircle, labelKey: 'nav.chat' },
  { key: 'more', icon: MoreHorizontal, labelKey: 'nav.more' },
];

const BottomNav: React.FC<BottomNavProps> = ({ active, onChange }) => {
  const { t } = useTranslation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 safe-area-bottom"
      style={{
        background: 'var(--surface)',
        borderTop: '0.5px solid var(--border)',
      }}
    >
      {tabs.map(({ key, icon: Icon, labelKey }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="flex flex-col items-center gap-0.5 py-1 px-3 transition-colors"
          >
            <Icon
              size={22}
              strokeWidth={1.5}
              style={{ color: isActive ? 'var(--accent)' : 'var(--text-3)' }}
            />
            <span
              className="text-[10px]"
              style={{ color: isActive ? 'var(--accent)' : 'var(--text-3)' }}
            >
              {t(labelKey)}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
