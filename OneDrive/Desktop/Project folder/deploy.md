# Deploy CivicEye with Render and Vercel

This guide deploys the Express API to Render and the React/Vite frontend to Vercel. In this GitHub repository, the CivicEye app is in the `OneDrive/Desktop/Project folder` subdirectory, not at the repository root. Set the project root directory to that relative path on both hosting services so they can find `package.json`.

## 1. Prepare and push the repository to GitHub

Run these commands in PowerShell from the project folder:

```powershell
npm install
npm run build
git init
git check-ignore -v server\.env
git status --short
```

Before committing, confirm that `server\.env`, `node_modules`, build output, and uploaded images are not listed as files to commit. **Never commit real MongoDB or Gemini credentials.** `.gitignore` prevents new untracked secret files from being added, but it does not remove a file already tracked by Git. If credentials were committed or shared, rotate them before deploying.

Create an empty repository on GitHub (do not initialize it with a README), then push this project:

```powershell
git branch -M main
git add .
git status --short
git commit -m "Initial CivicEye MVP"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the GitHub URL with your repository URL. Review `git status --short` before `git commit`; it should not list `.env` files, uploads, or `node_modules`.

## 2. Deploy the API on Render

1. In Render, create a **Web Service** and connect the GitHub repository.
2. Set **Root Directory** to `OneDrive/Desktop/Project folder` (relative to the GitHub repository root; do not include a drive letter).
3. Use these settings:
   - Runtime: **Node**
   - Build command: `npm install`
   - Start command: `npm start`
4. Add these environment variables in Render's Environment settings:

   | Key | Value |
   | --- | --- |
   | `MONGODB_URI` | Your Atlas connection string, with a database name such as `/civiceye` |
   | `GEMINI_API_KEY` | Your Gemini API key (optional; keep it only in Render/server environment settings) |
   | `GEMINI_MODEL` | `gemini-2.5-flash` |
   | `CLIENT_ORIGIN` | Your Vercel production origin, e.g. `https://your-project.vercel.app` |
   | `UPLOADS_DIR` | `/var/data/uploads` if using a Render persistent disk; otherwise leave unset |

   Render sets `PORT` automatically; the server uses it. Do not set `VITE_API_URL` on Render.

5. In MongoDB Atlas, create a database user with only the permissions needed for the CivicEye database. Add Render's outbound IP addresses to Atlas Network Access if available for your plan. For a quick MVP where Render's outbound IPs are not fixed, Atlas may require allowing access from `0.0.0.0/0`; this exposes the database to connection attempts from any IP, so use a strong unique database password and least-privilege database user.
6. Click **Create Web Service** and wait for the deployment to finish. Copy the service URL, for example `https://your-api.onrender.com`.
7. Check `https://your-api.onrender.com/api/health`. It should return JSON with `"status":"ok"`.

### Persisting uploaded photos

The MVP stores uploaded photos on the API filesystem. Render filesystems are ephemeral by default, so photos can disappear after a restart or redeploy. To retain them, attach a persistent disk to the Render service, mount it at `/var/data`, and set `UPLOADS_DIR=/var/data/uploads`. Confirm that persistent disks are available for the service plan you choose. For a production deployment without a persistent disk, move uploads to object storage (for example, S3 or Cloudinary).

## 3. Deploy the frontend on Vercel

1. In Vercel, **Add New → Project**, import the same GitHub repository.
2. Set **Root Directory** to `OneDrive/Desktop/Project folder`. The `vercel.json` in that directory builds the client workspace and publishes `client/dist`.
3. The production API defaults to `https://api-civiceye-ai.onrender.com`. If you deploy the backend under a different domain, add or override this environment variable in Vercel:

   | Key | Value |
   | --- | --- |
   | `VITE_API_URL` | Render API origin, e.g. `https://your-api.onrender.com` (no trailing slash and no `/api`) |

   Set visibility to **Config**, not Secret, and select Production (and Preview if desired). This is a public API address, not a credential. Vite embeds `VITE_` variables at build time, so redeploy after changing it. For the default Render API URL, this variable may be omitted.
4. Deploy the project and copy its production domain, e.g. `https://your-project.vercel.app`.
5. Go back to Render and set `CLIENT_ORIGIN` to that exact Vercel origin (scheme and host only, no path or trailing slash). If you need both a custom domain and the Vercel domain, provide comma-separated origins, for example `https://civiceye.example,https://your-project.vercel.app`. Save the change and redeploy/restart the Render service.

The frontend sends API requests directly to `VITE_API_URL`, and uses the same API host to display uploaded images. The Vercel rewrite in `vercel.json` supports client-side routes such as `/report`, `/track`, `/dashboard`, and `/complaints/:id` when opened directly.

## 4. Verify the deployed app

1. Open the Vercel production URL.
2. Submit a test report with a map-selected location. Try a photo and **Preview AI analysis** if `GEMINI_API_KEY` is configured.
3. Confirm the new complaint appears on the dashboard/map and that tracking by its complaint ID works.
4. Update its status from the demonstration admin view and confirm the status history is recorded.
5. Check browser and Render logs if an API request fails. Common causes:
   - **CORS error:** `CLIENT_ORIGIN` must exactly match the browser's Vercel origin.
   - **MongoDB authentication/timeout:** verify `MONGODB_URI`, Atlas user permissions, and Atlas Network Access.
   - **AI unavailable:** check `GEMINI_API_KEY` in Render's environment settings; reports remain usable without AI.
   - **Images fail or disappear:** verify `VITE_API_URL`, and configure a persistent disk or object storage for durable image files.

The admin controls are demonstration-only and do not authenticate administrators or represent government actions. Add authentication and authorization before using the system for real administrative workflows.
