"use client";
import { useEffect, useRef } from "react";

/**
 * Glass bubbles with tech icons, drawn live on a canvas at the screen's real pixel density so
 * they stay razor sharp at any size (a video would be upscaled and soft). The video behind only
 * carries the dark background and light beams.
 */
const NAMES = ["nextdotjs", "wordpress", "shopify", "laravel", "javascript", "tailwindcss", "mongodb", "vuedotjs", "mysql", "css3", "api", "webdev"];
const TINT = ["200,210,255", "130,190,255", "160,225,110", "255,120,100", "255,225,90", "80,190,250", "90,215,120", "90,200,150", "80,170,225", "80,160,255", "190,170,255", "120,210,250"];
const COLS = [0.47, 0.63, 0.8, 0.9];
const SMALL = [
  { x: 0.7, y: 0.35, r: 16, k: 1, p: 0, t: "170,140,255" },
  { x: 0.85, y: 0.8, r: 22, k: 2, p: 2, t: "120,230,255" },
  { x: 0.55, y: 0.9, r: 12, k: 1, p: 4, t: "255,120,200" },
];
const PERIOD = 13.8; // seconds for one bubble to cross the screen
const TAU = Math.PI * 2;
const mod = (a: number, n: number) => ((a % n) + n) % n;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function HeroBubbles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bubbles = COLS.map((x, i) => ({ x, y: i / 4 + 0.06, r: 56 + ((i * 37) % 15), p: i * 1.7, big: i }));
    const icons: Record<string, HTMLImageElement> = {};
    NAMES.forEach((n) => {
      const img = new Image();
      img.decoding = "async";
      img.src = `/svgs/tech/${n}.svg`;
      icons[n] = img;
    });

    let W = 0, H = 0, dpr = 1, raf = 0, visible = true, paused = false, last = 0, clock = 0;
    const size = () => {
      const r = host.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (u: number) => {
      ctx.clearRect(0, 0, W, H);
      const scale = clamp(W / 1440, 0.62, 1.5);
      const list: any[] = [...bubbles, ...SMALL];
      for (const b of list) {
        const r = b.r * scale;
        const k = b.k || 1;
        const x = b.x * W + Math.sin(TAU * u * k + b.p) * 14 * scale;
        const y = mod(b.y - u * k, 1) * (H + r * 2) - r;
        const dk = clamp((x / W - 0.3) / 0.45, 0.22, 1); // darker on the left, near the text
        let tint = b.t as string | undefined;
        let icon: HTMLImageElement | null = null;
        if (b.big !== undefined) {
          const pass = mod(Math.floor(u - b.y), 3);
          const ix = (pass * 4 + b.big) % 12;
          tint = TINT[ix];
          icon = icons[NAMES[ix]];
        }
        ctx.globalAlpha = dk;
        const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.05, x, y, r);
        g.addColorStop(0, `rgba(255,255,255,${icon ? 0.34 : 0.3})`);
        g.addColorStop(0.5, `rgba(${tint},${icon ? 0.1 : 0.05})`);
        g.addColorStop(0.92, `rgba(${tint},0.26)`);
        g.addColorStop(1, `rgba(${tint},0.5)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.36)";
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,.6)";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.78, Math.PI * 1.1, Math.PI * 1.42);
        ctx.stroke();
        if (icon && icon.complete && icon.naturalWidth) {
          const s = clamp(40 * scale, 30, 56);
          ctx.shadowColor = `rgba(${tint},.85)`;
          ctx.shadowBlur = 16 * scale;
          ctx.drawImage(icon, x - s / 2, y - s / 2, s, s);
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (!visible || paused || document.hidden) return;
      clock += dt;
      draw(clock / PERIOD);
    };

    size();
    draw(0.35);
    if (!reduce) raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "50px" });
    io.observe(host);
    const ro = new ResizeObserver(() => { size(); draw(clock / PERIOD || 0.35); });
    ro.observe(host);
    // follows the hero "Pause" button
    const btn = document.getElementById("vidBtn");
    const onBtn = () => requestAnimationFrame(() => { paused = btn?.getAttribute("aria-pressed") === "true"; });
    btn?.addEventListener("click", onBtn);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      btn?.removeEventListener("click", onBtn);
    };
  }, []);

  return <canvas ref={ref} className="hero__bubbles" aria-hidden="true" />;
}
