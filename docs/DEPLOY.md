# Deployment

This is a small Express + Vite project. You have three reasonable deployment paths.

> ⚠️ **Do not deploy only the frontend to Netlify with the backend running on localhost.**
> The deployed site will silently fail because `/api/*` won't resolve. Either deploy both, or share the demo locally (screenshare / Loom).

## Option A — Render (single service, simplest)

Render can host the Express backend AND serve the Vite-built frontend from the same service.

1. Push the repo to GitHub.
2. On [render.com](https://render.com), create a new **Web Service** pointing at the repo.
3. **Root directory:** leave blank (Render sees the whole repo).
4. **Build command:**
   ```
   cd frontend && npm install && npm run build && cd ../backend && npm install
   ```
5. **Start command:**
   ```
   cd backend && node server.js
   ```
6. **Environment:** Node 20+.

To make the Express backend serve the built frontend in production, add this to `backend/server.js` before the 404 handler:

```js
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendDist));
// catch-all so client routes work
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});
```

Free tier sleeps after inactivity. First request takes ~30s to wake. Fine for a demo.

## Option B — Render (backend) + Netlify (frontend)

Two services. Use this if you already have Netlify wired up to your portfolio.

**Backend on Render:**
1. New Web Service → root directory `backend` → build `npm install` → start `node server.js`.
2. Copy the public URL (something like `https://careflow-bridge.onrender.com`).

**Frontend on Netlify:**
1. Add a `frontend/.env.production` file:
   ```
   VITE_API_BASE=https://careflow-bridge.onrender.com
   ```
2. In `frontend/src/App.jsx` (and other fetch calls), use the env var:
   ```js
   const API = import.meta.env.VITE_API_BASE || "";
   fetch(`${API}/api/intake`, ...)
   ```
3. In Netlify, point at the `frontend` directory, build command `npm run build`, publish directory `dist`.
4. Make sure backend has CORS enabled for the Netlify domain (already enabled for all origins in this demo via the `cors` middleware).

## Option C — Railway

Same shape as Render but a different UI. Push to GitHub, point Railway at the repo, set:

- Root directory: `backend`
- Build: `npm install`
- Start: `node server.js`
- Add a separate service for the frontend or use the static-site service.

## Option D — Local only (perfectly fine for a 1:1 demo)

If the demo is a screenshare with Josh, just run it locally:

```powershell
# Terminal 1
cd backend && npm install && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev
```

Share your screen and walk through it. No deployment risk.

## Recommendation

**Option A (single-service Render)** is the simplest path to a public URL you can put on your portfolio. ~10 minutes to wire up. Free tier is fine for a demo.

If you only have time for one path tonight: **Option D**. Get the screenshare demo polished first. Deploy later.

## Domain for the portfolio card

Once it's live, the public URL goes on your portfolio card under "View Demo". You can map it to a subdomain like `careflow.jquinn-dev.com` later if you want.
