import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { chromium } from "playwright";

// Use a dedicated server that this test owns and always stops.
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", "3000"], {
    cwd: process.cwd(), windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
});
let browser;
try {
    await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Test server did not start.")), 15000);
        server.once("exit", code => { clearTimeout(timeout); reject(new Error(`Test server exited: ${code}`)); });
        server.stdout.on("data", chunk => { if (chunk.toString().includes("Ready")) { clearTimeout(timeout); resolve(); } });
    });
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(() => {
        window.__loadingLabels = [];
        window.__loadingShells = [];
        new MutationObserver(() => {
            document.querySelectorAll('[role="progressbar"]').forEach(element => {
                const label = element.getAttribute("aria-label");
                if (label && !window.__loadingLabels.includes(label)) {
                    window.__loadingLabels.push(label);
                    window.__loadingShells.push({ label, heading: document.querySelector("main h1")?.textContent });
                }
            });
        }).observe(document, { childList: true, subtree: true });
    });
    const routes = [
        ["/", ["Loading projects", "Loading service packages", "Loading experience"], "Aaron James R. Mission"],
        ["/projects", ["Loading projects"], "Projects"],
        ["/projects/fallen-tear", ["Loading project details"]],
        ["/services", ["Loading service packages"], "Let's build your next idea."],
        ["/experience", ["Loading experience"], "Experience"],
        ["/experience/cmd", ["Loading experience details"]],
    ];
    for (const [route, expectedLabels, shellHeading] of routes) {
        const response = await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        const labels = await page.evaluate(() => window.__loadingLabels);
        for (const label of expectedLabels) {
            assert.ok(labels.includes(label), `${route} did not render ${label} (observed: ${labels.join(", ")}).`);
        }
        if (shellHeading) {
            const shells = await page.evaluate(() => window.__loadingShells);
            assert.ok(shells.some(shell => shell.heading?.includes(shellHeading)), `${route} hid its page heading while data loaded.`);
        }
        assert.equal(await page.getByRole("progressbar").count(), 0, "Loading indicator remained after data arrived.");
        assert.equal(await page.locator("header").count(), 1);
        console.log(`PASS ${route}: section loading appeared with page shell intact, then content replaced it.`);
    }
    // Internal navigation must also show feedback while the next route loads.
    await page.getByRole("link", { name: "Services", exact: true }).click();
    await page.waitForURL("**/services");
    await page.getByRole("heading", { name: "Let's build your next idea.", exact: true }).waitFor();
    await page.getByRole("progressbar").waitFor({ state: "detached" });
    assert.equal(await page.getByRole("progressbar").count(), 0);
    assert.deepEqual(errors, []);
    console.log("PASS client navigation and reduced-motion rendering; no browser runtime errors.");
} finally {
    if (browser) await browser.close();
    if (server.exitCode === null) {
        const stopped = new Promise(resolve => server.once("exit", resolve));
        if (process.platform === "win32") {
            execFileSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
        } else {
            server.kill();
        }
        await stopped;
    }
    console.log("Temporary loading-test server stopped.");
}
