import Link from "next/link";
import { getServicesData, getServicesPageData } from "@/utils/pageData";
import { ArrowUp, pad, stripHtml } from "../ui";
import { Arrow } from "../ui";
import { Bleed, PageHead, nameOf } from "../parts";

/* eslint-disable @next/next/no-img-element */

const COLORS = ["--crimson", "--amber", "--green", "--blue", "--sky"];

export default async function ServicesStudio() {
  const [services, page] = await Promise.all([getServicesData(), getServicesPageData()]);
  const list = (services as any[]) || [];
  const pg: any = page || {};

  return (
    <main className="page" data-page="services">
      <PageHead
        crumb="Services list"
        title={pg.banner?.title || "Our Services"}
        lead={[(pg.banner?.description || "").replace(/s*Services lists*$/i, "").replace(/.?$/, "."), pg.servicesShotcut?.title].filter((x) => x && x !== ".").join(" ")}
      />
      <Bleed src={pg.bannerBG?.src} type={pg.bannerBG?.type} alt={pg.banner?.title} />
      <section className="chapter">
        <div className="wrap">
          <div className="tags" style={{ marginBottom: 40 }}>
            {list.map((s, i) => (
              <a className="tag" key={s._id || s.slug} href={`#svc${i}`} data-scroll={`#svc${i}`}>
                <span className="gem" style={{ ["--c" as any]: `var(${COLORS[i % COLORS.length]})`, width: 7, height: 11 }} />
                {s.title}
              </a>
            ))}
          </div>
          <div>
            {list.map((s, i) => {
              const bullets: string[] = [...(s.subServices || []), ...(s.tags || []).map(nameOf)].filter(Boolean);
              return (
                <article className="svc" id={`svc${i}`} key={s._id || s.slug}>
                  <div className="media media--par svc__media reveal-clip">
                    <img src={s.thumnail?.url || s.icon} alt={s.thumbnailAlt || s.title} loading="lazy" />
                  </div>
                  <div className="svc__body">
                    <span className="svc__num mono" style={{ color: `var(${COLORS[i % COLORS.length]})` }}>
                      {pad(i + 1)} · Creative Digital Studio
                    </span>
                    <h2 className="h-lg">{s.title}</h2>
                    <p>{s.excerpt || stripHtml(s.description)}</p>
                    {bullets.length ? (
                      <ul className={`bullets${bullets.length > 4 ? " bullets--2" : ""}`}>
                        {bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    ) : null}
                    <Link className="textlink" href={`/services/${s.slug}`}>
                      Want to know more about {s.title}? <Arrow />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          {pg.bottomText?.title ? (
            <div className="eyebrow mono mute" style={{ marginTop: 80 }}>
              <span>{pg.bottomText.expression}</span>
              <Link href="/contact" className="mono">
                {pg.bottomText.title} <ArrowUp />
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
