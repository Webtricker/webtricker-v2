import Link from "next/link";
import HtmlContentParser from "@/sharedComponets/ui/editor/HtmlContentParser";
import { MaskWords } from "../ui";
import { Bleed } from "../parts";

const cap = (s = "") => s.replace(/(^|[-\s])(\w)/g, (_, a, b) => (a === "-" ? " " : a) + b.toUpperCase());

const Block = ({ title, items }: { title: string; items?: string[] }) =>
  items?.length ? (
    <div className="job__block">
      <h2>{title}</h2>
      <ul className="bullets">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  ) : null;

/** Single job opening. */
export default function JobStudio({ job }: { job: any }) {
  const apply = job.howToApply || "careers@webtricker.com";
  const isMail = /@/.test(apply);
  return (
    <main className="page" data-page="job">
      <section className="pagehead">
        <div className="wrap">
          <div className="pagehead__crumb mono mute">
            <Link href="/career">Career</Link>&nbsp;· Career Opportunity
          </div>
          <h1 className="h-xl page-title" aria-label={job.title} style={{ fontSize: "clamp(42px, 8vw, 128px)" }}>
            <MaskWords text={job.title} />
          </h1>
          <div className="tags" style={{ marginTop: 28 }}>
            <span className="tag" style={{ borderColor: "var(--amber)", color: "var(--amber)" }}>
              {cap(job.employmentType)}
            </span>
            <span className="tag">{job.department}</span>
            <span className="tag">
              {cap(job.workMode)} · {job.location}
            </span>
            <span className="tag">{cap(job.experienceLevel)}</span>
            <span className="tag">Vacancy: {Number(job.vacancyCount) || 0}</span>
          </div>
        </div>
      </section>
      <Bleed src={job.ogImage} alt={job.ogImageAlt || job.title} height="clamp(240px, 40vw, 560px)" />
      <section className="chapter">
        <div className="wrap job">
          <div className="job__main">
            <p className="statement" style={{ fontSize: "clamp(24px, 2.6vw, 38px)" }}>
              {job.shortDescription}
            </p>
            <div className="job__block">
              <h2>About This Role</h2>
              <div className="prose" style={{ fontSize: 17 }}>
                <HtmlContentParser htmlContent={job.fullDescription || ""} />
              </div>
            </div>
            <Block title="Responsibilities" items={job.responsibilities} />
            <Block title="Requirements" items={job.requirements} />
            <Block title="Nice To Have" items={job.niceToHave} />
            <Block title="Benefits" items={job.benefits} />
            <div className="job__block">
              <h2>How to Apply</h2>
              <div>
                <p>
                  {isMail ? "Send your CV, profile links, sample work if available, and a short cover note to " : ""}
                  <b style={{ color: "var(--paper)" }}>{apply}</b>.
                </p>
                <p>
                  Subject line: <b style={{ color: "var(--paper)" }}>{job.title}</b>
                </p>
              </div>
            </div>
          </div>
          <aside className="summary glass">
            <h3>Job Summary</h3>
            <dl>
              <div><dt>Department</dt><dd>{job.department}</dd></div>
              <div><dt>Location</dt><dd>{job.location}</dd></div>
              <div><dt>Employment</dt><dd>{cap(job.employmentType)}</dd></div>
              <div><dt>Experience</dt><dd>{cap(job.experienceLevel)}</dd></div>
              <div><dt>Work Mode</dt><dd>{cap(job.workMode)}</dd></div>
              <div><dt>Vacancy</dt><dd>{Number(job.vacancyCount) || 0}</dd></div>
              {job.salaryRange ? (
                <div><dt>Salary</dt><dd>{job.salaryRange}</dd></div>
              ) : null}
              {job.applicationDeadline ? (
                <div><dt>Deadline</dt><dd>{new Date(job.applicationDeadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</dd></div>
              ) : null}
            </dl>
            {isMail ? (
              <button className="pill pill--solid copy" type="button" data-copy={apply} style={{ width: "100%" }}>
                Apply Now · {apply.split("@")[0]}@ <small>Copy</small>
              </button>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}
