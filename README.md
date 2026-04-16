# priorit-ease

A static to-do tracker organized by the Eisenhower Matrix — every item is
tagged as **important / not important** and **urgent / not urgent**, and the
list is grouped into four quadrants:

1. Important & Urgent — *Do first*
2. Important, Not Urgent — *Schedule*
3. Not Important, Urgent — *Delegate*
4. Not Important, Not Urgent — *Eliminate*

You can also attach free-form **tags** to items and filter the view by them.
Data is stored in your browser's `localStorage` — no account, no server.

Live at <https://yjmrobert.com/priorit-ease/>.

## Local development

```bash
npm ci
npm run dev          # http://localhost:5173/priorit-ease/
npm run build        # type-check + production build to ./dist
npm run preview      # serve ./dist at /priorit-ease/
```

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds on every push to
`main` and publishes to GitHub Pages. One-time setup in the repo:

- **Settings → Pages → Source: GitHub Actions**

Pages then serves the project under the user-site custom domain at
`https://yjmrobert.com/priorit-ease/`. The Vite `base` is configured to match.
