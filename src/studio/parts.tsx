import React from "react";
import Link from "next/link";
import { MaskWords, Roll } from "./ui";

/* eslint-disable @next/next/no-img-element */

export const nameOf = (v: any): string => (typeof v === "string" ? v : v?.name || "");
export const initials = (n = "") =>
  n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

/** Page opener used by every inner page. */
export function PageHead({
  crumb,
  title,
  lead,
  cta,
  size,
}: {
  crumb: React.ReactNode;
  title: string;
  lead?: string;
  cta?: { href: string; label: string };
  size?: string;
}) {
  return (
    <section className="pagehead">
      <div className="wrap">
        <div className="pagehead__crumb mono mute">{crumb}</div>
        <div className={lead ? "pagehead__grid" : undefined}>
          <h1 className="h-xl page-title" aria-label={title} style={size ? { fontSize: size } : undefined}>
            <MaskWords text={title} />
          </h1>
          {lead ? (
            <div style={{ display: "grid", gap: 24, justifyItems: "start" }}>
              <p className="lead">{lead}</p>
              {cta ? (
                <Link className="pill magnetic" href={cta.href}>
                  <Roll>{cta.label}</Roll>
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Full-width cover under the page opener. Video sources render as a muted loop. */
export function Bleed({
  src,
  type,
  alt = "",
  height,
}: {
  src?: string;
  type?: string;
  alt?: string;
  height?: string;
}) {
  if (!src) return null;
  const isVideo = type === "video" || /\.(mp4|webm)(\?|$)/i.test(src) || /\/video\/upload\//.test(src);
  return (
    <div className="media media--par bleed" style={height ? { height } : undefined}>
      {isVideo ? (
        <video src={src} muted loop playsInline autoPlay preload="metadata" style={{ width: "100%", height: "118%", marginTop: "-9%", objectFit: "cover" }} />
      ) : (
        <img src={src} alt={alt} loading="lazy" />
      )}
    </div>
  );
}

export function Person({ p }: { p: { name: string; role?: string; profile?: string } }) {
  return (
    <div className="person">
      <div className="person__card tilt">
        {p.profile ? <img src={p.profile} alt={p.name} loading="lazy" /> : null}
        <b>{initials(p.name)}</b>
      </div>
      <h3>{p.name}</h3>
      <span className="mono mute">{p.role}</span>
    </div>
  );
}

export function Testimonials({ list }: { list: any[] }) {
  if (!list?.length) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="tslider">
      <div className="tslider__stage" aria-live="polite">
        {list.map((t, i) => (
          <figure className={`q${i === 0 ? " is-on" : ""}`} key={t._id || i} aria-hidden={i ? "true" : undefined}>
            <figcaption>
              <span className="avatar">{t.profile ? <img src={t.profile} alt="" loading="lazy" /> : initials(t.name)}</span>
              <b>{t.name}</b>
              <span className="mono mute">{t.role}</span>
            </figcaption>
            <blockquote>{t.review}</blockquote>
          </figure>
        ))}
      </div>
      <div className="tslider__nav">
        <button className="tsb" type="button" data-d="-1" aria-label="Previous testimonial">
          ←
        </button>
        <button className="tsb" type="button" data-d="1" aria-label="Next testimonial">
          →
        </button>
        <div className="tslider__dots">
          {list.map((_, i) => (
            <i key={i} className={i ? undefined : "is-on"} />
          ))}
        </div>
        <span className="tslider__count mono mute">01 / {pad(list.length)}</span>
      </div>
    </div>
  );
}

export function Stats({ an }: { an: any }) {
  if (!an) return null;
  const stats = [
    { n: an.projectsCompleted, s: "+", l: an.projectsCompletedText },
    { n: an.yearsOfExperience, s: "+", l: an.yearsOfExperienceText },
    { n: an.teamMembers, s: "+", l: an.teamMembersText },
    { n: an.growingRate, s: "%", l: an.growingRateText },
  ];
  return (
    <div className="nums">
      {stats.map((s) => (
        <div className="num" key={s.l}>
          <b>
            <span data-count={s.n}>{s.n}</span>
            <sup>{s.s}</sup>
          </b>
          <span className="mono mute">{s.l}</span>
        </div>
      ))}
    </div>
  );
}

/** Previous / next card pair at the foot of detail pages. */
export function PrevNext({
  prev,
  next,
  label,
  listHref,
}: {
  prev?: { href: string; title: string } | null;
  next?: { href: string; title: string } | null;
  label: string;
  listHref?: string;
}) {
  return (
    <div className="pn" style={{ marginTop: 64 }}>
      {prev ? (
        <Link className="glass" href={prev.href}>
          <span className="mono mute">← Previous {label}</span>
          <strong>{prev.title}</strong>
        </Link>
      ) : listHref ? (
        <Link className="glass" href={listHref}>
          <span className="mono mute">← All {label}s</span>
          <strong>Back to the list</strong>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="glass" href={next.href} style={{ textAlign: "right" }}>
          <span className="mono mute">Next {label} →</span>
          <strong>{next.title}</strong>
        </Link>
      ) : null}
    </div>
  );
}
