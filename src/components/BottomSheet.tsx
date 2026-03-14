import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ onClose, title, children }) => {
  const [maxHeight, setMaxHeight] = useState('94vh');

  useEffect(() => {
    // Lock body scroll
    const origStyle = document.body.style.cssText;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    // Visual viewport listener for keyboard
    const vv = window.visualViewport;
    const handleResize = () => {
      if (vv) {
        setMaxHeight(`${vv.height * 0.94}px`);
      }
    };

    vv?.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      document.body.style.cssText = origStyle;
      vv?.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999]"
        style={{ background: 'rgba(0,0,0,0.3)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="fixed bottom-0 left-0 right-0 rounded-t-2xl"
          style={{
            background: 'var(--surface)',
            maxHeight,
            zIndex: 9999,
          }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-2)' }} />
          </div>

          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-5 pb-3">
              <h3 className="text-base font-medium" style={{ color: 'var(--text)' }}>{title}</h3>
              <button onClick={onClose} className="p-1" style={{ color: 'var(--text-3)' }}>
                <X size={20} />
              </button>
            </div>
          )}

          {/* Content */}
          <div
            className="overflow-y-auto px-5 pb-8"
            style={{
              maxHeight: `calc(${maxHeight} - 80px)`,
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BottomSheet;
