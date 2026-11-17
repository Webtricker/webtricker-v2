"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export type LifeItem = { src: string; alt: string; shape: "p" | "l" };

const SIZE = { p: [960, 1280], l: [680, 510] } as const;

/**
 * Infinite photo marquee: drifts right-to-left, speeds up / skews with the page scroll, can be dragged with inertia,
 * slows on hover, and each photo has a small parallax shift. Falls back to a plain scroll row for reduced motion.
 */
export default function LifeGallery({ items }: { items: LifeItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current, tr = track.current;
    if (!el || !tr) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const group = tr.firstElementChild as HTMLElement;
    const cards = Array.from(tr.querySelectorAll<HTMLElement>(".lifeg__card"));
    const imgs = cards.map((c) => c.querySelector("img") as HTMLElement);
    const setImg = imgs.map((i) => gsap.quickSetter(i, "x", "px"));
    const setX = gsap.quickSetter(tr, "x", "px");
    const skew = gsap.quickTo(tr, "skewX", { duration: 0.7, ease: "power3.out" });

    let W1 = 1, pos = 0, scrollVel = 0, lastY = window.scrollY, inertia = 0, dragging = false, hover = false, visible = false, mul = 1;
    const measure = () => { W1 = Math.max(1, group.getBoundingClientRect().width); };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(group);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; lastY = window.scrollY; }, { rootMargin: "120px" });
    io.observe(el);
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const mod = (a: number, n: number) => ((a % n) + n) % n;

    const tick = (_t: number, deltaMs: number) => {
      if (!visible) return;
      const d = clamp(deltaMs, 1, 64) / 1000;
      const y = window.scrollY, dy = y - lastY; lastY = y;
      scrollVel += (dy / d - scrollVel) * 0.08;
      mul += ((hover || dragging ? 0.12 : 1) - mul) * 0.08;
      if (!dragging) { pos += (52 * mul + scrollVel * 0.32) * d + inertia; inertia *= 0.94; }
      setX(-mod(pos, W1));
      skew(clamp(-scrollVel * 0.006, -7, 7));
      const vw = window.innerWidth;
      for (let i = 0; i < cards.length; i++) {
        const r = cards[i].getBoundingClientRect();
        if (r.right < -80 || r.left > vw + 80) continue;
        setImg[i](clamp(((r.left + r.width / 2 - vw / 2) / vw) * -70, -48, 48));
      }
    };
    gsap.ticker.add(tick);

    let lastX = 0;
    const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX; inertia = 0; el.setPointerCapture(e.pointerId); el.classList.add("is-drag"); };
    const move = (e: PointerEvent) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; pos -= dx; inertia = -dx * 0.9; };
    const up = (e: PointerEvent) => { if (!dragging) return; dragging = false; el.classList.remove("is-drag"); try { el.releasePointerCapture(e.pointerId); } catch {} };
    const enter = (e: PointerEvent) => { if (e.pointerType === "mouse") hover = true; };
    const leave = () => { hover = false; };
    el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    el.addEventListener("pointerenter", enter); el.addEventListener("pointerleave", leave);
    return () => {
      gsap.ticker.remove(tick); ro.disconnect(); io.disconnect();
      el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerenter", enter); el.removeEventListener("pointerleave", leave);
      gsap.set(tr, { clearProps: "x,skewX" });
    };
  }, []);

  return (
    <div className="lifeg" ref={root} data-cursor="Drag" role="group" aria-label="Photos from life at Webtricker">
      <div className="lifeg__track" ref={track}>
        {[0, 1].map((g) => (
          <div className="lifeg__group" key={g} aria-hidden={g ? "true" : undefined}>
            {items.map((it, i) => (
              <figure className={`lifeg__card lifeg__card--${it.shape}`} key={`${g}-${i}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.src} alt={g ? "" : it.alt} width={SIZE[it.shape][0]} height={SIZE[it.shape][1]} loading="lazy" decoding="async" draggable={false} />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
