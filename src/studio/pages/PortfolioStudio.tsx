import Link from "next/link";
import { getPortfolioPageData, getPortfoliosData, getTechnologies } from "@/utils/pageData";
import FilterBar from "../FilterBar";
import { ArrowUp } from "../ui";
import { PageHead, nameOf } from "../parts";

/* eslint-disable @next/next/no-img-element */

export default async function PortfolioStudio() {
  const [page, portfolios, techs] = await Promise.all([getPortfolioPageData(), getPortfoliosData(999), getTechnologies()]);
  const pg: any = page || {};
  const list = (portfolios as any[]) || [];
  const intro = pg.projectIntroduction || {};

  return (
    <main className="page" data-page="work">
      <PageHead crumb={`${intro.companyName || "Webtricker"} · Portfolio`} title={intro.title || "Our Latest"} lead={intro.description} />
      <section className="chapter" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <FilterBar
            label="Filter projects"
            gridId="cases"
            itemSelector=".case"
            items={[{ key: "all", label: "All" }, ...((techs as any[]) || []).map((t) => ({ key: t.name, label: t.name }))]}
          />
          <div className="cases" id="cases">
            {list.map((p) => (
              <Link className="case" href={`/portfolio/${p.slug}`} key={p._id || p.slug} data-cat={nameOf(p.technology)}>
                <div className="media reveal-clip">
                  <img src={p.thumnail?.url || p.coverImage?.url} alt={p.title} loading="lazy" />
                </div>
                <div className="case__row">
                  <div>
                    <span className="mono mute">{nameOf(p.technology)}</span>
                    <h3>{p.title}</h3>
                  </div>
                  <ArrowUp />
                </div>
              </Link>
            ))}
          </div>
          {pg.bottomText?.title ? (
            <div className="eyebrow mono mute" style={{ marginTop: 96 }}>
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
