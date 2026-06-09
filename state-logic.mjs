export const ACTIVE_PROFILE_CLEANUP_VERSION = "real-workers-2026-06-08";

const REAL_WORKER_NAMES = new Set([
  "koemyengvanh",
  "mery vuth",
  "mony keu",
  "pharith chin"
]);
const DEMO_WORKER_IDS = new Set(["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8"]);

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function unique(values = []) {
  return Array.from(new Set(asArray(values).filter(Boolean))).sort();
}

function workerNameKey(worker) {
  return String(worker?.name || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function isDemoWorker(worker) {
  return DEMO_WORKER_IDS.has(worker?.id) && /^100[1-8]$/.test(worker?.pin || "");
}

function itemKey(item, index) {
  if (item?.id) return `id:${item.id}`;
  const parts = [
    item?.workerId,
    item?.type,
    item?.at,
    item?.date,
    item?.inAt,
    item?.outAt,
    item?.requestedStart,
    item?.requestedEnd,
    item?.createdAt,
    item?.text
  ].filter(Boolean);
  return parts.length ? `legacy:${parts.join("|")}` : `index:${index}`;
}

function mergeById(localItems = [], remoteItems = []) {
  const byId = new Map();
  asArray(remoteItems).forEach((item, index) => {
    byId.set(itemKey(item, index), item);
  });
  asArray(localItems).forEach((item, index) => {
    const key = itemKey(item, index);
    byId.set(key, { ...byId.get(key), ...item });
  });
  return Array.from(byId.values());
}

export function normalizeTimeClockState(saved = {}) {
  const cleanupVersions = unique(saved.cleanupVersions);
  const deletedWorkerIds = new Set(unique(saved.deletedWorkerIds));
  const workers = asArray(saved.workers);

  workers.filter(isDemoWorker).forEach((worker) => deletedWorkerIds.add(worker.id));

  if (!cleanupVersions.includes(ACTIVE_PROFILE_CLEANUP_VERSION)) {
    workers.forEach((worker) => {
      if (!REAL_WORKER_NAMES.has(workerNameKey(worker))) {
        deletedWorkerIds.add(worker.id);
      }
    });
    cleanupVersions.push(ACTIVE_PROFILE_CLEANUP_VERSION);
    cleanupVersions.sort();
  }

  const deleted = new Set(deletedWorkerIds);
  const activeWorkers = workers.filter((worker) => worker?.id && !deleted.has(worker.id));

  return {
    workers: activeWorkers,
    events: asArray(saved.events),
    requests: asArray(saved.requests),
    overrides: asArray(saved.overrides),
    deletedWorkerIds: unique(Array.from(deleted)),
    cleanupVersions: unique(cleanupVersions)
  };
}

export function markWorkerDeleted(saved = {}, workerId) {
  const state = normalizeTimeClockState(saved);
  if (!workerId) return state;
  return normalizeTimeClockState({
    ...state,
    deletedWorkerIds: [...state.deletedWorkerIds, workerId],
    cleanupVersions: state.cleanupVersions
  });
}

export function normalizeStateJson(json = "") {
  return JSON.stringify(normalizeTimeClockState(parseStateJson(json)));
}

export function mergeStateJson(localJson = "", remoteJson = "") {
  const localState = parseStateJson(localJson);
  const remoteState = parseStateJson(remoteJson);
  const deletedWorkerIds = unique([
    ...asArray(localState.deletedWorkerIds),
    ...asArray(remoteState.deletedWorkerIds)
  ]);
  const cleanupVersions = unique([
    ...asArray(localState.cleanupVersions),
    ...asArray(remoteState.cleanupVersions)
  ]);

  return JSON.stringify(normalizeTimeClockState({
    workers: mergeById(localState.workers, remoteState.workers),
    events: mergeById(localState.events, remoteState.events),
    requests: mergeById(localState.requests, remoteState.requests),
    overrides: mergeById(localState.overrides, remoteState.overrides),
    deletedWorkerIds,
    cleanupVersions
  }));
}

function parseStateJson(json) {
  try {
    return json ? JSON.parse(json) : {};
  } catch {
    return {};
  }
}
