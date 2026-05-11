# Vox Diurna

> Daily Voice — A curated blog by Shishir Khatri.

Live: [https://vox-diurna.pages.dev](https://vox-diurna.pages.dev)

## Tech Stack

- **React 18** — UI library
- **Vite** — build tool and dev server
- **React Router v6** — client-side routing
- **react-markdown** + **remark-gfm** — rendering markdown content in posts
- **Cloudflare Pages** — frontend deployment
- **Cloudflare Workers** — backend API

## How It Works

Posts are stored and served via a Cloudflare Workers API. The frontend fetches posts from the API at build/runtime and renders them as styled cards on the homepage. Clicking a post navigates to `/blog/:slug/:id` where the full markdown content is fetched and rendered.

Key features:
- Featured posts (last 7 days only) displayed in a highlighted section
- LocalStorage caching as offline fallback
- Skeleton loaders during data fetch
- SEO-optimized with Open Graph, Twitter Card, and JSON-LD structured data

## Getting Started

```bash
npm install
npm run dev     # development server
npm run build   # production build
npm run preview # preview production build
```

## Project Structure

```
src/
  App.jsx          — main layout, nav, routes, footer
  main.jsx         — entry point
  index.css        — global styles
  lib/api.js       — API client with localStorage caching
  pages/
    Home.jsx       — homepage with featured + recent posts
    PostDetail.jsx — individual post view
    About.jsx      — about page
    NotFound.jsx   — 404 page
  components/
    EmptyState.jsx       — empty state message
    LocalizedDate.jsx   — date formatting
```