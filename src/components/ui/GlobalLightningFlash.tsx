import { useEffect, useState } from 'react';
import { audioSynth } from '../../hooks/useAudio';

export function GlobalLightningFlash() {
  const [flashOpacity, setFlashOpacity] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    let timeout1: any = null;
    let timeout2: any = null;
    let timeout3: any = null;

    const unsubscribe = audioSynth.addThunderListener(({ flashIntensity, type }) => {
      // Clear any pending animation timers
      if (timeout1) clearTimeout(timeout1);
      if (timeout2) clearTimeout(timeout2);
      if (timeout3) clearTimeout(timeout3);

      setIsVisible(true);

      if (type === 'strike') {
        // Sharp double-strike flicker effect for lightning strikes
        setFlashOpacity(flashIntensity);
        timeout1 = setTimeout(() => {
          setFlashOpacity(0.15);
          timeout2 = setTimeout(() => {
            setFlashOpacity(flashIntensity * 0.8);
            timeout3 = setTimeout(() => {
              setFlashOpacity(0);
              setTimeout(() => setIsVisible(false), 200);
            }, 120);
          }, 50);
        }, 90);
      } else {
        // Single smooth flash and rapid fade-out
        setFlashOpacity(flashIntensity);
        const fadeOutTime = type === 'close' ? 220 : 180;
        timeout1 = setTimeout(() => {
          setFlashOpacity(0);
          timeout2 = setTimeout(() => setIsVisible(false), fadeOutTime + 60);
        }, fadeOutTime);
      }
    });

    return () => {
      unsubscribe();
      if (timeout1) clearTimeout(timeout1);
      if (timeout2) clearTimeout(timeout2);
      if (timeout3) clearTimeout(timeout3);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] bg-white transition-opacity duration-150 ease-out"
      style={{ opacity: flashOpacity }}
      aria-hidden="true"
    />
  );
}
