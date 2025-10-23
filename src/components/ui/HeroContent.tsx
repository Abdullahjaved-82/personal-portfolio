"use client";

import Link from "next/link";
import { useEffect } from "react";
import { gsap } from "gsap";
import { useProfile } from "@/context/ProfileContext";

export default function HeroContent() {
    const { profile } = useProfile();

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(".hero-text-1", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.3, ease: "power1.out", })
          .fromTo(".hero-text-2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.3, ease: "power1.out" })
          .fromTo(".hero-text-3", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.3, ease: "power1.out" })
          .fromTo(".hero-buttons", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.3, ease: "power1.out" });
    }, []);

    const primaryCta = profile.heroCTA;
    const secondaryCta = profile.heroSecondaryCTA;

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
            <div className="absolute h-full pointer-events-none inset-0 flex items-center justify-center bg-slate-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            <p className="hero-text-1 text-center text-4xl md:text-5xl lg:text-7xl font-bold relative z-20 text-white max-w-4xl leading-tight">
                {profile.name}
            </p>
            <p className="hero-text-2 text-sm md:text-base lg:text-lg relative z-20 text-white/80 pt-4 uppercase tracking-[0.4em]">
                {profile.role}
            </p>
            <p className="hero-text-3 text-base md:text-lg lg:text-xl relative z-20 text-white/70 pt-6 max-w-xl text-center">
                {profile.heroSubheadline}
            </p>
            <p className="hero-text-3 text-sm md:text-base lg:text-lg relative z-20 text-white/60 py-4 max-w-2xl text-center">
                {profile.heroDescription}
            </p>
            <div className="hero-buttons relative z-20 flex flex-wrap items-center justify-center gap-4">
                <Link
                    href={primaryCta.href}
                    className="text-sm md:text-base px-5 py-3 bg-white text-black rounded-full text-center creativeBtn"
                >
                    <span>{primaryCta.label}</span>
                </Link>
                {secondaryCta && (
                    <Link
                        href={secondaryCta.href}
                        className="text-sm md:text-base px-5 py-3 border border-white/40 text-white rounded-full backdrop-blur hover:border-white transition"
                    >
                        {secondaryCta.label}
                    </Link>
                )}
            </div>
            <p className="sr-only">{profile.heroTagline}</p>
        </div>
    )
}
