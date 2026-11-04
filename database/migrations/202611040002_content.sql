create table if not exists public.portfolio_experiences (
    id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    content jsonb not null check (jsonb_typeof(content) = 'object'),
    sort_order integer not null default 100,
    published boolean not null default false,
    created_at timestamptz not null default now()
);
create index if not exists portfolio_experiences_published_order
    on public.portfolio_experiences (sort_order, id) where published = true;
revoke all on public.portfolio_experiences from public;

create table if not exists public.portfolio_services (
    id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    content jsonb not null check (jsonb_typeof(content) = 'object'),
    sort_order integer not null default 100,
    published boolean not null default false,
    created_at timestamptz not null default now()
);
create index if not exists portfolio_services_published_order
    on public.portfolio_services (sort_order, id) where published = true;
revoke all on public.portfolio_services from public;
