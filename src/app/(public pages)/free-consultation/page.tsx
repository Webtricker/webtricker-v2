import React from "react";
import { Metadata } from "next";
import Container from "@/sharedComponets/ui/wrapper/Container";
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
      isPartOf: { "@type": "WebSite", name: "Webtricker", url: "https://webtricker.com" },
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
    <main className="w-full z-0">
      <script
        type="application/ld+json"
        // "<" is escaped so no string in the data can close the script tag
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="relative w-full mt-[130px] md:mt-[150px] lg:mt-[180px] 2xl:mt-[200px]">
        <Container>
          <div className="w-full max-w-[1120px] mx-auto">
            <p className="bold flex items-center gap-1">
              <span>Free consultation</span>
              <span className="w-10 h-[1px] mt-1.5 bg-black dark:bg-white"></span>
            </p>
            <h1 className="heading xl:font-semibold !leading-[100%]">
              Book a free 30-minute consultation
            </h1>
            <p className="mt-4 max-w-[720px]">
              Tell us where you want to take your website or product. Pick a time
              and speak with a Webtricker expert about design, development and SEO,
              free and with no obligation.
            </p>

            <div className="w-full mt-10">
              <BookingScheduler />
            </div>

            <section aria-labelledby="how-it-works" className="mt-16">
              <h2 id="how-it-works" className="heading !text-2xl">How it works</h2>
              <ol className="mt-5 grid gap-6 md:grid-cols-3">
                {steps.map((s, i) => (
                  <li key={s.title}>
                    <span className="bold">Step {i + 1}</span>
                    <h3 className="heading !text-lg mt-1">{s.title}</h3>
                    <p className="mt-1">{s.text}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="faq" className="mt-16 mb-16">
              <h2 id="faq" className="heading !text-2xl">Frequently asked questions</h2>
              <div className="mt-5 flex flex-col gap-5">
                {faqs.map((f) => (
                  <div key={f.q}>
                    <h3 className="bold">{f.q}</h3>
                    <p className="mt-1">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Container>
      </div>
    </main>
  );
}
