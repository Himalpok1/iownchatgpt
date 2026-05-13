import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, ".hostinger-deploy");
const bundleDir = path.join(outDir, "bundle");

async function main() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(bundleDir, { recursive: true });

  await cp(path.join(root, ".next", "standalone"), bundleDir, { recursive: true });
  await cp(path.join(root, ".next", "static"), path.join(bundleDir, ".next", "static"), {
    recursive: true,
  });
  await cp(path.join(root, "public"), path.join(bundleDir, "public"), { recursive: true });

  const packageJson = JSON.parse(
    await readFile(path.join(root, "package.json"), "utf8")
  ) as {
    name: string;
    version: string;
  };

  const readme = `
Hostinger Node.js deployment bundle for ${packageJson.name}@${packageJson.version}

Contents:
- server.js and runtime files from Next.js standalone output
- .next/static assets
- public assets

Important:
- This bundle is for Hostinger Node.js app deployment, not plain static FTP-only hosting.
- Required environment variables must be configured in Hostinger before start:
  DATABASE_URL
  GOOGLE_CLIENT_ID
  GOOGLE_CLIENT_SECRET
  AUTH_SECRET or NEXTAUTH_SECRET
  NEXTAUTH_URL
  GEMINI_API_KEY
  ADMIN_EMAILS
  EDITORIAL_CRON_SECRET

Suggested start command:
node server.js
  `.trimStart();

  await writeFile(path.join(outDir, "README.txt"), readme, "utf8");

  console.log(`Prepared Hostinger bundle at ${outDir}`);
  console.log(`Bundle root: ${bundleDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
