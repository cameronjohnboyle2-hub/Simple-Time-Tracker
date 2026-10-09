const asArray = (value) => Array.isArray(value) ? value : [];
const validId = (value) => typeof value === "string" && /^[A-Za-z0-9-]{1,64}$/.test(value);
const uniqueIds = (values) => [...new Set(asArray(values).filter(validId))].sort();
const text = (value, length) => typeof value === "string" ? value.slice(0, length) : "";
const validDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(`${value}T00:00:00Z`))
  && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
const iso = (value) => typeof value === "string" && Number.isFinite(Date.parse(value))
  ? new Date(value).toISOString() : null;
const clockTime = (value) => typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : "";

// Project only the demo schema. Never retain credential or operational cleanup fields.
export function normalizeTimeClockState(input = {}) {
  const saved = input && typeof input === "object" ? input : {};
  const deletedWorkerIds = uniqueIds(saved.deletedWorkerIds);
  const deleted = new Set(deletedWorkerIds);
  const workers = asArray(saved.workers)
    .filter((worker) => validId(worker?.id) && !deleted.has(worker.id) && text(worker.name, 80).trim())
    .map((worker) => ({ id: worker.id, name: text(worker.name, 80), createdAt: iso(worker.createdAt) }));
  const workerIds = new Set(workers.map((worker) => worker.id));
  const owns = (item) => item && validId(item.id) && validId(item.workerId) && workerIds.has(item.workerId);
  const events = asArray(saved.events)
    .filter((event) => owns(event) && ["in", "out"].includes(event.type) && iso(event.at))
    .map((event) => ({ id: event.id, workerId: event.workerId, type: event.type, at: iso(event.at), pending: false }));
  const requests = asArray(saved.requests)
    .filter((request) => owns(request) && validDate(request.date) && ["pending", "approved", "denied"].includes(request.status))
    .map((request) => ({
      id: request.id, workerId: request.workerId, date: request.date,
      requestedStart: clockTime(request.requestedStart), requestedEnd: clockTime(request.requestedEnd),
      inAt: iso(request.inAt), outAt: iso(request.outAt), text: text(request.text, 2000),
      status: request.status, createdAt: iso(request.createdAt), reviewedAt: iso(request.reviewedAt)
    }));
  const overrides = asArray(saved.overrides)
    .filter((override) => owns(override) && validDate(override.date))
    .map((override) => ({
      id: override.id, workerId: override.workerId, date: override.date,
      requestId: validId(override.requestId) ? override.requestId : null,
      approvedAt: iso(override.approvedAt),
      intervals: asArray(override.intervals)
        .filter((interval) => validId(interval?.id) && iso(interval.inAt) && iso(interval.outAt) && Date.parse(interval.outAt) > Date.parse(interval.inAt))
        .map((interval) => ({ id: interval.id, inAt: iso(interval.inAt), outAt: iso(interval.outAt) }))
    }));
  return { workers, events, requests, overrides, deletedWorkerIds };
}

export function markWorkerDeleted(saved = {}, workerId) {
  const state = normalizeTimeClockState(saved);
  if (!validId(workerId)) return state;
  return normalizeTimeClockState({ ...state, deletedWorkerIds: [...state.deletedWorkerIds, workerId] });
}
