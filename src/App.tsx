import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { isSetupComplete, getRoomId } from '@/lib/room';
import SplashScreen from '@/components/SplashScreen';
import Onboarding from '@/components/Onboarding';
import PairingScreen from '@/components/PairingScreen';
import BottomNav, { type TabName } from '@/components/BottomNav';
import HomeTab from '@/components/HomeTab';
import CalendarTab from '@/components/CalendarTab';
import DatesTab from '@/components/DatesTab';
import ChatTab from '@/components/ChatTab';
import MoreTab from '@/components/MoreTab';

type AppScreen = 'splash' | 'onboarding' | 'pairing' | 'app';

const AppContent: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(() => {
    if (isSetupComplete() && getRoomId()) return 'app';
    return 'splash';
  });
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [pairingCode, setPairingCode] = useState('');

  // Apply saved theme
  useEffect(() => {
    const theme = localStorage.getItem('app_theme') || 'blush';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const handleGetStarted = async () => {
    const { createRoom } = await import('@/lib/room');
    const { pairingCode } = await createRoom();
    setPairingCode(pairingCode);
    setScreen('onboarding');
  };

  const handleCodeJoined = () => {
    setScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    setScreen('app');
  };

  const handleShowPairing = () => {
    setScreen('pairing');
  };

  const handlePairingContinue = () => {
    setScreen('app');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AnimatePresence mode="wait">
        {screen === 'splash' && (
          <SplashScreen
            key="splash"
            onGetStarted={handleGetStarted}
            onCodeJoined={handleCodeJoined}
          />
        )}
        {screen === 'onboarding' && (
          <Onboarding
            key="onboarding"
            onComplete={handleOnboardingComplete}
            onShowPairing={handleShowPairing}
          />
        )}
        {screen === 'pairing' && (
          <PairingScreen
            key="pairing"
            pairingCode={pairingCode}
            onContinue={handlePairingContinue}
          />
        )}
      </AnimatePresence>

      {screen === 'app' && (
        <>
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'calendar' && <CalendarTab />}
          {activeTab === 'dates' && <DatesTab />}
          {activeTab === 'chat' && <ChatTab />}
          {activeTab === 'more' && <MoreTab />}
          <BottomNav active={activeTab} onChange={setActiveTab} />
        </>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
