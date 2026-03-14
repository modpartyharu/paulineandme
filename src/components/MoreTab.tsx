import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { getRoomId, getMyRole } from '@/lib/room';
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/lib/types';
import type { Lang } from '@/i18n/translations';
import AvatarCircle from './AvatarCircle';
import { User, Palette, Globe, FileText, ListChecks, Key, ChevronRight } from 'lucide-react';
import BottomSheet from './BottomSheet';

const THEMES = [
  { id: 'blush', label: 'Blush Pink', color: '#E8A598' },
  { id: 'vintage', label: 'Vintage', color: '#C4A45C' },
  { id: 'dark', label: 'Dark', color: '#2D2D2D' },
  { id: 'forest', label: 'Forest', color: '#7A9478' },
  { id: 'sky', label: 'Sky', color: '#6B8FC4' },
  { id: 'mono', label: 'Mono', color: '#808080' },
  { id: 'cute', label: 'Cute', color: '#E8728C' },
];

const MoreTab: React.FC = () => {
  const { t, lang, setLang } = useTranslation();
  const roomId = getRoomId();
  const myRole = getMyRole();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<Profile | null>(null);
  const [pairingCode, setPairingCode] = useState('');
  const [showTheme, setShowTheme] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showHolidays, setShowHolidays] = useState(false);
  const [krHolidays, setKrHolidays] = useState(() => localStorage.getItem('show_kr_holidays') === 'true');
  const [deHolidays, setDeHolidays] = useState(() => localStorage.getItem('show_de_holidays') === 'true');

  useEffect(() => {
    if (!roomId) return;
    loadProfile();
  }, [roomId]);

  const loadProfile = async () => {
    if (!roomId) return;
    const [profRes, roomRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('room_id', roomId),
      supabase.from('rooms').select('pairing_code').eq('id', roomId).single(),
    ]);
    const profs = (profRes.data as any[]) || [];
    setProfile(profs.find((p: Profile) => p.role === myRole) || null);
    setPartnerProfile(profs.find((p: Profile) => p.role !== myRole) || null);
    setPairingCode(roomRes.data?.pairing_code || '');
  };

  const handleThemeChange = async (themeId: string) => {
    localStorage.setItem('app_theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    if (roomId) {
      await supabase.from('rooms').update({ theme: themeId }).eq('id', roomId);
    }
    setShowTheme(false);
  };

  const handleHolidayToggle = (key: string, value: boolean) => {
    localStorage.setItem(key, String(value));
    if (key === 'show_kr_holidays') setKrHolidays(value);
    if (key === 'show_de_holidays') setDeHolidays(value);
  };

  const menuItems = [
    { icon: User, label: t('more.profile'), onClick: () => {} },
    { icon: Palette, label: t('more.theme'), onClick: () => setShowTheme(true) },
    { icon: Globe, label: t('more.language'), onClick: () => setShowLanguage(true) },
    { icon: FileText, label: t('more.notes'), onClick: () => {} },
    { icon: ListChecks, label: t('more.holidays'), onClick: () => setShowHolidays(true) },
    { icon: Key, label: t('more.pairing_code'), onClick: () => setShowCode(true) },
  ];

  return (
    <div className="pb-20 pt-4 px-5">
      {/* Profile header */}
      {profile && (
        <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl" style={{ background: 'var(--surface)' }}>
          <AvatarCircle profile={profile} size={48} />
          <div className="flex-1">
            <p className="text-base font-medium" style={{ color: 'var(--text)' }}>{profile.name}</p>
            {partnerProfile && (
              <p className="text-xs" style={{ color: 'var(--text-3)' }}>& {partnerProfile.name}</p>
            )}
          </div>
          {partnerProfile && <AvatarCircle profile={partnerProfile} size={36} />}
        </div>
      )}

      {/* Menu */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)' }}>
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={item.onClick}
            className="w-full flex items-center gap-4 px-4 py-3.5 text-left"
            style={{ borderBottom: i < menuItems.length - 1 ? '0.5px solid var(--border)' : 'none' }}
          >
            <item.icon size={18} strokeWidth={1.5} style={{ color: 'var(--text-2)' }} />
            <span className="flex-1 text-sm" style={{ color: 'var(--text)' }}>{item.label}</span>
            <ChevronRight size={16} style={{ color: 'var(--text-3)' }} />
          </button>
        ))}
      </div>

      {/* Theme sheet */}
      {showTheme && (
        <BottomSheet onClose={() => setShowTheme(false)} title={t('more.theme')}>
          <div className="grid grid-cols-4 gap-3">
            {THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl"
                style={{ background: 'var(--bg)' }}
              >
                <div className="w-10 h-10 rounded-full" style={{ background: theme.color }} />
                <span className="text-[10px]" style={{ color: 'var(--text-2)' }}>{theme.label}</span>
              </button>
            ))}
          </div>
        </BottomSheet>
      )}

      {/* Language sheet */}
      {showLanguage && (
        <BottomSheet onClose={() => setShowLanguage(false)} title={t('more.language')}>
          <div className="flex flex-col gap-2">
            {([{ code: 'en' as Lang, label: 'English' }, { code: 'ko' as Lang, label: '한국어' }, { code: 'de' as Lang, label: 'Deutsch' }]).map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setShowLanguage(false); }}
                className="w-full py-3 px-4 rounded-xl text-left text-sm font-medium"
                style={{
                  background: lang === l.code ? 'var(--accent-light)' : 'var(--bg)',
                  color: lang === l.code ? 'var(--accent)' : 'var(--text)',
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </BottomSheet>
      )}

      {/* Pairing code sheet */}
      {showCode && (
        <BottomSheet onClose={() => setShowCode(false)} title={t('more.pairing_code')}>
          <div className="text-center py-4">
            <p className="text-3xl font-mono font-semibold tracking-[0.3em] mb-4" style={{ color: 'var(--text)' }}>
              {pairingCode.slice(0, 3)} {pairingCode.slice(3)}
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(pairingCode)}
              className="px-4 py-2 rounded-full text-sm"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              {t('pairing.copy')}
            </button>
          </div>
        </BottomSheet>
      )}

      {/* Holidays sheet */}
      {showHolidays && (
        <BottomSheet onClose={() => setShowHolidays(false)} title={t('more.holidays')}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm" style={{ color: 'var(--text)' }}>{t('more.kr_holidays')}</span>
              <button onClick={() => handleHolidayToggle('show_kr_holidays', !krHolidays)}
                className="w-12 h-7 rounded-full relative" style={{ background: krHolidays ? 'var(--accent)' : 'var(--border)' }}>
                <div className="w-5 h-5 rounded-full bg-white absolute top-1 transition-all" style={{ left: krHolidays ? '26px' : '4px' }} />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm" style={{ color: 'var(--text)' }}>{t('more.de_holidays')}</span>
              <button onClick={() => handleHolidayToggle('show_de_holidays', !deHolidays)}
                className="w-12 h-7 rounded-full relative" style={{ background: deHolidays ? 'var(--accent)' : 'var(--border)' }}>
                <div className="w-5 h-5 rounded-full bg-white absolute top-1 transition-all" style={{ left: deHolidays ? '26px' : '4px' }} />
              </button>
            </div>
          </div>
        </BottomSheet>
      )}
    </div>
  );
};

export default MoreTab;
