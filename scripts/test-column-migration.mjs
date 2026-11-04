import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { neon } from "@neondatabase/serverless";
const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());
assert.ok(process.env.NEON_MIGRATION_TEST_URL, "Set NEON_MIGRATION_TEST_URL to the migrated verification branch.");
const source = neon(process.env.DATABASE_URL);
const target = neon(process.env.NEON_MIGRATION_TEST_URL);

function canonical(value) {
    const copy = JSON.parse(JSON.stringify(value));
    for (const key of ["startDate", "endDate"]) if (copy[key] && copy[key] !== "Present") copy[key] = new Date(copy[key]).toISOString();
    for (const key of ["websiteLink", "githubLink", "companyUrl", "logo", "example", "exampleLabel"]) if (!copy[key]) delete copy[key];
    return copy;
}
const oldProjects = await source`SELECT id, content, published, sort_order FROM portfolio_projects ORDER BY id`;
const projects = await target`SELECT * FROM portfolio_projects ORDER BY id`;
const pages = await target`SELECT project_id, title, description, image_assets FROM portfolio_project_pages ORDER BY sort_order, id`;
assert.equal(projects.length, oldProjects.length);
for (const row of projects) {
    const original = oldProjects.find(item => item.id === row.id);
    assert.deepEqual(canonical({ id: row.id, type: row.project_type, companyName: row.company_name,
        category: row.categories, shortDescription: row.short_description, websiteLink: row.website_url,
        githubLink: row.github_url, techStack: row.technologies, startDate: row.start_date, endDate: row.end_date,
        companyLogoImg: row.cover_asset, descriptionDetails: { paragraphs: row.description_paragraphs, bullets: row.description_bullets },
        pagesInfoArr: pages.filter(page => page.project_id === row.id).map(page => ({ title: page.title, ...(page.description !== null ? { description: page.description } : {}), imgArr: page.image_assets })),
    }), canonical(original.content));
    assert.equal(row.published, original.published); assert.equal(row.sort_order, original.sort_order);
}
const oldExperiences = await source`SELECT id, content, published, sort_order FROM portfolio_experiences ORDER BY id`;
const experiences = await target`SELECT * FROM portfolio_experiences ORDER BY id`;
assert.equal(experiences.length, oldExperiences.length);
for (const row of experiences) {
    const original = oldExperiences.find(item => item.id === row.id);
    assert.deepEqual(canonical({ id: row.id, position: row.position, company: row.company, location: row.location,
        startDate: row.start_date, endDate: row.end_date ?? "Present", description: row.description_paragraphs,
        achievements: row.achievements, skills: row.skills, companyUrl: row.company_url, logo: row.logo_asset,
    }), canonical(original.content));
    assert.equal(row.published, original.published); assert.equal(row.sort_order, original.sort_order);
}
const oldServices = await source`SELECT id, content, published, sort_order FROM portfolio_services ORDER BY id`;
const services = await target`SELECT * FROM portfolio_services ORDER BY id`;
assert.equal(services.length, oldServices.length);
for (const row of services) {
    const original = oldServices.find(item => item.id === row.id);
    assert.deepEqual(canonical({ id: row.id, name: row.name, tagline: row.tagline, category: row.category,
        price: Number(row.starting_price), timeline: row.timeline, features: row.features,
        example: row.example_url, exampleLabel: row.example_label,
    }), canonical(original.content));
    assert.equal(row.published, original.published); assert.equal(row.sort_order, original.sort_order);
}
console.log(`PASS full-field preservation: ${projects.length} projects, ${experiences.length} experiences, ${services.length} services, ${pages.length} gallery pages; visibility and ordering unchanged.`);
await assert.rejects(target`UPDATE portfolio_services SET starting_price = -1 WHERE id = 'personal-website'`, /portfolio_service_price/);
await assert.rejects(target`UPDATE portfolio_projects SET project_type = 'Invalid' WHERE id = 'heartfleet'`, /portfolio_project_type/);
await assert.rejects(target`UPDATE portfolio_experiences SET end_date = start_date - interval '1 day' WHERE id = 'cmd'`, /portfolio_experience_dates/);
console.log("PASS database constraints: invalid prices, project types, and date ranges rejected.");

const id = `column-check-${Date.now()}`;
try {
    await target`INSERT INTO portfolio_projects(id, project_type, company_name, categories, short_description, technologies, start_date, end_date, cover_asset, description_paragraphs, description_bullets) SELECT ${id}, project_type, company_name, categories, short_description, technologies, start_date, end_date, cover_asset, description_paragraphs, description_bullets FROM portfolio_projects WHERE id = 'heartfleet'`;
    await target`INSERT INTO portfolio_project_pages(project_id, title, image_assets, sort_order) VALUES (${id}, 'Gallery test', ARRAY['storage:checks/image.png'], 0)`;
    const [projection] = await target`SELECT content FROM portfolio_projects WHERE id = ${id}`;
    assert.equal(projection.content.pagesInfoArr[0].title, "Gallery test");
    await target`UPDATE portfolio_projects SET company_name = 'Typed column edit' WHERE id = ${id}`;
    const [updated] = await target`SELECT content FROM portfolio_projects WHERE id = ${id}`;
    assert.equal(updated.content.companyName, "Typed column edit");
    await target`DELETE FROM portfolio_projects WHERE id = ${id}`;
    const [orphan] = await target`SELECT count(*)::int AS count FROM portfolio_project_pages WHERE project_id = ${id}`;
    assert.equal(orphan.count, 0);
    console.log("PASS relational gallery writes, cascading cleanup, and old-deployment compatibility projection.");
} finally {
    await target`DELETE FROM portfolio_projects WHERE id = ${id}`;
}
