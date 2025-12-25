"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { usePerfFlags } from "@/lib/perfFlags";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

function FallbackOrb() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-[22rem] h-[22rem] md:w-[32rem] md:h-[32rem]">
        <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl mix-blend-screen" />
        <div className="absolute inset-10 rounded-full bg-white/5 blur-xl mix-blend-screen" />
      </div>
    </div>
  );
}

export default function LostOrb() {
  const { lowEnd, underLoad, saveData, reducedMotion, failsafe } = usePerfFlags();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [mountWebgl, setMountWebgl] = useState(false);

  // Once failsafe trips, never mount WebGL again for this session.
  const webglSessionAllowedRef = useRef(true);
  useEffect(() => {
    if (failsafe) webglSessionAllowedRef.current = false;
  }, [failsafe]);

  // Never attempt WebGL on low-end/mobile data saver modes.
  const allowWebgl =
    webglSessionAllowedRef.current &&
    !(lowEnd || underLoad || saveData || reducedMotion || failsafe);
  const allowFilters = allowWebgl;

  useEffect(() => {
    if (!allowWebgl || !inView) {
      setMountWebgl(false);
      return;
    }

    let cancelled = false;
    let idleId: number | null = null;
    let timerId: number | null = null;

    const mount = () => {
      if (cancelled) return;
      setMountWebgl(true);
    };

    // Let the page become interactive first; then mount WebGL.
    // This improves perceived load time and avoids chunk-load timeouts on slower disks.
    const ric = (window as any).requestIdleCallback as ((cb: () => void, opts?: any) => number) | undefined;
    const cic = (window as any).cancelIdleCallback as ((id: number) => void) | undefined;

    if (typeof ric === "function") {
      idleId = ric(mount, { timeout: 1500 });
    } else {
      timerId = window.setTimeout(mount, 650);
    }

    return () => {
      cancelled = true;
      if (idleId !== null && typeof cic === "function") cic(idleId);
      if (timerId !== null) window.clearTimeout(timerId);
    };
  }, [allowWebgl, inView]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setInView(entries.some((e) => e.isIntersecting));
      },
      { root: null, threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      className="lost-orb w-full h-full opacity-70 pointer-events-none"
      style={{
        filter: allowFilters ? "saturate(1.2) brightness(1.05)" : "none",
        mixBlendMode: allowFilters ? "screen" : "normal",
      }}
    >
      {allowWebgl && inView && mountWebgl ? (
        <Spline scene="https://prod.spline.design/kVbOOfwISRC36KJd/scene.splinecode" />
      ) : (
        <FallbackOrb />
      )}
    </div>
  );
}
