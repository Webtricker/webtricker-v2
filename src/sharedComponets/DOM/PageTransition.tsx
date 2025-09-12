"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const greenOverlayRef = useRef<HTMLDivElement>(null);
  const blueOverlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const greenOverlay = greenOverlayRef.current;
    const blueOverlay = blueOverlayRef.current;
    const content = contentRef.current;

    if (!greenOverlay || !blueOverlay || !content) return;

    gsap.set(content, { opacity: 0 });
    gsap.set(greenOverlay, { x: 0 });
    gsap.set(blueOverlay, { y: 0 });

    const tl = gsap.timeline();

    tl.to(greenOverlay, {
      x: "100%",
      duration: 1.2,
      ease: "power2.inOut",
    })
      .to(blueOverlay, {
        y: "-100%",
        duration: 0.8,
        ease: "power2.inOut",
      })
      .to(content, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
  }, [pathname, mounted]);

  return (
    <>
      <div
        ref={greenOverlayRef}
        className="fixed inset-0 z-[99999] bg-[#546b27] pointer-events-none"
      />

      <div
        ref={blueOverlayRef}
        className="fixed inset-0 z-[9999] bg-[#aa013f] pointer-events-none"
      />

      <div ref={contentRef}>{children}</div>
    </>
  );
}
