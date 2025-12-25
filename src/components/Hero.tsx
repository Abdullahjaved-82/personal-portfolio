"use client";
import React from "react";
import HeroContent from "./ui/HeroContent";
import LostOrb from "./ui/LostOrb";
import HeroSun from "./ui/HeroSun";
import { usePerfFlags } from "@/lib/perfFlags";
import clsx from "clsx";

export default function Hero() {
    const { lowEnd, underLoad, reducedMotion, saveData } = usePerfFlags();
    const perfLow = lowEnd || underLoad || reducedMotion || saveData;

    return (
        <section
            id="home"
            className={clsx(
                "flex flex-col min-h-screen-safe w-full relative items-center justify-center bg-black overflow-hidden isolate [contain:paint]",
                !perfLow && "bg-grid-white/[0.1]"
            )}
        >
            {!perfLow && (
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            )}
            <HeroSun />
            
            <HeroContent />
            <div
                className={clsx(
                    "w-full absolute inset-x-0 bottom-0 md:h-full",
                    perfLow ? "h-[45svh]" : "h-[50svh]"
                )}
            >
                <LostOrb />
            </div>
        </section>
    );
}