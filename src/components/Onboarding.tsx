import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n/LanguageContext';
import { saveProfile, uploadAvatar, getRoomId, getMyRole } from '@/lib/room';
import { Globe, Camera } from 'lucide-react';
import type { Lang } from '@/i18n/translations';

const PROFILE_COLORS = ['#E8A598', '#A8C4B8', '#C8B4D4', '#6B8FC4', '#E8945C', '#5CB4B4'];

interface OnboardingProps {
  onComplete: () => void;
  onShowPairing?: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onShowPairing }) => {
  const { t, lang, setLang } = useTranslation();
  const [step, setStep] = useState<'profile' | 'anniversary'>('profile');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other');
  const [birthDate, setBirthDate] = useState('');
  const [profileColor, setProfileColor] = useState(PROFILE_COLORS[0]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [anniversary, setAnniversary] = useState('');
  const [saving, setSaving] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const role = getMyRole();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const roomId = getRoomId()!;
    let avatarUrl: string | undefined;

    if (avatarFile) {
      try {
        avatarUrl = await uploadAvatar(roomId, role!, avatarFile);
      } catch (e) {
        console.error('Avatar upload failed:', e);
      }
    }

    try {
      await saveProfile(roomId, role!, {
        name: name.trim(),
        gender,
        birth_date: birthDate || undefined,
        profile_color: profileColor,
        avatar_url: avatarUrl,
      });

      if (role === 'user1') {
        if (anniversary) {
          const { supabase } = await import('@/integrations/supabase/client');
          await supabase.from('rooms').update({ anniversary_date: anniversary }).eq('id', roomId);
        }
        // Show pairing code screen
        setSaving(false);
        if (onShowPairing) onShowPairing();
        return;
      }

      // user2: complete immediately
      localStorage.setItem('setup_complete', 'true');
      setSaving(false);
      onComplete();
    } catch (e) {
      console.error('Failed to save profile:', e);
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (step === 'profile' && role === 'user1') {
      setStep('anniversary');
    } else {
      handleSaveProfile();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9998] flex flex-col"
      style={{ background: 'var(--bg)' }}
    >
      {/* Language toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button onClick={() => setShowLangMenu(!showLangMenu)} className="p-2 rounded-full" style={{ color: 'var(--text-2)' }}>
          <Globe size={20} />
        </button>
        {showLangMenu && (
          <div className="absolute right-0 top-10 rounded-lg shadow-lg p-2" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {(['en', 'ko', 'de'] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => { setLang(l); setShowLangMenu(false); }}
                className="block w-full text-left px-4 py-2 text-sm rounded"
                style={{ color: lang === l ? 'var(--accent)' : 'var(--text-2)', fontWeight: lang === l ? 500 : 400 }}
              >
                {l === 'en' ? 'English' : l === 'ko' ? '한국어' : 'Deutsch'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-16 pb-32">
        {step === 'profile' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-sm mx-auto">
            <h2 className="text-xl font-medium mb-8" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              {t('onboarding.profile_title')}
            </h2>

            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <button
                onClick={() => fileRef.current?.click()}
                className="relative w-20 h-20 rounded-full overflow-hidden flex items-center justify-center"
                style={{ background: avatarPreview ? 'transparent' : profileColor }}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={24} style={{ color: 'white' }} />
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            <p className="text-center text-xs mb-6" style={{ color: 'var(--text-3)' }}>
              {avatarPreview ? t('profile.photo.change') : t('profile.photo.add')}
            </p>

            {/* Name */}
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-2)' }}>{t('onboarding.name')}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('onboarding.name_placeholder')}
              className="w-full h-12 rounded-lg px-4 mb-4"
              style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '16px' }}
            />

            {/* Gender */}
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-2)' }}>{t('onboarding.gender')}</label>
            <div className="flex gap-2 mb-4">
              {(['male', 'female', 'other'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className="flex-1 h-10 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: gender === g ? 'var(--accent)' : 'var(--surface)',
                    color: gender === g ? 'white' : 'var(--text-2)',
                    border: `1px solid ${gender === g ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  {t(`onboarding.${g}`)}
                </button>
              ))}
            </div>

            {/* Birth date */}
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-2)' }}>{t('onboarding.birthday')}</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full h-12 rounded-lg px-4 mb-4"
              style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '16px' }}
            />

            {/* Profile color */}
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-2)' }}>{t('onboarding.color')}</label>
            <div className="flex gap-3 mb-6">
              {PROFILE_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setProfileColor(c)}
                  className="w-10 h-10 rounded-full transition-transform"
                  style={{
                    background: c,
                    transform: profileColor === c ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: profileColor === c ? `0 0 0 3px var(--bg), 0 0 0 5px ${c}` : 'none',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === 'anniversary' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-sm mx-auto">
            <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              {t('onboarding.anniversary')}
            </h2>
            <input
              type="date"
              value={anniversary}
              onChange={e => setAnniversary(e.target.value)}
              className="w-full h-12 rounded-lg px-4 mb-4"
              style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '16px' }}
            />
            <button
              onClick={() => setAnniversary('')}
              className="text-sm"
              style={{ color: 'var(--text-3)' }}
            >
              {t('onboarding.anniversary_skip')}
            </button>
          </motion.div>
        )}
      </div>

      {/* Bottom button */}
      <div className="fixed bottom-0 left-0 right-0 p-6" style={{ background: 'var(--bg)' }}>
        <button
          onClick={step === 'anniversary' ? handleSaveProfile : handleNext}
          disabled={!name.trim() || saving}
          className="w-full h-[52px] rounded-full text-white font-medium text-base transition-all disabled:opacity-50"
          style={{ background: 'var(--accent)' }}
        >
          {saving ? t('common.loading') : step === 'anniversary' ? t('onboarding.done') : t('onboarding.next')}
        </button>
      </div>
    </motion.div>
  );
};

export default Onboarding;
