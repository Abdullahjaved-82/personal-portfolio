"use client";

import { cn } from "@/utils/cn";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { usePerfFlags } from "@/lib/perfFlags";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    name: string;
    title?: string;
    img?: string;
  }[];
  direction?: "left" | "right" | "up" | "down";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const { lowEnd, underLoad, reducedMotion, saveData } = usePerfFlags();
  const disableInfinite = lowEnd || underLoad || reducedMotion || saveData;

  const getDirection = useCallback(() => {
    if (containerRef.current) {
      switch (direction) {
        case "left":
          containerRef.current.style.setProperty("--animation-direction", "forwards");
          containerRef.current.style.setProperty("--animation-axis", "horizontal");
          break;
        case "right":
          containerRef.current.style.setProperty("--animation-direction", "reverse");
          containerRef.current.style.setProperty("--animation-axis", "horizontal");
          break;
        case "up":
          containerRef.current.style.setProperty("--animation-direction", "forwards");
          containerRef.current.style.setProperty("--animation-axis", "vertical");
          break;
        case "down":
          containerRef.current.style.setProperty("--animation-direction", "reverse");
          containerRef.current.style.setProperty("--animation-axis", "vertical");
          break;
      }
    }
  }, [direction]);

  const getSpeed = useCallback(() => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty(
          "--animation-duration",
          lowEnd ? "60s" : "25s"
        );
      } else if (speed === "normal") {
        containerRef.current.style.setProperty(
          "--animation-duration",
          lowEnd ? "90s" : "50s"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-duration",
          lowEnd ? "140s" : "100s"
        );
      }
    }
  }, [lowEnd, speed]);

  const addAnimation = useCallback(() => {
    if (disableInfinite) {
      setStart(false);
      return;
    }
    if (containerRef.current && scrollerRef.current) {
      // Avoid duplicating nodes multiple times (e.g. React StrictMode in dev)
      // which explodes DOM size and causes mobile memory spikes.
      if (scrollerRef.current.dataset.duplicated === "true") {
        setStart(true);
        return;
      }

      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      scrollerRef.current.dataset.duplicated = "true";

      getDirection();
      getSpeed();
      setStart(true);
    }
  }, [disableInfinite, getDirection, getSpeed]);

  useEffect(() => {
    addAnimation();
    // Pause animations entirely when backgrounded.
    const onVisibilityChange = () => {
      setStart(!document.hidden);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [addAnimation]);
  const [start, setStart] = useState(false);

  useEffect(() => {
    // Re-apply duration if the perf tier resolves after mount.
    getSpeed();
  }, [getSpeed]);

  useEffect(() => {
    // If we enter a low-power or under-load state, stop the infinite animation.
    if (disableInfinite) setStart(false);
  }, [disableInfinite]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden",
        direction === "left" || direction === "right"
          ? "[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]"
          : "[mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex",
          direction === "left" || direction === "right" ? "flex-row" : "flex-col",
          "min-w-full shrink-0 gap-4 py-4 w-max",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="h-full w-[280px] relative overflow-hidden rounded-2xl border border-b-0 flex-shrink-0 border-slate-700"
            style={{
              background: "linear-gradient(180deg, var(--slate-800), var(--slate-900)",
            }}
            key={item.name}
          >
            {item.img && (
              <Image 
                alt={item.title || "Image"} 
                src={item.img} 
                width={280} 
                height={180} 
                className="w-full h-auto"
                quality={60}
                loading={idx === 0 ? "eager" : "lazy"}
                sizes="280px"
              />
            )}
            {item.title && (
              <p className="relative w-max px-6 py-2">{item.title}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
