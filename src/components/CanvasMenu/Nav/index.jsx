"use client";

import styles from "./style.module.scss";
import { motion } from "framer-motion";
import Image from "next/image";
import { slideIn } from "./anim";
import clsx from "clsx";
import Link from "next/link";
import { useProfile } from "@/context/ProfileContext";

export default function NavigationMenu() {
	const { profile } = useProfile();

	const navLinks = [
		{ title: "Home", href: "#home" },
		{ title: "About", href: "#about" },
		{ title: "Skills", href: "#skills" },
		{ title: "Projects", href: "#projects" },
		{ title: "Contact", href: "#contact" },
		{ title: "Admin", href: "/admin" },
	];

	const socialLinks = Object.entries(profile.socials)
		.filter(([_, value]) => Boolean(value))
		.map(([key, value]) => ({
			title: key.replace(/^[a-z]/, (c) => c.toUpperCase()),
			href: value,
		}));

	return (
		<div className={styles.mainNav}>
			<div className={styles.nav}>
				<div className={clsx(styles.body)}>
					{navLinks.map((link, i) => (
						<div key={`nav_${link.title}`} className={styles.linkContainer}>
							<motion.div
								custom={i}
								variants={slideIn}
								initial="initial"
								animate="enter"
								exit="exit"
							>
								<Link href={link.href}>{link.title}</Link>
							</motion.div>
						</div>
					))}
				</div>
				<motion.div className={styles.footer}>
					{socialLinks.map((link, i) => (
						<motion.a
							key={`social_${link.title}`}
							href={link.href}
							target={link.href.startsWith("http") ? "_blank" : undefined}
							rel={link.href.startsWith("http") ? "noreferrer" : undefined}
							variants={slideIn}
							custom={i}
							initial="initial"
							animate="enter"
							exit="exit"
						>
							{link.title}
						</motion.a>
					))}
				</motion.div>
			</div>
			<div className="relative block h-[40vh] w-full overflow-hidden rounded-3xl">
				<Image
					alt={`${profile.name} creative background`}
					src={profile.heroMedia || "/works/works01.jpg"}
					fill
					className="object-cover"
					sizes="100vw"
					priority
				/>
			</div>
		</div>
	);
}
