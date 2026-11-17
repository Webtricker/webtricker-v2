"use client";
import React, { useEffect, useState } from "react";

/** Footer group: plain heading + content on desktop; an accordion (closed by default) on phones. */
export default function FooterAcc({ title, children, id }: { title: string; children: React.ReactNode; id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`facc${open ? " is-open" : ""}`}>
      <button type="button" className="facc__btn mono mute" aria-expanded={open} aria-controls={`facc-${id}`} onClick={() => setOpen((v) => !v)}>
        <span>{title}</span>
        <i aria-hidden="true" />
      </button>
      <div className="facc__panel" id={`facc-${id}`}>
        <div className="facc__in">{children}</div>
      </div>
    </div>
  );
}

/** Current year, refreshed in the browser so statically generated pages never show an old one. */
export function CopyrightYear({ initial }: { initial: number }) {
  const [y, setY] = useState(initial);
  useEffect(() => setY(new Date().getFullYear()), []);
  return <>{y}</>;
}
