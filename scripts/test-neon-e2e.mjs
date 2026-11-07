import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { neon } from "@neondatabase/serverless";
import { Files } from "files-sdk";
import { neon as neonStorage } from "files-sdk/neon";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());
const origin = process.env.NEON_E2E_APP_URL || "http://localhost:3000";
assert.ok(process.env.DATABASE_URL && process.env.AWS_ENDPOINT_URL_S3 && process.env.NEON_REALTIME_URL && process.env.NEON_REALTIME_SECRET, "Run neon deploy first.");
const sql = neon(process.env.DATABASE_URL);
const files = new Files({ adapter: neonStorage({ bucket: "assets" }) });
const id = `neon-e2e-${Date.now()}`;
const key = `checks/${id}.png`;
const title = `Neon integration check ${id}`;
const bytes = await fs.readFile(new URL("../public/projects/heartfleet/logo.png", import.meta.url));
let browser;
let inserted = false;
let uploaded = false;
let contentInserted = false;
let failure;

try {
    const [counts] = await sql`SELECT count(*)::int AS count FROM portfolio_projects WHERE published = true`;
    const [baselineServices] = await sql`SELECT count(*)::int AS count FROM portfolio_services WHERE published = true`;
    assert.ok(counts.count >= 14);
    console.log(`PASS Postgres: ${counts.count} published projects available.`);
    await files.upload(key, bytes, { contentType: "image/png" });
    uploaded = true;
    const downloaded = await files.download(key);
    assert.deepEqual(Buffer.from(await downloaded.arrayBuffer()), bytes);
    const publicUrl = `${process.env.AWS_ENDPOINT_URL_S3.replace(/\/$/, "")}/assets/${key}`;
    const anonymous = await fetch(publicUrl);
    assert.equal(anonymous.status, 200);
    assert.deepEqual(Buffer.from(await anonymous.arrayBuffer()), bytes);
    console.log("PASS Object Storage: authenticated upload/download and anonymous image GET match original bytes.");

    const capabilityResponse = await fetch(`${origin}/api/projects/live`, { method: "POST" });
    assert.equal(capabilityResponse.status, 200);
    assert.match(capabilityResponse.headers.get("cache-control"), /no-store/);
    const capability = await capabilityResponse.json();
    assert.ok(capability.capability && capability.queryFingerprint);
    assert.ok(!JSON.stringify(capability).includes(process.env.NEON_REALTIME_SECRET));
    console.log("PASS Realtime endpoint: public-only sealed query issued without exposing its signing secret.");

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    let navigations = 0;
    page.on("framenavigated", frame => { if (frame === page.mainFrame()) navigations++; });
    const response = await page.goto(`${origin}/projects`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator("h5").first().textContent(), "Fallen Tear: The Ascension");
    assert.equal(await page.locator("h5:visible").count(), counts.count);
    const baselineNavigations = navigations;
    console.log("PASS App: /projects server-renders all database projects with Fallen Tear first.");

    await sql`INSERT INTO portfolio_projects (id, project_type, company_name, categories, short_description, website_url, github_url, technologies, start_date, end_date, cover_asset, description_paragraphs, description_bullets, sort_order, published, badges)
        SELECT ${id}, project_type, ${title}, categories, 'Temporary Neon integration verification project.', website_url, github_url, technologies, start_date, end_date, ${`storage:${key}`}, description_paragraphs, description_bullets, 99999, false, ARRAY['Custom project badge'] FROM portfolio_projects WHERE id = 'heartfleet'`;
    inserted = true;
    const draftPage = await browser.newPage();
    await draftPage.goto(`${origin}/projects/${id}`);
    await draftPage.waitForURL(`${origin}/projects`);
    await draftPage.close();
    assert.equal(await page.getByRole("heading", { name: title, exact: true }).count(), 0);
    console.log("PASS Draft isolation: unpublished project is absent from listing and detail route.");

    await sql`UPDATE portfolio_projects SET published = true WHERE id = ${id}`;
    const heading = page.getByRole("heading", { name: title, exact: true });
    await heading.waitFor({ state: "attached", timeout: 45000 });
    assert.ok((await heading.locator("xpath=../..").textContent()).includes("Custom project badge"));
    assert.equal(navigations, baselineNavigations);
    assert.equal(await page.locator("h5").first().textContent(), "Fallen Tear: The Ascension");
    const image = heading.locator("xpath=../..").locator("img").first();
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(img => img.decode());
    assert.ok(await image.evaluate(img => img.naturalWidth > 0));
    console.log("PASS Realtime + Storage UI: newly published project and Neon-hosted cover appear without page reload.");

    const updatedTitle = `${title} updated`;
    await sql`UPDATE portfolio_projects SET company_name = ${updatedTitle} WHERE id = ${id}`;
    await sql`INSERT INTO portfolio_project_pages(project_id, title, image_assets, sort_order) VALUES (${id}, 'Gallery preview', ARRAY[${`storage:${key}`}], 0)`;
    await page.getByRole("heading", { name: updatedTitle, exact: true }).waitFor({ state: "attached", timeout: 30000 });
    assert.equal(navigations, baselineNavigations);
    const detail = await browser.newPage();
    const detailResponse = await detail.goto(`${origin}/projects/${id}`, { waitUntil: "networkidle" });
    assert.equal(detailResponse.status(), 200);
    assert.ok((await detail.locator("h1").textContent()).includes(updatedTitle));
    await detail.getByText("Custom project badge", { exact: true }).waitFor();
    await detail.getByRole("heading", { name: "Gallery preview", exact: true }).waitFor();
    await detail.close();
    console.log("PASS Postgres + App: live title edit and newly created detail page reflect the database.");

    await sql`UPDATE portfolio_projects SET published = false WHERE id = ${id}`;
    await page.getByRole("heading", { name: updatedTitle, exact: true }).waitFor({ state: "detached", timeout: 30000 });
    assert.equal(navigations, baselineNavigations);
    console.log("PASS Realtime: unpublishing removes the project without page reload.");
    const home = await page.goto(origin, { waitUntil: "networkidle" });
    assert.equal(home.status(), 200);
    assert.equal(await page.locator("h5").first().textContent(), "Fallen Tear: The Ascension");
    assert.equal(await page.locator("#services article").count(), 3);
    assert.deepEqual(errors, []);
    console.log("PASS Homepage: database flagship and three service category highlights render; no browser runtime errors.");

    const [experienceCount] = await sql`SELECT count(*)::int AS count FROM portfolio_experiences WHERE published = true`;
    const [serviceCount] = await sql`SELECT count(*)::int AS count FROM portfolio_services WHERE published = true`;
    assert.equal(experienceCount.count, 3);
    assert.equal(serviceCount.count, baselineServices.count);
    await page.goto(`${origin}/experience`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Game Developer", exact: true }).waitFor();
    const companyLogo = page.getByRole("img", { name: "The CMD Studios", exact: true });
    await companyLogo.scrollIntoViewIfNeeded();
    await companyLogo.evaluate(img => img.decode());
    assert.ok(await companyLogo.evaluate(img => img.naturalWidth > 0));
    console.log("PASS Experiences: database timeline and migrated Neon-hosted company logo render.");

    const experienceTitle = `Database experience ${id}`;
    const serviceTitle = `Database service ${id}`;
    await sql.transaction([
        sql`INSERT INTO portfolio_experiences (id, position, company, location, start_date, end_date, description_paragraphs, achievements, skills, company_url, logo_asset, sort_order, published)
            SELECT ${id}, ${experienceTitle}, company, location, start_date, end_date, description_paragraphs, achievements, skills, company_url, logo_asset, 0, false FROM portfolio_experiences WHERE id = 'cmd'`,
        sql`INSERT INTO portfolio_services (id, name, tagline, category, starting_price, timeline, features, example_url, example_label, sort_order, published)
            SELECT ${id}, ${serviceTitle}, tagline, category, 4321, timeline, features, example_url, example_label, 0, false FROM portfolio_services WHERE id = 'personal-website'`,
    ]);
    contentInserted = true;
    await page.goto(`${origin}/services`, { waitUntil: "networkidle" });
    assert.equal(await page.getByRole("heading", { name: serviceTitle, exact: true }).count(), 0);
    const draftExperience = await browser.newPage();
    await draftExperience.goto(`${origin}/experience/${id}`);
    await draftExperience.waitForURL(`${origin}/experience`);
    await draftExperience.close();
    await sql.transaction([
        sql`UPDATE portfolio_experiences SET published = true WHERE id = ${id}`,
        sql`UPDATE portfolio_services SET published = true WHERE id = ${id}`,
    ]);
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("heading", { name: serviceTitle, exact: true }).waitFor();
    await page.locator(`article[id="${id}"]`).getByRole("button", { name: "Request this package" }).click();
    assert.equal(await page.locator("#service").inputValue(), id);
    assert.ok((await page.locator(`article[id="${id}"]`).textContent()).includes("4,321"));
    console.log("PASS Services: new database-only package renders with price and can be selected for an inquiry.");

    const experienceDetail = await page.goto(`${origin}/experience/${id}`, { waitUntil: "networkidle" });
    assert.equal(experienceDetail.status(), 200);
    assert.ok((await page.locator("h1").textContent()).includes(experienceTitle));
    assert.ok((await page.title()).includes(experienceTitle));
    await page.goto(`${origin}/experience`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: experienceTitle, exact: true }).waitFor();
    await page.goto(origin, { waitUntil: "networkidle" });
    assert.equal(await page.getByRole("heading", { name: serviceTitle, exact: true }).count(), 0);
    assert.ok((await page.locator("#services article").first().textContent()).includes("4,321"));
    await page.getByRole("heading", { name: experienceTitle, exact: true }).waitFor();
    console.log("PASS Database edits: new experience content and category starting price appear on homepage without rebuilding.");
    await sql.transaction([
        sql`UPDATE portfolio_experiences SET published = false WHERE id = ${id}`,
        sql`UPDATE portfolio_services SET published = false WHERE id = ${id}`,
    ]);
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.getByRole("heading", { name: serviceTitle, exact: true }).count(), 0);
    assert.equal(await page.getByRole("heading", { name: experienceTitle, exact: true }).count(), 0);
    assert.deepEqual(errors, []);
    console.log("PASS Published-only reads: hidden experiences/services disappear after refresh; no browser runtime errors.");
} catch (error) {
    failure = error;
} finally {
    if (browser) await browser.close();
    if (inserted) await sql`DELETE FROM portfolio_projects WHERE id = ${id}`;
    if (contentInserted) await sql.transaction([
        sql`DELETE FROM portfolio_experiences WHERE id = ${id}`,
        sql`DELETE FROM portfolio_services WHERE id = ${id}`,
    ]);
    if (uploaded) await files.delete(key);
    console.log("CLEANUP: temporary verification row and object removed.");
}
if (failure) throw failure;
console.log("PASS END-TO-END: Postgres, Object Storage, and Realtime work through the production-built app.");
