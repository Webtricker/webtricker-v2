"use client";
import { useEffect, useState } from "react";

/** "On this page" list built from the headings inside the article body. */
export default function TocNav({ label = "On this page" }: { label?: string }) {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    const prose = document.querySelector(".stu .prose");
    if (!prose) return;
    const hs = Array.from(prose.querySelectorAll<HTMLElement>("h2, h3, h4, h5")).filter((h) => (h.textContent || "").trim());
    setItems(
      hs.slice(0, 24).map((h, i) => {
        if (!h.id) h.id = `sec-${i + 1}`;
        return { id: h.id, text: (h.textContent || "").trim() };
      })
    );
  }, []);

  if (!items.length) return <div className="mono mute">{label}</div>;
  return (
    <>
      <div className="mono mute">{label}</div>
      <nav>
        {items.map((it, i) => (
          <a key={it.id} href={`#${it.id}`} data-scroll={`#${it.id}`}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {it.text.replace(/^\d+\.\s*/, "")}
          </a>
        ))}
      </nav>
    </>
  );
}
