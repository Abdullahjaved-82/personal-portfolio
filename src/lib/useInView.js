"use client";

import { useEffect, useState } from "react";

/**
 * Minimal IntersectionObserver hook.
 * @param {React.RefObject<Element>} ref
 * @param {IntersectionObserverInit & { disabled?: boolean }} opts
 */
export function useInView(ref, opts = {}) {
  const { disabled, root = null, rootMargin = "0px", threshold = 0.1 } = opts;
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (disabled) {
      setInView(true);
      return;
    }

    const el = ref?.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setInView(entries.some((e) => e.isIntersecting));
      },
      { root, rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, disabled, root, rootMargin, threshold]);

  return inView;
}
