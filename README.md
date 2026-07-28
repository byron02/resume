# Byron — Resume

Personal resume site hosted for free on **GitHub Pages**.

**Live site:** [https://byron02.github.io/resume/](https://byron02.github.io/resume/)

## Edit your resume

1. Update content in [`index.html`](index.html) (name, contact, experience, education, skills, projects).
2. Tweak look in [`styles.css`](styles.css) if you want.
3. Commit and push to `main` — the site updates automatically after Pages is enabled.

```bash
git add .
git commit -m "Update resume content"
git push origin main
```

## Enable GitHub Pages (one-time)

If the live URL above does not load yet:

1. Open the repo on GitHub → **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, choose **GitHub Actions** (this repo includes a Pages workflow), or **Deploy from a branch** → `main` / `/ (root)`.
3. Wait a minute, then visit [https://byron02.github.io/resume/](https://byron02.github.io/resume/).

## Save as PDF

Open the live page (or `index.html` locally), then use your browser: **Print** → **Save as PDF**.

## Stack

- Static HTML + CSS (no build step)
- [IBM Plex](https://fonts.google.com/specimen/IBM+Plex+Sans) for typography
- GitHub Pages for hosting (free for public repos)
