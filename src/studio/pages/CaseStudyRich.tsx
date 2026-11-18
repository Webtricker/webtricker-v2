import Link from "next/link";
import type { CaseStudyData, CaseStudyPoint } from "@/types/portfolio";

/**
 * Structured case study body. Written for people first, and for search engines and AI answer
 * engines second: one direct answer at the top, labelled facts, real numbers, plain-language
 * sections with their own headings, and a visible FAQ that mirrors the FAQPage schema.
 */
const Points = ({ items }: { items: CaseStudyPoint[] }) => (
  <ol className="cs-points">
    {items.map((it, i) => (
      <li key={it.title}>
        <span className="cs-points__n mono" aria-hidden="true">
          {String(i + 1).padStart(2, "0")}
        </span>
        <div>
          <h3>{it.title}</h3>
          <p>{it.text}</p>
        </div>
      </li>
    ))}
  </ol>
);

export default function CaseStudyRich({ cs, title, liveLink }: { cs: CaseStudyData; title: string; liveLink?: string }) {
  return (
    <div className="cs">
      {cs.summary ? (
        <section className="cs-sum" aria-label="Summary">
          <div className="wrap">
            <div className="cs-sum__box">
              <span className="mono mute">In short</span>
              <p className="cs-summary">{cs.summary}</p>
            </div>
            {cs.facts?.length ? (
              <dl className="cs-facts">
                {cs.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="mono mute">{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </section>
      ) : null}

      {cs.metrics?.length ? (
        <section className="cs-metrics" aria-label="Key numbers">
          <div className="wrap">
            <ul>
              {cs.metrics.map((m) => (
                <li key={m.label}>
                  <b>{m.value}</b>
                  <span>{m.label}</span>
                  {m.note ? <em className="mono mute">{m.note}</em> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {cs.challenge ? (
        <section className="cs-sec" aria-labelledby="cs-challenge">
          <div className="wrap cs-grid">
            <div className="cs-side">
              <span className="mono mute">01 · The problem</span>
              <h2 id="cs-challenge" className="h-lg">
                The challenge
              </h2>
              {cs.challenge.intro ? <p className="lead">{cs.challenge.intro}</p> : null}
            </div>
            {cs.challenge.points ? <Points items={cs.challenge.points} /> : null}
          </div>
        </section>
      ) : null}

      {cs.solution ? (
        <section className="cs-sec" aria-labelledby="cs-solution">
          <div className="wrap cs-grid">
            <div className="cs-side">
              <span className="mono mute">02 · What we built</span>
              <h2 id="cs-solution" className="h-lg">
                How we solved it
              </h2>
              {cs.solution.intro ? <p className="lead">{cs.solution.intro}</p> : null}
            </div>
            {cs.solution.points ? <Points items={cs.solution.points} /> : null}
          </div>
        </section>
      ) : null}

      {cs.comparison?.length ? (
        <section className="cs-sec" aria-labelledby="cs-compare">
          <div className="wrap">
            <span className="mono mute">03 · Before and after</span>
            <h2 id="cs-compare" className="h-lg">
              Measured difference
            </h2>
            <div className="cs-table" role="region" aria-label="Before and after comparison" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Before</th>
                    <th scope="col">After</th>
                    <th scope="col">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {cs.comparison.map((r) => (
                    <tr key={r.metric}>
                      <th scope="row">{r.metric}</th>
                      <td>{r.before}</td>
                      <td>
                        <b>{r.after}</b>
                      </td>
                      <td>{r.impact || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {cs.results ? (
        <section className="cs-sec" aria-labelledby="cs-results">
          <div className="wrap cs-grid">
            <div className="cs-side">
              <span className="mono mute">04 · Outcome</span>
              <h2 id="cs-results" className="h-lg">
                Results
              </h2>
              {cs.results.intro ? <p className="lead">{cs.results.intro}</p> : null}
            </div>
            {cs.results.points ? (
              <ul className="cs-ticks">
                {cs.results.points.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      {cs.stackTable?.length ? (
        <section className="cs-sec" aria-labelledby="cs-stack">
          <div className="wrap">
            <span className="mono mute">05 · Technology</span>
            <h2 id="cs-stack" className="h-lg">
              Tech stack
            </h2>
            <div className="cs-table" role="region" aria-label="Technology stack" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Layer</th>
                    <th scope="col">Technologies</th>
                  </tr>
                </thead>
                <tbody>
                  {cs.stackTable.map((r) => (
                    <tr key={r.layer}>
                      <th scope="row">{r.layer}</th>
                      <td>{r.items}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {cs.takeaways?.length ? (
        <section className="cs-sec" aria-labelledby="cs-take">
          <div className="wrap cs-grid">
            <div className="cs-side">
              <span className="mono mute">06 · Remember this</span>
              <h2 id="cs-take" className="h-lg">
                Key takeaways
              </h2>
            </div>
            <ul className="cs-ticks">
              {cs.takeaways.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {cs.faq?.length ? (
        <section className="cs-sec" aria-labelledby="cs-faq">
          <div className="wrap cs-grid">
            <div className="cs-side">
              <span className="mono mute">07 · Questions</span>
              <h2 id="cs-faq" className="h-lg">
                {title}: common questions
              </h2>
            </div>
            <div className="cs-faq">
              {cs.faq.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="cs-cta">
        <div className="wrap">
          <h2 className="h-lg">Planning something similar?</h2>
          <p className="lead">Tell us about your project and we will reply with a plan, timeline and price range.</p>
          <div className="cs-cta__row">
            <Link className="pill pill--solid magnetic" href="/free-consultation">
              Book a free consultation
            </Link>
            {liveLink ? (
              <a className="pill" href={liveLink} target="_blank" rel="noopener noreferrer">
                Visit the live site ↗
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
