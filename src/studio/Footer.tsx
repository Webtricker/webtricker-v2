import Link from "next/link";
import { getFooter, getSiteConfig } from "./data";
import StudioSubscribe from "./StudioSubscribe";
import FooterAcc, { CopyrightYear } from "./FooterAcc";

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
          <FooterAcc id="email" title="Email Address">
            <ul>
              {emails.map((m) => (
                <li key={m}>
                  <Copy value={m} />
                </li>
              ))}
            </ul>
          </FooterAcc>
          <FooterAcc id="phone" title="Phone · Hotline">
            <ul>
              {phones.map((p) => (
                <li key={p}>
                  <Copy value={p.replace(/[^\d+]/g, "")} label={p} />
                </li>
              ))}
            </ul>
          </FooterAcc>
          <FooterAcc id="address" title="Address">
            {offices.map((o) => (
              <p key={o.label}>
                <b>{o.label}</b>
                {o.addressText}
              </p>
            ))}
          </FooterAcc>
          <div className="fcol">
            <div className="fsub">
              <h4 className="mono mute">Subscribe to our newsletter</h4>
              <StudioSubscribe />
            </div>
            <FooterAcc id="pages" title={footer?.pages?.title || "Our Pages"}>
            <ul className="fpages">
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
            </FooterAcc>
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
            © <CopyrightYear initial={year} /> {brand}
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
