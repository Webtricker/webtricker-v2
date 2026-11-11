"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SLIDES = [
  { t: "Web & App Development", d: "Fast, scalable websites, headless builds, e-commerce and custom web apps.", href: "/services/web-development", c: "#7dd3fc" },
  { t: "Creative Design", d: "Brand, UI/UX and visual systems that look sharp and convert.", href: "/services", c: "#a78bfa" },
  { t: "Digital Growth & SEO", d: "Technical SEO, content and campaigns that bring qualified traffic.", href: "/services/seo-development", c: "#5eead4" },
];
const COLORS = ["#7dd3fc", "#a78bfa", "#5eead4", "#c4b5fd", "#67e8f9", "#f5b83d", "#93c5fd"];

/** Neon wave-tunnel scene: canvas ribbons + perspective grid + glass cubes, with cycling service titles. */
export default function WaveScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [i, setI] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStill(reduce);
    if (reduce) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % SLIDES.length), 3600);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = cv.current, host = wrap.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1 : 1.5);
    let W = 0, H = 0, raf = 0, visible = false;
    const N = small ? 5 : 8;
    const parts = Array.from({ length: small ? 36 : 70 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + 0.4, s: Math.random() * 0.00006 + 0.00002, p: Math.random() * 6 }));
    const cubes = Array.from({ length: small ? 4 : 7 }, () => ({ x: Math.random(), y: 0.2 + Math.random() * 0.6, s: 9 + Math.random() * 14, r: Math.random() * 3, v: (Math.random() - 0.5) * 0.0006, d: Math.random() * 0.00004 + 0.00002 }));

    const size = () => {
      const r = host.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const hz = H * 0.92;
      /* perspective grid floor */
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(125,211,252,.14)";
      ctx.beginPath();
      const cols = 22;
      for (let k = -cols; k <= cols; k++) { ctx.moveTo(W / 2, hz); ctx.lineTo(W / 2 + k * (W / 9), H); }
      const off = (t * 0.00035) % 1;
      for (let k = 0; k < 14; k++) { const f = Math.pow((k + off) / 14, 2.2); const y = hz + (H - hz) * f; ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();
      /* glow band at the horizon */
      const g = ctx.createLinearGradient(0, hz - H * 0.25, 0, hz + H * 0.1);
      g.addColorStop(0, "rgba(167,139,250,0)"); g.addColorStop(0.7, "rgba(125,211,252,.10)"); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.fillRect(0, hz - H * 0.25, W, H * 0.35);
      /* ribbons */
      ctx.globalCompositeOperation = "lighter";
      for (let n = 0; n < N; n++) {
        const col = COLORS[n % COLORS.length];
        const amp = H * (0.022 + (n % 4) * 0.009);
        const ph = n * 0.8, sp = 0.00045 + n * 0.00004;
        const path = new Path2D();
        const step = small ? 12 : 8;
        for (let x = 0; x <= W + step; x += step) {
          const u = x / W;
          const env = 0.55 + 0.45 * Math.sin(u * Math.PI);
          const y = H * 0.87 + Math.sin(u * 5.2 + t * sp + ph) * amp * env + Math.sin(u * 2.3 - t * sp * 0.7 + ph * 1.7) * amp * 0.6 + (n - N / 2) * H * 0.006;
          if (x === 0) path.moveTo(x, y); else path.lineTo(x, y);
        }
        ctx.lineWidth = 7; ctx.strokeStyle = col + "1f"; ctx.stroke(path);
        ctx.lineWidth = 1.6; ctx.strokeStyle = col + "cc"; ctx.shadowColor = col; ctx.shadowBlur = small ? 0 : 10; ctx.stroke(path); ctx.shadowBlur = 0;
      }
      ctx.globalCompositeOperation = "source-over";
      /* particles */
      for (const p of parts) {
        const y = (p.y - t * p.s * 0.6 + 1) % 1, x = (p.x + Math.sin(t * 0.0003 + p.p) * 0.01 + 1) % 1;
        ctx.globalAlpha = 0.35 + 0.4 * Math.sin(t * 0.002 + p.p);
        ctx.fillStyle = "#cfe9ff"; ctx.beginPath(); ctx.arc(x * W, y * H, p.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      /* glass cubes */
      ctx.lineWidth = 1.2;
      for (const c of cubes) {
        const x = (c.x + t * c.d + 1) % 1, y = c.y + Math.sin(t * 0.0006 + c.r) * 0.03, a = c.r + t * c.v;
        ctx.save(); ctx.translate(x * W, y * H); ctx.rotate(a);
        ctx.strokeStyle = "rgba(220,235,255,.45)"; ctx.fillStyle = "rgba(167,139,250,.08)";
        ctx.beginPath(); ctx.rect(-c.s / 2, -c.s / 2, c.s, c.s); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = "rgba(125,211,252,.35)"; ctx.beginPath(); ctx.rect(-c.s / 2 + c.s * 0.25, -c.s / 2 - c.s * 0.25, c.s, c.s); ctx.stroke();
        ctx.restore();
      }
    };

    const loop = (t: number) => { if (visible) frame(t); raf = requestAnimationFrame(loop); };
    size();
    if (reduce) { frame(4000); } else { raf = requestAnimationFrame(loop); }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "100px" });
    io.observe(host);
    const ro = new ResizeObserver(() => { size(); if (reduce) frame(4000); });
    ro.observe(host);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, []);

  const s = SLIDES[i];
  return (
    <section className="wavescene" aria-label="What we do">
      <div className="wavescene__stage" ref={wrap}>
        <canvas ref={cv} aria-hidden="true" />
        <div className="wavescene__vignette" aria-hidden="true" />
        <div className="wavescene__copy wrap">
          <span className="mono mute">What we do</span>
          {still ? (
            <ul className="wavescene__list">
              {SLIDES.map((x) => (
                <li key={x.t}><Link href={x.href}><b>{x.t}</b><span>{x.d}</span></Link></li>
              ))}
            </ul>
          ) : (
            <>
              <div className="wavescene__title" key={i} style={{ ["--c" as any]: s.c }}>
                <h2 className="h-xl">{s.t}</h2>
                <p>{s.d}</p>
                <Link className="pill" href={s.href}>Explore {s.t}</Link>
              </div>
              <div className="wavescene__dots" role="tablist" aria-label="Services">
                {SLIDES.map((x, k) => (
                  <button key={x.t} type="button" role="tab" aria-selected={k === i} aria-label={x.t} className={k === i ? "is-on" : ""} onClick={() => setI(k)} style={{ ["--c" as any]: x.c }} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
