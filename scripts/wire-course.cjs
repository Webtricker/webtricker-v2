const fs = require("fs");
const p = "src/app/(public pages)/training/[id]/page.tsx";
let s = fs.readFileSync(p, "utf8");
if (s.includes("@/studio/")) { console.log("skip"); process.exit(0); }
const i = s.indexOf("  const hasInstructor");
if (i < 0) throw new Error("marker");
s = s.slice(0, i) + "  return <CourseStudio course={course as any} />;\n}\n";
s = s.replace('import Button from "@/sharedComponets/ui/buttons/Button";\nimport Link from "next/link";\n', 'import CourseStudio from "@/studio/pages/CourseStudio";\n');
s = s.replace('import PackageSelector from "./PackageSelector";\n', "");
fs.writeFileSync(p, s);
fs.unlinkSync("src/app/(public pages)/training/[id]/PackageSelector.tsx");
console.log("wired");
