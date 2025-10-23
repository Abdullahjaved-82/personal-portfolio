"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";
import Header from "./CanvasMenu";
import { useProfile } from "@/context/ProfileContext";

const Menu = () => {
  const { profile } = useProfile();
  const [isHidden, setIsHidden] = useState(false);
  const [isElevated, setIsElevated] = useState(false);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    window.requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (currentY <= 80) {
        setIsHidden(false);
      } else if (delta > 10) {
        setIsHidden(true);
      } else if (delta < -10) {
        setIsHidden(false);
      }

      setIsElevated(currentY > 24);
      lastScrollY.current = currentY;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      className={clsx(
        "pointer-events-none fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out",
        isHidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div
        className={clsx(
          "pointer-events-auto mx-auto flex h-16 items-center justify-between gap-6 rounded-full border px-6 backdrop-blur-xl transition-all duration-300 lg:mt-4 mt-2",
          isElevated
            ? "border-white/20 bg-black/70 shadow-2xl shadow-black/40"
            : "border-white/10 bg-black/60"
        )}
      >
        <div className='flex min-w-0 flex-col justify-center text-white'>
          <span className='text-sm font-semibold leading-tight'>{profile.name}</span>
          <span className='text-xs uppercase tracking-[0.4em] text-white/40 hidden sm:block whitespace-nowrap leading-tight text-center sm:text-left'>
            {profile.role}
          </span>
        </div>
        <Header />
      </div>
    </div>
  )
}

export default Menu