"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePerfFlags } from "@/lib/perfFlags";

const SparklesCore = dynamic(
  () => import("./Sparkles").then((m) => m.SparklesCore),
  { ssr: false, loading: () => null }
);

export default function SparklesBg() {
  const { lowEnd, underLoad, saveData, reducedMotion, failsafe } = usePerfFlags();
  const perfLow = lowEnd || underLoad || failsafe;
  const allowSparkles = !(perfLow || saveData || reducedMotion || failsafe);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!allowSparkles) {
      setReady(false);
      return;
    }

    let cancelled = false;
    let idleId = null;
    let timerId = null;

    const mount = () => {
      if (cancelled) return;
      setReady(true);
    };

    // Defer loading heavy tsParticles until after first paint / idle.
    const ric = window.requestIdleCallback as
      | ((cb: IdleRequestCallback, options?: IdleRequestOptions) => number)
      | undefined;
    const cic = window.cancelIdleCallback as ((handle: number) => void) | undefined;

    if (typeof ric === "function") {
      idleId = ric(() => mount(), { timeout: 2000 });
    } else {
      timerId = window.setTimeout(mount, 900);
    }

    return () => {
      cancelled = true;
      if (idleId !== null && typeof cic === "function") cic(idleId);
      if (timerId !== null) window.clearTimeout(timerId);
    };
  }, [allowSparkles]);

  return (
    <div className="h-[40rem] absolute top-0 opacity-50 w-full bg-transparent flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="w-full absolute inset-0 h-full">
        {ready && (
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={perfLow ? 0.5 : 0.6}
            maxSize={perfLow ? 1.0 : 1.4}
            particleDensity={perfLow ? 35 : 100}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        )}
      </div>      
    </div>
  );
}
