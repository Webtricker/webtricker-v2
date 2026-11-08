import Link from "next/link";
import { getBlogsPageData, getCategories, getPostsData } from "@/utils/pageData";
import FilterBar from "../FilterBar";
import { Arrow, fmtDate, stripHtml } from "../ui";
import { PageHead, nameOf } from "../parts";

/* eslint-disable @next/next/no-img-element */

const COLORS = ["--amber", "--sky", "--blue", "--crimson", "--green"];

export default async function BlogStudio() {
  const [page, posts, cats] = await Promise.all([getBlogsPageData(), getPostsData(999), getCategories()]);
  const pg: any = page || {};
  const list = ((posts as any[]) || []).filter((p) => p?.slug);
  const feature = list.find((p) => p.featured) || list[0];
  const catList = (cats as any[]) || [];
  const colorFor = (name: string) => COLORS[Math.max(0, catList.findIndex((c) => c.name === name)) % COLORS.length];
  const rest = list.filter((p) => p !== feature);

  return (
    <main className="page" data-page="journal">
      <PageHead video="blog" crumb="Updates · Insights" title={pg.title || "Our Blog"} lead={pg.description} />
      {feature ? (
        <section className="wrap">
          <Link className="feature" href={`/blog/${feature.slug}`}>
            <div className="media">
              <img src={feature.thumnail?.url} alt={feature.title} loading="lazy" />
              <span className="media__tag">Featured</span>
            </div>
            <div>
              <div className="post__meta">
                <span className="mono" style={{ color: `var(${colorFor(nameOf(feature.category))})` }}>
                  {nameOf(feature.category)}
                </span>
                <span className="mono mute">{fmtDate(feature.createdAt)}</span>
              </div>
              <h2>{feature.title}</h2>
              <p className="lead">{feature.excerp || stripHtml(feature.description)}</p>
              <div style={{ marginTop: 28 }}>
                <span className="textlink">
                  Read More <Arrow />
                </span>
              </div>
            </div>
          </Link>
        </section>
      ) : null}
      <section className="chapter">
        <div className="wrap">
          <FilterBar
            label="Blog categories"
            gridId="blogGrid"
            itemSelector=".post"
            items={[
              { key: "all", label: "All" },
              ...catList
                .map((c) => ({ key: c.name, label: c.name, count: rest.filter((p) => nameOf(p.category) === c.name).length }))
                .filter((c) => c.count > 0),
            ]}
          />
          <div className="posts" id="blogGrid">
            {rest.map((p) => (
              <Link className="post" href={`/blog/${p.slug}`} key={p._id || p.slug} data-cat={nameOf(p.category)}>
                <div className="media">
                  <img src={p.thumnail?.url} alt={p.title} loading="lazy" />
                </div>
                <div className="post__meta">
                  <span className="mono" style={{ color: `var(${colorFor(nameOf(p.category))})` }}>
                    {nameOf(p.category)}
                  </span>
                  <span className="mono mute">{fmtDate(p.createdAt)}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.excerp || stripHtml(p.description)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
