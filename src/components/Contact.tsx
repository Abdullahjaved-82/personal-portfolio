"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useProfile } from "@/context/ProfileContext";

const Contact = () => {
  const { profile } = useProfile();

  const socialEntries = Object.entries(profile.socials)
    .filter(([_, value]) => Boolean(value))
    .map(([key, value]) => ({
      label: key.replace(/^[a-z]/, (c) => c.toUpperCase()),
      href: value as string,
    }));

  return (
    <section id="contact" className="relative w-full bg-black py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" aria-hidden />
      <div className="relative z-10 container mx-auto flex flex-col gap-12 px-6 lg:px-12 text-white">
        <div className="max-w-3xl">
          <span className="text-sm uppercase tracking-[0.4em] text-white/40">Contact</span>
          <h2 className="pt-4 text-3xl md:text-4xl font-semibold leading-tight">
            Let&apos;s collaborate on thoughtful software and intelligent products.
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/70 leading-relaxed">
            Whether you need a production-ready web platform, experiments with machine learning, or a fast prototype to validate ideas, I&apos;m one message away.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">Email</p>
            <Link
              href={`mailto:${profile.contact.email.replace(/^mailto:/, "")}`}
              className="mt-3 inline-flex text-lg font-medium text-white hover:text-white/70 transition"
            >
              {profile.contact.email.replace(/^mailto:/, "")}
            </Link>
            <p className="mt-4 text-sm text-white/60">
              I try to respond within 24 hours for new opportunities and collaborations.
            </p>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">Location</p>
            <p className="mt-3 text-lg font-medium text-white">{profile.contact.location}</p>
            <p className="mt-4 text-sm text-white/60">{profile.contact.availability}</p>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">Social</p>
            <div className="mt-3 flex flex-col gap-3">
              {socialEntries.slice(0, 4).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-white/60 hover:text-white transition"
                >
                  <span>{item.label}</span>
                  <span aria-hidden>↗</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-white/40">Let&apos;s build</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Have a project or experiment in mind?</h3>
            <p className="mt-2 text-white/60">
              Send over some context, and I&apos;ll share ideas on scope, tooling, and timelines.
            </p>
          </div>
          <Link
            href={`mailto:${profile.contact.email.replace(/^mailto:/, "")}`}
            className="inline-flex items-center justify-center rounded-full border border-white px-6 py-3 text-sm uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition"
          >
            Write me an email
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Contact;
