"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useProfile } from "@/context/ProfileContext";

const About = () => {
  const { profile } = useProfile();
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
          setIsVisible(false);
          setHasAnimated(false);
        }
      },
      {
        threshold: 0.3,
      }
    );

    const current = ref.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [hasAnimated]);

  return (
    <section id="about" className="relative flex w-full bg-black py-20 md:py-32">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-black to-black" />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 container mx-auto px-6 lg:px-12"
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center">
          <div className="group relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
              <Image
                src={profile.profileImage}
                alt={`${profile.name} portrait`}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 80vw, 360px"
                priority
              />
            </div>
            <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-black/60 p-4 text-sm text-white/80 backdrop-blur">
              <p className="font-semibold text-white">{profile.name}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">{profile.role}</p>
            </div>
          </div>

          <div className="flex flex-col gap-8 text-white">
            <div className="flex flex-col gap-4">
              <span className="text-sm uppercase tracking-[0.4em] text-white/40">About</span>
              <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
                {profile.heroTagline}
              </h2>
              <p className="text-base md:text-lg text-white/70 leading-relaxed">
                {profile.about.summary}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm uppercase tracking-[0.3em] text-white/50 mb-3">Focus Area</h3>
                <p className="text-sm md:text-base text-white/70 leading-relaxed">
                  {profile.about.focus}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm uppercase tracking-[0.3em] text-white/50 mb-3">Motivation</h3>
                <p className="text-sm md:text-base text-white/70 leading-relaxed">
                  {profile.about.motivation}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <h3 className="text-sm uppercase tracking-[0.3em] text-white/50">Highlights</h3>
              <ul className="grid gap-3">
                {profile.about.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3 text-sm md:text-base text-white/70">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-sm uppercase tracking-[0.3em] text-white/50 mb-3">Future Goals</h3>
              <ul className="grid gap-3 text-sm md:text-base text-white/70">
                {profile.about.futureGoals.map((goal) => (
                  <li key={goal} className="flex gap-3">
                    <span aria-hidden>→</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profile.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/80 backdrop-blur"
            >
              <p className="text-4xl font-semibold text-white">{stat.value}</p>
              <p className="text-sm uppercase tracking-[0.3em] text-white/50 mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default About;
