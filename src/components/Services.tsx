"use client";

import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import * as Profile from "@/context/ProfileContext";
import WebsiteMockup from "./ui/WebsiteMockup";
import ProgLangList from "./ui/ProgLangList";

const Services = () => {
  const { profile } = Profile.useProfile();

  const layoutPresets = [
    "lg:col-span-3 md:col-span-6 md:row-span-3 min-h-[320px]",
    "lg:col-span-2 md:col-span-3 md:row-span-2 min-h-[260px]",
    "lg:col-span-2 md:col-span-3 md:row-span-2 min-h-[260px]",
    "lg:col-span-2 md:col-span-3 md:row-span-2 min-h-[260px]",
    "lg:col-span-3 md:col-span-6 md:row-span-3 min-h-[320px]",
    "lg:col-span-2 md:col-span-3 md:row-span-2 min-h-[260px]",
  ];

  const featureComponents = [
    <WebsiteMockup key="feature-website" />, // Web engineering visual
    <ProgLangList key="feature-languages" />, // Language stack badges
    null,
    null,
    null,
    null,
  ];

  return (
    <section id="skills" className="w-full flex flex-col relative bg-grid-white/[0.05] py-20 pb-32">
      <div className="container mx-auto px-6 lg:px-12 mb-12">
        <span className="text-sm uppercase tracking-[0.4em] text-purple-400/60">Skills & Expertise</span>
        <h3 className="text-3xl md:text-5xl font-semibold text-white pt-4 max-w-3xl leading-tight">
          {profile.skillsIntro}
        </h3>
      </div>
      <>
        <BentoGrid className="container mx-auto px-6 pb-20 lg:px-12">
          {profile.skills.map((skill, index) => (
            <BentoGridItem
              key={skill.id}
              title={skill.title}
              headline={skill.headline}
              description={skill.description}
              tools={skill.tools}
              className={layoutPresets[index % layoutPresets.length]}
              feature={featureComponents[index] ?? null}
            />
          ))}
        </BentoGrid>
      </>
    </section>
  );
};

export default Services;