import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ACTIVE_PROFILE_CLEANUP_VERSION,
  markWorkerDeleted,
  mergeStateJson,
  normalizeTimeClockState
} from "./state-logic.mjs";

const cleanupDone = [ACTIVE_PROFILE_CLEANUP_VERSION];

describe("state cleanup and deletion sync", () => {
  it("runs a one-time cleanup that keeps only the four active profiles", () => {
    const state = normalizeTimeClockState({
      workers: [
        { id: "pharith", name: "Pharith Chin" },
        { id: "mery", name: "Mery Vuth" },
        { id: "test", name: "Test Worker" }
      ],
      events: [
        { id: "real-event", workerId: "pharith" },
        { id: "test-event", workerId: "test" }
      ],
      requests: [
        { id: "real-request", workerId: "mery" },
        { id: "test-request", workerId: "test" }
      ],
      overrides: [
        { id: "real-override", workerId: "pharith" },
        { id: "test-override", workerId: "test" }
      ]
    });

    assert.deepEqual(state.workers.map((worker) => worker.name), ["Pharith Chin", "Mery Vuth"]);
    assert.deepEqual(state.events.map((event) => event.id), ["real-event", "test-event"]);
    assert.deepEqual(state.requests.map((request) => request.id), ["real-request", "test-request"]);
    assert.deepEqual(state.overrides.map((override) => override.id), ["real-override", "test-override"]);
    assert.deepEqual(state.deletedWorkerIds, ["test"]);
    assert.equal(state.cleanupVersions.includes(ACTIVE_PROFILE_CLEANUP_VERSION), true);
  });

  it("does not delete new future workers after the one-time cleanup has run", () => {
    const state = normalizeTimeClockState({
      cleanupVersions: cleanupDone,
      workers: [
        { id: "new-worker", name: "New Real Person" }
      ]
    });

    assert.deepEqual(state.workers.map((worker) => worker.id), ["new-worker"]);
    assert.deepEqual(state.deletedWorkerIds, []);
  });

  it("marks deleted workers with a tombstone without discarding clock data", () => {
    const state = markWorkerDeleted({
      cleanupVersions: cleanupDone,
      workers: [
        { id: "keep", name: "Pharith Chin" },
        { id: "delete-me", name: "Old Test" }
      ],
      events: [
        { id: "keep-event", workerId: "keep" },
        { id: "deleted-event", workerId: "delete-me" }
      ],
      requests: [
        { id: "deleted-request", workerId: "delete-me" }
      ],
      overrides: [
        { id: "deleted-override", workerId: "delete-me" }
      ]
    }, "delete-me");

    assert.deepEqual(state.workers.map((worker) => worker.id), ["keep"]);
    assert.deepEqual(state.events.map((event) => event.id), ["keep-event", "deleted-event"]);
    assert.deepEqual(state.requests.map((request) => request.id), ["deleted-request"]);
    assert.deepEqual(state.overrides.map((override) => override.id), ["deleted-override"]);
    assert.deepEqual(state.deletedWorkerIds, ["delete-me"]);
  });

  it("does not resurrect a deleted remote worker during sync merge", () => {
    const local = JSON.stringify({
      cleanupVersions: cleanupDone,
      workers: [{ id: "keep", name: "Pharith Chin" }],
      deletedWorkerIds: ["old-test"]
    });
    const remote = JSON.stringify({
      workers: [
        { id: "keep", name: "Pharith Chin" },
        { id: "old-test", name: "Old Test" }
      ],
      events: [{ id: "old-event", workerId: "old-test" }]
    });

    const merged = JSON.parse(mergeStateJson(local, remote));

    assert.deepEqual(merged.workers.map((worker) => worker.id), ["keep"]);
    assert.deepEqual(merged.events, [{ id: "old-event", workerId: "old-test" }]);
    assert.deepEqual(merged.deletedWorkerIds, ["old-test"]);
  });

  it("preserves legacy clock events that do not have ids", () => {
    const legacyEvent = {
      workerId: "keep",
      type: "in",
      at: "2026-06-02T02:00:00.000Z"
    };
    const local = JSON.stringify({
      cleanupVersions: cleanupDone,
      workers: [{ id: "keep", name: "Pharith Chin" }]
    });
    const remote = JSON.stringify({
      workers: [{ id: "keep", name: "Pharith Chin" }],
      events: [legacyEvent]
    });

    const merged = JSON.parse(mergeStateJson(local, remote));

    assert.deepEqual(merged.events, [legacyEvent]);
  });

  it("keeps legacy demo profiles out of normalized state", () => {
    const state = normalizeTimeClockState({
      cleanupVersions: cleanupDone,
      workers: [
        { id: "w1", name: "Demo Worker", pin: "1001" },
        { id: "real", name: "Pharith Chin", pin: "2001" }
      ]
    });

    assert.deepEqual(state.workers.map((worker) => worker.id), ["real"]);
    assert.deepEqual(state.deletedWorkerIds, ["w1"]);
  });
});
