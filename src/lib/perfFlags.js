"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRafTask } from "@/lib/useRafTask";

function safeMatchMedia(query) {
  if (typeof window === "undefined" || !window.matchMedia) return null;
  try {
    return window.matchMedia(query);
  } catch {
    return null;
  }
}

function getReducedMotion() {
  return Boolean(safeMatchMedia("(prefers-reduced-motion: reduce)")?.matches);
}

function getConnection() {
  if (typeof navigator === "undefined") return null;
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
}

function getSaveData() {
  return Boolean(getConnection()?.saveData);
}

function getEffectiveType() {
  return getConnection()?.effectiveType || "unknown";
}

function getHardwareConcurrency() {
  if (typeof navigator === "undefined") return undefined;
  return navigator.hardwareConcurrency;
}

function getDeviceMemory() {
  if (typeof navigator === "undefined") return undefined;
  return navigator.deviceMemory;
}

function getDpr() {
  if (typeof window === "undefined") return 1;
  return window.devicePixelRatio || 1;
}

function getViewportMinSide() {
  if (typeof window === "undefined") return 0;
  return Math.min(window.innerWidth || 0, window.innerHeight || 0);
}

function getWebGLRendererInfo() {
  // Best-effort only; may be blocked for privacy.
  if (typeof document === "undefined") return { renderer: "unknown", vendor: "unknown" };
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return { renderer: "unavailable", vendor: "unavailable" };

    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (!ext) return { renderer: "masked", vendor: "masked" };

    const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || "unknown";
    const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "unknown";
    return {
      vendor: String(vendor),
      renderer: String(renderer),
    };
  } catch {
    return { renderer: "unknown", vendor: "unknown" };
  }
}

function isLikelyLowGpu(renderer) {
  if (!renderer || typeof renderer !== "string") return false;
  const r = renderer.toLowerCase();

  // Very conservative: only match older/low-end families.
  // We rely more heavily on memory/cores/runtime underLoad signals.
  const lowGpuHints = [
    "mali-400",
    "mali-450",
    "mali-t720",
    "mali-t760",
    "powervr",
    "adreno (tm) 3",
    "adreno 3",
    "vivante",
  ];

  return lowGpuHints.some((h) => r.includes(h));
}

function getLowEndHeuristic() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;

  const deviceMemory = getDeviceMemory();
  const hardwareConcurrency = getHardwareConcurrency();

  const isAndroid = /android/i.test(navigator.userAgent);
  const minViewportSide = getViewportMinSide();
  const dpr = getDpr();

  const lowMemory = typeof deviceMemory === "number" && deviceMemory > 0 && deviceMemory <= 4;
  const lowCpu = typeof hardwareConcurrency === "number" && hardwareConcurrency > 0 && hardwareConcurrency <= 4;

  // Android + small viewport + high DPR is a common pattern on low-end phones.
  const lowEndAndroidProxy = isAndroid && minViewportSide <= 430 && dpr >= 2;

  // Optional GPU hint (best-effort)
  const { renderer } = getWebGLRendererInfo();
  const lowGpuHint = isLikelyLowGpu(renderer);

  return lowMemory || lowCpu || lowEndAndroidProxy || lowGpuHint;
}

export function capDpr(dpr, lowEnd) {
  // Cap DPR aggressively on low-end devices to reduce canvas/WebGL memory.
  // Oppo A12-class devices tend to fall over with DPR=2 full-screen canvases.
  if (lowEnd) return Math.min(dpr || 1, 1.25);
  return Math.min(dpr || 1, 2);
}

function useUnderLoadDetector({ enabled }) {
  const [underLoad, setUnderLoad] = useState(false);
  const lastTRef = useRef(0);
  const badFramesRef = useRef(0);
  const totalFramesRef = useRef(0);
  const longTaskRef = useRef(false);
  const enabledRef = useRef(Boolean(enabled));
  enabledRef.current = Boolean(enabled);

  useEffect(() => {
    if (!enabled) {
      setUnderLoad(false);
      return;
    }

    let perfObserver = null;
    if (typeof PerformanceObserver !== "undefined") {
      try {
        perfObserver = new PerformanceObserver((list) => {
          // If the main thread is blocked, treat it as under load.
          if (list.getEntries().length > 0) longTaskRef.current = true;
        });
        // "longtask" isn’t supported everywhere; ignore if unsupported.
        perfObserver.observe({ entryTypes: ["longtask"] });
      } catch {
        perfObserver = null;
      }
    }

    return () => {
      if (perfObserver) {
        try {
          perfObserver.disconnect();
        } catch {
          // ignore
        }
      }
    };
  }, [enabled]);

  useRafTask({
    id: "perfFlags:underLoad",
    maxFps: 60,
    enabled: () => enabledRef.current,
    cb: (t) => {
      const targetMs = 1000 / 30; // 33.3ms
      const badFrameThresholdMs = 50; // clearly janky on low-end

      if (lastTRef.current) {
        const dt = t - lastTRef.current;
        totalFramesRef.current += 1;

        if (dt > badFrameThresholdMs) badFramesRef.current += 1;

        // Evaluate every ~2s worth of frames.
        if (totalFramesRef.current >= 60) {
          const badRatio = badFramesRef.current / totalFramesRef.current;
          const loaded = longTaskRef.current || badRatio >= 0.25;

          // Hysteresis: once under load, require a strong recovery.
          setUnderLoad((prev) => (prev ? !(badRatio < 0.08) : loaded));

          badFramesRef.current = 0;
          totalFramesRef.current = 0;
          longTaskRef.current = false;
        }

        // Quick early trigger if we’re consistently missing 30fps.
        if (dt > targetMs * 2.2) {
          badFramesRef.current += 1;
        }
      }

      lastTRef.current = t;
    },
  });

  return underLoad;
}

function readSessionBool(key) {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage?.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeSessionBool(key, value) {
  if (typeof window === "undefined") return;
  try {
    if (value) window.sessionStorage?.setItem(key, "1");
    else window.sessionStorage?.removeItem(key);
  } catch {
    // ignore (private mode / blocked storage)
  }
}

/**
 * FPS-based failsafe:
 * - Monitors real frame pacing
 * - If FPS stays below 20, permanently enables a "degrade effects" mode
 * - Persists for the session
 */
function usePerfFailsafe({ enabled }) {
  const SESSION_KEY = "perf:failsafe";
  const [failsafe, setFailsafe] = useState(() => readSessionBool(SESSION_KEY));

  const enabledRef = useRef(Boolean(enabled));
  enabledRef.current = Boolean(enabled);

  const startRef = useRef(0);
  const framesRef = useRef(0);
  const consecutiveBadWindowsRef = useRef(0);

  useEffect(() => {
    // If it was already tripped in this session, keep it.
    if (readSessionBool(SESSION_KEY)) setFailsafe(true);
  }, []);

  useEffect(() => {
    if (!failsafe) return;
    writeSessionBool(SESSION_KEY, true);
  }, [failsafe]);

  useRafTask({
    id: "perfFlags:failsafe",
    maxFps: 60,
    enabled: () => enabledRef.current && !failsafe,
    cb: (now) => {
      // Use the raw RAF timestamp for FPS math (dt passed to tasks is time-scaled).
      if (!startRef.current) startRef.current = now;

      framesRef.current += 1;
      const elapsed = now - startRef.current;

      // Evaluate every ~2s for stable FPS measurement.
      if (elapsed >= 2000) {
        const fps = (framesRef.current * 1000) / Math.max(1, elapsed);

        if (fps < 20) consecutiveBadWindowsRef.current += 1;
        else consecutiveBadWindowsRef.current = 0;

        // Require sustained low FPS (two consecutive windows) to avoid false trips.
        if (consecutiveBadWindowsRef.current >= 2) {
          setFailsafe(true);
          writeSessionBool(SESSION_KEY, true);
        }

        startRef.current = now;
        framesRef.current = 0;
      }
    },
  });

  return failsafe;
}

export function useDeviceCapabilities() {
  const [caps, setCaps] = useState(() => ({
    lowEnd: false,
    reducedMotion: false,
    saveData: false,
    dpr: 1,
    cpuCores: undefined,
    deviceMemory: undefined,
    effectiveType: "unknown",
    gpuRenderer: "unknown",
    gpuVendor: "unknown",
  }));

  useEffect(() => {
    const rm = safeMatchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      const dpr = getDpr();
      const gpu = getWebGLRendererInfo();

      setCaps({
        lowEnd: getLowEndHeuristic(),
        reducedMotion: getReducedMotion(),
        saveData: getSaveData(),
        dpr,
        cpuCores: getHardwareConcurrency(),
        deviceMemory: getDeviceMemory(),
        effectiveType: getEffectiveType(),
        gpuRenderer: gpu.renderer,
        gpuVendor: gpu.vendor,
      });
    };

    update();

    const onResize = () => update();
    window.addEventListener("resize", onResize, { passive: true });

    const onConnChange = () => update();
    const conn = getConnection();
    if (conn?.addEventListener) conn.addEventListener("change", onConnChange);

    const onRmChange = () => update();
    if (rm?.addEventListener) rm.addEventListener("change", onRmChange);

    return () => {
      window.removeEventListener("resize", onResize);
      if (conn?.removeEventListener) conn.removeEventListener("change", onConnChange);
      if (rm?.removeEventListener) rm.removeEventListener("change", onRmChange);
    };
  }, []);

  const failsafe = usePerfFailsafe({ enabled: true });
  const underLoad = useUnderLoadDetector({ enabled: true }) || failsafe;

  return useMemo(
    () => ({
      ...caps,
      underLoad,
      failsafe,
    }),
    [caps, underLoad, failsafe]
  );
}

// Back-compat: existing components already use usePerfFlags().
export function usePerfFlags() {
  const { lowEnd, reducedMotion, saveData, dpr, underLoad, failsafe } = useDeviceCapabilities();
  return useMemo(
    () => ({
      lowEnd,
      reducedMotion,
      saveData,
      dpr,
      underLoad,
      failsafe,
    }),
    [lowEnd, reducedMotion, saveData, dpr, underLoad, failsafe]
  );
}
