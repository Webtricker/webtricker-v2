"use client";

import type React from "react";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const slicesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const slices = slicesRef.current?.children;
    const content = contentRef.current;

    if (!slices || !content) return;

    gsap.set(slices, {
      scaleY: 0,
      transformOrigin: "center center",
    });
    gsap.set(content, { opacity: 0 });

    const tl = gsap.timeline();

    tl.to(slices, {
      scaleY: 1,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out",
      transformOrigin: "center center",
    })
      .to(
        slices,
        {
          scaleY: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.in",
          transformOrigin: "center center",
        },
        "+=0.1"
      )
      .to(
        content,
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.3"
      );
  }, [pathname]);

  return (
    <>
      <div
        ref={slicesRef}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ mixBlendMode: "normal" }}
      >
        <div
          className="absolute top-0 left-0 w-1/4 h-full origin-center"
          style={{
            backgroundColor: "#84cc16",
            transform: "skewX(20deg)",
          }}
        />
        <div
          className="absolute top-0 left-1/4 w-1/4 h-full origin-center"
          style={{
            backgroundColor: "#0ea5e9",
            transform: "skewX(-20deg)",
          }}
        />
        <div
          className="absolute top-0 right-1/4 w-1/4 h-full origin-center"
          style={{
            backgroundColor: "#eab308",
            transform: "skewX(20deg)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-1/4 h-full origin-center"
          style={{
            backgroundColor: "#84cc16",
            transform: "skewX(-20deg)",
          }}
        />
      </div>

      {/* Page content */}
      <div ref={contentRef}>{children}</div>
    </>
  );
}
