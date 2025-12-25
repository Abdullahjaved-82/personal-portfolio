'use client'
import { cn } from "@/utils/cn";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";
import { capDpr, usePerfFlags } from "@/lib/perfFlags";
import { useInView } from "@/lib/useInView";
import { useRafTask } from "@/lib/useRafTask";

interface VortexProps {
  children?: any;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

const HALF_PI: number = 0.5 * Math.PI;
const TAU: number = 2 * Math.PI;
const TO_RAD: number = Math.PI / 180;
const rand = (n: number): number => n * Math.random();
const randRange = (n: number): number => n - rand(2 * n);
const fadeInOut = (t: number, m: number): number => {
  const hm = 0.5 * m;
  return Math.abs(((t + hm) % m) - hm) / hm;
};
const lerp = (n1: number, n2: number, speed: number): number =>
  (1 - speed) * n1 + speed * n2;

export const Vortex = (props: VortexProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { lowEnd, underLoad, reducedMotion, saveData, failsafe, dpr } = usePerfFlags();
  const inView = useInView(containerRef, { threshold: 0.1 });
  const noise3D = useMemo(() => createNoise3D(), []);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlePropsRef = useRef<Float32Array | null>(null);
  const tickRef = useRef(0);
  const centerRef = useRef<[number, number]>([0, 0]);
  const dimsRef = useRef({ w: 0, h: 0, dpr: 1 });

  const particlePropCount = 9;

  const baseTTL = 50;
  const rangeTTL = 150;
  const rangeHue = 100;
  const noiseSteps = 3;
  const xOff = 0.001;
  const yOff = 0.001;
  const zOff = 0.0003;

  const backgroundColor = props.backgroundColor || "#000000";
  const baseHue = props.baseHue || 220;

  const baseSpeed = props.baseSpeed || 0.0;
  const perfLow = useMemo(() => lowEnd || underLoad, [lowEnd, underLoad]);
  const rangeSpeed = (props.rangeSpeed || 1.0) * (perfLow ? 0.85 : 1);
  const baseRadius = props.baseRadius || 1;
  const rangeRadius = (props.rangeRadius || 1.5) * (perfLow ? 0.85 : 1);
  const rangeY = Math.min(props.rangeY || 100, perfLow ? 420 : Number.POSITIVE_INFINITY);

  const requestedParticleCount = props.particleCount || 350;
  const particleCount = Math.min(requestedParticleCount, perfLow ? 180 : 350);

  const initParticle = useCallback(
    (i: number) => {
      const particleProps = particlePropsRef.current;
      if (!particleProps) return;

      const { w } = dimsRef.current;
      const [, cy] = centerRef.current;

      let x, y, vx, vy, life, ttl, speed, radius, hue;

      x = rand(w);
      y = cy + randRange(rangeY);
      vx = 0;
      vy = 0;
      life = 0;
      ttl = baseTTL + rand(rangeTTL);
      speed = baseSpeed + rand(rangeSpeed);
      radius = baseRadius + rand(rangeRadius);
      hue = baseHue + rand(rangeHue);

      particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
    },
    [baseHue, baseRadius, baseSpeed, rangeRadius, rangeSpeed, rangeY]
  );

  const initParticles = useCallback(() => {
    tickRef.current = 0;
    const propsLength = particleCount * particlePropCount;
    const buffer = new Float32Array(propsLength);
    particlePropsRef.current = buffer;

    for (let i = 0; i < propsLength; i += particlePropCount) {
      initParticle(i);
    }
  }, [initParticle, particleCount]);

  const drawParticle = useCallback(
    (
      x: number,
      y: number,
      x2: number,
      y2: number,
      life: number,
      ttl: number,
      radius: number,
      hue: number,
      ctx: CanvasRenderingContext2D
    ) => {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineWidth = radius;
      ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    },
    []
  );

  const updateParticle = useCallback((
    i: number,
    ctx: CanvasRenderingContext2D,
    dtNorm: number
  ) => {
    const particleProps = particlePropsRef.current;
    if (!particleProps) return;

    let i2 = 1 + i,
      i3 = 2 + i,
      i4 = 3 + i,
      i5 = 4 + i,
      i6 = 5 + i,
      i7 = 6 + i,
      i8 = 7 + i,
      i9 = 8 + i;
    let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, hue;

    x = particleProps[i];
    y = particleProps[i2];
    n = noise3D(x * xOff, y * yOff, tickRef.current * zOff) * noiseSteps * TAU;
    vx = lerp(particleProps[i3], Math.cos(n), 0.5);
    vy = lerp(particleProps[i4], Math.sin(n), 0.5);
    life = particleProps[i5];
    ttl = particleProps[i6];
    speed = particleProps[i7];
    x2 = x + vx * speed * dtNorm;
    y2 = y + vy * speed * dtNorm;
    radius = particleProps[i8];
    hue = particleProps[i9];

    drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);

    life++;

    particleProps[i] = x2;
    particleProps[i2] = y2;
    particleProps[i3] = vx;
    particleProps[i4] = vy;
    particleProps[i5] = life;

    (checkBounds(x, y) || life > ttl) && initParticle(i);
  }, [drawParticle, initParticle, noise3D]);

  const drawParticles = useCallback(
    (ctx: CanvasRenderingContext2D, dtNorm: number) => {
      const particleProps = particlePropsRef.current;
      if (!particleProps) return;

      for (let i = 0; i < particleProps.length; i += particlePropCount) {
        updateParticle(i, ctx, dtNorm);
      }
    },
    [updateParticle]
  );

  const checkBounds = (x: number, y: number) => {
    const { w, h } = dimsRef.current;
    return x > w || x < 0 || y > h || y < 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    } as any) as CanvasRenderingContext2D | null;
    if (!ctx) return;
    ctxRef.current = ctx;

    const applySize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const dprCapped = capDpr(dpr, perfLow || reducedMotion || saveData);

      dimsRef.current = { w, h, dpr: dprCapped };
      centerRef.current = [0.5 * w, 0.5 * h];

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dprCapped);
      canvas.height = Math.floor(h * dprCapped);

      ctx.setTransform(dprCapped, 0, 0, dprCapped, 0, 0);
    };

    const renderFrame = () => {
      const { w, h } = dimsRef.current;
      tickRef.current += 1;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      // Additive particles give a good glow feel without full-canvas blur passes.
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      drawParticles(ctx, 1);
      ctx.restore();
    };

    applySize();
    initParticles();
    renderFrame();

    const onResize = () => {
      applySize();
      initParticles();
      renderFrame();
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [
    backgroundColor,
    baseHue,
    baseRadius,
    baseSpeed,
    drawParticles,
    dpr,
    initParticles,
    lowEnd,
    perfLow,
    underLoad,
    particleCount,
    rangeRadius,
    rangeSpeed,
    rangeY,
    reducedMotion,
    saveData,
  ]);

  const maxFps = perfLow ? 30 : 60;
  const animate = inView && !(reducedMotion || saveData || failsafe);

  useRafTask({
    id: "bg:vortex",
    maxFps,
    enabled: () => animate,
    cb: (_now, dt) => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const { w, h } = dimsRef.current;
      if (!w || !h) return;

      const dtNorm = Math.max(0, (dt || 0) / (1000 / 60));
      tickRef.current += dtNorm;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      drawParticles(ctx, dtNorm);
      ctx.restore();
    },
  });

  return (
    <div className={cn("relative h-full w-full", props.containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={containerRef}
        className="absolute h-full w-full inset-0 z-0 bg-transparent flex items-center justify-center"
      >
        <canvas ref={canvasRef}></canvas>
      </motion.div>

      <div className={cn("relative z-10", props.className)}>
        {props.children}
      </div>
    </div>
  );
};
