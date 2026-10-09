export const PHNOM_PENH_TZ = "Asia/Phnom_Penh";
export const LONG_INTERVAL_MS = 16 * 60 * 60 * 1000;

export function toMinuteDate(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  return new Date(Math.floor(date.getTime() / 60000) * 60000);
}

export function minuteIso(value = new Date()) {
  return toMinuteDate(value).toISOString();
}

export function getCambodiaDateParts(value) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PHNOM_PENH_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
  }).formatToParts(new Date(value));
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

export function cambodiaDateKey(value) {
  const parts = getCambodiaDateParts(value);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function cambodiaDateTimeToIso(date, time) {
  return minuteIso(new Date(`${date}T${time}:00+07:00`));
}

export function dateInputValue(value) {
  return cambodiaDateKey(value);
}

export function timeInputValue(value) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: PHNOM_PENH_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(toMinuteDate(value));
}

export function intervalDurationMs(inAt, outAt = new Date()) {
  const start = toMinuteDate(inAt);
  const end = toMinuteDate(outAt);
  return Math.max(0, end - start);
}

export function isCrossDayInterval(inAt, outAt) {
  if (!outAt) return false;
  return cambodiaDateKey(inAt) !== cambodiaDateKey(outAt);
}

export function isLongInterval(inAt, outAt = new Date()) {
  return intervalDurationMs(inAt, outAt) > LONG_INTERVAL_MS;
}

export function buildRawShifts(events = [], workerId) {
  const workerEvents = events
    .filter((event) => event.workerId === workerId)
    .sort((a, b) => new Date(a.at) - new Date(b.at));
  const shifts = [];
  let open = null;

  for (const event of workerEvents) {
    const normalizedEvent = { ...event, at: minuteIso(event.at) };
    if (event.type === "in") {
      open = normalizedEvent;
    }
    if (event.type === "out" && open) {
      shifts.push({
        workerId,
        date: cambodiaDateKey(open.at),
        inAt: open.at,
        outAt: normalizedEvent.at,
        pending: open.pending || event.pending,
        eventIds: [open.id, event.id].filter(Boolean)
      });
      open = null;
    }
  }

  if (open) {
    shifts.push({
      workerId,
      date: cambodiaDateKey(open.at),
      inAt: open.at,
      outAt: null,
      pending: open.pending,
      eventIds: [open.id].filter(Boolean)
    });
  }

  return shifts;
}

export function overrideIntervals(override = {}) {
  const source = Array.isArray(override.intervals) && override.intervals.length
    ? override.intervals
    : override.inAt && override.outAt
      ? [{ id: `${override.id || "override"}-legacy`, inAt: override.inAt, outAt: override.outAt }]
      : [];

  return source
    .filter((interval) => interval?.inAt && interval?.outAt)
    .map((interval, index) => ({
      id: interval.id || `${override.id || "override"}-${index}`,
      inAt: minuteIso(interval.inAt),
      outAt: minuteIso(interval.outAt)
    }))
    .filter((interval) => new Date(interval.outAt) > new Date(interval.inAt));
}

export function normalizeOverride(override = {}) {
  return {
    ...override,
    intervals: overrideIntervals(override)
  };
}

export function shiftsWithOverrides(events = [], overrides = [], workerId) {
  const raw = buildRawShifts(events, workerId);
  const approvedOverrides = overrides
    .filter((override) => override.workerId === workerId)
    .map(normalizeOverride)
    .filter((override) => override.intervals.length);
  const overrideDates = new Set(approvedOverrides.map((override) => override.date));
  const rawShifts = raw.filter((shift) => !overrideDates.has(shift.date));
  const manualShifts = approvedOverrides.flatMap((override) => {
    return override.intervals.map((interval) => ({
      workerId,
      date: override.date,
      inAt: interval.inAt,
      outAt: interval.outAt,
      pending: false,
      manual: true,
      requestId: override.requestId,
      overrideId: override.id,
      intervalId: interval.id
    }));
  });

  return [...rawShifts, ...manualShifts].sort((a, b) => new Date(b.inAt) - new Date(a.inAt));
}

export function buildManualIntervals(rows = []) {
  const intervals = [];

  for (const [index, row] of rows.entries()) {
    const values = [row.startDate, row.startTime, row.endDate, row.endTime];
    const hasAnyValue = values.some(Boolean);
    if (!hasAnyValue) continue;

    if (values.some((value) => !value)) {
      return { ok: false, code: "complete", row: index };
    }

    const inAt = cambodiaDateTimeToIso(row.startDate, row.startTime);
    const outAt = cambodiaDateTimeToIso(row.endDate, row.endTime);
    if (new Date(outAt) <= new Date(inAt)) {
      return { ok: false, code: "order", row: index };
    }
    intervals.push({ id: row.id || "", inAt, outAt });
  }

  if (!intervals.length) {
    return { ok: false, code: "empty", row: 0 };
  }

  const sorted = [...intervals].sort((a, b) => new Date(a.inAt) - new Date(b.inAt));
  for (let index = 1; index < sorted.length; index += 1) {
    if (new Date(sorted[index].inAt) < new Date(sorted[index - 1].outAt)) {
      return { ok: false, code: "overlap", row: index };
    }
  }

  return { ok: true, intervals: sorted };
}
