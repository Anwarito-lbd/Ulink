# Proof of Work — uLink v1

> **Successor Notice:** uLink v1 is succeeded by **[Propel](https://github.com/Anwarito-lbd/propel)**.

All checks below were executed on the `docs/readme-refresh` branch in a clean local environment.

## 1. Automated Verification Summary

| Check | Command | Observed Result |
| :--- | :--- | :--- |
| Linter & Formatter | `npm run lint` (`biome check .`) | **Passed** — Checked 9 files, 0 errors |
| JS Syntax Check | `npm run check:js` (`node --check app.js`) | **Passed** — Exit code 0 |
| Playwright E2E Suite | `npm run test:e2e` (`playwright test`) | **2/2 passed** (10.8s) |

### Playwright E2E Test Cases (`tests/ulink.spec.js`)
1. `profile submit shows recommendations and persists across reload` — **PASSED (2.5s)**
2. `filtering by bourses returns scholarship entries only` — **PASSED (688ms)**

## 2. Dataset Inspection (`data/opportunities.json`)
- `total`: **321** normalized items
- `sources.canadian`: **139**
- `sources.aiJobs`: **180**
- `sources.scholarships`: **2**

## 3. Visual Artifacts Captured (`docs/images/`)
- `docs/images/ulink-desktop.png` — Live desktop UI (`1280×800`) after profile submission showing ranked matches
- `docs/images/ulink-mobile.png` — Live mobile UI (`390×844`) verifying responsive layout
- `docs/images/ulink-architecture.png` — Static build & client-side scoring architecture diagram
- `docs/images/ulink-walkthrough.mp4` & `docs/images/ulink-walkthrough.gif` — Playwright screen-recorded walkthrough of profile submission, live ranking, and scholarship filtering
