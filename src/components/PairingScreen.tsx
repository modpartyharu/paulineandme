import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n/LanguageContext';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check } from 'lucide-react';

interface PairingScreenProps {
  pairingCode: string;
  onContinue: () => void;
}

const PairingScreen: React.FC<PairingScreenProps> = ({ pairingCode, onContinue }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const formattedCode = `${pairingCode.slice(0, 3)} ${pairingCode.slice(3)}`;
  const appUrl = `${window.location.origin}?code=${pairingCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pairingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center px-8"
      style={{ background: 'var(--bg)' }}
    >
      <h2 className="text-xl font-medium mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
        {t('pairing.title')}
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text-3)' }}>
        {t('pairing.subtitle')}
      </p>

      {/* Code display */}
      <div
        className="px-8 py-4 rounded-2xl mb-6"
        style={{ background: 'var(--surface)', boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }}
      >
        <span className="text-4xl font-mono font-semibold tracking-[0.3em]" style={{ color: 'var(--text)' }}>
          {formattedCode}
        </span>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 transition-all"
        style={{
          background: copied ? 'var(--success-light)' : 'var(--accent-light)',
          color: copied ? 'var(--success)' : 'var(--accent)',
        }}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? t('pairing.copied') : t('pairing.copy')}
      </button>

      {/* QR Code */}
      <div className="p-4 rounded-2xl mb-8" style={{ background: 'white' }}>
        <QRCodeSVG value={appUrl} size={160} />
      </div>

      {/* Continue */}
      <button
        onClick={() => {
          localStorage.setItem('setup_complete', 'true');
          onContinue();
        }}
        className="w-full max-w-xs h-[52px] rounded-full text-white font-medium text-base"
        style={{ background: 'var(--accent)' }}
      >
        {t('pairing.continue')}
      </button>
    </motion.div>
  );
};

export default PairingScreen;
