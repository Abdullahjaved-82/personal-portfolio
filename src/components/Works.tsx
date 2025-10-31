"use client";

import { MdOutlineArrowOutward } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { useProfile } from "@/context/ProfileContext";

export default function Works() {
    const { profile } = useProfile();

    return (
        <section id="projects" className="relative flex flex-col w-full bg-black py-20">
            <div className="container mx-auto px-6 lg:px-12">
                <span className="text-sm uppercase tracking-[0.4em] text-white/40">Projects</span>
                <h3 className="text-3xl md:text-4xl text-white pt-4 max-w-3xl">
                    {profile.projectsIntro}
                </h3>
            </div>
            {profile.projects.map((item, idx) => (
                <div
                    key={item.id}
                    className="group container mx-auto flex flex-col gap-10 px-6 py-16 lg:px-12 md:flex-row md:items-center border-b border-white/10"
                >
                    <div className="flex flex-col gap-6 md:w-1/2">
                        <div className="mb-12">
                            <span className="text-xs uppercase tracking-[0.4em] text-white/40">{`Project ${idx + 1}`}</span>
                            <h2 className="text-3xl md:text-4xl font-semibold pb-4 text-white">{item.title}</h2>
                            <p className="text-white/70 leading-relaxed">{item.description}</p>
                            <div className="grid">
                                <div className="flex gap-6 pb-4 border-b border-white/5 mb-4 w-full">
                                    <span className="w-[40%] text-white/50">Tech Stack</span>
                                    <span className="w-[60%] text-white/80">{item.techStack}</span>
                                </div>
                                <div className="flex gap-6 pb-4 border-b border-white/5 w-full">
                                    <span className="w-[40%] text-white/50">Type</span>
                                    <span className="w-[60%] text-white/80">{item.type}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            {item.link && (
                                <Link
                                    href={item.link}
                                    className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-white/70 hover:text-white transition group/button"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span>Project Details</span>
                                    <MdOutlineArrowOutward className="text-2xl group-hover/button:rotate-45 group-hover/button:translate-x-1 duration-500" />
                                </Link>
                            )}
                            {item.github && (
                                <Link
                                    href={item.github}
                                    className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-white/40 hover:text-white transition"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span>View Code</span>
                                    <MdOutlineArrowOutward className="text-2xl" />
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative h-[240px] sm:h-[280px] md:h-[360px] overflow-hidden rounded-3xl bg-black/40">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                                loading="lazy"
                                quality={55}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}
