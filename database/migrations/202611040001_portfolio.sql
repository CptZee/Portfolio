create table if not exists public.portfolio_projects (
    id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    content jsonb not null check (jsonb_typeof(content) = 'object'),
    sort_order integer not null default 100,
    published boolean not null default false,
    created_at timestamptz not null default now()
);
create index if not exists portfolio_projects_published_order
    on public.portfolio_projects (sort_order, id) where published = true;
-- Access is through the Next.js server and authenticated Neon console only.
-- Do not expose DATABASE_URL to the browser or create a public database write API.
revoke all on public.portfolio_projects from public;
