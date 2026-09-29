# FakeProfile Shield - Frontend

Investigator-facing web UI for **Fake Social Media Profile Detection and Reporting System** (Team G-9, SVVV Indore, Jul-Dec 2026).
Pure HTML/CSS/JS - no build step, no dependencies.

## Status

🚧 **In progress.** Frontend/UI is complete and functional as a standalone demo. Backend and model integration are planned for later this project cycle.

- ✅ Frontend UI (all pages, routing, mock data layer)
- ✅ Mock scoring/API layer designed to swap cleanly to a live backend
- 🔲 Backend API
- 🔲 Trained classifier (RandomForest / GradientBoosting)
- 🔲 LLM-based content analysis module
- 🔲 Live model integration into dashboard

Model Insights metrics and profile data shown in the demo are **mock/placeholder** until the backend and Kaggle-trained models are connected.

## Run

- Double-click `index.html`, **or**
- `npx serve . -l 5173` (or `npm start`), then open <http://localhost:5173>

Demo login: any email/password.

## Structure
```
index.html          entry point
css/style.css       theme (light/dark), layout, components
js/api.js           config, mock data + scoring, API layer (mock <-> live)
js/components.js    gauge, meters, tables, app shell
js/pages.js         all pages (landing, login, dashboard, analyze, profiles, batch, reports, model, team, settings)
js/actions.js       event handlers, profile detail, report view
js/router.js        hash router + auth guard
docs/API_CONTRACT.md  endpoints the backend must provide
```

Scripts are plain (non-module) files loaded in order, so the app also works from `file://`.

## Pages

Landing, Login, Dashboard, Analyze Profile, Flagged Profiles (+ detail), Batch Screening, Reports (+ printable report / PDF), Model Insights, Project & Team, Settings.

## Design decision: mock/live API split

The API layer (`js/api.js`) is built to swap between mock data and a live backend without touching the UI code — `docs/API_CONTRACT.md` defines the exact endpoints the backend needs to implement. This was intentional: the frontend was built ahead of the backend, so it needed to work standalone now and plug into the real classifier later without a rewrite.

## Deploy on GitHub Pages

Repo -> Settings -> Pages -> Deploy from branch `main` / root.
