import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { chromium } from "playwright";

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", "3000"], { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
let browser;
try {
    await new Promise((resolve, reject) => {
        let stderr = "";
        server.stderr.on("data", chunk => stderr += chunk);
        const timeout = setTimeout(() => reject(new Error("Showcase test server did not start.")), 15000);
        server.once("exit", code => { clearTimeout(timeout); reject(new Error(`Server exited ${code}: ${stderr}`)); });
        server.stdout.on("data", chunk => { if (chunk.toString().includes("Ready")) { clearTimeout(timeout); resolve(); } });
    });
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
    assert.deepEqual((await page.locator("h5:visible").allTextContents()).slice(0, 2), ["Fallen Tear: The Ascension", "Seller's Notebook"]);
    await page.getByRole("tab", { name: "Personal", exact: true }).click();
    assert.equal(await page.locator("h5:visible").first().textContent(), "Seller's Notebook");
    assert.ok((await page.locator("h5:visible").first().locator("xpath=../..").textContent()).includes("Flagship · Personal project"));
    console.log("PASS flagship ordering: Fallen Tear first overall; Seller's Notebook first among personal projects, with database badges.");

    await page.goto("http://localhost:3000/projects/sellers-notebook", { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Seller's Notebook", exact: true }).waitFor();
    await page.getByText("Flagship · Personal project", { exact: true }).waitFor();
    const gallery = page.getByRole("region", { name: "Seller's Notebook media gallery" });
    assert.equal(await gallery.getByRole("button", { name: /^Show (image|video):/ }).count(), 6);
    await gallery.getByRole("button", { name: "Expand image: Seller's Notebook brand preview", exact: true }).click();
    await page.getByRole("dialog").waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "detached" });
    await gallery.getByRole("button", { name: "Next media", exact: true }).click();
    await gallery.getByRole("img", { name: "Business overview", exact: true }).evaluate(img => img.decode());
    await gallery.getByRole("button", { name: "Next media", exact: true }).click();
    await gallery.getByRole("img", { name: "Inventory workspace", exact: true }).evaluate(img => img.decode());
    await gallery.getByRole("button", { name: "Show video: Product walkthrough", exact: true }).click();
    const video = gallery.locator("video");
    assert.equal(await video.getAttribute("preload"), "none");
    assert.equal(await video.getAttribute("autoplay"), null);
    assert.equal(await video.evaluate(element => element.paused), true);
    await video.evaluate(async element => { element.load(); await element.play(); });
    await page.waitForFunction(() => document.querySelector("video")?.currentTime > 0.1);
    assert.ok(await video.evaluate(element => element.duration >= 14 && element.videoWidth > 0));
    await video.evaluate(element => element.pause());
    await gallery.getByRole("button", { name: "Previous media", exact: true }).click();
    assert.equal(await gallery.locator("video").count(), 0);
    console.log("PASS Notebook gallery: six media items, image enlargement, previous/next selection, and real MP4 playback; no autoplay.");

    await page.goto("http://localhost:3000/projects/fallen-tear", { waitUntil: "networkidle" });
    const gameGallery = page.getByRole("region", { name: "Fallen Tear: The Ascension media gallery" });
    assert.equal(await gameGallery.getByRole("button", { name: /^Show (image|video):/ }).count(), 4);
    assert.equal(await gameGallery.locator("iframe").count(), 0);
    await gameGallery.getByRole("button", { name: "Show video: Official release date trailer", exact: true }).click();
    const embed = gameGallery.locator("iframe");
    await embed.waitFor();
    assert.equal(await embed.getAttribute("src"), "https://www.youtube-nocookie.com/embed/PiFNRVGdI9A");
    assert.ok((await embed.getAttribute("title")).length > 0);
    console.log("PASS Fallen Tear gallery: three official screenshots and allowlisted trailer embed, loaded only after selection.");

    await page.goto("http://localhost:3000/projects/heartfleet", { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Heartfleet", exact: true }).waitFor();
    assert.equal(await page.getByRole("heading", { name: "Project showcase", exact: true }).count(), 0);
    await page.getByRole("img", { name: "Heartfleet", exact: true }).evaluate(img => img.decode());
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3000/projects/sellers-notebook", { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Project showcase", exact: true }).waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    assert.deepEqual(errors, []);
    console.log("PASS legacy cover fallback and mobile gallery layout; no browser runtime errors.");
} finally {
    if (browser) await browser.close();
    if (server.exitCode === null) {
        const stopped = new Promise(resolve => server.once("exit", resolve));
        if (process.platform === "win32") execFileSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
        else server.kill();
        await stopped;
    }
    console.log("Temporary showcase test server stopped.");
}
