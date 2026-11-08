import Link from "next/link";
import HtmlContentParser from "@/sharedComponets/ui/editor/HtmlContentParser";
import TocNav from "../TocNav";
import { MaskWords, Roll, fmtDate } from "../ui";

/** Privacy policy and terms pages. */
export default function LegalStudio({ data, page }: { data: any; page: string }) {
  return (
    <main className="page" data-page={page}>
      <section className="pagehead">
        <div className="wrap">
          <div className="pagehead__crumb mono mute">Legal · Last Updated: {fmtDate(data?.updatedAt || data?.createdAt)}</div>
          <h1 className="h-xl page-title" aria-label={data?.title}>
            <MaskWords text={data?.title || ""} />
          </h1>
        </div>
      </section>
      <section className="chapter" style={{ paddingTop: 0 }}>
        <div className="wrap legal">
          <aside className="toc">
            <TocNav label="Contents" />
            <Link className="pill" href="/contact">
              <Roll>Questions? Contact us</Roll>
            </Link>
          </aside>
          <div className="prose">
            {data?.description ? <p className="big">{data.description}</p> : null}
            <HtmlContentParser htmlContent={data?.content || ""} />
          </div>
        </div>
      </section>
    </main>
  );
}
