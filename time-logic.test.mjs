import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildManualIntervals,
  buildRawShifts,
  cambodiaDateKey,
  dateInputValue,
  intervalDurationMs,
  isCrossDayInterval,
  isLongInterval,
  minuteIso,
  shiftsWithOverrides,
  timeInputValue
} from "./time-logic.mjs";

describe("time interval logic", () => {
  it("keeps multiple clock-in/out intervals on the same Cambodia day", () => {
    const events = [
      { id: "in-1", workerId: "w1", type: "in", at: "2026-06-02T02:04:59.000Z" },
      { id: "out-1", workerId: "w1", type: "out", at: "2026-06-02T05:00:30.000Z" },
      { id: "in-2", workerId: "w1", type: "in", at: "2026-06-02T06:00:00.000Z" },
      { id: "out-2", workerId: "w1", type: "out", at: "2026-06-02T11:15:01.000Z" }
    ];

    const shifts = buildRawShifts(events, "w1");

    assert.equal(shifts.length, 2);
    assert.deepEqual(shifts.map((shift) => shift.date), ["2026-06-02", "2026-06-02"]);
  });

  it("calculates durations from displayed minutes instead of hidden seconds", () => {
    const ms = intervalDurationMs("2026-06-02T02:04:59.000Z", "2026-06-02T11:15:01.000Z");

    assert.equal(ms / 60000, 551);
  });

  it("normalizes new clock events to exact visible minutes", () => {
    assert.equal(minuteIso("2026-06-02T02:04:59.999Z"), "2026-06-02T02:04:00.000Z");
    assert.equal(timeInputValue("2026-06-02T02:04:59.999Z"), "09:04");
  });

  it("ignores stray clock-out events and keeps an open interval visible", () => {
    const events = [
      { id: "stray-out", workerId: "w1", type: "out", at: "2026-06-02T01:00:00.000Z" },
      { id: "in-1", workerId: "w1", type: "in", at: "2026-06-02T02:04:00.000Z" }
    ];

    const shifts = buildRawShifts(events, "w1");

    assert.equal(shifts.length, 1);
    assert.equal(shifts[0].outAt, null);
    assert.equal(shifts[0].date, "2026-06-02");
  });

  it("uses the latest clock-in when someone clocks in twice before clocking out", () => {
    const events = [
      { id: "in-1", workerId: "w1", type: "in", at: "2026-06-02T02:04:00.000Z" },
      { id: "in-2", workerId: "w1", type: "in", at: "2026-06-02T03:00:00.000Z" },
      { id: "out-1", workerId: "w1", type: "out", at: "2026-06-02T11:15:00.000Z" }
    ];

    const shifts = buildRawShifts(events, "w1");

    assert.equal(shifts.length, 1);
    assert.equal(shifts[0].inAt, "2026-06-02T03:00:00.000Z");
    assert.equal(intervalDurationMs(shifts[0].inAt, shifts[0].outAt) / 60000, 495);
  });

  it("treats old single-interval overrides as one manual interval", () => {
    const shifts = shiftsWithOverrides([], [{
      id: "old-override",
      workerId: "w1",
      date: "2026-06-02",
      inAt: "2026-06-02T02:04:00.000Z",
      outAt: "2026-06-02T11:15:00.000Z"
    }], "w1");

    assert.equal(shifts.length, 1);
    assert.equal(shifts[0].manual, true);
    assert.equal(shifts[0].date, "2026-06-02");
  });

  it("manual overrides replace raw shifts for only the edited day", () => {
    const events = [
      { id: "jun2-in", workerId: "w1", type: "in", at: "2026-06-02T02:00:00.000Z" },
      { id: "jun2-out", workerId: "w1", type: "out", at: "2026-06-02T12:00:00.000Z" },
      { id: "jun3-in", workerId: "w1", type: "in", at: "2026-06-03T02:00:00.000Z" },
      { id: "jun3-out", workerId: "w1", type: "out", at: "2026-06-03T11:00:00.000Z" }
    ];
    const overrides = [{
      id: "jun2-manual",
      workerId: "w1",
      date: "2026-06-02",
      intervals: [
        { id: "morning", inAt: "2026-06-02T02:00:00.000Z", outAt: "2026-06-02T05:00:00.000Z" },
        { id: "afternoon", inAt: "2026-06-02T06:00:00.000Z", outAt: "2026-06-02T11:00:00.000Z" }
      ]
    }];

    const shifts = shiftsWithOverrides(events, overrides, "w1");
    const jun2 = shifts.filter((shift) => shift.date === "2026-06-02");
    const jun3 = shifts.filter((shift) => shift.date === "2026-06-03");

    assert.equal(jun2.length, 2);
    assert.equal(jun2.every((shift) => shift.manual), true);
    assert.equal(jun2.reduce((sum, shift) => sum + intervalDurationMs(shift.inAt, shift.outAt), 0) / 60000, 480);
    assert.equal(jun3.length, 1);
    assert.equal(jun3[0].manual, undefined);
  });

  it("marks cross-day intervals and preserves their real dates", () => {
    const inAt = "2026-06-03T02:06:00.000Z";
    const outAt = "2026-06-04T11:08:00.000Z";

    assert.equal(cambodiaDateKey(inAt), "2026-06-03");
    assert.equal(cambodiaDateKey(outAt), "2026-06-04");
    assert.equal(isCrossDayInterval(inAt, outAt), true);
    assert.equal(isLongInterval(inAt, outAt), true);
    assert.equal(timeInputValue(outAt), "18:08");
    assert.equal(dateInputValue(outAt), "2026-06-04");
  });

  it("allows a valid short overnight interval while still marking it cross-day", () => {
    const inAt = "2026-06-02T16:30:00.000Z";
    const outAt = "2026-06-02T18:15:00.000Z";

    assert.equal(cambodiaDateKey(inAt), "2026-06-02");
    assert.equal(cambodiaDateKey(outAt), "2026-06-03");
    assert.equal(isCrossDayInterval(inAt, outAt), true);
    assert.equal(isLongInterval(inAt, outAt), false);
    assert.equal(intervalDurationMs(inAt, outAt) / 60000, 105);
  });

  it("validates complete, ordered, non-overlapping manual intervals", () => {
    const valid = buildManualIntervals([
      { startDate: "2026-06-02", startTime: "09:00", endDate: "2026-06-02", endTime: "12:00" },
      { startDate: "2026-06-02", startTime: "13:00", endDate: "2026-06-02", endTime: "18:00" }
    ]);
    const overlap = buildManualIntervals([
      { startDate: "2026-06-02", startTime: "09:00", endDate: "2026-06-02", endTime: "13:00" },
      { startDate: "2026-06-02", startTime: "12:30", endDate: "2026-06-02", endTime: "18:00" }
    ]);
    const incomplete = buildManualIntervals([
      { startDate: "2026-06-02", startTime: "09:00", endDate: "2026-06-02", endTime: "" }
    ]);

    assert.equal(valid.ok, true);
    assert.equal(valid.intervals.length, 2);
    assert.deepEqual(overlap, { ok: false, code: "overlap", row: 1 });
    assert.deepEqual(incomplete, { ok: false, code: "complete", row: 0 });
  });

  it("allows back-to-back manual intervals but rejects reversed and empty rows", () => {
    const backToBack = buildManualIntervals([
      { startDate: "2026-06-02", startTime: "09:00", endDate: "2026-06-02", endTime: "12:00" },
      { startDate: "2026-06-02", startTime: "12:00", endDate: "2026-06-02", endTime: "18:00" }
    ]);
    const reversed = buildManualIntervals([
      { startDate: "2026-06-02", startTime: "18:00", endDate: "2026-06-02", endTime: "09:00" }
    ]);
    const empty = buildManualIntervals([
      { startDate: "", startTime: "", endDate: "", endTime: "" }
    ]);

    assert.equal(backToBack.ok, true);
    assert.equal(backToBack.intervals.length, 2);
    assert.deepEqual(reversed, { ok: false, code: "order", row: 0 });
    assert.deepEqual(empty, { ok: false, code: "empty", row: 0 });
  });
});
