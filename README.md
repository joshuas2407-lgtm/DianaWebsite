# Personal Portfolio Website

A sleek personal portfolio with an owner-only content management system. The owner edits text and images through simple forms—no technical knowledge required.

## Features

- **Landing page**: Editable introduction text (owner only)
- **Category hub**: Architecture, Art, Photography, Leather
- **Subpages**: Project posts with title, date, description, and image uploads
- **Owner CMS**: Sign in via the discreet dot in the top-right corner

## Backend

The site uses a **Node.js + Express** API (`backend/`) served together with the Next.js frontend via `server.js` on a single port.

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
| `POST /api/upload` | Owner | Upload images |

**Persistence** (saved on disk):

- `data/content.json` — introduction text and all project data
- `public/uploads/` — uploaded images

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
backend/
  lib/          # Auth, content storage, category helpers
  routes/       # Express API routes
data/
  content.json  # Site text and project data
public/uploads/ # Uploaded images
server.js       # Express API + Next.js custom server
src/            # Next.js frontend
```

## Production

```bash
npm run build
NODE_ENV=production npm start
```

Set `OWNER_PASSWORD` and `OWNER_SESSION_SECRET` in your hosting environment. Use persistent storage for `data/` and `public/uploads/` if your host resets the filesystem between deploys.
