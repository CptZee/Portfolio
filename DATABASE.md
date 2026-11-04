# Neon backend

This app is linked to project divine-bread-63277438, production branch, in org-wispy-darkness-49680098. `neon.ts` declares Postgres, an `assets` public-read bucket, and Realtime with explicit browser origins. The Next.js frontend remains hosted separately (for example on Vercel); `neon deploy` provisions backend services, not frontend hosting.

## Setup and commands

- `neon deploy --update-existing` reconciles the declared services and pulls managed variables into `.env` (already present in this checkout). Preserve its existing unrelated settings. `.env` and `.neon` stay ignored.
- `node scripts/migrate-portfolio.mjs` applies the tracked additive SQL migration through DATABASE_URL_UNPOOLED. A test branch connection can be supplied in NEON_MIGRATION_TEST_URL; credentials must never be printed.
- The initial imports are complete: 14 projects, 3 experiences, and 3 services. Their catalogs now exist only in the database; the local constants and one-time import scripts have been removed. Project images and experience logos are in the `assets` bucket.
- `npm run build`, then `npm run start` serves the production app at http://localhost:3000.
- With the production app running: `node scripts/test-neon-e2e.mjs` tests database rendering, storage upload/download and public reads, draft isolation, live publish/edit/unpublish, image display, detail pages, and the homepage. It creates one uniquely named temporary row and image and removes them in a finally block. Never run it against an unrelated app/database.

Environment: DATABASE_URL (pooled application connection), DATABASE_URL_UNPOOLED (direct migrations), AWS_ENDPOINT_URL_S3, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, NEON_REALTIME_URL, NEON_REALTIME_SECRET. Neon also supplies NEON_BRANCH. Only the storage endpoint and realtime URL reach the browser; all credentials stay on the server. Configure the same variables on your frontend host, and add any new frontend origin to `neon.ts` before deploying that policy. No NEXT_PUBLIC secret variables are needed.

The existing serverless HTTP driver is retained for one-shot database reads. Files SDK's Neon adapter uses the injected AWS variables for storage. Realtime uses the official SDK and React bindings, a server-sealed fixed query over published rows, SSR initial results, and a POST endpoint for capability renewal. No caller can supply SQL or subscribe to drafts. The catalog is public, so the read-only capability endpoint intentionally requires no login. No project write/upload endpoint is exposed publicly.

## Add a project without changing code

1. Upload its cover and gallery images to the Neon `assets` bucket through the Console or `neon bucket object put` (see command help).
2. In Neon's table editor, add a `portfolio_projects` row with a unique slug `id`, `sort_order`, and `content` JSON as below. Leave `published` false while drafting.
3. Set `published` true. Already-open homepage and project listing views update automatically through Realtime; detail pages read the latest data when opened. Fallen Tear is always first, regardless of sort order.

```json
{
  "companyName": "My New Project",
  "type": "Personal",
  "category": ["Frontend", "Web Dev"],
  "shortDescription": "A short introduction.",
  "websiteLink": "https://example.com",
  "githubLink": "",
  "techStack": ["React", "Next.js", "Typescript"],
  "startDate": "2026-11-04T00:00:00.000Z",
  "endDate": "2026-11-04T00:00:00.000Z",
  "companyLogoImg": "storage:projects/new/cover.png",
  "descriptionDetails": {
    "paragraphs": ["What the project does and why it was built."],
    "bullets": ["A key feature or contribution."]
  },
  "pagesInfoArr": []
}
```

`storage:` paths are keys inside `assets`, resolved using the current branch's storage endpoint. Store keys rather than expiring signed URLs so data and files stay aligned when branching. Gallery entries use `{ "title": "Preview", "imgArr": ["storage:projects/new/screenshot.png"] }`. HTTPS URLs from the same bucket also work. Types are Personal or Professional; categories match `constants/Constants.ts`.

The bucket's contents are public. Do not upload private files. Use unique names for image revisions to avoid stale caches; Next.js image optimization provides caching for raster covers. Unpublish to hide a project; remove unused objects only after removing their references. Interface assets, fonts, and the current resume remain in the repository. DATABASE_URL is required: missing configuration and database errors fail explicitly, with no local content fallback.

## Experiences and services

Both use the same row structure as projects: a unique slug `id`, `content` JSON, `sort_order`, and `published`. Edit them through Neon's table editor. Only published rows are displayed. Changes appear on the next page load/refresh; project feeds additionally update through Realtime.

`portfolio_experiences.content` contains `position`, `company`, `location`, ISO `startDate`, ISO `endDate` or `"Present"`, string arrays `description`, `achievements`, and `skills`, optional HTTPS `companyUrl`, and optional `logo` such as `storage:experience/company.png`. Date values are parsed back into Date objects. The same data powers the homepage, timeline, detail page, and detail metadata.

`portfolio_services.content` contains `name`, `tagline`, `category`, numeric nonnegative `price` in PHP, `timeline`, string array `features`, optional `example` (local path or HTTPS URL), and optional `exampleLabel`. The same data powers homepage cards, service packages, and the inquiry selector. Unknown/new service IDs receive a default icon without needing code changes.

Type definitions remain in `types/portfolio.ts`; validation/formatting code is separate from data. No local copies of project, experience, or service catalogs are bundled into the app.

References: installed Neon plugin skills (neon, neon-postgres, neon-object-storage, neon-realtime), https://neon.com/docs/serverless/serverless-driver, https://neon.com/docs/storage/get-started, https://neon.com/docs/realtime/quickstart.
