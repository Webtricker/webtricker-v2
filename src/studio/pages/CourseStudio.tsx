"use client";

import Link from "next/link";
import { useState } from "react";
import { MaskWords, Roll } from "../ui";

/* eslint-disable @next/next/no-img-element */

type Pkg = {
  _id?: string;
  name: string;
  duration: string;
  totalFee: number;
  offlineTotalFee?: number;
  registrationFee: number;
  installmentAmount: number;
  installmentCount: number;
  currency: string;
  nextCohortDate?: string;
  classDays?: string;
  isPopular?: boolean;
  isJobReady?: boolean;
  outcomeStatement?: string;
  deliverables?: string[];
  idealForThisPackage?: string;
  modules: { title: string; duration?: string; project?: string }[];
};

export type CourseData = {
  slug: string;
  title: string;
  description: string;
  detailedDescription: string;
  tools?: string[];
  prerequisites?: string;
  certification?: string;
  idealFor?: string[];
  instructor?: { name?: string; title?: string; photo?: string; bio?: string; experience?: string };
  faq?: { question: string; answer: string }[];
  packages: Pkg[];
};

const money = (n: number) => n.toLocaleString("en-US");

/** Training course detail: package tabs drive the outcome, modules, pricing card and deliverables. */
export default function CourseStudio({ course }: { course: CourseData }) {
  const [active, setActive] = useState(0);
  const pkgs = course.packages ?? [];
  const pk = pkgs[active] ?? pkgs[0];
  const cur = pk?.currency || "BDT";
  const hasInstructor = course.instructor && (course.instructor.name || course.instructor.bio || course.instructor.photo);
  const cohort = pk?.nextCohortDate
    ? new Date(pk.nextCohortDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <main className="page" data-page="course">
      <section className="pagehead" style={{ paddingBottom: "clamp(40px, 5vw, 64px)" }}>
        <div className="wrap">
          <div className="pagehead__crumb mono mute">
            <Link href="/training" style={{ textDecoration: "none" }}>
              &larr; Back to Courses
            </Link>
            &nbsp;· Online School
          </div>
          <div className="pagehead__grid">
            <h1 className="h-xl page-title" aria-label={course.title}>
              <MaskWords text={course.title} />
            </h1>
            <p className="lead">{course.description}</p>
          </div>
          {pkgs.length > 1 ? (
            <div className="crs-pk" role="tablist" aria-label="Course packages">
              {pkgs.map((p, i) => (
                <button key={p._id ?? i} type="button" role="tab" aria-selected={i === active} onClick={() => setActive(i)}>
                  {p.name}
                  {p.isPopular ? <span className="crs-badge">Popular</span> : null}
                  {p.isJobReady ? <span className="crs-badge crs-badge--g">Job-Ready</span> : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {pk ? (
        <section className="chapter" style={{ paddingTop: 0 }}>
          <div className="wrap crs">
            <div className="crs__main">
              {pk.outcomeStatement ? (
                <div className="crs-after glass">
                  <span className="mono mute">After this course</span>
                  <p>{pk.outcomeStatement}</p>
                </div>
              ) : null}

              <div className="crs-block">
                <h2>Course Overview</h2>
                <p>{course.detailedDescription}</p>
                {course.idealFor?.length ? (
                  <div className="tags">
                    {course.idealFor.map((x) => (
                      <span className="tag" key={x}>
                        {x}
                      </span>
                    ))}
                  </div>
                ) : null}
                {pk.idealForThisPackage ? <p className="crs-aud">{pk.idealForThisPackage}</p> : null}
                <div className="tags">
                  <span className="tag">Duration: {pk.duration}</span>
                  {course.certification ? <span className="tag">{course.certification}</span> : null}
                </div>
              </div>

              <div className="crs-block">
                <div className="crs-head">
                  <h2>Course Modules</h2>
                  <span className="mono mute">{pk.modules.length} modules</span>
                </div>
                {pk.modules.length ? (
                  <ol className="crs-mods">
                    {pk.modules.map((m, i) => (
                      <li key={`${active}-${i}`}>
                        <b>
                          {m.title}
                          {m.duration ? <em className="mono mute" style={{ fontStyle: "normal", marginLeft: 10 }}>({m.duration})</em> : null}
                        </b>
                        {m.project ? <span>{m.project}</span> : null}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>No modules listed yet.</p>
                )}
              </div>

              <div className="crs-two">
                {course.tools?.length ? (
                  <div className="crs-block">
                    <h2>Tools You&apos;ll Learn</h2>
                    <div className="tags">
                      {course.tools.map((t) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {course.prerequisites || course.certification ? (
                  <div className="crs-block">
                    {course.prerequisites ? (
                      <>
                        <h2>Prerequisites</h2>
                        <p>{course.prerequisites}</p>
                      </>
                    ) : null}
                    {course.certification ? (
                      <>
                        <h2 style={course.prerequisites ? { marginTop: 16 } : undefined}>Certification</h2>
                        <p className="crs-certline">{course.certification}</p>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {hasInstructor ? (
                <div className="crs-block">
                  <h2>Your Instructor</h2>
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
                    {course.instructor!.photo ? (
                      <img
                        src={course.instructor!.photo}
                        alt={course.instructor!.name || "Instructor"}
                        style={{ width: 84, height: 84, borderRadius: "50%", objectFit: "cover", flex: "none" }}
                      />
                    ) : null}
                    <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 6 }}>
                      {course.instructor!.name ? <b style={{ fontSize: 20 }}>{course.instructor!.name}</b> : null}
                      {course.instructor!.title ? <span className="mono mute">{course.instructor!.title}</span> : null}
                      {course.instructor!.experience ? <span className="mono mute">{course.instructor!.experience} experience</span> : null}
                      {course.instructor!.bio ? <p>{course.instructor!.bio}</p> : null}
                    </div>
                  </div>
                </div>
              ) : null}

              {course.faq?.length ? (
                <div className="crs-block">
                  <h2>Frequently Asked Questions</h2>
                  <div>
                    {course.faq.map((f, i) => (
                      <details key={i} style={{ borderTop: "1px solid var(--line)", padding: "16px 0" }}>
                        <summary style={{ cursor: "pointer", fontWeight: 600, listStyle: "none" }}>{f.question}</summary>
                        <p style={{ marginTop: 10 }}>{f.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <aside className={`crs-card glass${pk.isJobReady ? " crs-card--pro" : ""}`} aria-live="polite">
              <span className="crs-badge crs-badge--g crs-probadge">Job-Ready Program</span>
              <div className="crs-card__head">
                <span className="mono mute">Package</span>
                <b>{pk.name}</b>
              </div>
              <div className="crs-price">
                <div>
                  <span className="mono mute">Online mode</span>
                  <b>
                    {money(pk.totalFee)} {cur}
                  </b>
                  <small>
                    ৳{money(pk.registrationFee)} registration + ৳{money(pk.installmentAmount)} × {pk.installmentCount} monthly installments
                  </small>
                </div>
                {pk.offlineTotalFee && pk.offlineTotalFee > 0 ? (
                  <div>
                    <span className="mono mute">Offline mode</span>
                    <b>
                      {money(pk.offlineTotalFee)} {cur}
                    </b>
                  </div>
                ) : null}
              </div>
              {cohort || pk.classDays ? (
                <div className="crs-price">
                  {cohort ? (
                    <div>
                      <span className="mono mute">Next cohort</span>
                      <small style={{ color: "var(--paper)" }}>{cohort}</small>
                    </div>
                  ) : null}
                  {pk.classDays ? (
                    <div>
                      <span className="mono mute">Class days</span>
                      <small style={{ color: "var(--paper)" }}>{pk.classDays}</small>
                    </div>
                  ) : null}
                </div>
              ) : null}
              {pk.deliverables?.length ? (
                <div>
                  <span className="mono mute">What you&apos;ll get</span>
                  <ul className="crs-get">
                    {pk.deliverables.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <Link className="pill pill--solid" href="/contact">
                <Roll>Enroll Now</Roll>
              </Link>
              <p className="crs-note">Pay in easy monthly installments. Free internship and job placement support after completion.</p>
            </aside>
          </div>
        </section>
      ) : null}

      <section className="chapter" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="crs-cta glass">
            <span className="mono mute">Online School · Webtricker</span>
            <h2 className="h-lg">
              Ready to get <em className="ital">started?</em>
            </h2>
            <p className="lead">Enroll now and take the first step toward your new career.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <Link className="pill pill--solid magnetic" href="/contact">
                <Roll>Enroll Now</Roll>
              </Link>
              <Link className="pill" href="/training">
                <Roll>All courses</Roll>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
