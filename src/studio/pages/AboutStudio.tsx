import { getAboutPageData, getTeamData, getTestimonialsData } from "@/utils/pageData";
import { Bleed, PageHead, Person, Stats, Testimonials } from "../parts";

/* eslint-disable @next/next/no-img-element */

export default async function AboutStudio() {
  const [a, team, testimonials] = await Promise.all([getAboutPageData(), getTeamData(), getTestimonialsData()]);
  const p: any = a || {};
  const intro: string = p.introText || "";
  const em = intro.match(/high-quality design and branding solutions/i)?.[0];
  const [before, after] = em ? intro.split(em) : [intro, ""];
  const rows = [
    [p.ourMissionText, p.ourMissionDescription],
    [p.ourGoalsText, p.ourGoalsDescription],
    [p.whyUsText, p.whyUsDescription],
    [p.whatWeOfferTitle, (p.whatWeOfferItems || []).join(" · ")],
  ].filter((r) => r[0]);
  const ii = p.introImages || {};

  return (
    <main className="page" data-page="about">
      <PageHead
        crumb={`About · ${[p.bannerIntroText?.top, p.bannerIntroText?.bottom].filter(Boolean).join(" ")}`}
        title={p.bannerLargeText}
        lead={[p.bannerDescription, p.bannerBottomText].filter(Boolean).join(" ")}
        cta={p.bannerBottomBtnText ? { href: p.bannerBottomBtnLink || "/services", label: p.bannerBottomBtnText } : undefined}
      />
      <Bleed src={p.bannerBackgroundImage} alt={p.bannerLargeText} />

      <section className="chapter">
        <div className="wrap">
          <p className="statement">
            {before}
            {em ? <em>{em}</em> : null}
            {after}
          </p>
          <div className="collage" style={{ marginTop: "clamp(64px, 8vw, 120px)" }}>
            {[ii.large, ii.medium, ii.small].filter(Boolean).map((src: string, i: number) => (
              <div className="media media--par" key={i}>
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="chapter" style={{ paddingTop: 0 }}>
        <div className="wrap sticky2">
          <div className="sticky2__side">
            <div className="mono mute">Who we are</div>
            <h2 className="h-lg">{p.aboutUsText}</h2>
            <p className="lead">{p.aboutUsDescription}</p>
            {p.aboutUsImage ? (
              <div className="media">
                <img src={p.aboutUsImage} alt="" loading="lazy" />
              </div>
            ) : null}
          </div>
          <div className="rows">
            {rows.map((r, i) => (
              <div key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{r[0]}</h3>
                <p>{r[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {p.aboutUsAnalytics ? (
        <section className="chapter" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="eyebrow mono mute">
              <span>{p.aboutUsAnalytics.title}</span>
              <span>{p.aboutUsAnalytics.subTitle}</span>
            </div>
            <Stats an={p.aboutUsAnalytics} />
          </div>
        </section>
      ) : null}

      <section className="chapter" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="eyebrow mono mute">
            <span>{p.teamInfoTitle || "Our Team"}</span>
            <span>{(team as any[]).length} people</span>
          </div>
          <div className="swiper v5team" id="teamSwiper" data-cursor="Drag" data-people={(team as any[]).length}>
            <div className="swiper-wrapper">
              {/* listed twice so the slider can loop seamlessly with few people; the second set is hidden from assistive tech */}
              {[...(team as any[]), ...(team as any[])].map((m, i) => (
                <div className="swiper-slide" key={`${m._id || m.name}-${i}`} aria-hidden={i >= (team as any[]).length ? "true" : undefined}>
                  <Person p={m} />
                </div>
              ))}
            </div>
          </div>
          <div className="eyebrow mono mute" style={{ marginTop: "clamp(80px, 10vw, 140px)", marginBottom: 0 }}>
            <span>From Our Clients</span>
            <span>Testimonials</span>
          </div>
          <Testimonials list={testimonials as any[]} />
        </div>
      </section>
    </main>
  );
}
