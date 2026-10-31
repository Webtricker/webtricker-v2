# Webtricker: SEO / AEO / GEO / SXO / AIO action plan

Audit date: 2026-10-29. Method: crawled the live site (`webtricker.com`: 8 core pages, one of each dynamic type, sitemap, robots, headers) and read the code that generates it.

Terms used here: **AEO** answer-engine optimization (featured snippets, voice, Perplexity-style answers), **GEO** generative-engine optimization (ChatGPT, Claude, Gemini citing you), **SXO** search-experience optimization (intent match + page experience + conversion), **AIO** Google AI Overviews / AI-assistant visibility. "FXO" is not a standard term; this plan treats it as **funnel/friction experience optimization** (getting visitors from article to booked call). Tell me if you meant something else.

---

## 1. What is already good

- Every key page has a unique title, meta description, canonical URL, Open Graph and Twitter tags.
- 0 images missing `alt` across ~1,000 images on the pages sampled.
- `http://` and `www.` both 308-redirect to `https://webtricker.com`; junk URLs return a real 404.
- `robots.txt` + `sitemap.xml` exist (91 URLs); `lang="en"`, mobile viewport set.
- One `ProfessionalService` JSON-LD block with address, phone, hours and sameAs links.

## 2. Fixed in code during this session (not yet deployed)

| Issue found | Fix |
|---|---|
| Organization + WebSite schema was injected by JavaScript only, so crawlers that skip JS (and most AI bots) never saw it | Now server-rendered in `app/layout.tsx` |
| Sitemap listed `/training/1` to `/training/9`; those URLs return a "Course Not Found" noindex page (soft 404) | Sitemap now lists the real published course slugs |
| Every sitemap `lastmod` was "now", which Google learns to ignore | Removed where the true date is unknown; kept real `updatedAt` for careers and courses |
| `/portfolio` had no `<h1>` | Hero title is now the H1 |
| Blog posts had no article structured data | Added `BlogPosting` + `BreadcrumbList` JSON-LD |
| No `llms.txt` for AI assistants | New `/llms.txt` (services + latest articles, refreshed daily) |
| No security headers (also a trust/ranking-adjacent signal) | HSTS, CSP baseline, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy |
| New page for lead capture | `/free-consultation` with FAQ schema, in the sitemap, linked from Contact |

## 3. Needs your action (cannot be fixed in code alone)

1. **Google Analytics and Tag Manager are not actually loading.** The IDs `G-F53LQ46RXD` and `GTM-T26D8442` are only printed as `<meta>` tags in `layout.tsx`. Only Microsoft Clarity and Vercel Speed Insights run. You currently have no GA4 traffic, goal or conversion data. Install the GTM container (or `gtag.js`) and add a `generate_lead` event on booking success, contact submit and newsletter verify. Because this adds third-party tracking, add a consent banner if you serve EU/UK visitors.
2. **Logo URL is broken.** Site Config says `https://webtricker.com/logo.png`, which returns 404, and it feeds the schema `logo` field (needed for Google's logo / knowledge-panel eligibility). Upload the real logo in the Media Library and set it under Settings > Site Config > brand logo. (The only logo-like file in the repo is a leftover "accompanied" template logo; do not use it.)
3. **Search Console + Bing Webmaster:** re-submit `sitemap.xml` after deploy, inspect `/free-consultation`, and check Pages > "Soft 404" and "Alternate page with proper canonical" counts.
4. **Career URL canonical mismatch:** `/career/marketing-and-business-growth-strategist` declares canonical `/career/senior-marketing-business-growth-strategist-jamalpur`. Pick one slug, 301 the other, and keep the sitemap on the canonical one.

## 4. Content / on-page fixes (highest ROI first)

1. **Titles over ~60 characters get truncated in results.** Blog titles are 82 and 88 characters; a career title is 96. Shorten the `<title>` (the template already appends "| Webtricker"), e.g. keep the keyword phrase within the first 50 characters.
2. **Meta descriptions:** `/services` (109), `/portfolio` (89), `/career` (82) and the homepage (107, generic default) are short; career detail is 186 (cut off). Aim for 140-160 characters with a benefit and a call to action ("Book a free consultation").
3. **Heading structure:** `/blog`, `/contact` and `/career` have an H1 but no H2; blog posts go H1 to H3 (one H2, twelve H3). Use H2 for main sections and H3 only beneath them. Portfolio detail pages (`/portfolio/tkween-design`) have an H1 and nothing else: add problem / solution / results sections with numbers.
4. **Category pages** use database IDs (`/category/6878f1...`) and have one-line descriptions ("Explore our blog posts about Affiliate."). Move to keyword slugs, add a 100-150 word intro, or `noindex` the thin ones.
5. **Add `manifest`** to the root metadata (`/manifest.json` exists but is not linked).
6. **Homepage weight:** 391 KB HTML and 119 images. Confirm below-the-fold images are lazy-loaded and measure LCP/INP in Search Console's Core Web Vitals report (recent commits already tackled CLS).

## 5. Structured data to add next

You have `ProfessionalService`, and now `Organization`, `WebSite`, `BlogPosting`, `BreadcrumbList` and `FAQPage` (on the consultation page). Add, in this order:

1. `Service` + `FAQPage` on every `/services/[slug]` (3-5 real questions each).
2. `Review` / `AggregateRating` from the Testimonials you already store (only if the ratings are genuine and visible on the page).
3. `Course` on training pages; `JobPosting` on career pages; `CreativeWork` (or `Article`) on portfolio case studies.
4. `Person` for authors and leadership with `sameAs` to LinkedIn. Blog posts currently credit "Webtricker" only.

## 6. AEO (answer engines, featured snippets, voice)

- Under each H2 that is a question ("How much does a business website cost?"), put a 40-60 word direct answer first, then the detail. This is the format snippets and assistants quote.
- Add a visible FAQ block to each service page and the top 10 blog posts; mirror it in `FAQPage` JSON-LD.
- Use comparison tables and numbered steps (HowTo-style content) for "vs" and "how to" queries.
- Publish pricing ranges or "what affects the price" content; assistants prefer pages that state concrete numbers.

## 7. GEO / AIO (ChatGPT, Claude, Gemini, Perplexity, AI Overviews)

- `llms.txt` is added. Keep AI crawlers allowed (`robots.txt` currently allows all). Do not block `Googlebot`, `GPTBot`, `ClaudeBot`, `PerplexityBot` or `Google-Extended` unless you decide you do not want to be cited.
- Models cite brands they can verify across the web: keep name, address, phone and description **identical** on LinkedIn, Facebook, Clutch, GoodFirms, DesignRush, Crunchbase, Google Business Profile and your site; link them via `sameAs`.
- Publish original, citable material: case studies with before/after numbers, a yearly "state of web performance for small businesses" data post, benchmark results from your own client work.
- Show expertise (E-E-A-T): named authors with bios and credentials, dates ("updated October 2026"), and links to primary sources.
- Add short, self-contained definition paragraphs ("What is technical SEO?") near the top of pillar pages so they can be lifted verbatim.

## 8. SXO and FXO (intent, experience, conversion)

- Put the new **Book a free consultation** CTA where intent is highest: header button (edit in Settings > Header), end of every blog post, every service page hero and the footer. Right now it is linked only from Contact.
- Match each page to one intent: services = "hire", blog = "learn", portfolio = "prove". End each with the next step toward the consultation.
- Track the funnel: blog view > service view > `/free-consultation` view > booking. Set up as GA4 events once item 3.1 is done, then look at drop-off per step.
- Keep the booking flow short (it is: date, time, 3 required fields). Review the cancellation and no-show rate in Settings > Consultations.
- Speed is part of experience: target LCP < 2.5 s, INP < 200 ms, CLS < 0.1 on mobile.

## 9. Local and link-building (biggest remaining lever)

- Create / complete a **Google Business Profile** for each office (the schema lists US and Dhaka) with services, photos and hours; ask clients for reviews.
- Target location + service pages with real content (e.g. "web design agency in Dhaka", "web development company in [US city]"), not thin doorway pages.
- Earn links: agency directories (Clutch, GoodFirms, DesignRush, Sortlist), guest posts, client-site credits ("Built by Webtricker"), and open-source or free-tool outreach.
- Internal links: every blog post should link to the one most relevant service page and one related article, with descriptive anchor text.

## 10. 30-day order of work

| Week | Do |
|---|---|
| 1 | Deploy this branch; install GA4/GTM + conversion events; fix logo; resubmit sitemap in Google and Bing |
| 2 | Fix titles/descriptions; heading structure; career canonical; category pages |
| 3 | Add Service + FAQ schema and visible FAQs to service pages; consultation CTAs site-wide |
| 4 | Business profiles + directory listings; first data/case-study post; review Search Console for new errors |
