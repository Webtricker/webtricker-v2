import React from "react";
import { Metadata } from "next";
import { PageHead } from "@/studio/parts";
import BookingScheduler from "./components/BookingScheduler";

const URL = "https://webtricker.com/free-consultation";
const TITLE = "Book a Free Consultation | Webtricker";
const DESCRIPTION =
  "Book a free 30-minute consultation with Webtricker's web design, development and SEO experts. Pick a time that suits you and get a clear plan for your project.";

export const metadata: Metadata = {
  title: "Book a Free Consultation",
  description: DESCRIPTION,
  keywords: [
    "free consultation",
    "web design consultation",
    "web development consultation",
    "SEO consultation",
    "book a call",
    "Webtricker",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    siteName: "Webtricker",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@webtricker",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const steps = [
  { title: "Pick a time", text: "Choose any open slot. Times are shown in your own timezone." },
  { title: "Tell us about your project", text: "A few quick details help us prepare so the call is useful from minute one." },
  { title: "Talk to an expert", text: "We email you a calendar invite and the meeting link. No pressure, no obligation." },
];

const faqs = [
  {
    q: "Is the consultation really free?",
    a: "Yes. The 30-minute call is completely free with no obligation to hire us.",
  },
  {
    q: "What happens during the call?",
    a: "We listen to your goals, review your current website or idea, and outline the best approach, timeline and budget range. You leave with a clear next step either way.",
  },
  {
    q: "Can I reschedule or cancel?",
    a: "Yes. Your confirmation email has a link to cancel at any time, and you can book a new time right after.",
  },
  {
    q: "Which topics can we discuss?",
    a: "Website design and development, e-commerce, custom web apps, technical SEO and performance, and website maintenance and security.",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${URL}#webpage`,
      url: URL,
      name: TITLE,
      description: DESCRIPTION,
      isPartOf: { "@id": "https://webtricker.com/#website" },
      potentialAction: { "@type": "ReserveAction", target: URL, name: "Book a free consultation" },
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function FreeConsultationPage() {
  return (
    <main className="page" data-page="consult">
      <script
        type="application/ld+json"
        // "<" is escaped so no string in the data can close the script tag
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <PageHead
        video="consult"
        crumb="Free consultation"
        title="Book a free 30-minute consultation"
        lead="Tell us where you want to take your website or product. Pick a time and speak with a Webtricker expert about design, development and SEO, free and with no obligation."
      />
      <section className="chapter" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="legacy consult__sched">
            <BookingScheduler />
          </div>
        </div>
      </section>
      <section className="chapter" style={{ paddingTop: 0 }} aria-labelledby="how-it-works">
        <div className="wrap">
          <div className="eyebrow mono mute">
            <span id="how-it-works">How it works</span>
            <span>3 simple steps</span>
          </div>
          <ol className="cstep">
            {steps.map((st, i) => (
              <li key={st.title}>
                <span className="mono mute">Step {i + 1}</span>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="chapter" style={{ paddingTop: 0 }} aria-labelledby="faq">
        <div className="wrap">
          <div className="eyebrow mono mute">
            <span id="faq">Frequently asked questions</span>
            <span>{faqs.length} answers</span>
          </div>
          <div className="cfaq">
            {faqs.map((f) => (
              <div key={f.q} className="cfaq__item">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
