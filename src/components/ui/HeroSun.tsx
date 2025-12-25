"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { usePerfFlags } from "@/lib/perfFlags";
import { useInView } from "@/lib/useInView";
import { useRafTask } from "@/lib/useRafTask";

type HeroSunProps = {
  className?: string;
};

export default function HeroSun({ className }: HeroSunProps) {
  const { lowEnd, underLoad, reducedMotion, saveData } = usePerfFlags();

  const isLowEnd = useMemo(
    () => lowEnd || underLoad || saveData,
    [lowEnd, underLoad, saveData]
  );

  const layerARef = useRef<HTMLDivElement | null>(null);
  const layerBRef = useRef<HTMLDivElement | null>(null);
  const layerCRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef(0);

  const inView = useInView(hostRef, { threshold: 0.1 });

  const targetFps = isLowEnd ? 30 : 60;

  useRafTask({
    id: "hero:sun",
    maxFps: targetFps,
    enabled: () => !reducedMotion && inView,
    cb: (_now, dt) => {
      // dt is globally time-scaled by rafHub.
      phaseRef.current += (dt || 0) * 0.001;
      const time = phaseRef.current;

      // Keep motion subtle and slow to stay around 30fps on low-end.
      const basePulse =
        1 +
        Math.sin(time * (isLowEnd ? 0.6 : 0.9)) * (isLowEnd ? 0.03 : 0.06);

      const a = layerARef.current;
      if (a) {
        const scale = basePulse;
        const opacity = isLowEnd ? 0.32 : 0.38;
        a.style.transform = `translate3d(-50%, -50%, 0) scale(${scale})`;
        a.style.opacity = String(opacity);
      }

      if (!isLowEnd) {
        const b = layerBRef.current;
        if (b) {
          const scale = 1 + Math.sin(time * 0.55 + 1.7) * 0.05;
          const opacity = 0.22 + Math.sin(time * 0.7 + 0.4) * 0.04;
          b.style.transform = `translate3d(-50%, -50%, 0) scale(${scale})`;
          b.style.opacity = String(opacity);
        }

        const c = layerCRef.current;
        if (c) {
          const scale = 1 + Math.sin(time * 0.4 + 2.2) * 0.04;
          const opacity = 0.14 + Math.sin(time * 0.5 + 1.1) * 0.03;
          c.style.transform = `translate3d(-50%, -50%, 0) scale(${scale})`;
          c.style.opacity = String(opacity);
        }
      }
    },
  });

  useEffect(() => {
    // Ensure the expensive layers don't mount on low-end.
    // (Render already gates them, this is just defensive.)
  }, [isLowEnd]);

  // Two versions:
  // - Desktop/high-end: 3 layered gradient discs.
  // - Low-end: 1 disc, slower/throttled updates.
  // Animation updates only transform + opacity.
  return (
    <div
      aria-hidden
      ref={hostRef}
      className={
        "pointer-events-none absolute inset-0 z-[1] " +
        (className ? className : "")
      }
    >
      <div
        ref={layerARef}
        className={
          "absolute left-1/2 top-[28%] md:top-[26%] rounded-full " +
          (isLowEnd ? "" : "will-change-transform will-change-opacity ") +
          (isLowEnd
            ? "h-[22rem] w-[22rem] md:h-[28rem] md:w-[28rem]"
            : "h-[28rem] w-[28rem] md:h-[40rem] md:w-[40rem]")
        }
        style={{
          transform: "translate3d(-50%, -50%, 0)",
          // Low-end: keep it subtle (normal blend). High-end: stronger focal glow.
          opacity: reducedMotion ? 0.34 : isLowEnd ? 0.42 : 0.5,
          mixBlendMode: isLowEnd ? "normal" : "screen",
        }}
      >
        <div
          className={
            "absolute inset-0 rounded-full " +
            (isLowEnd
              ? "bg-[radial-gradient(circle_at_center,rgba(255,237,213,0.22)_0%,rgba(251,146,60,0.18)_45%,rgba(234,88,12,0.10)_70%,rgba(0,0,0,0)_100%)]"
              : "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22)_0%,rgba(254,215,170,0.18)_28%,rgba(251,146,60,0.16)_50%,rgba(234,88,12,0.10)_72%,rgba(0,0,0,0)_100%)]")
          }
        />
      </div>

      {!isLowEnd && (
        <>
          <div
            ref={layerBRef}
            className="absolute left-1/2 top-[28%] md:top-[26%] h-[34rem] w-[34rem] md:h-[46rem] md:w-[46rem] rounded-full"
            style={{
              transform: "translate3d(-50%, -50%, 0)",
              opacity: 0.22,
              mixBlendMode: "screen",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10)_0%,rgba(253,186,116,0.12)_35%,rgba(249,115,22,0.10)_60%,rgba(0,0,0,0)_100%)]" />
          </div>
          <div
            ref={layerCRef}
            className="absolute left-1/2 top-[28%] md:top-[26%] h-[44rem] w-[44rem] md:h-[56rem] md:w-[56rem] rounded-full"
            style={{
              transform: "translate3d(-50%, -50%, 0)",
              opacity: 0.14,
              mixBlendMode: "screen",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.05)_45%,rgba(0,0,0,0)_100%)]" />
          </div>
        </>
      )}

      {reducedMotion && (
        <div className="sr-only">Reduced motion enabled</div>
      )}
    </div>
  );
}
