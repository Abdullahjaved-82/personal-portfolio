"use client";

/**
 * Global single requestAnimationFrame hub.
 *
 * Goals:
 * - One RAF loop for the whole app
 * - Per-task FPS throttling
 * - Auto-pause when tab is hidden
 * - Easy subscription from React components
 */

const tasks = new Map();
let rafId = null;
let lastNow = 0;
let running = false;
let timeScale = 1;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function start() {
  if (running) return;
  if (tasks.size === 0) return;
  running = true;
  lastNow = 0;
  rafId = requestAnimationFrame(tick);
}

function stop() {
  running = false;
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  lastNow = 0;
}

function tick(now) {
  if (!running) return;

  // If the tab is hidden, we fully pause (no callbacks, no scheduling).
  if (document.hidden) {
    stop();
    return;
  }

  // Clamp dt to avoid huge jumps after tab switches/suspends.
  const rawDt = lastNow ? now - lastNow : 16;
  lastNow = now;
  const dt = clamp(rawDt, 0, 50);
  const scaledDt = dt * timeScale;

  for (const [id, task] of tasks) {
    if (!task) continue;
    if (task.enabled && !task.enabled()) continue;

    const maxFps = task.maxFps || 60;
    const minInterval = 1000 / maxFps;

    const last = task.lastRun || 0;
    if (last && now - last < minInterval) continue;

    task.lastRun = now;

    try {
      task.cb(now, scaledDt);
    } catch {
      // Fail-safe: disable a crashing task to protect the app.
      tasks.delete(id);
    }
  }

  if (tasks.size === 0) {
    stop();
    return;
  }

  rafId = requestAnimationFrame(tick);
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
      return;
    }
    if (tasks.size > 0) start();
  });
}

/**
 * Set global time scaling for all dt-based tasks.
 * - 1: normal speed
 * - 0.5: half speed
 * - 0: frozen (dt=0)
 */
export function setRafHubTimeScale(scale) {
  timeScale = clamp(Number(scale) || 0, 0, 2);
}

export function getRafHubTimeScale() {
  return timeScale;
}

/**
 * Subscribe a task to the global RAF.
 * @param {Object} opts
 * @param {string} opts.id Unique id
 * @param {(now:number, dt:number)=>void} opts.cb Callback
 * @param {()=>boolean} [opts.enabled] Return true to allow running
 * @param {number} [opts.maxFps] FPS cap per task
 */
export function addRafTask({ id, cb, enabled, maxFps }) {
  if (!id) throw new Error("addRafTask: id is required");
  if (typeof cb !== "function") throw new Error("addRafTask: cb must be a function");

  tasks.set(id, {
    cb,
    enabled,
    maxFps,
    lastRun: 0,
  });

  start();

  return () => {
    tasks.delete(id);
    if (tasks.size === 0) stop();
  };
}

export function updateRafTask(id, partial) {
  const t = tasks.get(id);
  if (!t) return;
  tasks.set(id, { ...t, ...partial });
}
