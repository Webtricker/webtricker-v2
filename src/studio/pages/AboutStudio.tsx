import { getAboutPageData, getLeaderData, getTeamData, getTestimonialsData } from "@/utils/pageData";
import { PageHead, Person, Stats, Testimonials } from "../parts";
import { cld, FadeWords } from "../ui";

/* eslint-disable @next/next/no-img-element */

export default async function AboutStudio() {
  const [a, teamRaw, leaders, testimonials] = await Promise.all([getAboutPageData(), getTeamData(), getLeaderData(), getTestimonialsData()]);
  /* one team list: the leaders first (same photo and role as the home page), then everyone else; a person in both lists appears once */
  const norm = (s: string) => String(s || "").toLowerCase().replace(/\bmd\b\.?/g, "").replace(/[^a-z]/g, "");
  const lead = ((leaders as any[]) || []).map((l) => ({ _id: l._id, name: l.name, role: l.role, profile: l.profile }));
  const seen = new Set(lead.map((l) => norm(l.name)));
  const team: any[] = [...lead, ...((teamRaw as any[]) || []).filter((m) => !seen.has(norm(m.name)))];
  const p: any = a || {};
  const intro: string = p.introText || "";
  const em = intro.match(/high-quality design and branding solutions/i)?.[0];
  const rows = [
    [p.ourMissionText, p.ourMissionDescription],
    [p.ourGoalsText, p.ourGoalsDescription],
    [p.whyUsText, p.whyUsDescription],
    [p.whatWeOfferTitle, (p.whatWeOfferItems || []).join(" · ")],
  ].filter((r) => r[0]);
  const ii = p.introImages || {};

  return (
    <main className="page" data-page="about">
      <PageHead video="about"
        crumb={`About · ${[p.bannerIntroText?.top, p.bannerIntroText?.bottom].filter(Boolean).join(" ")}`}
        title={p.bannerLargeText}
        lead={[p.bannerDescription, p.bannerBottomText].filter(Boolean).join(" ")}
        cta={p.bannerBottomBtnText ? { href: p.bannerBottomBtnLink || "/services", label: p.bannerBottomBtnText } : undefined}
      />

      <section className="chapter">
        <div className="wrap">
          <p className="statement"><FadeWords text={intro} highlight={em ? em.split(/\s+/) : []} /></p>
          <div className="collage" style={{ marginTop: "clamp(64px, 8vw, 120px)" }}>
            {[ii.large, ii.medium, ii.small].filter(Boolean).map((src: string, i: number) => (
              <div className="media media--par" key={i}>
                <img decoding="async" src={cld(src, 1200)} alt="" loading="lazy" />
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
                <img decoding="async" src={cld(p.aboutUsImage, 1000)} alt="" loading="lazy" />
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
          <div className="teamrun" style={{ ["--n" as any]: team.length }} role="list" aria-label="Our team">
            <div className="teamrun__track">
              {[0, 1].map((g) => (
                <div className="teamrun__group" key={g}>
                  {[0, 1].map((c) =>
                    team.map((m: any) => (
                      <div className="teamrun__item" role="listitem" key={`${g}-${c}-${m._id || m.name}`} aria-hidden={g || c ? "true" : undefined}>
                        <Person p={m} w={560} />
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="eyebrow mono mute" style={{ marginTop: "clamp(80px, 10vw, 140px)" }}>
            <span>Life at Webtricker</span>
            <span>Our team at work</span>
          </div>
          <div className="officegrid">
            {[1, 2, 3].map((n) => (
              <div className="media" key={n}>
                <img src={`/images/team/office-${n}.webp`} alt="The Webtricker team working together in our office" loading="lazy" width={960} height={1280} />
              </div>
            ))}
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
