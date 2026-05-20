import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.resolve(
  repoRoot,
  "../VioletTides.github.io/public/assets/projects"
);
const outPng = path.join(outDir, "study-timer.png");
const outWebp = path.join(outDir, "study-timer.webp");
const writeWebp = process.env.SKIP_WEBP !== "1";

const appUrl = process.env.TIMER_URL || "http://localhost:8081/";

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
});

await page.goto(appUrl, { waitUntil: "networkidle" });
await page.evaluate(() => {
  localStorage.setItem(
    "study-timer-settings",
    JSON.stringify({
      timeSync: 30,
      backgroundId: "mother",
      customAccent: "#ffb84a",
    })
  );
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(600);

await page.locator(".config-popover").count().then(async (n) => {
  if (n > 0) {
    await page.getByLabel("Close configuration").click();
    await page.waitForTimeout(200);
  }
});

const shell = page.locator(".app-shell");
await shell.waitFor({ state: "visible" });
await shell.screenshot({ path: outPng, type: "png" });

await browser.close();

if (writeWebp) {
  const { execSync } = await import("child_process");
  try {
    execSync(
      `magick "${outPng}" -quality 88 "${outWebp}"`,
      { stdio: "inherit" }
    );
    console.log(`Wrote ${outWebp}`);
  } catch {
    console.warn("ImageMagick not found; kept PNG only.");
  }
}

console.log(`Wrote ${outPng}`);
