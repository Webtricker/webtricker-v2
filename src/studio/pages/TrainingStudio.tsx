import Link from "next/link";
import { PageHead } from "../parts";
import { Roll } from "../ui";

const COLORS = ["--green", "--blue", "--sky", "--crimson", "--amber"];

type Pkg = {
  duration: string;
  totalFee: number;
  registrationFee: number;
  installmentAmount: number;
  installmentCount: number;
  currency: string;
};
type Course = { slug: string; title: string; description: string; packages: Pkg[] };

async function getCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/training?published=true&limit=100`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.courses ?? [];
  } catch {
    return [];
  }
}

const WHY = [
  ["Expert Instructors", "Learn from industry professionals with years of experience", "--blue"],
  ["Flexible Learning", "Choose between online and offline modes based on your preference", "--green"],
  ["Easy Installments", "Pay in easy monthly installments — no large upfront payment", "--sky"],
  ["Free Internship", "Get hands-on experience with our complimentary internship program", "--crimson"],
  ["Job Placement", "Career support and job placement assistance after internship completion", "--amber"],
];

export default async function TrainingStudio() {
  const courses = await getCourses();
  return (
    <main className="page" data-page="training">
      <PageHead video="training"
        crumb="Online School · Training"
        title="Professional Training Courses"
        size="clamp(42px, 8vw, 120px)"
        lead="Enhance your skills with our comprehensive training programs designed for modern professionals. Pay in easy monthly installments — no large upfront payment."
      />
      <section className="chapter">
        <div className="wrap">
          <div className="eyebrow mono mute">
            <span>Courses</span>
            <span>{courses.length}</span>
          </div>
          {courses.length === 0 ? (
            <p className="lead">No courses available at the moment.</p>
          ) : (
            <div className="courses">
              {courses.map((c, i) => {
                const pk = c.packages ?? [];
                const low = pk.length ? pk.reduce((a, b) => (b.totalFee < a.totalFee ? b : a)) : null;
                return (
                  <article className="course glass" key={c.slug}>
                    <div className="tags">
                      <span className="gem" style={{ ["--c" as any]: `var(${COLORS[i % COLORS.length]})` }} />
                      {low ? <span className="tag">{low.duration}</span> : <span className="tag">New schedule soon</span>}
                      {pk.length > 1 ? <span className="tag">{pk.length} packages</span> : null}
                    </div>
                    <h3>{c.title}</h3>
                    <p>{c.description}</p>
                    {low ? (
                      <div className="price">
                        <b>
                          {low.totalFee.toLocaleString()} {low.currency}
                        </b>
                        <span>
                          {low.registrationFee > 0
                            ? `৳${low.registrationFee.toLocaleString()} reg + ৳${low.installmentAmount.toLocaleString()} × ${low.installmentCount}`
                            : "Starting from"}
                        </span>
                      </div>
                    ) : (
                      <div className="price price--tbc">
                        <b>Fee updating</b>
                        <span>Ask us for the next batch</span>
                      </div>
                    )}
                    <div className="course__actions">
                      <Link className="pill" href={`/training/${c.slug}`}>
                        <Roll>View Details</Roll>
                      </Link>
                      <Link className="pill pill--solid" href="/contact">
                        <Roll>Enroll Now</Roll>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <section className="chapter" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="eyebrow mono mute">
            <span>Why Choose Our Training Programs?</span>
            <span>{WHY.length} reasons</span>
          </div>
          <div className="why">
            {WHY.map(([t, d, c]) => (
              <div key={t}>
                <span className="gem" style={{ ["--c" as any]: `var(${c})` }} />
                <strong>{t}</strong>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
