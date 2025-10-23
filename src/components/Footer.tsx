"use client";
import { useRef, useEffect, useMemo } from "react";
import { gsap } from "gsap";
import { useProfile } from "@/context/ProfileContext";
import Link from "next/link";

export function Footer() {
    const listItemsRef = useRef<(HTMLLIElement | null)[]>([]);
    const spanItemsRef = useRef<(HTMLSpanElement | null)[]>([]);
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

    useEffect(() => {
        const handleMouseEnter = (item: HTMLElement) => {
            const textInitial = item.querySelector('.initial');
            const textHover = item.querySelector('.hover');
            gsap.to(textInitial, {
                yPercent: -100,
                perspective: 1000,
                rotationX: 90,
                duration: 1,
                ease: 'power4.out',
            });
            gsap.to(textHover, {
                yPercent: 0,
                perspective: 1000,
                rotationX: 0,
                duration: 1,
                ease: 'power4.out',
            });
        };

        const handleMouseLeave = (item: HTMLElement) => {
            const textInitial = item.querySelector('.initial');
            const textHover = item.querySelector('.hover');
            gsap.to(textInitial, {
                yPercent: 0,
                perspective: 1000,
                rotationX: 0,
                duration: 1,
                ease: 'power4.out',
            });
            gsap.to(textHover, {
                yPercent: 100,
                perspective: 1000,
                rotationX: -90,
                duration: 1,
                ease: 'power4.out',
            });
        };

        const addEventListeners = (item: HTMLElement | null) => {
            if (!item) return;
            const textHover = item.querySelector('.hover');
            gsap.set(textHover, { yPercent: 100, perspective: 1000, rotationX: -90 });

            const enterHandler = () => handleMouseEnter(item);
            const leaveHandler = () => handleMouseLeave(item);

            item.addEventListener('mouseenter', enterHandler);
            item.addEventListener('mouseleave', leaveHandler);

            // Store handlers to remove them later
            (item as any).__enterHandler = enterHandler;
            (item as any).__leaveHandler = leaveHandler;
        };

        const removeEventListeners = (item: HTMLElement | null) => {
            if (!item) return;
            item.removeEventListener('mouseenter', (item as any).__enterHandler);
            item.removeEventListener('mouseleave', (item as any).__leaveHandler);
        };

        const navItems = [...listItemsRef.current];
        const contactItems = [...spanItemsRef.current];

        navItems.forEach(addEventListeners);
        contactItems.forEach(addEventListeners);

        return () => {
            navItems.forEach(removeEventListeners);
            contactItems.forEach(removeEventListeners);
        };
    }, []);

    return (
        <footer className="relative flex flex-col bg-black py-20">
            <div className="container mx-auto flex flex-col gap-12 px-6 lg:px-12">
                <div className='flex flex-col'>
                    <ul className="flex flex-col gap-5 uppercase w-fit text-sm tracking-[0.4em]">
                        {navLinks.map((link, index) => (
                            <li
                                key={link.label}
                                ref={(el) => { listItemsRef.current[index] = el; }}
                                className="relative overflow-hidden h-5 cursor-pointer"
                            >
                                <Link href={link.href} className="block initial absolute top-0 left-0 w-full h-full">
                                    {link.label}
                                </Link>
                                <Link href={link.href} className="block hover absolute top-0 left-0 w-full h-full">
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
                                        ref={(el) => {
                                            spanItemsRef.current[idx] = el;
                                        }}
                                        className='relative overflow-hidden group/line cursor-pointer'
                                    >
                                        <a
                                            href={hrefValue}
                                            target={hrefValue.startsWith('http') ? '_blank' : undefined}
                                            rel={hrefValue.startsWith('http') ? 'noreferrer' : undefined}
                                            className='leading-none pb-2 initial block'
                                        >
                                            {displayValue}
                                        </a>
                                        <a
                                            href={hrefValue}
                                            target={hrefValue.startsWith('http') ? '_blank' : undefined}
                                            rel={hrefValue.startsWith('http') ? 'noreferrer' : undefined}
                                            className='leading-none pb-2 hover block'
                                        >
                                            {displayValue}
                                        </a>
                                        <span className='block bg-white h-[1px] -translate-x-full group-hover/line:translate-x-0 group-hover/line:opacity-100 opacity-0 duration-500' />
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
