const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const distDir = path.join(repoRoot, "dist");
const portfolioRoot = path.resolve(
  process.env.PORTFOLIO_DIR ||
    path.join(repoRoot, "../VioletTides.github.io")
);
const targetDir = path.join(portfolioRoot, "public/projects/timer/demo");

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.copyFileSync(src, dest);
}

function removeRecursive(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const entry of fs.readdirSync(dir)) {
    const entryPath = path.join(dir, entry);
    if (fs.statSync(entryPath).isDirectory()) {
      removeRecursive(entryPath);
    } else {
      fs.unlinkSync(entryPath);
    }
  }
  fs.rmdirSync(dir);
}

if (!fs.existsSync(distDir)) {
  console.error("Missing dist/. Run npm run build:pages first.");
  process.exit(1);
}

if (!fs.existsSync(portfolioRoot)) {
  console.error(`Portfolio repo not found: ${portfolioRoot}`);
  console.error("Set PORTFOLIO_DIR to your VioletTides.github.io clone path.");
  process.exit(1);
}

fs.mkdirSync(path.dirname(targetDir), { recursive: true });
removeRecursive(targetDir);
fs.mkdirSync(targetDir, { recursive: true });
copyRecursive(distDir, targetDir);

console.log(`Deployed to ${targetDir}`);
console.log("Run npm run build in the portfolio repo so dist/ includes the demo.");
console.log("Live URL: https://violettides.github.io/projects/timer/demo/");
