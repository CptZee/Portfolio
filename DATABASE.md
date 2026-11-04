# Portfolio database

Postgres stores structured portfolio data, a public object-storage bucket stores images, and Realtime streams published project rows. The frontend is hosted separately. Project and organization identifiers belong in local connection settings, not this documentation.

## Tables and columns

| Table | Editable content columns |
| --- | --- |
| `portfolio_projects` | `project_type`, `company_name`, `categories`, `short_description`, `website_url`, `github_url`, `technologies`, `start_date`, `end_date`, `cover_asset`, `description_paragraphs`, `description_bullets` |
| `portfolio_project_pages` | `project_id`, `title`, `description`, `image_assets`, `sort_order` |
| `portfolio_experiences` | `position`, `company`, `location`, `start_date`, `end_date`, `description_paragraphs`, `achievements`, `skills`, `company_url`, `logo_asset` |
| `portfolio_services` | `name`, `tagline`, `category`, `starting_price`, `timeline`, `features`, `example_url`, `example_label` |

The three main tables also have `id`, `sort_order`, `published`, `created_at`, and `updated_at`. Array fields use native PostgreSQL `text[]`; prices use nonnegative `numeric(12,2)` in PHP; dates use `timestamptz`. An experience with NULL `end_date` is displayed as Present. Projects enforce valid categories/types and nondecreasing dates. Gallery pages reference a project through a foreign key and are deleted with their parent.

The app reads explicit columns. Migrations are verified on an isolated branch before being applied to the target database, preserving data, publication settings, ordering, and storage keys.

## Manage content

Use Neon's table editor to change individual columns, rather than editing a JSON document. Keep `published` false while preparing a new row, then enable it to display the row. Keep existing IDs when editing, since IDs determine detail URLs. Fallen Tear stays first regardless of `sort_order`.

For lists, use PostgreSQL arrays, for example `ARRAY['Unity', 'C#']` in SQL. Gallery pages belong in `portfolio_project_pages`; set `project_id` to the parent project's slug and `sort_order` to control display order. Store asset references as `storage:projects/new/cover.png` or `storage:experience/company.png`, pointing to objects uploaded to the Neon `assets` bucket. These keys resolve against the current branch's storage endpoint.

Example service insert:

```sql
INSERT INTO portfolio_services
  (id, name, tagline, category, starting_price, timeline, features, published)
VALUES
  ('custom-package', 'Custom package', 'A focused offering.', 'Games', 8000,
   'About 1–2 weeks', ARRAY['One agreed feature', 'Source-code handover'], false);
```

Projects update in already-open feeds through Realtime. Experiences and services update on the next navigation or refresh. The homepage shows three category summaries, with starting prices calculated from published service rows. No local catalog fallback exists.

## Deployment compatibility

`content` remains temporarily on the three main tables as a deprecated compatibility projection for frontend builds deployed before this migration. A database trigger regenerates it from the typed columns (and related gallery rows) on every write. It is no longer the source of truth. Do not edit this field: manage the typed columns instead. The updated app and its Realtime query do not select it.

After all frontend deployments and their existing browser subscriptions have moved to the typed-column version, a separate cleanup migration can remove the compatibility triggers and columns. Keeping the projection during rollout prevents older deployed pages from breaking.

## Migrations and verification

- `neon deploy --update-existing` reconciles `neon.ts` and pulls managed values into the ignored `.env` file. Preserve unrelated settings.
- `node scripts/migrate-portfolio.mjs` uses the direct `DATABASE_URL_UNPOOLED` connection. It applies tracked SQL files transactionally and records their names in `portfolio_schema_migrations`. A session lock prevents concurrent runs. Applied migrations are skipped, rather than re-running data conversions. SQL function bodies are executed intact.
- Test migrations on a temporary production-data branch first, supplying its direct URL as `NEON_MIGRATION_TEST_URL` without printing it.
- `node scripts/test-column-migration.mjs` compares a migrated test branch against production, tests constraints, and checks gallery relations and the legacy projection.
- `npm run build`, then `npm run start`, serves the app at http://localhost:3000.
- With the app running, `node scripts/test-neon-e2e.mjs` verifies typed-column writes, published-only reads, live updates, new detail pages, relational gallery display, storage, services, experience metadata, and homepage summaries. It removes its uniquely named test records and object afterward.
- `node scripts/test-loading.mjs` owns and stops a temporary server while checking progressive section loading.

Runtime configuration: `DATABASE_URL`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `NEON_REALTIME_URL`, `NEON_REALTIME_SECRET`. Migrations also need `DATABASE_URL_UNPOOLED`. Keep credentials out of source control and never use NEXT_PUBLIC prefixes for them. Only the storage endpoint and realtime URL are passed to the browser. Add new frontend origins to `neon.ts` before deploying its policy.

The public bucket must contain only shareable files. Use versioned file names for replacements to avoid stale caches. Remove unused objects only after removing references. No public database-write or file-upload API is exposed; editing is through the authenticated owner dashboard. Interface assets, fonts, and the resume remain in the repository.
