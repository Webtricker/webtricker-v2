import Link from "next/link";
import { Bleed, PageHead } from "../parts";
import { ArrowUp, pad } from "../ui";

type Job = { slug: string; title: string; department?: string; vacancyCount?: number; ogImage?: string };

async function getJobs(): Promise<Job[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/career?published=true&limit=100`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.careers ?? [];
  } catch {
    return [];
  }
}

const PERKS = [
  ["Performance Bonuses", "Two yearly bonuses plus special recognition for exceptional achievements and measurable impact."],
  ["Career Development", "Professional training, skill development sessions, mentoring, and room to grow into stronger responsibilities."],
  ["Salary Reviews", "Salary revision opportunities 2 to 3 times per year based on progress, skill growth, and performance."],
  ["Long-Term Security", "Special gratuity and pension-style packages after long-term service milestones, subject to company policy."],
  ["Affiliate Earning", "Affiliate opportunities to help team members expand income beyond their regular salary."],
  ["Daily Workplace Care", "Refreshment support during office hours and a friendly environment built for sustainable work."],
];
const VALUES = [
  ["Freedom and Ownership", "We respect ideas, choices, and thoughtful initiative so team members can contribute beyond a job description."],
  ["One-Team Culture", "Anyone's challenge is treated as a shared challenge. We grow together through support, feedback, and trust."],
  ["Voice in Decisions", "We listen to practical suggestions from every role and value people who help improve the company."],
  ["Path to Partnership", "Dedicated long-term contributors may get opportunities to become shareholders under specific conditions."],
  ["Human Respect", "People are not treated as ordinary job holders; they are collaborators with goals, families, and futures."],
  ["Recognition for Impact", "Strong contribution, leadership, loyalty, and problem-solving are noticed and rewarded over time."],
];

const Rows = ({ data }: { data: string[][] }) => (
  <div className="rows">
    {data.map((d, i) => (
      <div key={d[0]}>
        <span>{pad(i + 1)}</span>
        <h3>{d[0]}</h3>
        <p>{d[1]}</p>
      </div>
    ))}
  </div>
);

export default async function CareerStudio() {
  const jobs = await getJobs();
  return (
    <main className="page" data-page="career">
      <PageHead
        crumb="Career · Join the team"
        title="Do you have the courage?"
        lead="To be a part of challenging people. If you are a self motivated, confident but not over confident, hardworking, energetic, creative, team player and eager to achieve something extraordinary then you are surely welcome to a dynamic team!"
      />
      <Bleed src="/images/career/career-hero-team.png" alt="Webtricker career team collaboration" />
      <section className="chapter">
        <div className="wrap">
          <div className="eyebrow mono mute">
            <span>Open roles</span>
            <span>{jobs.length} openings</span>
          </div>
          {jobs.length ? (
            <ul className="jobs">
              {jobs.map((j, i) => (
                <li key={j.slug}>
                  <Link href={`/career/${j.slug}`} data-preview={j.ogImage}>
                    <span className="mono mute">{pad(i + 1)}</span>
                    <h3>{j.title}</h3>
                    <span className="mono mute job__dept">{j.department}</span>
                    <span className="tag job__vac">Vacancy: {Number(j.vacancyCount) || 0}</span>
                    <ArrowUp />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="lead">No open positions are available at the moment.</p>
          )}
        </div>
      </section>
      <section className="chapter" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="eyebrow mono mute">
            <span>What you can expect from us</span>
            <span>Respected, supported, valued</span>
          </div>
          <div className="sticky2">
            <div className="sticky2__side">
              <h2 className="h-lg">Benefits &amp; Perks</h2>
            </div>
            <Rows data={PERKS} />
          </div>
          <div className="sticky2" style={{ marginTop: "clamp(80px, 10vw, 140px)" }}>
            <div className="sticky2__side">
              <h2 className="h-lg">How We Value Our Team</h2>
              <p className="lead">We want every person here to feel respected, supported, and valued as a real team member.</p>
            </div>
            <Rows data={VALUES} />
          </div>
        </div>
      </section>
    </main>
  );
}
