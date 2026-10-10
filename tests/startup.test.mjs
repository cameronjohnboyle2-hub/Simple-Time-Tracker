import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import * as timeLogic from "../public/time-logic.mjs";
import * as stateLogic from "../public/state-logic.mjs";
import { createDemoState } from "../public/demo-data.mjs";
import { escapeHtml } from "../public/display.mjs";

const source = (await readFile(new URL("../public/app.js", import.meta.url), "utf8"))
  .replace(/^import[\s\S]*?from "[^"]+";\r?\n/gm, "");

function boot({ cachedValue = null, storageBlocked = false } = {}) {
  const reads = [], writes = [], elements = new Map();
  const element = () => ({
    value: "", textContent: "", dataset: {},
    classList: { add() {}, remove() {}, toggle() {} },
    setAttribute() {}, addEventListener() {}, replaceChildren() {}, append() {}
  });
  const querySelector = (selector) => {
    if (!elements.has(selector)) elements.set(selector, element());
    return elements.get(selector);
  };
  const context = {
    ...timeLogic, ...stateLogic, createDemoState, escapeHtml,
    localStorage: {
      getItem(key) { reads.push(key); if (storageBlocked) throw new Error("blocked"); return key.endsWith("demo-v1") ? cachedValue : null; },
      setItem(key, value) { if (storageBlocked) throw new Error("blocked"); writes.push({ key, value }); }
    },
    document: { querySelector, querySelectorAll: () => [], createElement: element, documentElement: {}, title: "" },
    window: { location: { pathname: "/" }, clearTimeout() {}, setTimeout: () => 0 }
  };
  // Allow a cold CI runner to initialize Intl while keeping script execution bounded.
  vm.runInNewContext(`${source}\nglobalThis.bootState = state;`, context, { timeout: 5000 });
  return { context, reads, writes, elements };
}

test("actual app startup replaces malformed saved JSON with fictional fixtures", () => {
  const result = boot({ cachedValue: "{damaged-json" });
  assert.equal(result.context.bootState.workers.length, 3);
  assert.equal(result.writes.length, 1);
  assert.equal(JSON.parse(result.writes[0].value).workers[0].name, "Demo Amber");
});
test("actual app startup does not load legacy operational storage", () => {
  const result = boot();
  assert.deepEqual(result.reads, ["portfolio-time-clock-demo-language-v1", "portfolio-time-clock-demo-v1"]);
  assert.ok(result.writes.every((write) => write.key === "portfolio-time-clock-demo-v1"));
});
test("actual app startup works with blocked storage and shows session-only feedback", () => {
  const result = boot({ storageBlocked: true });
  assert.equal(result.context.bootState.workers.length, 3);
  assert.match(result.elements.get("#toast").textContent, /storage is unavailable/);
});
