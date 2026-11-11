import React from "react";

export const pad = (n: number) => String(n).padStart(2, "0");

export const Arrow = () => (
  <span className="arrow">
    <svg viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  </span>
);

export const ArrowUp = () => (
  <span className="arrow">
    <svg viewBox="0 0 24 24">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  </span>
);

/** Button label that slides up on hover (the design's text-roll). */
export const Roll = ({ children }: { children: string }) => (
  <span className="roll">
    <span className="roll__a">{children}</span>
    <span className="roll__b" aria-hidden="true">
      {children}
    </span>
  </span>
);

/** Letter-by-letter spans so the hero can animate each character. */
export const Chars = ({ text }: { text: string }) => (
  <>
    {text.split("").map((c, i) => (
      <span className="ch" key={i}>
        {c === " " ? " " : c}
      </span>
    ))}
  </>
);

/** Heading words wrapped in masks for the scroll reveal. */
export const MaskWords = ({ text }: { text: string }) => {
  const words = text.trim().split(/\s+/);
  return (
    <>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span
            className="lmask"
            style={{ display: "inline-block" }}
            aria-hidden="true"
          >
            <span className="ch">{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </>
  );
};

/** Manifesto words that fade in as you scroll. */
export const FadeWords = ({
  text,
  highlight = [],
}: {
  text: string;
  highlight?: string[];
}) => {
  const words = text.trim().split(/\s+/);
  return (
    <>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className={`w${highlight.includes(w) ? " hi" : ""}`}>{w}</span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </>
  );
};

export const stripHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

export const fmtDate = (d?: string | Date) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const SERVICE_ORDER: [string, string][] = [
  ["web-development", "Web Development"],
  ["wordpress-development", "WordPress Development"],
  ["shopify-development", "Shopify Development"],
  ["other-cms-development", "Other CMS Development"],
  ["mern-stack-development", "MERN Stack Development"],
  ["api-development", "API Development"],
  ["web-app-development", "Web App Development"],
  ["seo-development", "SEO Development"],
  ["digital-marketing", "Digital Marketing"],
  ["training", "Training"],
];

/** Fixed service order and display names; unknown services keep their place at the end. */
export function orderServices(list: any[]): any[] {
  const rank = (s: any) => {
    const i = SERVICE_ORDER.findIndex(([slug]) => slug === s.slug);
    return i < 0 ? 999 : i;
  };
  return [...list]
    .sort((a, b) => rank(a) - rank(b))
    .map((s) => {
      const m = SERVICE_ORDER.find(([slug]) => slug === s.slug);
      return m ? { ...s, title: m[1] } : s;
    });
}

/** Cloudinary delivery: serve a right-sized, modern-format copy (f_auto = WebP/AVIF, q_auto) instead of the multi-MB original. */
export const cld = (url?: string, w = 1000): string => {
  if (!url || !/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(url)) return url || "";
  if (/\/upload\/[^/]*(f_auto|q_auto|w_\d+)/.test(url)) return url;
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,w_${w},c_limit/`);
};

/** Project screenshots are tall full-page captures: crop to the top (nav + hero) at the card ratio. */
export const cldTop = (url?: string, w = 900, h = 620): string => {
  if (!url || !/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(url)) return url || "";
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,w_${w},h_${h},c_fill,g_north/`);
};
