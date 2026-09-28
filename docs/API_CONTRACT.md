# Backend API Contract (for Paridhi)

Base URL: `http://localhost:8000/api` (change in the app under Settings, or `CFG.API_BASE` in `js/api.js`).
Enable CORS for the frontend origin (e.g. `http://localhost:5173`). Auth: `Authorization: Bearer <token>`.

| Method | Path | Body | Response |
|---|---|---|---|
| POST | /auth/login | `{email,password}` | `{token}` |
| POST | /analyze | `{username,platform,followers,following,posts,age_days,bio,captions}` | Profile (below) |
| GET | /profiles | – | `[Profile]` |
| GET | /profiles/{id} | – | `Profile` |
| PATCH | /profiles/{id} | `{status}` (Open/Escalated/Dismissed) | `Profile` |
| POST | /batch | `{usernames:[str]}` | `[Profile]` |
| POST | /reports | `{profile_id}` | `{id,created}` |
| GET | /reports | – | `[Report]` |
| GET | /metrics | – | model metrics (accuracy, precision, recall, f1, roc_auc per model, feature importance) |

## Profile object
```json
{
  "id": 1, "username": "x", "platform": "Instagram",
  "followers": 10, "following": 900, "posts": 2, "age_days": 5,
  "bio": "...", "captions": "...", "status": "Open", "date": "2026-09-28",
  "ml": 0.82, "llm": 0.55, "risk": 0.71,
  "features": [["Follower/following ratio", 0.9], ["Account age", 0.95]],
  "flags": ["crypto", "possible impersonation"],
  "verdict": "Suspicious content detected",
  "rationale": "..."
}
```
`ml`, `llm`, `risk` are 0-1. `risk = 0.6*ml + 0.4*llm` (weights configurable).
`features` = `[label, contribution 0-1]` pairs.

## Going live
1. Implement endpoints above.
2. In the app: Settings -> Mode: Live backend -> set API URL -> Save.
3. Replace the mock screen data reads in `js/pages.js` / `js/actions.js` (which read `DB.profiles`) with `await API.profiles()` etc. - helpers already exist in `js/api.js`.
