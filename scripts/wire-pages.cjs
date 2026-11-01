const fs = require("fs");
const root = "src/app/(public pages)/";
const edit = (file, fn) => { const p = root + file; let s = fs.readFileSync(p, "utf8"); if (s.includes("@/studio/")) { console.log("skip", file); return; } s = fn(s); fs.writeFileSync(p, s); console.log("wired", file); };
const addImports = (s, imps) => imps + "\n" + s;
const tailFrom = (s, marker) => { const i = s.indexOf(marker); if (i < 0) throw new Error("marker " + marker); return s.slice(0, i); };

const simple = (file, imp, comp, marker = "export default async function") => edit(file, (s) => addImports(tailFrom(s, marker) + `export default function Page() {\n  return <${comp} />;\n}\n`, imp));
simple("about/page.tsx", 'import AboutStudio from "@/studio/pages/AboutStudio";', "AboutStudio");
simple("services/page.tsx", 'import ServicesStudio from "@/studio/pages/ServicesStudio";', "ServicesStudio");
simple("portfolio/page.tsx", 'import PortfolioStudio from "@/studio/pages/PortfolioStudio";', "PortfolioStudio");
simple("blog/page.tsx", 'import BlogStudio from "@/studio/pages/BlogStudio";', "BlogStudio");
simple("training/page.tsx", 'import TrainingStudio from "@/studio/pages/TrainingStudio";', "TrainingStudio");
simple("contact/page.tsx", 'import ContactStudio from "@/studio/pages/ContactStudio";', "ContactStudio");
simple("career/page.tsx", 'import CareerStudio from "@/studio/pages/CareerStudio";', "CareerStudio", "async function careerPage()");

for (const [f, name, page] of [["privacy-policy/page.tsx", "getPrivacyPolicyPageData", "privacy"], ["terms-and-conditions/page.tsx", "getTermsAndConditionPageData", "terms"]]) {
  edit(f, (s) => addImports(tailFrom(s, "export default async function") + `export default async function Page() {\n  const data = await ${name}();\n  if (!data?._id) {\n    return (\n      <main className="page"><section className="pagehead"><div className="wrap"><h1 className="h-xl">No Data Found</h1></div></section></main>\n    );\n  }\n  return <LegalStudio data={data} page="${page}" />;\n}\n`, 'import LegalStudio from "@/studio/pages/LegalStudio";'));
}

const retail = (file, imp, newReturn) => edit(file, (s) => {
  const d = s.indexOf("export default async function");
  const re = /\r?\n  return \(\r?\n\s*<main/g;
  const m = re.exec(s.slice(d)); if (!m) throw new Error("return in " + file);
  return addImports(s.slice(0, d + m.index) + "\n" + newReturn + "\n}\n", imp);
});

retail("blog/[slug]/page.tsx", 'import DetailStudio from "@/studio/pages/DetailStudio";\nimport { fmtDate as studioFmtDate } from "@/studio/ui";',
`  return (
    <DetailStudio
      kind="Blog"
      listHref="/blog"
      title={post.title}
      meta={\`\${post.category?.name || "Article"} · Published \${studioFmtDate(post.createdAt)}\`}
      category={post.category?.name}
      tags={(post as any).readingTime ? [\`\${(post as any).readingTime} min read\`] : []}
      cover={post.thumnail?.url}
      description={post.description}
      html={post.content}
      prev={prevPost ? { href: \`/blog/\${prevPost.slug}\`, title: prevPost.title } : null}
      next={nextPost ? { href: \`/blog/\${nextPost.slug}\`, title: nextPost.title } : null}
      schema={schema}
    />
  );`);

retail("services/[slug]/page.tsx", 'import DetailStudio from "@/studio/pages/DetailStudio";\nimport { fmtDate as studioFmtDate } from "@/studio/ui";',
`  return (
    <DetailStudio
      kind="Service"
      listHref="/services"
      title={service.title}
      meta={\`Published \${studioFmtDate(service.createdAt)}\`}
      category={service.category}
      cover={service.thumnail?.url}
      description={service.description}
      html={service.content}
      prev={prevService ? { href: \`/services/\${prevService.slug}\`, title: prevService.title } : null}
      next={nextService ? { href: \`/services/\${nextService.slug}\`, title: nextService.title } : null}
    />
  );`);

retail("portfolio/[title]/page.tsx", 'import CaseStudio from "@/studio/pages/CaseStudio";\nimport { getPortfoliosData as studioPortfolios } from "@/utils/pageData";',
`  const all = ((await studioPortfolios(999)) as any[]) || [];
  const idx = all.findIndex((x) => x.slug === portfolio.slug);
  const nx = idx >= 0 ? all[(idx + 1) % all.length] : null;
  const pv = idx >= 0 ? all[(idx - 1 + all.length) % all.length] : null;
  return (
    <CaseStudio
      p={portfolio}
      next={nx && nx.slug !== portfolio.slug ? { href: \`/portfolio/\${nx.slug}\`, title: nx.title } : null}
      prev={pv && pv.slug !== portfolio.slug ? { href: \`/portfolio/\${pv.slug}\`, title: pv.title } : null}
    />
  );`);

retail("career/[slug]/page.tsx", 'import JobStudio from "@/studio/pages/JobStudio";', `  return <JobStudio job={career} />;`);
