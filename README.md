# Personal Portfolio Website

A sleek black-and-white personal site with an owner-only content management system. The owner edits text and images through simple forms—no technical knowledge required.

## Features

- **Landing page**: Giant “Hey” in the upper left, editable bio with translucent panel (next page visible when scrolling)
- **Category hub**: Four icon buttons—Architecture, Art, Photography, Leather
- **Subpages**: Add projects (title, date, text, images) when signed in as owner
- **Owner CMS**: Sign in via the discreet dot in the top-right corner

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
- Click the bio text area to edit your introduction. Changes save when you click away.

**Category pages** (Architecture, Art, Photography, Leather)
- Click **+** to add a project
- Fill in title, date, and description
- Drag images onto the drop zone or click to browse
- Click **Delete project** to remove one

4. Click **Sign out** when finished

## Project structure

- `data/content.json` — site text and project data
- `public/uploads/` — uploaded images
- Content is saved automatically when you finish editing a field

## Deploying

For production (e.g. Vercel), set `OWNER_PASSWORD` and `OWNER_SESSION_SECRET` in your hosting provider’s environment variables. Use persistent storage for `data/` and `public/uploads/` if your host resets the filesystem between deploys.
