# study-timer

A retro-futurist Vue 3 focus timer with CRT phosphor displays, cassette-deck controls, and industrial HUD panels inspired by sci-fi terminal aesthetics (ALIEN-era interfaces, tape-deck futurism).

## Features

- Phosphor countdown display with segmented tape counter and progress rail
- Six CRT profiles (amber, sepia, cyan, mono, violet, custom accent; green/red for status)
- Configuration terminal with module codes and preset duration matrix
- Scanlines, grid overlay, status LEDs, and tab-title telemetry
- Fullscreen deck mode · preferences saved in-browser

## Project setup

```bash
npm install
```

### Development

```bash
npm run serve
```

### Production build

```bash
npm run build
```

Built files are output to `dist/`.

### GitHub Pages (portfolio demo)

This app is built for a subdirectory on [VioletTides.github.io](https://github.com/VioletTides/VioletTides.github.io):

`https://violettides.github.io/projects/timer/demo/`

From this repo, build and copy into your portfolio clone:

```bash
npm run deploy:pages
```

By default that writes to `../VioletTides.github.io/public/projects/timer/demo/` (sibling repo under `Documents/git/`). Vite copies `public/` into `dist/` on build, which is what GitHub Pages deploys. Override the path if needed:

```bash
PORTFOLIO_DIR=/home/robin/Documents/git/VioletTides.github.io npm run deploy:pages
```

Then commit and push the portfolio repo:

```bash
cd ../VioletTides.github.io
git add public/projects/timer/demo
git commit -m "Add study timer demo"
git push
```

Pushes to `main` rebuild the portfolio via GitHub Actions and publish `dist/`, including the demo.

Link from your portfolio with a trailing slash: `/projects/timer/demo/`

### Portfolio project thumbnail

Regenerate the Mother amber homescreen screenshot (requires dev server on port 8081 and ImageMagick):

```bash
npm run serve   # separate terminal
npm run capture:thumb
```
