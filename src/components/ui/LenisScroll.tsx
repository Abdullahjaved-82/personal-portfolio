'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { usePerfFlags } from '@/lib/perfFlags';
import { useRafTask } from '@/lib/useRafTask';

const LenisScroll: React.FC = () => {
  const { lowEnd, reducedMotion, saveData, failsafe } = usePerfFlags();
  const lenisRef = useRef<Lenis | null>(null);

  // Keep scroll smooth on high-end: don't toggle Lenis off due to transient underLoad.
  // Still respect low-end, reduced motion, data-saver, and the FPS failsafe.
  const enabled = !(lowEnd || reducedMotion || saveData || failsafe);

  useEffect(() => {
    if (!enabled) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    lenisRef.current = new Lenis({
      duration: 0.5,
      easing: (t) => t ** 0.5,
    });
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [enabled]);

  // Drive Lenis from the shared RAF hub.
  useRafTask({
    id: 'scroll:lenis',
    maxFps: 60,
    enabled: () => enabled,
    cb: (time: number) => {
      lenisRef.current?.raf(time);
    },
  });

  return null;
};

export default LenisScroll;
