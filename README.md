# uLink

Students waste hours searching for the same internships and scholarships over and over. With uLink a student
builds a profile once and gets the most relevant opportunities matched to it.

_Version française : uLink répond au problème de recherche longue et répétée de stages et de bourses._

## Overview

- Opportunity data is aggregated from public Canadian tech internship and AI job lists, plus a curated scholarship list
- A build script normalizes those sources into `data/opportunities.json`
- The static web app scores each opportunity against the student's profile (field, city, remote preference, type) and ranks the results
- The profile stays in the browser (`localStorage`) and is never sent to a server
- Playwright end-to-end tests cover the main flow

## Demo / Screenshots

<!-- Add a screenshot of the matching screen under docs/ and link it here. Add a live URL once deployed. -->
_Screenshots coming soon._

## Architecture

```
external lists (Markdown)  ──►  scripts/build-opportunities.mjs  ──►  data/opportunities.json
                                                                           │
                                                   index.html + app.js  ◄──┘  (static, no backend)
```

## How it works

1. **Collect.** `scripts/build-opportunities.mjs` reads public internship and job lists (Markdown) and the curated scholarship list, and normalizes every entry into one shape: title, organization, field, location, type and link.
2. **Store.** The result is written to `data/opportunities.json`, so the site needs no backend or database.
3. **Profile.** The student fills in a short form (field, city, remote preference, opportunity type). It is saved in the browser only.
4. **Score.** `score()` in `app.js` gives points for a matching field and city, adjusts for the remote preference, and removes types the student didn't ask for.
5. **Show.** Opportunities are sorted by score, so the best matches come first.

## Project structure

| Path | What it is |
|---|---|
| `index.html`, `styles.css`, `app.js` | The whole web app: form, scoring and results list |
| `scripts/build-opportunities.mjs` | Data build: source lists to JSON |
| `data/opportunities.json` | Generated opportunity data |
| `tests/ulink.spec.js` | Playwright end-to-end test of the main flow |
| `Taskfile.yml`, `lefthook.yml`, `biome.json` | Task shortcuts, git hooks, lint/format config |

## Stack

JavaScript · HTML/CSS · Node.js (data build) · Playwright (e2e) · Biome (lint/format) · Task, mise, lefthook

## Local Setup

```bash
npm install
npx playwright install   # first time only
python3 -m http.server 5173   # or: task dev
```

Then open http://localhost:5173.

```bash
npm run lint
npm run test:e2e
```

To regenerate `data/opportunities.json`, clone the source lists next to this repo
(`../Canadian-Tech-Internships-2026` and `../2026-AI-College-Jobs`), then run `npm run build:data`.

## Documentation

The code is small, so these files are the best place to read further:

| File | What to read it for |
|---|---|
| [app.js](app.js) | `score()` is the matching logic; `render()` draws the results |
| [build-opportunities.mjs](scripts/build-opportunities.mjs) | How each source list is parsed and normalized |
| [ulink.spec.js](tests/ulink.spec.js) | The user flow the e2e test covers |
