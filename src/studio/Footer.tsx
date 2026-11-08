import Link from "next/link";
import { getFooter, getSiteConfig } from "./data";
import StudioSubscribe from "./StudioSubscribe";

const Copy = ({ value, label }: { value: string; label?: string }) => (
  <button className="copy" type="button" data-copy={value}>
    {label ?? value} <small>Copy</small>
  </button>
);

export default async function Footer() {
  const [site, footer] = await Promise.all([getSiteConfig(), getFooter()]);
  const emails = site?.contact?.emails ?? (site?.contact?.primaryEmail ? [site.contact.primaryEmail] : []);
  const phones = site?.contact?.phones ?? (site?.contact?.primaryPhone ? [site.contact.primaryPhone] : []);
  const offices = site?.offices ?? [];
  const pages = footer?.pages?.links ?? [];
  const brand = site?.brand?.name || "Webtricker";
  const year = new Date().getFullYear();

  return (
    <footer className="finale" id="footer">
      <div className="wrap">
        <div className="eyebrow mono mute">
          <span>Have a project in mind?</span>
          <span>Contact Us</span>
        </div>
        <Link className="finale__big" href="/contact">
          <span>Let&apos;s</span>
          <span>Talk</span>
        </Link>
        <div className="contacts">
          <div>
            <h4 className="mono mute">Email Address</h4>
            <ul>
              {emails.map((m) => (
                <li key={m}>
                  <Copy value={m} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mono mute">Phone · Hotline</h4>
            <ul>
              {phones.map((p) => (
                <li key={p}>
                  <Copy value={p.replace(/[^\d+]/g, "")} label={p} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mono mute">Address</h4>
            {offices.map((o) => (
              <p key={o.label}>
                <b>{o.label}</b>
                {o.addressText}
              </p>
            ))}
          </div>
          <div>
            <h4 className="mono mute">Subscribe to our newsletter</h4>
            <StudioSubscribe />
            <h4 className="mono mute" style={{ marginTop: 24 }}>
              {footer?.pages?.title || "Our Pages"}
            </h4>
            <ul style={{ gridTemplateColumns: "1fr 1fr" }}>
              {pages.map((l) => (
                <li key={l.href}>
                  {l.isExternal || /^https?:/.test(l.href) ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href}>{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="wordmark" aria-hidden="true">
          {brand}
        </p>
      </div>
      <div className="spectrum" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="wrap">
        <div className="bar">
          <span>
            © 2014 - {year} {brand} Web Design &amp; Development Agency. / {brand} LLC. All Rights Reserved.
          </span>
          <span>
            <Link href="/privacy-policy">Privacy &amp; Policy</Link> ·{" "}
            <Link href="/terms-and-conditions">Terms &amp; Condition</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
