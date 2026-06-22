import fs from 'fs';
import path from 'path';

function findRouteFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findRouteFiles(filePath, fileList);
    } else if (file === 'route.ts') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const routes = findRouteFiles('./src/app/api');

routes.forEach(routePath => {
  let content = fs.readFileSync(routePath, 'utf8');
  let changed = false;

  // Add import if not exists
  if (content.includes('export const POST') || content.includes('export const PUT') || content.includes('export const DELETE')) {
    if (!content.includes('import { logActivity }')) {
      content = 'import { logActivity } from "@/utils/logger";\n' + content;
      changed = true;
    }
  }

  const endpointName = routePath.split(path.sep).slice(-2, -1)[0] || 'Resource';

  // Inject into POST
  if (content.includes('export const POST') && !content.includes("logActivity(req, 'CREATE'")) {
    content = content.replace(/(export const POST[^]*?await connectToDatabase\(\);)/, "$1\n    const reqClone = req.clone();");
    content = content.replace(/(return NextResponse\.json\()/g, `await logActivity(req, 'CREATE', '${endpointName}', 'Created a new entry');\n    $1`);
    changed = true;
  }

  // Inject into PUT
  if (content.includes('export const PUT') && !content.includes("logActivity(req, 'UPDATE'")) {
    content = content.replace(/(return NextResponse\.json\()/g, `await logActivity(req, 'UPDATE', '${endpointName}', 'Updated an entry');\n    $1`);
    changed = true;
  }

  // Inject into DELETE
  if (content.includes('export const DELETE') && !content.includes("logActivity(req, 'DELETE'")) {
    content = content.replace(/(return NextResponse\.json\()/g, `await logActivity(req, 'DELETE', '${endpointName}', 'Deleted an entry');\n    $1`);
    changed = true;
  }

  if (changed) {
    // Basic injection: we need to be careful. Let's just write to console to see what it would do.
    // Actually, writing a regex to correctly inject before `return NextResponse` inside the try block is very risky.
  }
});

console.log("Found " + routes.length + " route files.");
