alter table portfolio_projects
  add column badges text[] not null default '{}',
  add column is_flagship boolean not null default false,
  add column flagship_rank integer not null default 100 check (flagship_rank >= 0);

update portfolio_projects set badges = ARRAY['Flagship · Professional work'],
  is_flagship = true, flagship_rank = 0 where id = 'fallen-tear';

create table portfolio_project_media (
  id bigint generated always as identity primary key,
  project_id text not null references portfolio_projects(id) on delete cascade,
  media_type text not null check (media_type in ('image','video','embed')),
  asset_url text not null check (asset_url ~ '^(storage:|https://|/[^/])'),
  poster_asset text check (poster_asset is null or poster_asset ~ '^(storage:|https://|/[^/])'),
  alt_text text not null check (length(trim(alt_text)) > 0),
  caption text,
  sort_order integer not null default 100,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create index portfolio_project_media_order on portfolio_project_media(project_id, sort_order, id) where published = true;
revoke all on portfolio_project_media from public;
