# FakeProfile Shield - Frontend

Investigator-facing web UI for **Fake Social Media Profile Detection and Reporting System** (Team G-9, SVVV Indore, Jul-Dec 2026).
Pure HTML/CSS/JS - no build step, no dependencies.

## Run
- Double-click `index.html`, **or**
- `npx serve . -l 5173` (or `npm start`), then open http://localhost:5173

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

## Deploy on GitHub Pages
Repo -> Settings -> Pages -> Deploy from branch `main` / root.

## Note
Model Insights metrics and all profile data are **mock/placeholder** until the backend and Kaggle-trained models are connected.
