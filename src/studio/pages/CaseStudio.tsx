import Link from "next/link";
import HtmlContentParser from "@/sharedComponets/ui/editor/HtmlContentParser";
import { MaskWords } from "../ui";
import { Bleed, PrevNext, nameOf } from "../parts";

/** Single portfolio project. */
export default function CaseStudio({
  p,
  next,
  prev,
}: {
  p: any;
  next?: { href: string; title: string } | null;
  prev?: { href: string; title: string } | null;
}) {
  const year = p.createdAt ? new Date(p.createdAt).getFullYear() : "";
  return (
    <main className="page" data-page="case">
      <section className="pagehead">
        <div className="wrap">
          <div className="pagehead__crumb mono mute">
            <Link href="/portfolio">Portfolio</Link>&nbsp;· Case study
          </div>
          <h1 className="h-xl page-title" aria-label={p.title}>
            <MaskWords text={p.title} />
          </h1>
          <div className="meta4">
            <div>
              <span className="mono mute">Client</span>
              <b>{p.title}</b>
            </div>
            <div>
              <span className="mono mute">Category</span>
              <b>{nameOf(p.technology) || "—"}</b>
            </div>
            <div>
              <span className="mono mute">Year</span>
              <b>{year}</b>
            </div>
            <div>
              <span className="mono mute">Live site</span>
              <b>
                {p.liveLink ? (
                  <a href={p.liveLink} target="_blank" rel="noopener noreferrer">
                    {p.liveLink.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
                  </a>
                ) : (
                  "—"
                )}
              </b>
            </div>
          </div>
        </div>
      </section>
      <Bleed src={p.coverImage?.url || p.thumnail?.url} alt={p.title} />
      <section className="chapter">
        <div className="wrap sticky2">
          <div className="sticky2__side">
            <div className="mono mute">Overview</div>
            <h2 className="h-lg">The brief</h2>
            <p className="lead">{p.description}</p>
          </div>
          <div className="prose">
            <HtmlContentParser htmlContent={p.content || ""} />
          </div>
        </div>
        <div className="wrap">
          <PrevNext prev={prev} next={next} label="project" listHref="/portfolio" />
        </div>
      </section>
    </main>
  );
}
