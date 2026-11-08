"use client";
import { useEffect } from "react";

const GA_ID = "G-F53LQ46RXD";
const CLARITY_ID = "sljjh41puk";

/**
 * Loads Google Analytics and Microsoft Clarity only after the visitor first interacts with the page
 * (or after a short fallback delay). Keeps their ~1s of main-thread work out of the first-load
 * critical path, which is what Lighthouse and real users feel as Total Blocking Time.
 */
export default function DeferredAnalytics() {
  useEffect(() => {
    if (/^\/(settings|login)/.test(location.pathname)) return;
    let done = false;
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;

    const load = () => {
      if (done) return;
      done = true;
      events.forEach((e) => window.removeEventListener(e, load));
      clearTimeout(timer);

      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.gtag = function () {
        w.dataLayer.push(arguments);
      };
      w.gtag("js", new Date());
      w.gtag("config", GA_ID);
      const ga = document.createElement("script");
      ga.async = true;
      ga.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(ga);

      w.clarity =
        w.clarity ||
        function () {
          (w.clarity.q = w.clarity.q || []).push(arguments);
        };
      const cl = document.createElement("script");
      cl.async = true;
      cl.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
      document.head.appendChild(cl);
    };

    events.forEach((e) => window.addEventListener(e, load, { passive: true, once: true }));
    const timer = setTimeout(load, 8000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, load));
      clearTimeout(timer);
    };
  }, []);
  return null;
}
