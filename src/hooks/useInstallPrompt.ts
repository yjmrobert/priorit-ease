import { useCallback, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export interface UseInstallPrompt {
  canInstall: boolean;
  isStandalone: boolean;
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
  return (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function useInstallPrompt(): UseInstallPrompt {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(detectStandalone);

  useEffect(() => {
    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
    }
    function onInstalled() {
      setEvt(null);
      setIsStandalone(true);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    const mq = window.matchMedia?.('(display-mode: standalone)');
    const onChange = () => setIsStandalone(detectStandalone());
    mq?.addEventListener?.('change', onChange);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      mq?.removeEventListener?.('change', onChange);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!evt) return 'unavailable' as const;
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    setEvt(null);
    return outcome;
  }, [evt]);

  return {
    canInstall: evt !== null && !isStandalone,
    isStandalone,
    promptInstall,
  };
}
