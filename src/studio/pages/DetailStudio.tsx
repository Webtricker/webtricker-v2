import Link from "next/link";
import HtmlContentParser from "@/sharedComponets/ui/editor/HtmlContentParser";
import TocNav from "../TocNav";
import { MaskWords, Roll, fmtDate } from "../ui";
import { Bleed, PrevNext } from "../parts";

/** Shared template for blog posts and service pages (cover, contents list, CMS body, prev/next). */
export default function DetailStudio({
  kind,
  listHref,
  title,
  meta,
  category,
  tags = [],
  cover,
  description,
  html,
  prev,
  next,
  schema,
}: {
  kind: string;
  listHref: string;
  title: string;
  meta?: string;
  category?: string;
  tags?: string[];
  cover?: string;
  description?: string;
  html?: string;
  prev?: { href: string; title: string } | null;
  next?: { href: string; title: string } | null;
  schema?: object;
}) {
  return (
    <main className="page" data-page="article">
      {schema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      ) : null}
      <section className="pagehead" style={{ paddingBottom: 48 }}>
        <div className="wrap article__head">
          <div className="pagehead__crumb mono mute">
            <Link href={listHref}>{kind}</Link>&nbsp;· {meta}
          </div>
          <h1 className="h-lg page-title" aria-label={title}>
            <MaskWords text={title} />
          </h1>
          <div className="tags" style={{ marginTop: 28 }}>
            {category ? (
              <span className="tag" style={{ borderColor: "var(--amber)", color: "var(--amber)" }}>
                {category}
              </span>
            ) : null}
            {tags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
      {kind === "Service" ? (
        <div className="wrap">
          <div className="bleed--box">
            <Bleed src={cover} alt={title} height="clamp(260px, 46vw, 620px)" />
          </div>
        </div>
      ) : (
        <Bleed src={cover} alt={title} height="clamp(260px, 46vw, 620px)" />
      )}
      <section className="chapter">
        <div className="wrap article__body">
          <aside className="toc">
            <TocNav />
            <Link className="pill pill--solid magnetic" href="/free-consultation">
              <Roll>Free Consultation</Roll>
            </Link>
          </aside>
          <div>
            <div className="prose">
              {description ? <p className="big">{description}</p> : null}
              <HtmlContentParser htmlContent={html || ""} />
            </div>
            <PrevNext prev={prev} next={next} label={kind.toLowerCase()} listHref={listHref} />
          </div>
        </div>
      </section>
    </main>
  );
}

export { fmtDate };
