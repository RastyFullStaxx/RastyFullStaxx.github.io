# Portfolio — Rasty C. Espartero

Personal portfolio for **Rasty C. Espartero**, full-stack developer (Taguig, Philippines).
Built as a single static page with no dependencies, no build step and no framework —
three files and an assets folder.

[GitHub](https://github.com/RastyFullStaxx) · [LinkedIn](https://www.linkedin.com/in/rastyespartero/)

---

## Running it

It's a static site. Any of these work:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. Under XAMPP, drop the folder in `htdocs`
and visit `http://localhost/portfolio/`. Opening `index.html` directly from
the filesystem also works, though the clipboard copy falls back to a legacy
path because `navigator.clipboard` needs a secure context.

## Files

| File | What's in it |
|------|--------------|
| `index.html` | Page structure and the overlay/dialog markup |
| `styles.css` | All styling, tokens at the top, responsive and reduced-motion at the bottom |
| `app.js` | Content data + every interaction |
| `assets/` | Portrait, CV, and photos for the Beyond section |

## Editing content

Everything is in the `DATA` block at the top of `app.js` — no HTML editing needed:

- `PROJECTS` — work gallery and case studies
- `BEYOND` — trainings, community, awards, scholarships
- `STACK` — skills by category, each tagged `core` / `working` / `basic`
- `TIMELINE` and `EDUCATION` — the experience section
- `MARQUEE` — the scrolling tech strip

To add photos to a Beyond entry, see `assets/beyond/.gitkeep`.

## What's under the hood

- **Hero** — a simplex-noise flow field rendered on canvas 2D, pausable, and
  suspended via `IntersectionObserver` when scrolled off screen.
- **Loader** — progress tracks real work: font loading, portrait decode and
  the window `load` event. Not a fake timer.
- **Reveals** — headings decrypt character by character, eyebrows typewrite,
  paragraphs stagger word by word.
- **Gallery** — filtering animates with FLIP; cards expand into their case
  study through the View Transitions API where supported, with a blur-scale
  fallback everywhere else.
- **Command palette** — `Ctrl`/`⌘` + `K` searches sections, projects and
  involvement entries.

### Accessibility

`prefers-reduced-motion` is honoured throughout: the loader skips, the particle
field renders one static frame instead of animating, reveals appear instantly
and pointer effects are disabled. Dialogs trap focus, restore it on close, and
close on `Escape`; the particle field has a manual pause control.

Layout is designed under Jakob's, Fitts's, Miller's, Hick's, Proximity and
Tesler's laws — see the comments in `index.html`.

## Deploying

Static hosting works anywhere. For **GitHub Pages**: Settings → Pages → deploy
from `main` / root. All paths are relative, so it works from a subpath such as
`rastyfullstaxx.github.io/portfolio/`.

Before sharing the link widely, set an absolute URL on the `og:image` and add
an `og:url` in `index.html` — link previews on Facebook, LinkedIn and X ignore
relative image paths.

---

© 2026 Rasty C. Espartero. Code is free to learn from; the written content,
CV and photographs are not for reuse.
