import { getContactPageData } from "@/utils/pageData";
import { getSiteConfig } from "../data";
import StudioContactForm from "../StudioContactForm";
import { PageHead } from "../parts";

/* eslint-disable @next/next/no-img-element */

const Copy = ({ value, label, big }: { value: string; label?: string; big?: boolean }) => (
  <button className={`copy${big ? " big-copy" : ""}`} type="button" data-copy={value}>
    {label ?? value} <small>Copy</small>
  </button>
);

export default async function ContactStudio() {
  const [page, site] = await Promise.all([getContactPageData(), getSiteConfig()]);
  const pg: any = page || {};
  const emails = site?.contact?.emails ?? [];
  const phones = site?.contact?.phones ?? [];
  const offices: any[] = pg.address?.addresses?.length
    ? pg.address.addresses.map((a: any) => ({ label: a.office, addressText: a.location }))
    : site?.offices ?? [];
  const socials: any[] = pg.leftPanel?.socialLinks ?? [];

  return (
    <main className="page" data-page="contact">
      <PageHead crumb={`${pg.branding || "Webtricker"} · ${pg.greetings?.topTxt || "Say hello to us"}`} title={pg.title || "Get in touch"} />
      <section className="chapter" style={{ paddingTop: 0 }}>
        <div className="wrap contact">
          <div className="contact__col">
            <div>
              <div className="mono mute" style={{ marginBottom: 14 }}>
                Email Address
              </div>
              <div style={{ display: "grid", gap: 6, justifyItems: "start" }}>
                {emails.map((m) => (
                  <Copy key={m} value={m} big />
                ))}
              </div>
            </div>
            <div>
              <div className="mono mute" style={{ marginBottom: 14 }}>
                Phone Number
              </div>
              <div style={{ display: "grid", gap: 4, justifyItems: "start" }}>
                {phones.map((n) => (
                  <Copy key={n} value={n.replace(/[^\d+]/g, "")} label={n} />
                ))}
              </div>
            </div>
            {socials.length ? (
              <div>
                <div className="mono mute" style={{ marginBottom: 14 }}>
                  {pg.leftPanel?.text || "Follow Us"}
                </div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {socials.map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="arrow" aria-label={s.href}>
                      <img src={s.icon} alt="" width={20} height={20} style={{ filter: "invert(1)" }} />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <StudioContactForm cfg={pg.form} />
        </div>
      </section>
      <section className="chapter" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="eyebrow mono mute">
            <span>{pg.contactInformationTitle || "Contact Information"}</span>
            <a className="mono" href="https://maps.google.com/?q=Webtricker+Web+and+Design+Solutions+Jamalpur" target="_blank" rel="noopener noreferrer">
              Open in Google Maps ↗
            </a>
          </div>
          <div className="offices">
            {offices.map((o) => (
              <div className="office glass" key={o.label}>
                <span className="mono mute">{o.country || ""}</span>
                <strong>{o.label}</strong>
                <p>{o.addressText}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
