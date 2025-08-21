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
  const slicesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const slices = slicesRef.current?.children;
    const content = contentRef.current;

    if (!slices || !content) return;

    gsap.set(content, { opacity: 0 });

    const tl = gsap.timeline();

    tl.fromTo(
      slices,
      {
        scaleY: 0,
        transformOrigin: "center center",
      },
      {
        scaleY: 1,
        duration: 0.4,
        stagger: 0.15,
        ease: "power2.out",
        transformOrigin: "center center",
      },
      "+=0.1"
    )
      .to({}, { duration: 0.3 })
      .to(slices, {
        scaleY: 0,
        duration: 0.3,
        stagger: 0.1,
        ease: "power2.in",
        transformOrigin: "center center",
      })
      .to(
        content,
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.4"
      );
  }, [pathname, mounted]);

  return (
    <>
      {/* Slice overlay */}
      <div
        ref={slicesRef}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ mixBlendMode: "normal" }}
      >
        {/* Left outer diagonal of W - Lime */}
        <div
          className="absolute top-0 left-0 w-1/4 h-full origin-center"
          style={{
            backgroundColor: "#84cc16",
            transform: "skewX(20deg)",
          }}
        />
        {/* Left inner diagonal of W - Sky Blue */}
        <div
          className="absolute top-0 left-1/4 w-1/4 h-full origin-center"
          style={{
            backgroundColor: "#0ea5e9",
            transform: "skewX(-20deg)",
          }}
        />
        {/* Right inner diagonal of W - Yellow */}
        <div
          className="absolute top-0 right-1/4 w-1/4 h-full origin-center"
          style={{
            backgroundColor: "#eab308",
            transform: "skewX(20deg)",
          }}
        />
        {/* Right outer diagonal of W - Lime */}
        <div
          className="absolute top-0 right-0 w-1/4 h-full origin-center"
          style={{
            backgroundColor: "#84cc16",
            transform: "skewX(-20deg)",
          }}
        />
      </div>

      {/* Page content */}
      <div ref={contentRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </>
  );
}
