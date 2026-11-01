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
