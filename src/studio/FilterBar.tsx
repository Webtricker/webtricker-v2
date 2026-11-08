"use client";
import { useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Category filter. Cards are server-rendered with data-cat; this only toggles their `hidden` attribute. */
export default function FilterBar({
  items,
  gridId,
  itemSelector,
  label,
}: {
  items: { key: string; label: string; count?: number }[];
  gridId: string;
  itemSelector: string;
  label: string;
}) {
  const [active, setActive] = useState("all");

  const pick = (key: string) => {
    setActive(key);
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.classList.toggle("is-filtered", key !== "all");
    grid.querySelectorAll<HTMLElement>(itemSelector).forEach((c) => {
      c.hidden = !(key === "all" || c.dataset.cat === key);
    });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(`#${gridId} ${itemSelector}:not([hidden])`, { y: 40, opacity: 0.2 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "expo.out" });
    }
    ScrollTrigger.refresh();
  };

  return (
    <div className="filters" role="group" aria-label={label}>
      {items.map((it) => (
        <button key={it.key} className="tag" type="button" aria-pressed={active === it.key} onClick={() => pick(it.key)}>
          {it.label}
          {it.count != null ? <span className="mute"> {it.count}</span> : null}
        </button>
      ))}
    </div>
  );
}
