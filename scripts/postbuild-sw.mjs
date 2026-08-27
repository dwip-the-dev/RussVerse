import fs from "node:fs";
import path from "node:path";

const outputPublic = path.resolve(process.cwd(), ".output/public");
const assetsDir = path.resolve(outputPublic, "assets");
const swTargetPublic = path.resolve(process.cwd(), "public/sw.js");
const swTargetOutput = path.resolve(outputPublic, "sw.js");

if (fs.existsSync(assetsDir)) {
  const assetFiles = fs.readdirSync(assetsDir);
  const assetUrls = assetFiles
    .filter((f) => f.endsWith(".js") || f.endsWith(".css") || f.endsWith(".svg") || f.endsWith(".png"))
    .map((f) => `/assets/${f}`);

  console.log(`[postbuild-sw] Found ${assetUrls.length} compiled client asset chunks in .output/public/assets.`);

  // Read existing public/sw.js
  let swContent = fs.readFileSync(swTargetPublic, "utf-8");

  // Replace STATIC_ASSETS array to include all compiled chunks
  const jsonAssets = JSON.stringify(assetUrls, null, 2);
  const injection = `const COMPILED_BUNDLES = ${jsonAssets};\nconst STATIC_ASSETS = [`;

  swContent = swContent.replace(/const STATIC_ASSETS = \[/, injection);
  swContent = swContent.replace(
    /await safePrecache\(cache, \[\.\.\.CORE_ROUTES, \.\.\.STATIC_ASSETS\]\);/,
    `await safePrecache(cache, [...CORE_ROUTES, ...STATIC_ASSETS, ...(typeof COMPILED_BUNDLES !== "undefined" ? COMPILED_BUNDLES : [])]);`,
  );

  // Write updated sw.js to both public/ and .output/public/
  fs.writeFileSync(swTargetPublic, swContent, "utf-8");
  if (fs.existsSync(outputPublic)) {
    fs.writeFileSync(swTargetOutput, swContent, "utf-8");
  }

  console.log(`[postbuild-sw] Successfully injected ${assetUrls.length} bundle chunks into public/sw.js & .output/public/sw.js!`);
} else {
  console.log("[postbuild-sw] .output/public/assets does not exist yet. Skipping.");
}
