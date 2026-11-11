export type StudioOffice = {
  label: string;
  country?: string;
  locality?: string;
  addressText: string;
};

export type StudioSiteConfig = {
  brand?: { name?: string };
  contact?: { primaryEmail?: string; primaryPhone?: string; emails?: string[]; phones?: string[] };
  offices?: StudioOffice[];
};

const base = () => process.env.NEXT_PUBLIC_BASE_URL;
/** Cache key changes with each deploy so CMS/image updates never wait on a stale data cache. */
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA || "dev").slice(0, 7);

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${base()}${path}${path.includes("?") ? "&" : "?"}b=${BUILD}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data ?? null) as T | null;
  } catch {
    return null;
  }
}

export const getSiteConfig = () => getJson<StudioSiteConfig>("/api/site-config");

/** Small square logo mark (the five gems) from Settings > Logos. */
export const getSiteLogos = () =>
  getJson<{ smallLogo?: string }>("/api/settings/logos");

export type StudioLink = { label: string; href: string; isExternal?: boolean };
export const getNavLinks = async (): Promise<StudioLink[]> => {
  const d = await getJson<{ links?: StudioLink[] }>("/api/main-header");
  return d?.links ?? [];
};

export type StudioFooter = {
  description?: string;
  pages?: { title?: string; links?: StudioLink[] };
};
export const getFooter = () => getJson<StudioFooter>("/api/footer");
