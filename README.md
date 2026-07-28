# Byron Xavier Mataya — Resume

Professional resume site hosted for free on **GitHub Pages**, with one-click PDF download.

**Live site:** [https://byron02.github.io/resume/](https://byron02.github.io/resume/)

## Features

- **Unlock gate** — hold-to-unlock intro before credentials appear (Enter / Esc also works)
- **Interactive web** — particle field, custom cursor, typed title, magnetic buttons, 3D tilt cards, scroll reveals, reading progress
- **Designed PDF** — branded two-column layout with blue sidebar (not a plain generic CV)
- Edit once in [`data.js`](data.js); both views update
- Free GitHub Pages hosting (no Firebase)

## Edit your resume

Update content in [`data.js`](data.js) only. The website and the downloadable PDF both read from that file.

```bash
git add .
git commit -m "Update resume content"
git push origin main
```

## Enable GitHub Pages (one-time)

1. Open the repo on GitHub → **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, choose **GitHub Actions** (workflow included), or **Deploy from a branch** → `main` / `/ (root)`.
3. Visit [https://byron02.github.io/resume/](https://byron02.github.io/resume/).

## Download PDF

Open the site and click **Download Resume** / **Download PDF**, then choose **Save as PDF** in the print dialog.

## Compared to the Firebase portfolio version

The earlier dynamic site (`resume-site`) used Firebase for live editing. This repo stays **static** so it deploys cleanly on free GitHub Pages with no cloud bill, API keys, or open database rules.
