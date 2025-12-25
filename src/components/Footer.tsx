"use client";
import { useMemo } from "react";
import { useProfile } from "@/context/ProfileContext";
import Link from "next/link";

export function Footer() {
    const { profile } = useProfile();

    const navLinks = useMemo(
        () => [
            { label: "Home", href: "#home" },
            { label: "About", href: "#about" },
            { label: "Skills", href: "#skills" },
            { label: "Projects", href: "#projects" },
            { label: "Contact", href: "#contact" },
            { label: "Admin", href: "/admin" },
        ],
        []
    );

    return (
        <footer className="relative flex flex-col bg-black py-20">
            <div className="container mx-auto flex flex-col gap-12 px-6 lg:px-12">
                <div className='flex flex-col'>
                    <ul className="flex flex-col gap-5 uppercase w-fit text-sm tracking-[0.4em]">
                        {navLinks.map((link, index) => (
                            <li
                                key={link.label}
                                className="group relative h-5 cursor-pointer overflow-hidden"
                            >
                                <Link
                                    href={link.href}
                                    className="absolute left-0 top-0 block h-full w-full transition-transform duration-500 ease-out group-hover:-translate-y-full"
                                >
                                    {link.label}
                                </Link>
                                <Link
                                    href={link.href}
                                    className="absolute left-0 top-0 block h-full w-full translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='relative overflow-hidden group/line py-12 w-fit cursor-pointer'>
                    <a href="#contact" className='w-full text-[12vw] md:text-[8vw] uppercase leading-none text-white'>Get In Touch</a>
                    <span className='block w-full bg-white h-1 -translate-x-full group-hover/line:translate-x-0 duration-500 opacity-0 group-hover/line:opacity-100' />
                </div>
                <div className='w-full flex flex-col md:flex-row gap-10 justify-between text-white/60 uppercase text-xs tracking-[0.4em]'>
                    <div className='flex flex-wrap gap-8'>
                        {[profile.contact.email, profile.socials.github, profile.socials.linkedin]
                            .filter(Boolean)
                            .map((value, idx) => {
                                const raw = String(value);
                                const hrefValue = raw.startsWith('http')
                                    ? raw
                                    : raw.startsWith('mailto:')
                                    ? raw
                                    : raw.includes('@')
                                        ? `mailto:${raw}`
                                        : raw;
                                const displayValue = raw.replace('mailto:', '');

                                return (
                                    <span
                                        key={idx}
                                        className='group relative overflow-hidden cursor-pointer'
                                    >
                                        <a
                                            href={hrefValue}
                                            target={hrefValue.startsWith('http') ? '_blank' : undefined}
                                            rel={hrefValue.startsWith('http') ? 'noreferrer' : undefined}
                                            className='block pb-2 leading-none transition-transform duration-500 ease-out group-hover:-translate-y-full'
                                        >
                                            {displayValue}
                                        </a>
                                        <a
                                            href={hrefValue}
                                            target={hrefValue.startsWith('http') ? '_blank' : undefined}
                                            rel={hrefValue.startsWith('http') ? 'noreferrer' : undefined}
                                            className='block pb-2 leading-none translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0'
                                        >
                                            {displayValue}
                                        </a>
                                        <span className='block bg-white h-[1px] -translate-x-full opacity-0 duration-500 group-hover:translate-x-0 group-hover:opacity-100' />
                                    </span>
                                );
                            })}
                    </div>
                    <div className='flex flex-col md:items-end gap-3 text-right normal-case tracking-normal text-white/50'>
                        <span>{profile.contact.location}</span>
                        <span>{profile.contact.availability}</span>
                        <span>{`© ${new Date().getFullYear()} ${profile.name}`}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
