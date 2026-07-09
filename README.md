# Your Mates Brewing — App Hub

A landing page listing every internal tool/app, plus a manager page to add/edit links. Saves happen live, the same way your CRM Pricing Guide saves — because it works the same way under the hood: a small serverless Function backed by real storage (Netlify Blobs), not a static file you have to re-upload.

## Files

- `index.html` — the public landing page.
- `admin.html` — add, edit, delete, and reorder links with a form. Anyone with this link can edit; there's no login.
- `api.js` — tiny shared helper both pages use to call the backend.
- `style.css` — shared styling.
- `netlify/functions/links.mjs` — the backend. Handles `GET /api/links` (read) and `PUT /api/links` (save) using Netlify Blobs for storage.
- `package.json` / `netlify.toml` — tell Netlify to install `@netlify/blobs` and where to find the function.
- `links.js`, `config.js`, `store.js` — **deprecated**, left over from an earlier draft. Not used by the site anymore; ignore or delete them once this is in your own repo.

## Deploying it (you use a Git-connected Netlify site)

1. Copy all the files above (keeping `netlify/functions/links.mjs` in that exact folder path) into a repo — either a new repo dedicated to the App Hub, or a new folder in an existing one.
2. Push to GitHub/GitLab.
3. In Netlify: **Add new site → Import an existing project**, pick the repo. Leave the build command empty and publish directory as the repo root — there's no build step, Netlify just needs to install `@netlify/blobs` (it does this automatically from `package.json`) and deploy the function.
4. Deploy. That's it — no environment variables, no database to provision. Netlify Blobs is zero-config on Netlify's own infrastructure.
5. Open your new site's URL — the App Hub is live with the two links already on it (they were carried over as the starting list).

## Using it day to day

Open `admin.html`, add/edit/delete/reorder links. Each change saves immediately — the badge next to the page title shows "live ✓" once it's confirmed. The App Hub (`index.html`) reflects it right away for every visitor. No downloading files, no re-uploading, no coming back to Claude.

## Notes

- **No login:** anyone with the `admin.html` URL can change links. Don't publish that link publicly — only share it with people you trust to edit the page (same as you'd treat an admin panel on any of your other tools).
- **Backup:** the **Download backup** button on `admin.html` exports the current list as JSON, purely as a just-in-case copy — it's not part of the normal save flow.
- Want to test changes before they're live? Push to a branch — Netlify will build a preview deploy with its own working `/api/links`, since Blobs work the same way on preview deploys.
