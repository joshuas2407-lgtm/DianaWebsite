# Personal Portfolio Website

A sleek personal portfolio with an owner-only content management system. The owner edits text and images through simple forms—no technical knowledge required.

## Features

- **Landing page**: Editable introduction text (owner only)
- **Category hub**: Architecture, Art, Photography, Leather
- **Subpages**: Project posts with title, date, description, and image uploads
- **Owner CMS**: Sign in via the discreet dot in the top-right corner

## Backend

The API lives in Next.js route handlers under `src/app/api/`, so the whole site runs on Vercel (or with `next dev` locally).

| API route | Auth | Purpose |
|-----------|------|---------|
| `POST /api/auth/login` | Public | Owner sign-in |
| `POST /api/auth/logout` | Public | Sign out |
| `GET /api/auth/session` | Public | Check if owner is signed in |
| `GET /api/content` | Public | Read site content |
| `PATCH /api/content` | Owner | Update introduction bio |
| `GET /api/projects/:category` | Public | List projects |
| `POST /api/projects/:category` | Owner | Create project |
| `PATCH /api/projects/:category` | Owner | Edit project |
| `DELETE /api/projects/:category` | Owner | Delete project |
| `POST /api/projects/art/columns` | Owner | Add an art column |
| `POST /api/upload` | Owner | Upload images |

**Where edits are saved** (`src/lib/storage.ts`):

- **Deployed (Vercel)**: [Vercel Blob](https://vercel.com/docs/vercel-blob). Used whenever `BLOB_READ_WRITE_TOKEN` is set. Content is `content.json` in the Blob store; images go under `uploads/`.
- **Local, no Blob token**: `data/content.json` and `public/uploads/` on disk.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set:
   - `OWNER_PASSWORD` — password the owner uses to sign in
   - `OWNER_SESSION_SECRET` — any long random string (e.g. run `openssl rand -base64 32`)

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Editing content (for the owner)

1. Click the small circle in the **top-right corner** of any page
2. Enter your owner password and click **Sign in**
3. You’ll see **Editing mode** in the corner

**Home page**
- Click the introduction text area to edit. Changes save when you click away.

**Category pages** (Architecture, Art, Photography, Leather)
- Click **+** to add a project
- Fill in title, date, and description
- Drag images onto the drop zone or click to browse
- Click **Delete project** to remove one

4. Click **Sign out** when finished

## Project structure

```
data/content.json      # Local site content (and the starting content before Blob has any)
public/uploads/        # Locally uploaded images
scripts/upload-to-blob.mjs  # One-time copy of local content + images into Blob
src/app/api/           # API route handlers
src/lib/               # Auth, content and storage helpers
src/                   # Next.js frontend
```

## Deploying to Vercel (with editing)

1. Import the GitHub repo into Vercel (framework: Next.js, default settings).
2. In the Vercel project, open **Storage → Create → Blob**, create a store and connect it to the project. This adds `BLOB_READ_WRITE_TOKEN` automatically.
3. In **Settings → Environment Variables**, add `OWNER_PASSWORD` and `OWNER_SESSION_SECRET`.
4. Redeploy.
5. Optional, to start the live site with your local content and images: copy `BLOB_READ_WRITE_TOKEN` into `.env.local` (or run `npx vercel env pull .env.local`), then run `npm run upload-to-blob`. Remove the token from `.env.local` afterwards if you want local edits to stay on disk instead of going to the live site.

After that, sign in with the dot in the top-right corner of the live site to edit. Changes are visible to visitors right away, without a redeploy.
