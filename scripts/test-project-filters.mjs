import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { neon } from "@neondatabase/serverless";
import { chromium } from "playwright";

createRequire(import.meta.url)("@next/env").loadEnvConfig(process.cwd());
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`SELECT company_name, project_type, categories FROM portfolio_projects WHERE published = true`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", "3000"], { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
let browser;
try {
    await new Promise((resolve, reject) => {
        let stderr = "";
        server.stderr.on("data", chunk => stderr += chunk);
        const timeout = setTimeout(() => reject(new Error("Filter test server did not start.")), 15000);
        server.once("exit", code => { clearTimeout(timeout); reject(new Error(`Server exited ${code}: ${stderr}`)); });
        server.stdout.on("data", chunk => { if (chunk.toString().includes("Ready")) { clearTimeout(timeout); resolve(); } });
    });
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
    const filter = page.getByLabel("Category", { exact: true });
    const expected = (category, type) => rows.filter(row => (!category || row.categories.includes(category)) && (!type || row.project_type === type)).map(row => row.company_name).sort();
    const actual = async () => (await page.locator("h5:visible").allTextContents()).sort();
    assert.equal(await page.locator("h5:visible").first().textContent(), "Fallen Tear: The Ascension");
    await filter.selectOption("Game Dev");
    assert.deepEqual(await actual(), expected("Game Dev"));
    await page.getByRole("tab", { name: "Personal", exact: true }).click();
    assert.equal(await filter.inputValue(), "Game Dev");
    assert.deepEqual(await actual(), expected("Game Dev", "Personal"));
    await page.getByRole("tab", { name: "Professional", exact: true }).click();
    assert.deepEqual(await actual(), expected("Game Dev", "Professional"));
    await filter.selectOption("E-Commerce");
    assert.deepEqual(await actual(), expected("E-Commerce", "Professional"));
    if (!expected("E-Commerce", "Professional").length) await page.getByText("No projects match this category in the selected tab.", { exact: true }).first().waitFor();
    await page.getByRole("tab", { name: "All", exact: true }).click();
    assert.deepEqual(await actual(), expected("E-Commerce"));
    await page.getByRole("button", { name: "Clear category", exact: true }).click();
    assert.deepEqual(await actual(), expected());
    console.log("PASS desktop: Game Dev/category filtering combines with all three tabs; empty state, reset, and flagship order work.");
    await page.setViewportSize({ width: 390, height: 844 });
    await filter.selectOption("Game Dev");
    await page.getByRole("button", { name: "All", exact: true }).click();
    await page.getByRole("menuitem", { name: "Personal", exact: true }).click();
    assert.deepEqual(await actual(), expected("Game Dev", "Personal"));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    console.log("PASS mobile: category selection and Personal dropdown work together without overflow.");
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    assert.equal(await page.getByLabel("Category", { exact: true }).count(), 0);
    assert.equal(await page.locator("#projects h5").count(), 3);
    assert.deepEqual(errors, []);
    console.log("PASS homepage: featured cards unchanged; no browser runtime errors.");
} finally {
    if (browser) await browser.close();
    if (server.exitCode === null) {
        const stopped = new Promise(resolve => server.once("exit", resolve));
        if (process.platform === "win32") execFileSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
        else server.kill();
        await stopped;
    }
    console.log("Temporary filter test server stopped.");
}
