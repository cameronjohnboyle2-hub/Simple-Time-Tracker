import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeTimeClockState, markWorkerDeleted } from "../public/state-logic.mjs";
import { createDemoState } from "../public/demo-data.mjs";
import { escapeHtml } from "../public/display.mjs";

const now = new Date("2026-10-09T12:00:00Z");
test("fixtures contain three explicitly fictional workers and a usable correction", () => {
  const state = normalizeTimeClockState(createDemoState(now));
  assert.equal(state.workers.length, 3);
  assert.ok(state.workers.every((worker) => worker.name.startsWith("Demo ")));
  assert.equal(state.events.length, 6);
  assert.equal(state.requests[0].status, "pending");
  assert.equal(state.requests[0].date, "2026-10-05");
  assert.ok(state.requests[0].outAt > state.requests[0].inAt);
});
test("normalization drops credentials and operational cleanup metadata", () => {
  const state = createDemoState(now);
  state.workers[0].pin = "synthetic-not-a-credential";
  state.secret = "synthetic-secret";
  state.cleanupVersions = ["private-cleanup"];
  const normalized = normalizeTimeClockState(state);
  assert.equal("pin" in normalized.workers[0], false);
  assert.equal("secret" in normalized, false);
  assert.equal("cleanupVersions" in normalized, false);
});
test("deleting a worker removes dependent visible records and stays deleted on reload", () => {
  const state = markWorkerDeleted(createDemoState(now), "demo-amber");
  assert.equal(state.workers.length, 2);
  assert.equal(state.requests.length, 0);
  assert.ok(state.events.every((event) => event.workerId !== "demo-amber"));
  state.workers.push({ id: "demo-amber", name: "Demo Amber" });
  assert.equal(normalizeTimeClockState(state).workers.some((worker) => worker.id === "demo-amber"), false);
});
test("malformed IDs and date attributes cannot reach rendering from a saved cache", () => {
  const state = createDemoState(now);
  state.workers.push({ id: 'bad" onclick="x', name: "Synthetic" });
  state.events.push({ id: "bad-date", workerId: "demo-amber", type: "in", at: "invalid" });
  state.requests.push({ ...state.requests[0], id: "bad-day", date: '2026-10-05" onmouseover="x' });
  const normalized = normalizeTimeClockState(state);
  assert.equal(normalized.workers.length, 3);
  assert.equal(normalized.events.length, 6);
  assert.equal(normalized.requests.length, 1);
  assert.doesNotThrow(() => normalizeTimeClockState(null));
});
test("stored names render as literal text rather than executable markup", () => {
  const name = '<img src=x onerror="synthetic()"> & \'quote\'';
  assert.equal(escapeHtml(name), '&lt;img src=x onerror=&quot;synthetic()&quot;&gt; &amp; &#039;quote&#039;');
});
