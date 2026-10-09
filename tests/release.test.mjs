import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicRoot = join(root, "public");
test("the shipped artifact has no backend/config or external runtime dependencies", async () => {
  const names = await readdir(publicRoot);
  assert.deepEqual(names.sort(), [".nojekyll", "admin.html", "app.js", "demo-data.mjs", "display.mjs", "icon.svg", "index.html", "manifest.webmanifest", "state-logic.mjs", "styles.css", "time-logic.mjs"].sort());
  for (const name of names) {
    const source = await readFile(join(publicRoot, name), "utf8");
    assert.doesNotMatch(source, /https?:\/\/(?!www\.w3\.org\/2000\/svg)/, name);
    assert.doesNotMatch(source, /\b(?:fetch|WebSocket|XMLHttpRequest|sendBeacon)\s*\(/, name);
    assert.doesNotMatch(source, /firebase|gstatic|team-time-clock-v1|ADMIN_PASSCODE_HASH|REAL_WORKER_NAMES/, name);
  }
  const html = await readFile(join(publicRoot, "index.html"), "utf8");
  assert.match(html, /connect-src 'none'/);
  assert.doesNotMatch(html, /type="password"/);
});
test("both admin name renderers apply HTML escaping", async () => {
  const source = await readFile(join(publicRoot, "app.js"), "utf8");
  assert.doesNotMatch(source, /\$\{worker\.name\}/);
  assert.match(source, /<strong>\$\{escapeHtml\(worker\.name\)\}<\/strong>/);
});
test("Pages publishes only public and depends on passing tests", async () => {
  const workflow = await readFile(join(root, ".github/workflows/pages.yml"), "utf8");
  assert.match(workflow, /needs: test/);
  assert.match(workflow, /path: public/);
  assert.match(workflow, /github\.event_name != 'pull_request'/);
});
