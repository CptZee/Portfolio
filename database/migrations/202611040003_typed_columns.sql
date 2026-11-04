-- Typed fields are authoritative. content is a transitional, trigger-generated
-- projection for frontend versions deployed before this migration.
alter table portfolio_projects
  add column project_type text,
  add column company_name text,
  add column categories text[] not null default '{}',
  add column short_description text,
  add column website_url text,
  add column github_url text,
  add column technologies text[] not null default '{}',
  add column start_date timestamptz,
  add column end_date timestamptz,
  add column cover_asset text,
  add column description_paragraphs text[] not null default '{}',
  add column description_bullets text[] not null default '{}',
  add column updated_at timestamptz not null default now();

update portfolio_projects set
  project_type = content->>'type', company_name = content->>'companyName',
  categories = array(select jsonb_array_elements_text(content->'category')),
  short_description = content->>'shortDescription',
  website_url = nullif(content->>'websiteLink', ''), github_url = nullif(content->>'githubLink', ''),
  technologies = array(select jsonb_array_elements_text(content->'techStack')),
  start_date = (content->>'startDate')::timestamptz, end_date = (content->>'endDate')::timestamptz,
  cover_asset = content->>'companyLogoImg',
  description_paragraphs = array(select jsonb_array_elements_text(content->'descriptionDetails'->'paragraphs')),
  description_bullets = array(select jsonb_array_elements_text(content->'descriptionDetails'->'bullets'));

alter table portfolio_projects
  alter column project_type set not null, alter column company_name set not null,
  alter column short_description set not null, alter column start_date set not null,
  alter column end_date set not null, alter column cover_asset set not null,
  add constraint portfolio_project_type check (project_type in ('Personal', 'Professional')),
  add constraint portfolio_project_name check (length(trim(company_name)) > 0),
  add constraint portfolio_project_dates check (end_date >= start_date),
  add constraint portfolio_project_categories check (categories <@ array['Full Stack','Frontend','Backend','UI/UX','Web Dev','Mobile Dev','Game Dev','Window App','E-Commerce']::text[]);

create table portfolio_project_pages (
  id bigint generated always as identity primary key,
  project_id text not null references portfolio_projects(id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  description text,
  image_assets text[] not null default '{}',
  sort_order integer not null default 100
);
create index portfolio_project_pages_order on portfolio_project_pages(project_id, sort_order, id);
revoke all on portfolio_project_pages from public;
insert into portfolio_project_pages(project_id, title, description, image_assets, sort_order)
select p.id, page->>'title', page->>'description',
  array(select jsonb_array_elements_text(page->'imgArr')), (ordinality - 1)::integer
from portfolio_projects p cross join lateral jsonb_array_elements(coalesce(p.content->'pagesInfoArr', '[]')) with ordinality as pages(page, ordinality);

alter table portfolio_experiences
  add column position text, add column company text, add column location text,
  add column start_date timestamptz, add column end_date timestamptz,
  add column description_paragraphs text[] not null default '{}',
  add column achievements text[] not null default '{}',
  add column skills text[] not null default '{}',
  add column company_url text, add column logo_asset text,
  add column updated_at timestamptz not null default now();
update portfolio_experiences set
  position = content->>'position', company = content->>'company', location = content->>'location',
  start_date = (content->>'startDate')::timestamptz,
  end_date = case when content->>'endDate' = 'Present' then null else (content->>'endDate')::timestamptz end,
  description_paragraphs = array(select jsonb_array_elements_text(content->'description')),
  achievements = array(select jsonb_array_elements_text(content->'achievements')),
  skills = array(select jsonb_array_elements_text(content->'skills')),
  company_url = nullif(content->>'companyUrl', ''), logo_asset = nullif(content->>'logo', '');
alter table portfolio_experiences
  alter column position set not null, alter column company set not null,
  alter column location set not null, alter column start_date set not null,
  add constraint portfolio_experience_names check (length(trim(position)) > 0 and length(trim(company)) > 0),
  add constraint portfolio_experience_dates check (end_date is null or end_date >= start_date);

alter table portfolio_services
  add column name text, add column tagline text, add column category text,
  add column starting_price numeric(12,2), add column timeline text,
  add column features text[] not null default '{}',
  add column example_url text, add column example_label text,
  add column updated_at timestamptz not null default now();
update portfolio_services set
  name = content->>'name', tagline = content->>'tagline', category = content->>'category',
  starting_price = (content->>'price')::numeric, timeline = content->>'timeline',
  features = array(select jsonb_array_elements_text(content->'features')),
  example_url = nullif(content->>'example', ''), example_label = nullif(content->>'exampleLabel', '');
alter table portfolio_services
  alter column name set not null, alter column tagline set not null,
  alter column category set not null, alter column starting_price set not null,
  alter column timeline set not null,
  add constraint portfolio_service_name check (length(trim(name)) > 0),
  add constraint portfolio_service_price check (starting_price >= 0);

-- Older deployed clients may still SELECT content. They receive a projection of
-- the typed columns, never an independently editable second copy of the data.
create function portfolio_sync_legacy_content() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  if tg_table_name = 'portfolio_projects' then
    new.content := jsonb_strip_nulls(jsonb_build_object(
      'id',new.id,'type',new.project_type,'companyName',new.company_name,
      'category',new.categories,'shortDescription',new.short_description,
      'websiteLink',coalesce(new.website_url,''),'githubLink',coalesce(new.github_url,''),
      'techStack',new.technologies,'startDate',new.start_date,'endDate',new.end_date,
      'companyLogoImg',new.cover_asset,
      'descriptionDetails',jsonb_build_object('paragraphs',new.description_paragraphs,'bullets',new.description_bullets),
      'pagesInfoArr',coalesce((select jsonb_agg(jsonb_strip_nulls(jsonb_build_object('title',title,'description',description,'imgArr',image_assets)) order by sort_order,id) from portfolio_project_pages where project_id = new.id),'[]'::jsonb)));
  elsif tg_table_name = 'portfolio_experiences' then
    new.content := jsonb_strip_nulls(jsonb_build_object(
      'id',new.id,'position',new.position,'company',new.company,'location',new.location,
      'startDate',new.start_date,'endDate',case when new.end_date is null then to_jsonb('Present'::text) else to_jsonb(new.end_date) end,
      'description',new.description_paragraphs,'achievements',new.achievements,'skills',new.skills,
      'companyUrl',new.company_url,'logo',new.logo_asset));
  else
    new.content := jsonb_strip_nulls(jsonb_build_object(
      'id',new.id,'name',new.name,'tagline',new.tagline,'category',new.category,
      'price',new.starting_price,'timeline',new.timeline,'features',new.features,
      'example',new.example_url,'exampleLabel',new.example_label));
  end if;
  return new;
end;
$$;
create trigger portfolio_projects_legacy before insert or update on portfolio_projects for each row execute function portfolio_sync_legacy_content();
create trigger portfolio_experiences_legacy before insert or update on portfolio_experiences for each row execute function portfolio_sync_legacy_content();
create trigger portfolio_services_legacy before insert or update on portfolio_services for each row execute function portfolio_sync_legacy_content();
comment on column portfolio_projects.content is 'Deprecated compatibility projection. Edit the typed columns and portfolio_project_pages instead.';
comment on column portfolio_experiences.content is 'Deprecated compatibility projection. Edit the typed columns instead.';
comment on column portfolio_services.content is 'Deprecated compatibility projection. Edit the typed columns instead.';

create function portfolio_sync_page_projection() returns trigger language plpgsql as $$
begin
  if tg_op <> 'DELETE' then update portfolio_projects set updated_at = now() where id = new.project_id; end if;
  if tg_op = 'DELETE' or (tg_op = 'UPDATE' and old.project_id <> new.project_id) then
    update portfolio_projects set updated_at = now() where id = old.project_id;
  end if;
  return null;
end;
$$;
create trigger portfolio_project_pages_legacy after insert or update or delete on portfolio_project_pages for each row execute function portfolio_sync_page_projection();
update portfolio_projects set updated_at = now();
update portfolio_experiences set updated_at = now();
update portfolio_services set updated_at = now();
