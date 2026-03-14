import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/i18n/LanguageContext';
import { joinRoom } from '@/lib/room';

interface SplashScreenProps {
  onGetStarted: () => void;
  onCodeJoined: (roomId: string) => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted, onCodeJoined }) => {
  const { t } = useTranslation();
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Check URL for ?code= param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('code');
    if (urlCode && urlCode.length === 6) {
      setShowCodeInput(true);
      setCode(urlCode);
    }
  }, []);

  useEffect(() => {
    if (code.length === 6) {
      handleSubmitCode();
    }
  }, [code]);

  const handleSubmitCode = async () => {
    if (code.length !== 6) return;
    setLoading(true);
    setError('');
    const roomId = await joinRoom(code);
    setLoading(false);
    if (roomId) {
      onCodeJoined(roomId);
    } else {
      setError(t('splash.code_not_found'));
    }
  };

  const handleCodeChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6);
    setCode(cleaned);
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: 'var(--bg)' }}
    >
      {/* Top 65%: Image */}
      <div className="relative" style={{ height: '65%' }}>
        {!imgError ? (
          <img
            src="/splash-couple.jpg"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#F0D0C0' }} className="flex items-center justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
              <circle cx="80" cy="80" r="30" fill="#E8A598" />
              <circle cx="120" cy="80" r="30" fill="#A8C4B8" />
              <rect x="60" y="100" width="40" height="60" rx="10" fill="#E8A598" />
              <rect x="100" y="100" width="40" height="60" rx="10" fill="#A8C4B8" />
            </svg>
          </div>
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent 50%, var(--bg) 100%)`,
          }}
        />
      </div>

      {/* Bottom 35%: Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-12" style={{ marginTop: '-40px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', color: 'var(--text)' }} className="mb-2">
          우리의 캘린더
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: '14px' }} className="mb-8">
          {t('splash.tagline')}
        </p>

        <AnimatePresence mode="wait">
          {!showCodeInput ? (
            <motion.div key="buttons" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-xs flex flex-col items-center gap-3">
              <button
                onClick={onGetStarted}
                className="w-full h-[52px] rounded-full text-white font-medium text-base transition-transform active:scale-[0.98]"
                style={{ background: 'var(--accent)' }}
              >
                {t('splash.start')}
              </button>
              <button
                onClick={() => setShowCodeInput(true)}
                className="text-sm"
                style={{ color: 'var(--text-3)' }}
              >
                {t('splash.have_code')}
              </button>
            </motion.div>
          ) : (
            <motion.div key="code" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-xs flex flex-col items-center gap-4">
              <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>
                {t('splash.enter_code')}
              </p>
              <div className="flex gap-2 justify-center">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className="w-12 h-14 rounded-lg flex items-center justify-center text-xl font-mono"
                    style={{
                      border: `1px solid ${code[i] ? 'var(--accent)' : 'var(--border)'}`,
                      color: 'var(--text)',
                      background: 'var(--surface)',
                    }}
                  >
                    {code[i] || ''}
                  </div>
                ))}
              </div>
              <input
                type="tel"
                inputMode="numeric"
                autoFocus
                value={code}
                onChange={e => handleCodeChange(e.target.value)}
                className="absolute opacity-0 w-0 h-0"
                maxLength={6}
                style={{ fontSize: '16px' }}
              />
              {/* Visible input for accessibility */}
              <input
                type="tel"
                inputMode="numeric"
                value={code}
                onChange={e => handleCodeChange(e.target.value)}
                className="w-full h-12 rounded-lg text-center text-lg font-mono"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '16px',
                }}
                maxLength={6}
                placeholder="000000"
              />
              {error && <p style={{ color: 'var(--danger)', fontSize: '13px' }}>{error}</p>}
              {loading && <p style={{ color: 'var(--text-3)', fontSize: '13px' }}>{t('common.loading')}</p>}
              <button
                onClick={() => { setShowCodeInput(false); setCode(''); setError(''); }}
                className="text-sm"
                style={{ color: 'var(--text-3)' }}
              >
                {t('splash.back')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
