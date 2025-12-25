"use client";

import { useEffect, useMemo, useRef } from "react";
import { addRafTask, updateRafTask } from "@/lib/rafHub";

/**
 * React hook wrapper for the global RAF hub.
 * Ensures components don't create their own RAF loops.
 *
 * @typedef {Object} RafTaskOptions
 * @property {string} id
 * @property {(now:number, dt:number)=>void} cb
 * @property {boolean | (()=>boolean)} [enabled]
 * @property {number} [maxFps]
 */
export function useRafTask(/** @type {RafTaskOptions} */ { id, cb, enabled = true, maxFps = 60 }) {
  const cbRef = useRef(cb);
  cbRef.current = cb;

  const enabledFn = useMemo(() => {
    if (typeof enabled === "function") return enabled;
    return () => Boolean(enabled);
  }, [enabled]);

  useEffect(() => {
    const unsubscribe = addRafTask({
      id,
      cb: (now, dt) => cbRef.current(now, dt),
      enabled: enabledFn,
      maxFps,
    });

    return unsubscribe;
  }, [id, enabledFn, maxFps]);

  useEffect(() => {
    updateRafTask(id, { enabled: enabledFn, maxFps });
  }, [id, enabledFn, maxFps]);
}
