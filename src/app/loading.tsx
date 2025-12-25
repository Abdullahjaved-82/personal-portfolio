export default function Loading() {
  return (
    <div
      className="loading-screen fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Subtle grid (masked) to feel premium, no blur/filters. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 bg-grid-white/[0.06] [mask-image:radial-gradient(circle_at_center,black_0%,black_45%,transparent_72%)]"
      />

      <div className="relative flex flex-col items-center gap-6 px-6 text-center text-white">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border border-white/15" />
          <div
            className="absolute inset-0 rounded-full border border-white/30 motion-reduce:animate-none animate-spin"
            style={{ animationDuration: "1.35s" }}
          />
          <div
            className="absolute inset-[10px] rounded-full motion-reduce:animate-none animate-pulse"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.28) 22%, rgba(255,255,255,0.10) 55%, rgba(255,255,255,0) 72%)",
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium tracking-wide">Abdullah Javed</div>
          <div className="text-xs uppercase tracking-[0.55em] text-white/60">Loading portfolio</div>
        </div>

        <div className="h-[2px] w-56 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full w-full motion-reduce:animate-none animate-shimmer"
            style={{
              backgroundImage:
                "linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 45%, rgba(255,255,255,0) 100%)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
