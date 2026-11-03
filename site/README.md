# جستجو · Jostoju website

Persian-first (right to left at `/`), English at `/en/`. Static HTML, CSS and JS with no dependencies.

**The idea:** the website is a quest for the lost dot. The dot of «جو» (seek) has left the logotype and
travels the page. It slips away from the cursor in the hero, becomes the full stop of the manifesto, marks
what you're reading, completes the Missing Knot medallion (which becomes the showreel's play button), walks
through the seven valleys, and at the end drops back under its ج so the word is whole.

```bash
cd site
node build.mjs          # builds dist/ (the real site) and preview/ (self-contained review copy)
node serve.mjs dist     # http://localhost:4321
```

| File | What it is |
|---|---|
| `src/pages.mjs` | All pages. Every string is written twice, natively: `t('فارسی', 'English')` |
| `src/site.css` | The pearl world: grounds, type, arches, curtains, pearl strings |
| `src/site.js` | The lost dot: stations, travel, hover, the seven-valley walk, "found" moments |
| `src/marks.json` | Logo marks and the dot's landing points, exported from `brand/` by `tools/export_svg.py` |
| `build.mjs` · `serve.mjs` | Build and local preview |

**The dot's stations:** any element with `data-station` is a place the dot can land. Optional attributes:
- `data-fill="1"`: the dot arrives solid, meaning found.
- `data-group`: stations that compete; the hovered one wins.
- `data-seq`: the dot visits the stations inside in order as you scroll.
- `data-found-target`: the element that gets `.found` while the dot is docked.

**Still to fill in:**
- **Showreel:** the video is a placeholder dialog until the reel exists.
- **Work and Pardeh pages:** these show "coming soon" cards.
- **Domain and email:** `jostoju.studio` and `hello@jostoju.studio` are placeholders, set in `build.mjs` and `src/pages.mjs`.
- **Contact form:** set `data-endpoint` in `src/pages.mjs` to a form service (Formspree, Basin or similar). Until then the form says it isn't connected and points to the email.

**Deploying:** upload `dist/` to any static host (Netlify, Cloudflare Pages, GitHub Pages, Vercel).
