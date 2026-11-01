import Link from "next/link";
import { getNavLinks, getSiteConfig, getSiteLogos } from "./data";
import { Roll, pad } from "./ui";

export default async function Header() {
  const [links, logos, site] = await Promise.all([
    getNavLinks(),
    getSiteLogos(),
    getSiteConfig(),
  ]);

  const brand = site?.brand?.name || "Webtricker";
  const nav = links.filter((l) => l.href !== "/contact");
  const email = site?.contact?.primaryEmail;
  const phone = site?.contact?.primaryPhone;
  const offices = (site?.offices ?? [])
    .map((o) => o.locality)
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <header className="top">
        <div className="wrap">
          <Link className="brand" href="/" aria-label={`${brand} home`}>
            {logos?.smallLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logos.smallLogo} alt="" />
            ) : null}
            <span>{brand}</span>
          </Link>
          <nav aria-label="Main">
            {nav.map((l) => (
              <Link key={l.href} href={l.href} data-nav={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="top__right">
            <Link className="pill magnetic" href="/contact" data-nav="/contact">
              <i />
              <Roll>Let&apos;s talk</Roll>
            </Link>
            <button
              className="burger magnetic"
              type="button"
              aria-label="Open menu"
              aria-expanded="false"
              aria-controls="menu"
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="wrap">
          <ul>
            {[{ label: "Home", href: "/" }, ...links].map((l, i) => (
              <li key={l.href}>
                <Link href={l.href} data-nav={l.href}>
                  <small>{pad(i + 1)}</small>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu__foot mono mute">
            {email ? <span>{email}</span> : null}
            {phone ? <span>{phone}</span> : null}
            {offices ? <span>{offices}</span> : null}
          </div>
        </div>
      </div>
    </>
  );
}
