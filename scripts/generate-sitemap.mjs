import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://russverse.vercel.app";
const TODAY = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { path: "", priority: "1.0", changefreq: "daily" },
  { path: "/learn", priority: "0.95", changefreq: "daily" },
  { path: "/practice", priority: "0.90", changefreq: "daily" },
  { path: "/review", priority: "0.90", changefreq: "daily" },
  { path: "/progress", priority: "0.85", changefreq: "weekly" },
];

const unitUrls = [];
for (let i = 1; i <= 220; i++) {
  const unitId = `unit-${String(i).padStart(3, "0")}`;
  unitUrls.push({
    path: `/lesson/${unitId}`,
    priority: i <= 16 ? "0.85" : i <= 60 ? "0.80" : "0.75",
    changefreq: "weekly",
  });
}

const allUrls = [...staticRoutes, ...unitUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${BASE_URL}${u.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <image:image>
      <image:loc>${BASE_URL}/og-image.png</image:loc>
      <image:title>RussVerse Russian Language Mastery</image:title>
    </image:image>
  </url>`,
  )
  .join("\n")}
</urlset>`;

const outputPath = path.resolve(process.cwd(), "public/sitemap.xml");
fs.writeFileSync(outputPath, xml, "utf-8");
console.log(`Successfully generated sitemap.xml with ${allUrls.length} indexed URLs at ${outputPath}`);
