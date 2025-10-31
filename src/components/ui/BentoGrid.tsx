'use client'
import { cn } from "@/utils/cn";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        // change gap-4 to gap-8, change grid-cols-3 to grid-cols-5, remove md:auto-rows-[18rem], add responsive code
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto group",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  headline,
  description,
  tools,
  feature,
  cta,
}: {
  className?: string;
  title: string | React.ReactNode;
  headline?: string;
  description: string | React.ReactNode;
  tools?: string[];
  feature?: React.ReactNode;
  cta?: { label: string; href: string };
}) => {
  return (
    <div
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] group/bento hover:border-white/20 transition duration-300 flex flex-col",
        className
      )}
    >
      <div className="relative flex flex-1 flex-col gap-4 px-6 py-8 lg:px-10">
        <div className="flex flex-col gap-2">
          <div className="text-xs uppercase tracking-[0.3em] text-white/40">{headline}</div>
          <div className="font-sans text-xl lg:text-3xl font-semibold text-white">{title}</div>
        </div>
        <div className="text-sm md:text-base text-white/70 leading-relaxed">{description}</div>

        {tools && tools.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2">
            {tools.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-white/60"
              >
                {tool}
              </span>
            ))}
          </div>
        )}

        {cta && (
          <a
            href={cta.href}
            className="mt-6 inline-flex w-fit items-center gap-2 text-sm text-white hover:text-white/70 transition"
          >
            {cta.label}
            <span aria-hidden>→</span>
          </a>
        )}
      </div>

      {feature && (
        <div className="mt-auto flex items-end justify-end px-6 pb-6 lg:px-10">{feature}</div>
      )}
    </div>
  );
};