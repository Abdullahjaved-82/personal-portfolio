"use client";

import { useEffect } from "react";
import { usePerfFlags } from "@/lib/perfFlags";
import { setRafHubTimeScale } from "@/lib/rafHub";

/**
 * Central place to control global animation speed.
 * Keeps the rest of the app purely task-based.
 */
export default function RafHubController() {
  const { lowEnd, underLoad, reducedMotion, saveData, failsafe } = usePerfFlags();

  // Only treat device/network/failsafe as "low" for global styling.
  // underLoad is transient and can cause visible toggling/jank if it flips global gates.
  const perfLow = lowEnd || saveData || failsafe;

  useEffect(() => {
    // Publish perf tier to CSS so we can disable expensive effects globally.
    const root = document.documentElement;
    root.dataset.perf = perfLow ? "low" : "high";
    root.dataset.motion = reducedMotion ? "reduced" : "full";
    root.dataset.failsafe = failsafe ? "1" : "0";
    root.dataset.underload = underLoad ? "1" : "0";

    // Pause dt-based animations completely if the user wants reduced motion
    // or if data saver mode is on.
    if (reducedMotion || saveData) {
      setRafHubTimeScale(0);
      return;
    }

    // Slow down only on low-end / failsafe. Avoid global slowdowns on high-end.
    if (lowEnd) {
      setRafHubTimeScale(0.75);
      return;
    }

    if (failsafe) {
      setRafHubTimeScale(0.6);
      return;
    }

    setRafHubTimeScale(1);
  }, [lowEnd, underLoad, reducedMotion, saveData, failsafe, perfLow]);

  return null;
}
