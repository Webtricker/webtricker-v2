import Link from "next/link";
import ServiceArt, { hasArt } from "../ServiceArt";
import {
  getAboutPageData,
  getHomePageData,
  getLeaderData,
  getPortfoliosData,
  getPostsData,
  getServicesData,
  getTestimonialsData,
} from "@/utils/pageData";
import { getSiteConfig, getFooter } from "../data";
import { cld, cldTop, ArrowUp, Chars, FadeWords, Roll, fmtDate, orderServices, pad, stripHtml } from "../ui";

/* eslint-disable @next/next/no-img-element */

const GEM_COLORS = ["--crimson", "--amber", "--green", "--blue", "--sky"];

const nameOf = (v: any): string => (typeof v === "string" ? v : v?.name || "");
const initials = (n = "") =>
  n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

/** "Our newest articles" -> "Our newest <em>articles</em>" */
const ItalLast = ({ text }: { text: string }) => {
  const w = text.trim().split(/\s+/);
  if (w.length < 2) return <em className="ital">{text}</em>;
  return (
    <>
      {w.slice(0, -1).join(" ")} <em className="ital">{w[w.length - 1]}</em>
    </>
  );
};

export default async function HomeStudio() {
  const [home, services, portfolios, posts, testimonials, leaders, about, site, footer] =
    await Promise.all([
      getHomePageData(),
      getServicesData(10),
      getPortfoliosData(12),
      getPostsData(8),
      getTestimonialsData(),
      getLeaderData(),
      getAboutPageData(),
      getSiteConfig(),
      getFooter(),
    ]);

  const h: any = home || {};
  const kicker = [h.greeting?.top, h.greeting?.bottom].filter(Boolean).join(" ");
  const bt = h.bannerText || {};
  const kickerFull = `${kicker} a ${[bt.top, bt.left, bt.right].filter(Boolean).join(" ")}`.trim();
  const offices: any[] = site?.offices ?? [];
  /* hero background: the supplied design hero video (public/videos/hero.mp4) */
  const media = { src: "/videos/hero.mp4", type: "video" };

  /* manifesto: the "we are here to assist" sentence from the footer copy + the closing lines of the banner copy */
  const assist = (footer?.description || "").match(/We are here to assist you with .*?SEO/)?.[0];
  const tail = (h.bannerDescription || "").split(/(?<=\.)\s+/).slice(1).join(" ");
  const manifesto = assist ? `${assist}. ${tail}`.trim() : h.bannerDescription || "";

  const svc = orderServices((services as any[]) || []);
  const work = (portfolios as any[]) || [];
  const blog = (posts as any[]) || [];
  const techs: any[] = h.technologies || [];
  const half = Math.ceil(techs.length / 2);
  const clients: string[] = h.clientsBanners || [];
  const an = about?.aboutUsAnalytics;
  const leadersShown = ((leaders as any[]) || []).slice(0, 3);
  const tList = (testimonials as any[]) || [];

  const catOf = (p: any) => nameOf(p.technology) || "Project";
  const stats = an
    ? [
        { n: an.projectsCompleted, s: "+", l: an.projectsCompletedText },
        { n: an.yearsOfExperience, s: "+", l: an.yearsOfExperienceText },
        { n: an.teamMembers, s: "+", l: an.teamMembersText },
        { n: an.growingRate, s: "%", l: an.growingRateText },
      ]
    : [];

  return (
    <main className="page" data-page="home">
      {/* HERO */}
      <section className="hero v5hero v5hero--video">
        <div className="hero__video" aria-hidden="true">
          {media?.type === "video" ? (
            <video id="heroVid" src={media.src} poster="/videos/hero-poster.webp" muted loop playsInline autoPlay preload="metadata" />
          ) : media?.src ? (
            <img src={media.src} alt="" />
          ) : null}
          <div className="hero__shade" />
        </div>
        {media?.type === "video" ? (
          <button className="vidbtn mono" id="vidBtn" type="button" aria-pressed="false" aria-label="Pause background video">
            <i />
            <span>Pause</span>
          </button>
        ) : null}
        <div className="wrap">
          <div className="hero__kicker mono">{kickerFull}</div>
          <h1 className="v5h1" aria-label="We design, develop & deliver pixel-perfect websites.">
            <span className="hl" aria-hidden="true">
              <Chars text="We design, develop" />
            </span>
            <span className="hl" aria-hidden="true">
              <Chars text="& deliver" />
            </span>
            <span className="hl" aria-hidden="true">
              <em className="ital">
                <Chars text="pixel-perfect" />
              </em>
            </span>
            <span className="hl" aria-hidden="true">
              <Chars text="websites." />
            </span>
          </h1>
          <div className="hero__foot">
            <p className="lead">{h.bannerDescription}</p>
            <div className="clock">
              {offices.slice(0, 2).map((o: any, i: number) => (
                <span key={o.label}>
                  <b>{o.locality}{o.region && i === 0 ? `, ${o.region}` : ""}</b>
                  <br />
                  <span data-tz={o.openingHours?.[0]?.timezone || (i === 0 ? "America/New_York" : "Asia/Dhaka")}>--:--</span>
                  {i === 0 ? <br /> : null}
                </span>
              ))}
            </div>
            <div style={{ display: "grid", gap: 18, justifyItems: "start" }}>
              <Link className="pill pill--solid magnetic" href="/contact">
                <i />
                <Roll>Have a project in mind?</Roll>
              </Link>
              <a className="scrollcue mono" href="#manifesto" data-scroll="#manifesto">
                <i />
                Scroll to explore
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      {clients.length ? (
        <div className="wrap">
          <div className="clients" aria-label={h.clientSectionSubtitle}>
            <span className="mono mute" style={{ flex: "none" }}>
              {h.clientSectionSubtitle}
            </span>
            <div style={{ overflow: "hidden", flex: 1, minWidth: 0 }}>
              <div className="clients__track">
                {[...clients, ...clients].map((src, i) => (
                  <span key={i} aria-hidden={i >= clients.length ? "true" : undefined}>
                    <img decoding="async" src={cld(src, 1000)} alt="" loading="lazy" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* MANIFESTO */}
      <section className="chapter manifesto" id="manifesto">
        <div className="wrap v5split">
          <span className="mono mute">(00) {about?.whyUsText || "Why Us"} ?</span>
          <p>
            <FadeWords text={manifesto} highlight={["passionate,", "detail-driven,", "mind?"]} />
          </p>
        </div>
      </section>

      {/* SERVICES STACK */}
      <section className="chapter v5svc" id="reel" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="v5head">
            <span className="mono mute">(01) Services</span>
            <h2 className="h-lg">
              {h.serviceSectionTitle?.large} <em className="ital">{(h.serviceSectionTitle?.medium || "").toLowerCase()}</em>
            </h2>
            <div style={{ display: "grid", gap: 18, justifyItems: "start" }}>
              <p className="lead" style={{ maxWidth: "22em" }}>
                {h.serviceSectionTitle?.small}
              </p>
              <Link className="pill magnetic" href="/services">
                <Roll>{h.allServiceBtnText || "See All Services"}</Roll>
              </Link>
            </div>
          </div>
          <div className="v5stack" id="reelTrack">
            {svc.map((s, i) => {
              const tags = [...(s.tags || []).map(nameOf), ...(s.subServices || []), ...(s.category ? [s.category] : [])].filter((t) => t && String(t).length <= 26).slice(0, 4); /* short labels only: long sentences from the CMS are not tags */
              return (
                <Link className="panel glass" href={`/services/${s.slug}`} key={s._id || s.slug} style={{ ["--c" as any]: `var(${GEM_COLORS[i % GEM_COLORS.length]})` }}>
                  <div className="media">
                    {hasArt(s.slug) ? <ServiceArt slug={s.slug} label={s.thumbnailAlt || s.title} /> : <img decoding="async" src={cld(s.thumnail?.url || s.icon, 1000)} alt={s.thumbnailAlt || s.title} loading="lazy" />}
                  </div>
                  <div className="panel__top">
                    <span className="mono mute">
                      {pad(i + 1)} / {pad(svc.length)}
                    </span>
                    <span className="gem" />
                  </div>
                  <h3>{s.title}</h3>
                  <div style={{ display: "grid", gap: 14, alignContent: "end" }}>
                    <p>{s.excerpt || stripHtml(s.description)}</p>
                    {tags.length ? (
                      <div className="tags">
                        {tags.map((t: string) => (
                          <span className="tag" key={t}>
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="mq" aria-label="Coolest Project">
        <div className="mq__track">
          {[0, 1, 2, 3].map((k) => (
            <span className="mq__item" key={k} aria-hidden={k > 1 ? "true" : undefined}>
              Coolest <em>Project</em>
              <i />
            </span>
          ))}
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="chapter">
        <div className="wrap v5head">
          <span className="mono mute">(02) Selected work</span>
          <h2 className="h-lg">
            Coolest <em className="ital">projects</em>
          </h2>
          <div className="v5nav">
            <button className="tsb" type="button" id="wkPrev" aria-label="Previous project">
              &larr;
            </button>
            <button className="tsb" type="button" id="wkNext" aria-label="Next project">
              &rarr;
            </button>
          </div>
        </div>
        <div className="swiper v5work" id="wkSwiper" data-cursor="Drag">
          <div className="swiper-wrapper" id="wkWrap">
            {work.map((p, i) => (
              <div className="swiper-slide" key={p._id || p.slug}>
                <Link className="wk" href={`/portfolio/${p.slug}`}>
                  <div className="wk__img">
                    <img decoding="async" src={cldTop(p.coverImage?.url || p.thumnail?.url, 900, 620)} alt={p.title} loading="lazy" draggable={false} />
                  </div>
                  <div className="wk__meta">
                    <h3>{p.title}</h3>
                    <span className="mono mute">
                      {pad(i + 1)} · {catOf(p)}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="wrap">
          <div className="v5bar">
            <i id="wkBar" />
          </div>
        </div>
        <div className="wrap" style={{ marginTop: "clamp(80px, 10vw, 140px)" }}>
          <div className="eyebrow mono mute">
            <span>Project index</span>
            <span>{work.length} projects</span>
          </div>
          <ul className="work" id="homeWork">
            {work.slice(0, 6).map((p, i) => (
              <li key={p._id || p.slug}>
                <Link href={`/portfolio/${p.slug}`} data-preview={p.thumnail?.url || p.coverImage?.url}>
                  <span className="mono mute">{pad(i + 1)}</span>
                  <span className="work__name">{p.title}</span>
                  <span className="work__meta mono mute">{catOf(p)}</span>
                  <ArrowUp />
                </Link>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 48 }}>
            <Link className="pill magnetic" href="/portfolio">
              <Roll>{h.allProjectBtnText || "View All Projects"}</Roll>
            </Link>
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      {techs.length ? (
        <section className="chapter" style={{ paddingTop: 0 }}>
          <div className="wrap v5head">
            <span className="mono mute">(03) Stack</span>
            <h2 className="h-lg">
              <ItalLast text={h.technologoySectionTitle || "Technologies we are experts in"} />
            </h2>
            <span />
          </div>
          <div className="tmq">
            {[techs.slice(0, half), techs.slice(half)].map((row, r) => (
              <div className={`tmq__row${r ? " tmq__row--rev" : ""}`} key={r}>
                {[0, 1].map((copy) =>
                  row.map((t: any, i: number) => (
                    <span key={`${copy}-${i}`} aria-hidden={copy ? "true" : undefined}>
                      <img decoding="async" src={cld(t.icon, 120)} alt="" loading="lazy" />
                      {t.name}
                    </span>
                  ))
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* FACTS / TESTIMONIALS / LEADERS */}
      <section className="chapter" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {stats.length ? (
            <>
              <div className="v5head">
                <span className="mono mute">(04) {an.subTitle}</span>
                <h2 className="h-lg">
                  <ItalLast text={an.title} />
                </h2>
                <span />
              </div>
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
            </>
          ) : null}

          {tList.length ? (
            <div style={{ marginTop: "clamp(96px, 12vw, 170px)" }}>
              <div className="v5head">
                <span className="mono mute">(05) From Our Clients</span>
                <h2 className="h-lg">
                  Kind <em className="ital">words</em>
                </h2>
                <span />
              </div>
              <div className="tslider">
                <div className="tslider__stage" aria-live="polite">
                  {tList.map((t, i) => (
                    <figure className={`q${i === 0 ? " is-on" : ""}`} key={t._id || i} aria-hidden={i ? "true" : undefined}>
                      <figcaption>
                        <span className="avatar">
                          {t.profile ? <img decoding="async" src={cld(t.profile, 160)} alt="" loading="lazy" /> : initials(t.name)}
                        </span>
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
                    {tList.map((_, i) => (
                      <i key={i} className={i ? undefined : "is-on"} />
                    ))}
                  </div>
                  <span className="tslider__count mono mute">01 / {pad(tList.length)}</span>
                </div>
              </div>
            </div>
          ) : null}

          {leadersShown.length ? (
            <div style={{ marginTop: "clamp(96px, 12vw, 170px)" }}>
              <div className="eyebrow mono mute">
                <span>{h.leadersSectionTitle || "Our Leaders"}</span>
                <Link href="/about" className="mono">
                  Meet the team &rarr;
                </Link>
              </div>
              <div className="team" id="homeLeaders">
                {leadersShown.map((p: any) => (
                  <div className="person" key={p._id || p.name}>
                    <div className="person__card tilt">
                      {p.profile ? <img decoding="async" src={cld(p.profile, 240)} alt={p.name} loading="lazy" /> : null}
                      {!p.profile ? <b>{initials(p.name)}</b> : null}
                    </div>
                    <h3>{p.name}</h3>
                    <span className="mono mute">{p.role}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* BLOG */}
      {blog.length ? (
        <section className="chapter" style={{ paddingTop: 0 }}>
          <div className="wrap v5head">
            <span className="mono mute">
              (06) {h.blogSectionTitle?.large} · {h.blogSectionTitle?.medium}
            </span>
            <h2 className="h-lg">
              <ItalLast text={h.blogSectionTitle?.small || "Our newest articles"} />
            </h2>
            <div className="v5nav">
              <button className="tsb" type="button" id="blPrev" aria-label="Previous article">
                &larr;
              </button>
              <button className="tsb" type="button" id="blNext" aria-label="Next article">
                &rarr;
              </button>
            </div>
          </div>
          <div className="swiper v5blog" id="blSwiper" data-cursor="Drag">
            <div className="swiper-wrapper" id="homePosts">
              {blog.map((p, i) => (
                <div className="swiper-slide" key={p._id || p.slug}>
                  <Link className="post" href={`/blog/${p.slug}`}>
                    <div className="media">
                      <img decoding="async" src={cld(p.thumnail?.url, 1000)} alt={p.title} loading="lazy" />
                    </div>
                    <div className="post__meta">
                      <span className="mono" style={{ color: `var(${GEM_COLORS[i % GEM_COLORS.length]})` }}>
                        {nameOf(p.category)}
                      </span>
                      <span className="mono mute">{fmtDate(p.createdAt)}</span>
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.excerp || stripHtml(p.description)}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="wrap" style={{ marginTop: 40 }}>
            <Link className="pill magnetic" href="/blog">
              <Roll>All articles</Roll>
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
