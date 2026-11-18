import Link from "next/link";
import { getFooter, getSiteConfig } from "./data";
import StudioSubscribe from "./StudioSubscribe";
import FooterAcc, { CopyrightYear } from "./FooterAcc";
import { BRAND, resolvePhones } from "./brand";

const Copy = ({ value, label }: { value: string; label?: string }) => (
  <button className="copy" type="button" data-copy={value}>
    {label ?? value} <small>Copy</small>
  </button>
);

export default async function Footer() {
  const [site, footer] = await Promise.all([getSiteConfig(), getFooter()]);
  const emails = site?.contact?.emails ?? (site?.contact?.primaryEmail ? [site.contact.primaryEmail] : []);
  const resolved = resolvePhones(site);
  const phones = [resolved.us, resolved.bd];
  const offices = site?.offices ?? [];
  const pages = footer?.pages?.links ?? [];
  const brand = site?.brand?.name || "Webtricker";
  const year = new Date().getFullYear();

  return (
    <footer className="finale" id="footer">
      <div className="wrap">
        <div className="eyebrow mono mute">
          <span>Have a project in mind?</span>
          <Link className="neonlink" href="/contact">
            Contact Us <i aria-hidden="true">→</i>
          </Link>
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
                <li key={p.tel}>
                  <Copy value={p.tel} label={`${p.label} · ${p.display}`} />
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
            <p className="flinks">
              <a href={BRAND.mapsUrl} target="_blank" rel="noopener noreferrer">
                Find us on Google Maps ↗
              </a>
              <a href={BRAND.reviewUrl} target="_blank" rel="noopener noreferrer">
                Review us on Google ↗
              </a>
            </p>
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
            © 2014–<CopyrightYear initial={year} /> {BRAND.legalName} · {BRAND.bdName} (Bangladesh)
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
