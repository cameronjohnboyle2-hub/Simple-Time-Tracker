import { cambodiaDateKey, cambodiaDateTimeToIso } from "./time-logic.mjs";

export function createDemoState(now = new Date()) {
  const today = cambodiaDateKey(now);
  const localDay = new Date(`${today}T00:00:00Z`);
  const monday = new Date(localDay);
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() || 7) - 1));
  const shiftDate = monday.toISOString().slice(0, 10);
  const stamp = (time) => cambodiaDateTimeToIso(shiftDate, time);
  const workers = [
    { id: "demo-amber", name: "Demo Amber", createdAt: stamp("08:00") },
    { id: "demo-indigo", name: "Demo Indigo", createdAt: stamp("08:00") },
    { id: "demo-jade", name: "Demo Jade", createdAt: stamp("08:00") }
  ];
  const events = workers.flatMap((worker, index) => [
    { id: `demo-in-${index}`, workerId: worker.id, type: "in", at: stamp("09:00"), pending: false },
    { id: `demo-out-${index}`, workerId: worker.id, type: "out", at: stamp(index === 0 ? "16:00" : "17:00"), pending: false }
  ]);
  return {
    workers, events,
    requests: [{
      id: "demo-correction", workerId: "demo-amber", date: shiftDate,
      requestedStart: "09:00", requestedEnd: "17:00",
      inAt: stamp("09:00"), outAt: stamp("17:00"),
      text: "Fictional example: the afternoon finish time should be 17:00.",
      status: "pending", createdAt: now.toISOString()
    }],
    overrides: [], deletedWorkerIds: []
  };
}
