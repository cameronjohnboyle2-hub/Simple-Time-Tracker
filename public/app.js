import {
  PHNOM_PENH_TZ,
  buildManualIntervals,
  buildRawShifts,
  cambodiaDateKey,
  cambodiaDateTimeToIso,
  dateInputValue,
  getCambodiaDateParts,
  intervalDurationMs,
  isCrossDayInterval,
  isLongInterval,
  minuteIso,
  normalizeOverride,
  overrideIntervals,
  shiftsWithOverrides,
  timeInputValue
} from "./time-logic.mjs";
import {
  markWorkerDeleted,
  normalizeTimeClockState
} from "./state-logic.mjs";

const STORAGE_KEY = "portfolio-time-clock-demo-v1";
const LANGUAGE_KEY = "portfolio-time-clock-demo-language-v1";

import { createDemoState } from "./demo-data.mjs";
import { escapeHtml } from "./display.mjs";

const translations = {
  en: {
    storageError: "Browser storage is unavailable. Changes will last for this session.",
    resetDemo: "Reset demo",
    demoNotice: "Fictional data only · Changes stay in this browser",
    brand: "Fictional workshop team",
    appTitle: "Time Clock",
    exit: "Exit",
    workerSignIn: "Explore the worker view",
    pinHelp: "Choose a fictional worker. No account or PIN needed.",
    pin: "Demo worker",
    enterPin: "Choose a demo worker",
    signIn: "Open worker view",
    createAccount: "Add a fictional worker",
    name: "Name",
    yourName: "Fictional worker name",
    backToSignIn: "Back to demo workers",
    adminLogin: "Explore admin view",
    admin: "Admin",
    adminLoginHelp: "Review fictional hours and correction requests.",
    openAdmin: "Open admin view",
    workerLogin: "Explore worker view",
    hello: "Hello",
    notClockedIn: "Not clocked in",
    clockedInSince: "Clocked in since {time}",
    clockIn: "Clock In",
    clockOut: "Clock Out",
    onlineSync: "Saved in this browser only. No shared account or cloud connection.",
    offlineSync: "Saved in this browser only. This demo works without a cloud connection.",
    readyOffline: "Local demo",
    hours: "Hours",
    request: "Request",
    thisWeek: "This week",
    noShifts: "No shifts recorded this week.",
    date: "Date",
    clockInField: "Clock in",
    clockOutField: "Clock out",
    reason: "Reason",
    requestExample: "Example: I forgot to clock out at 5:00 PM.",
    submitRequest: "Submit Request",
    noRequests: "No requests yet.",
    weeklyHours: "Weekly Hours",
    team: "Team",
    requests: "Requests",
    noWorkers: "No worker accounts yet.",
    noPending: "No pending requests.",
    working: "Working",
    out: "Out",
    showDays: "Show days",
    hideDays: "Hide days",
    noTime: "No time",
    deleteWorker: "Delete worker",
    deleteConfirm: "Slide all the way right to confirm deleting {name}.",
    cancel: "Cancel",
    delete: "Delete",
    incorrectPin: "Choose an available demo worker",
    enterName: "Enter a fictional name (up to 80 characters)",
    addTimeOrNote: "Add a clock time or a note",
    outAfterIn: "Clock out must be after clock in",
    pending: "pending",
    approved: "approved",
    denied: "denied",
    approveAction: "Approve",
    denyAction: "Deny",
    noClockTime: "No clock time selected",
    needsShift: "Needs an existing shift or both clock-in and clock-out times before approval can change hours.",
    willBecome: "Will become {time}",
    adminApproved: "Admin approved",
    pendingSync: "Pending sync",
    saved: "Saved locally",
    inProgress: "In progress",
    now: "Now",
    duration: "{hours}h {minutes}m",
    languageToggle: "ភាសាខ្មែរ",
    switchLanguage: "Switch language",
    signOutLabel: "Leave this demo view",
    workerViews: "Worker views",
    adminViews: "Admin views",
    confirmDeleteLabel: "Confirm delete {name}",
    clockInSummary: "Clock in {time}",
    clockOutSummary: "Clock out {time}",
    previousWeek: "Previous week",
    nextWeek: "Next week",
    currentWeek: "Current week",
    weekOf: "Week of {range}",
    manualEdit: "Manual edit",
    saveTimes: "Save times",
    clearManual: "Clear manual edit",
    manualNeedsBoth: "Complete the start and end date/time for each interval before saving",
    manualSaved: "Manual intervals saved",
    manualIntervals: "Manual intervals",
    addInterval: "Add interval",
    removeInterval: "Remove",
    startDate: "Start date",
    endDate: "End date",
    intervalOverlap: "Intervals cannot overlap",
    reviewInterval: "Review",
    reviewIntervalHelp: "Long or cross-day interval - verify the dates"
  },
  km: {
    storageError: "មិនអាចរក្សាទុកក្នុងកម្មវិធីរុករកបានទេ។ ការកែប្រែនៅតែក្នុងវគ្គនេះ។",
    resetDemo: "ចាប់ផ្តើមគំរូឡើងវិញ",
    demoNotice: "ទិន្នន័យគំរូប៉ុណ្ណោះ · រក្សាទុកតែក្នុងកម្មវិធីរុករកនេះ",
    brand: "ក្រុមសិក្ខាសាលាគំរូ",
    appTitle: "កម្មវិធីកត់ម៉ោងគំរូ",
    exit: "ចេញ",
    workerSignIn: "មើលផ្នែកបុគ្គលិកគំរូ",
    pinHelp: "ជ្រើសរើសបុគ្គលិកគំរូ។ មិនចាំបាច់មានគណនី ឬ PIN ទេ។",
    pin: "បុគ្គលិកគំរូ",
    enterPin: "បញ្ចូលលេខ PIN",
    signIn: "បើកផ្នែកបុគ្គលិក",
    createAccount: "បន្ថែមបុគ្គលិកគំរូ",
    name: "ឈ្មោះ",
    yourName: "ឈ្មោះគំរូ",
    backToSignIn: "ត្រឡប់ទៅបុគ្គលិកគំរូ",
    adminLogin: "មើលផ្នែកអ្នកគ្រប់គ្រងគំរូ",
    admin: "អ្នកគ្រប់គ្រង",
    adminLoginHelp: "ពិនិត្យម៉ោង និងសំណើកែតម្រូវគំរូ។",
    openAdmin: "បើកផ្នែកអ្នកគ្រប់គ្រង",
    workerLogin: "មើលផ្នែកបុគ្គលិក",
    hello: "សួស្តី",
    notClockedIn: "មិនទាន់ចូលធ្វើការ",
    clockedInSince: "បានចូលធ្វើការតាំងពី {time}",
    clockIn: "ចូលធ្វើការ",
    clockOut: "ចេញធ្វើការ",
    onlineSync: "រក្សាទុកតែក្នុងកម្មវិធីរុករកនេះ។ មិនភ្ជាប់ទិន្នន័យរួមទេ។",
    offlineSync: "រក្សាទុកតែក្នុងកម្មវិធីរុករកនេះ។ គំរូនេះមិនត្រូវការភ្ជាប់ទិន្នន័យរួមទេ។",
    readyOffline: "គំរូក្នុងឧបករណ៍",
    hours: "ម៉ោង",
    request: "សំណើ",
    thisWeek: "សប្តាហ៍នេះ",
    noShifts: "មិនមានវេនការងារដែលបានកត់ត្រាក្នុងសប្តាហ៍នេះទេ។",
    date: "កាលបរិច្ឆេទ",
    clockInField: "ម៉ោងចូល",
    clockOutField: "ម៉ោងចេញ",
    reason: "មូលហេតុ",
    requestExample: "ឧទាហរណ៍៖ ខ្ញុំភ្លេចចេញធ្វើការនៅម៉ោង 5:00 ល្ងាច។",
    submitRequest: "ដាក់សំណើ",
    noRequests: "មិនទាន់មានសំណើទេ។",
    weeklyHours: "ម៉ោងធ្វើការប្រចាំសប្តាហ៍",
    team: "ក្រុម",
    requests: "សំណើ",
    noWorkers: "មិនទាន់មានគណនីបុគ្គលិកទេ។",
    noPending: "មិនមានសំណើកំពុងរង់ចាំទេ។",
    working: "កំពុងធ្វើការ",
    out: "បានចេញ",
    showDays: "បង្ហាញថ្ងៃ",
    hideDays: "លាក់ថ្ងៃ",
    noTime: "មិនមានម៉ោង",
    deleteWorker: "លុបបុគ្គលិក",
    deleteConfirm: "អូសទៅស្តាំឱ្យដល់ចុង ដើម្បីបញ្ជាក់ការលុប {name}។",
    cancel: "បោះបង់",
    delete: "លុប",
    incorrectPin: "ជ្រើសរើសបុគ្គលិកគំរូ",
    enterName: "បញ្ចូលឈ្មោះគំរូ (មិនលើស 80 តួអក្សរ)",
    addTimeOrNote: "បញ្ចូលម៉ោង ឬកំណត់ចំណាំ",
    outAfterIn: "ម៉ោងចេញត្រូវតែក្រោយម៉ោងចូល",
    pending: "កំពុងរង់ចាំ",
    approved: "បានអនុម័ត",
    denied: "បានបដិសេធ",
    approveAction: "អនុម័ត",
    denyAction: "បដិសេធ",
    noClockTime: "មិនទាន់បានជ្រើសម៉ោងទេ",
    needsShift: "ត្រូវមានវេនការងារដែលមានស្រាប់ ឬបញ្ចូលទាំងម៉ោងចូល និងម៉ោងចេញ មុនពេលអនុម័តការកែម៉ោង។",
    willBecome: "នឹងក្លាយជា {time}",
    adminApproved: "បានអនុម័តដោយអ្នកគ្រប់គ្រង",
    pendingSync: "រង់ចាំធ្វើសមកាលកម្ម",
    saved: "រក្សាទុកក្នុងឧបករណ៍",
    inProgress: "កំពុងធ្វើការ",
    now: "ឥឡូវនេះ",
    duration: "{hours} ម៉ោង {minutes} នាទី",
    languageToggle: "English",
    switchLanguage: "ប្តូរភាសា",
    signOutLabel: "ចាកចេញពីផ្នែកគំរូ",
    workerViews: "ផ្នែកបុគ្គលិក",
    adminViews: "ផ្នែកអ្នកគ្រប់គ្រង",
    confirmDeleteLabel: "បញ្ជាក់ការលុប {name}",
    clockInSummary: "ម៉ោងចូល {time}",
    clockOutSummary: "ម៉ោងចេញ {time}",
    previousWeek: "សប្ដាហ៍មុន",
    nextWeek: "សប្ដាហ៍បន្ទាប់",
    currentWeek: "សប្ដាហ៍នេះ",
    weekOf: "សប្ដាហ៍ចាប់ពី {range}",
    manualEdit: "កែម៉ោងដោយដៃ",
    saveTimes: "រក្សាទុកម៉ោង",
    clearManual: "លុបការកែដោយដៃ",
    manualNeedsBoth: "សូមជ្រើសម៉ោងចូល និងម៉ោងចេញ ដើម្បីរក្សាទុកការកែដោយអ្នកគ្រប់គ្រង",
    manualSaved: "បានរក្សាទុកការកែម៉ោងដោយដៃ"
  }
};

const els = {
  toast: document.querySelector("#toast"),
  loginScreen: document.querySelector("#loginScreen"),
  adminLoginScreen: document.querySelector("#adminLoginScreen"),
  workerScreen: document.querySelector("#workerScreen"),
  adminScreen: document.querySelector("#adminScreen"),
  logoutButton: document.querySelector("#logoutButton"),
  signInForm: document.querySelector("#signInForm"),
  createAccountForm: document.querySelector("#createAccountForm"),
  newWorkerName: document.querySelector("#newWorkerName"),
  createError: document.querySelector("#createError"),
  adminLoginForm: document.querySelector("#adminLoginForm"),
  workerError: document.querySelector("#workerError"),
  demoWorkerSelect: document.querySelector("#demoWorkerSelect"),
  loginButton: document.querySelector("#loginButton"),
  workerName: document.querySelector("#workerName"),
  shiftStatus: document.querySelector("#shiftStatus"),
  clockButton: document.querySelector("#clockButton"),
  syncNote: document.querySelector("#syncNote"),
  weekTotal: document.querySelector("#weekTotal"),
  workerShiftList: document.querySelector("#workerShiftList"),
  requestForm: document.querySelector("#requestForm"),
  requestDate: document.querySelector("#requestDate"),
  requestStart: document.querySelector("#requestStart"),
  requestEnd: document.querySelector("#requestEnd"),
  requestText: document.querySelector("#requestText"),
  workerRequestList: document.querySelector("#workerRequestList"),
  adminWorkerList: document.querySelector("#adminWorkerList"),
  adminRequestList: document.querySelector("#adminRequestList"),
  languageToggle: document.querySelector("#languageToggle")
};

let language = readStored(LANGUAGE_KEY) === "km" ? "km" : "en";
let session = { role: "guest", workerId: null };
let adminWeekOffset = 0;
let state = loadState();
saveState();

function readStored(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function loadState() {
  try {
    const existing = readStored(STORAGE_KEY);
    if (existing) return normalizeState(JSON.parse(existing));
  } catch { /* A damaged demo cache is safely replaced with fictional fixtures. */ }
  return normalizeState(createDemoState());
}

function normalizeState(saved) {
  const normalized = normalizeTimeClockState(saved);
  return {
    ...normalized,
    overrides: normalized.overrides.map(normalizeOverride)
  };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { showToast(t("storageError")); }
}

function t(key, values = {}) {
  const template = translations[language][key] || translations.en[key] || key;
  return Object.entries(values).reduce((text, [name, value]) => {
    return text.replaceAll(`{${name}}`, value);
  }, template);
}

function applyTranslations() {
  document.documentElement.lang = language === "km" ? "km" : "en";
  document.title = `${t("appTitle")} · Demo`;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  els.languageToggle.textContent = t("languageToggle");
  els.languageToggle.setAttribute("aria-label", t("switchLanguage"));
  els.logoutButton.title = t("signOutLabel");
  els.logoutButton.setAttribute("aria-label", t("signOutLabel"));
  document.querySelectorAll("[data-nav-label]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.navLabel));
  });
  renderDemoWorkerChoices();
  if (session.role === "worker") renderWorker();
  if (session.role === "admin") renderAdmin();
}

function showScreen(name) {
  [els.loginScreen, els.adminLoginScreen, els.workerScreen, els.adminScreen].forEach((screen) => {
    screen.classList.remove("active");
  });
  document.querySelector(`#${name}`).classList.add("active");
  els.logoutButton.classList.toggle("visible", name === "workerScreen" || name === "adminScreen");
}

function renderDemoWorkerChoices() {
  const selected = els.demoWorkerSelect.value;
  els.demoWorkerSelect.replaceChildren();
  state.workers.forEach((worker) => {
    const option = document.createElement("option");
    option.value = worker.id;
    option.textContent = worker.name;
    els.demoWorkerSelect.append(option);
  });
  if (state.workers.some((worker) => worker.id === selected)) els.demoWorkerSelect.value = selected;
}

function login(event) {
  event?.preventDefault();
  els.workerError.textContent = "";
  const worker = state.workers.find((person) => person.id === els.demoWorkerSelect.value);
  if (!worker) {
    els.workerError.textContent = t("incorrectPin");
    return;
  }
  session = { role: "worker", workerId: worker.id };
  renderWorker();
  showScreen("workerScreen");
}

function createAccount(event) {
  event.preventDefault();
  els.createError.textContent = "";
  const name = els.newWorkerName.value.trim();
  if (!name || name.length > 80) {
    els.createError.textContent = t("enterName");
    return;
  }
  const worker = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() };
  state.workers.push(worker);
  saveState();
  renderDemoWorkerChoices();
  session = { role: "worker", workerId: worker.id };
  els.createAccountForm.reset();
  renderWorker();
  showScreen("workerScreen");
}

function adminLogin(event) {
  event.preventDefault();
  session = { role: "admin", workerId: null };
  renderAdmin();
  showScreen("adminScreen");
}

function resetDemo() {
  state = normalizeState(createDemoState());
  saveState();
  adminWeekOffset = 0;
  els.requestForm.reset();
  els.createAccountForm.reset();
  document.querySelectorAll("[data-worker-tab]").forEach((tab) => tab.classList.toggle("active", tab.dataset.workerTab === "hours"));
  document.querySelectorAll("[data-admin-tab]").forEach((tab) => tab.classList.toggle("active", tab.dataset.adminTab === "team"));
  switchTab("worker", "hours");
  switchTab("admin", "team");
  setAuthMode("signin");
  renderDemoWorkerChoices();
  logout();
}

function logout() {
  session = { role: "guest", workerId: null };
  if (isAdminRoute()) {
    showScreen("adminLoginScreen");
  } else {
    showScreen("loginScreen");
  }
}

function workerEvents(workerId) {
  return state.events
    .filter((event) => event.workerId === workerId)
    .sort((a, b) => new Date(a.at) - new Date(b.at));
}

function currentOpenShift(workerId) {
  const events = workerEvents(workerId);
  let open = null;
  for (const event of events) {
    if (event.type === "in") open = event;
    if (event.type === "out") open = null;
  }
  return open;
}

function clockToggle() {
  const workerId = session.workerId;
  const open = currentOpenShift(workerId);
  state.events.push({
    id: crypto.randomUUID(),
    workerId,
    type: open ? "out" : "in",
    at: minuteIso(),
    pending: false
  });
  saveState();
  renderWorker();
}

function weekStartCambodia(now = new Date()) {
  const parts = getCambodiaDateParts(now);
  const utcDate = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() - day + 1);
  return utcDate;
}

function weekStartForOffset(weekOffset = 0) {
  const start = weekStartCambodia();
  start.setUTCDate(start.getUTCDate() + weekOffset * 7);
  return start;
}

function dateKeyFromUtcDate(date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0")
  ].join("-");
}

function weeklyShifts(workerId, weekOffset = 0) {
  const start = weekStartForOffset(weekOffset);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  const startKey = dateKeyFromUtcDate(start);
  const endKey = dateKeyFromUtcDate(end);
  return shiftsForWorker(workerId).filter((shift) => {
    const dateKey = shift.date || cambodiaDateKey(shift.inAt);
    return dateKey >= startKey && dateKey < endKey;
  });
}

function rawShiftsForWorker(workerId) {
  return buildRawShifts(state.events, workerId);
}

function shiftsForWorker(workerId) {
  return shiftsWithOverrides(state.events, state.overrides, workerId);
}

function durationMs(shift) {
  return intervalDurationMs(shift.inAt, shift.outAt || new Date());
}

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  return t("duration", {
    hours,
    minutes: String(minutes % 60).padStart(2, "0")
  });
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat(language === "km" ? "km-KH" : "en-US", {
    timeZone: PHNOM_PENH_TZ,
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

function renderWorker() {
  const worker = state.workers.find((person) => person.id === session.workerId);
  const open = currentOpenShift(worker.id);
  const shifts = weeklyShifts(worker.id);
  const total = shifts.reduce((sum, shift) => sum + durationMs(shift), 0);

  els.workerName.textContent = worker.name;
  els.shiftStatus.textContent = open ? t("clockedInSince", { time: formatDateTime(open.at) }) : t("notClockedIn");
  els.clockButton.textContent = open ? t("clockOut") : t("clockIn");
  els.clockButton.classList.toggle("out", Boolean(open));
  els.syncNote.textContent = t("onlineSync");
  els.weekTotal.textContent = formatDuration(total);

  els.workerShiftList.innerHTML = shifts.length
    ? shifts.map(renderShiftItem).join("")
    : `<div class="item small">${t("noShifts")}</div>`;

  const requests = state.requests.filter((request) => request.workerId === worker.id);
  els.workerRequestList.innerHTML = requests.length
    ? requests.map(renderWorkerRequest).join("")
    : `<div class="item small">${t("noRequests")}</div>`;
}

function renderShiftItem(shift) {
  const status = shift.outAt ? formatDuration(durationMs(shift)) : t("inProgress");
  const savedLabel = shift.manual ? t("adminApproved") : shift.pending ? t("pendingSync") : t("saved");
  const review = intervalNeedsReview(shift);
  return `
    <div class="item">
      <div class="item-row"><strong>${status}</strong><span class="small">${savedLabel}</span></div>
      <div class="small">${formatIntervalRange(shift)}</div>
      ${review ? `<div class="review-note">${t("reviewIntervalHelp")}</div>` : ""}
    </div>
  `;
}

function intervalNeedsReview(shift) {
  if (!shift?.outAt) return false;
  return isCrossDayInterval(shift.inAt, shift.outAt) || isLongInterval(shift.inAt, shift.outAt);
}

function formatIntervalRange(shift) {
  if (!shift?.outAt) return `${formatDateTime(shift.inAt)} - ${t("now")}`;
  if (isCrossDayInterval(shift.inAt, shift.outAt)) {
    return `${formatDateTime(shift.inAt)} - ${formatDateTime(shift.outAt)}`;
  }
  return `${formatTimeOnly(shift.inAt)} - ${formatTimeOnly(shift.outAt)}`;
}

function renderIntervalSummary(shift) {
  const review = intervalNeedsReview(shift);
  return `
    <div class="interval-summary ${review ? "needs-review" : ""}">
      <span>${formatIntervalRange(shift)}</span>
      ${review ? `<span class="review-pill" title="${t("reviewIntervalHelp")}">${t("reviewInterval")}</span>` : ""}
    </div>
  `;
}

function submitRequest(event) {
  event.preventDefault();
  const hasStart = Boolean(els.requestStart.value);
  const hasEnd = Boolean(els.requestEnd.value);
  const reason = els.requestText.value.trim();
  if (!hasStart && !hasEnd && !reason) {
    els.requestText.setCustomValidity(t("addTimeOrNote"));
    els.requestText.reportValidity();
    els.requestText.setCustomValidity("");
    return;
  }

  const inAt = hasStart ? cambodiaDateTimeToIso(els.requestDate.value, els.requestStart.value) : null;
  const outAt = hasEnd ? cambodiaDateTimeToIso(els.requestDate.value, els.requestEnd.value) : null;
  if (inAt && outAt && new Date(outAt) <= new Date(inAt)) {
    els.requestEnd.setCustomValidity(t("outAfterIn"));
    els.requestEnd.reportValidity();
    els.requestEnd.setCustomValidity("");
    return;
  }

  state.requests.push({
    id: crypto.randomUUID(),
    workerId: session.workerId,
    date: els.requestDate.value,
    requestedStart: els.requestStart.value,
    requestedEnd: els.requestEnd.value,
    inAt,
    outAt,
    text: reason,
    status: "pending",
    createdAt: new Date().toISOString()
  });
  els.requestForm.reset();
  saveState();
  renderWorker();
}

function renderWorkerRequest(request) {
  const change = requestChangeSummary(request);
  return `
    <div class="item">
      <div class="item-row"><strong>${request.date}</strong><span class="small">${t(request.status)}</span></div>
      <div class="small">${change}</div>
      <div>${escapeHtml(request.text)}</div>
    </div>
  `;
}

function renderAdmin() {
  const weekControls = renderWeekControls();
  if (!state.workers.length) {
    els.adminWorkerList.innerHTML = `${weekControls}<div class="item small">${t("noWorkers")}</div>`;
    els.adminRequestList.innerHTML = `<div class="item small">${t("noPending")}</div>`;
    return;
  }

  const rows = state.workers.map((worker) => {
    const shifts = weeklyShifts(worker.id, adminWeekOffset);
    const total = shifts.reduce((sum, shift) => sum + durationMs(shift), 0);
    const open = currentOpenShift(worker.id);
    return `
      <details class="item worker-details">
        <summary>
          <div class="item-row">
            <strong>${escapeHtml(worker.name)}</strong>
            <span class="status-pill">${open ? t("working") : t("out")}</span>
          </div>
          <div class="item-row">
            <span class="small">${adminWeekOffset === 0 ? t("thisWeek") : t("weekOf", { range: weekRangeLabel(adminWeekOffset) })}</span>
            <strong>${formatDuration(total)}</strong>
          </div>
          <div class="item-row details-labels">
            <span class="small show-label">${t("showDays")}</span>
            <span class="small hide-label">${t("hideDays")}</span>
          </div>
        </summary>
        <div class="day-list">${renderDailyRows(worker.id, adminWeekOffset)}</div>
        <div class="delete-zone" data-delete-zone="${worker.id}">
          <button class="delete-start" data-delete-start="${worker.id}" type="button">${t("deleteWorker")}</button>
          <div class="delete-confirm hidden" data-delete-confirm="${worker.id}">
            <p class="small">${t("deleteConfirm", { name: escapeHtml(worker.name) })}</p>
            <input class="delete-slider" data-delete-slider="${worker.id}" type="range" min="0" max="100" value="0" aria-label="${t("confirmDeleteLabel", { name: escapeHtml(worker.name) })}">
            <div class="actions">
              <button class="deny" data-delete-cancel="${worker.id}" type="button">${t("cancel")}</button>
              <button class="delete-final" data-delete-final="${worker.id}" type="button" disabled>${t("delete")}</button>
            </div>
          </div>
        </div>
      </details>
    `;
  });
  els.adminWorkerList.innerHTML = `${weekControls}${rows.join("")}`;

  const pending = state.requests.filter((request) => request.status === "pending");
  els.adminRequestList.innerHTML = pending.length
    ? pending.map(renderAdminRequest).join("")
    : `<div class="item small">${t("noPending")}</div>`;
}

function renderWeekControls() {
  return `
    <div class="item week-nav">
      <button class="ghost week-button" data-week-nav="-1" type="button">${t("previousWeek")}</button>
      <div>
        <strong>${adminWeekOffset === 0 ? t("currentWeek") : t("weekOf", { range: weekRangeLabel(adminWeekOffset) })}</strong>
        <div class="small">${weekRangeLabel(adminWeekOffset)}</div>
      </div>
      <button class="ghost week-button" data-week-nav="1" type="button" ${adminWeekOffset === 0 ? "disabled" : ""}>${t("nextWeek")}</button>
    </div>
  `;
}

function renderAdminRequest(request) {
  const worker = state.workers.find((person) => person.id === request.workerId);
  if (!worker) return "";
  const preview = buildApprovedShift(request);
  const canApprove = Boolean(preview);
  return `
    <div class="item">
      <div class="item-row"><strong>${escapeHtml(worker.name)}</strong><span class="small">${request.date}</span></div>
      <div class="small">${requestChangeSummary(request)}</div>
      <div class="small">${preview ? t("willBecome", { time: `${formatIntervalRange(preview)} (${formatDuration(intervalDurationMs(preview.inAt, preview.outAt))})` }) : t("needsShift")}</div>
      <div>${escapeHtml(request.text)}</div>
      <div class="actions">
        <button class="approve" data-request-action="approved" data-request-id="${request.id}" ${canApprove ? "" : "disabled"}>${t("approveAction")}</button>
        <button class="deny" data-request-action="denied" data-request-id="${request.id}">${t("denyAction")}</button>
      </div>
    </div>
  `;
}

function handleAdminRequestClick(event) {
  const weekButton = event.target.closest("[data-week-nav]");
  if (weekButton) {
    adminWeekOffset += Number(weekButton.dataset.weekNav);
    if (adminWeekOffset > 0) adminWeekOffset = 0;
    renderAdmin();
    return;
  }

  const saveTime = event.target.closest("[data-time-save]");
  if (saveTime) {
    saveManualTimes(saveTime.dataset.workerId, saveTime.dataset.date);
    return;
  }

  const clearTime = event.target.closest("[data-time-clear]");
  if (clearTime) {
    clearManualTimes(clearTime.dataset.workerId, clearTime.dataset.date);
    return;
  }

  const addInterval = event.target.closest("[data-interval-add]");
  if (addInterval) {
    addManualIntervalRow(addInterval);
    return;
  }

  const removeInterval = event.target.closest("[data-interval-remove]");
  if (removeInterval) {
    removeManualIntervalRow(removeInterval);
    return;
  }

  const deleteStart = event.target.closest("[data-delete-start]");
  if (deleteStart) {
    showDeleteConfirm(deleteStart.dataset.deleteStart);
    return;
  }

  const deleteCancel = event.target.closest("[data-delete-cancel]");
  if (deleteCancel) {
    hideDeleteConfirm(deleteCancel.dataset.deleteCancel);
    return;
  }

  const deleteFinal = event.target.closest("[data-delete-final]");
  if (deleteFinal && !deleteFinal.disabled) {
    deleteWorker(deleteFinal.dataset.deleteFinal);
    return;
  }

  const button = event.target.closest("[data-request-action]");
  if (!button) return;
  const request = state.requests.find((item) => item.id === button.dataset.requestId);
  if (!request) return;
  const approvedShift = buildApprovedShift(request);
  if (button.dataset.requestAction === "approved" && !approvedShift) return;
  request.status = button.dataset.requestAction;
  request.reviewedAt = new Date().toISOString();
  if (request.status === "approved") {
    state.overrides = state.overrides.filter((override) => {
      return override.workerId !== request.workerId || override.date !== request.date;
    });
    state.overrides.push({
      id: crypto.randomUUID(),
      requestId: request.id,
      workerId: request.workerId,
      date: request.date,
      intervals: [{
        id: crypto.randomUUID(),
        inAt: approvedShift.inAt,
        outAt: approvedShift.outAt
      }],
      approvedAt: request.reviewedAt
    });
  }
  saveState();
  renderAdmin();
}

function handleAdminInput(event) {
  const slider = event.target.closest("[data-delete-slider]");
  if (!slider) return;
  const workerId = slider.dataset.deleteSlider;
  const button = document.querySelector(`[data-delete-final="${workerId}"]`);
  button.disabled = Number(slider.value) < 100;
}

function showDeleteConfirm(workerId) {
  const panel = document.querySelector(`[data-delete-confirm="${workerId}"]`);
  const start = document.querySelector(`[data-delete-start="${workerId}"]`);
  const slider = document.querySelector(`[data-delete-slider="${workerId}"]`);
  const final = document.querySelector(`[data-delete-final="${workerId}"]`);
  panel.classList.remove("hidden");
  start.classList.add("hidden");
  slider.value = "0";
  final.disabled = true;
}

function hideDeleteConfirm(workerId) {
  const panel = document.querySelector(`[data-delete-confirm="${workerId}"]`);
  const start = document.querySelector(`[data-delete-start="${workerId}"]`);
  const slider = document.querySelector(`[data-delete-slider="${workerId}"]`);
  const final = document.querySelector(`[data-delete-final="${workerId}"]`);
  panel.classList.add("hidden");
  start.classList.remove("hidden");
  slider.value = "0";
  final.disabled = true;
}

function deleteWorker(workerId) {
  state = markWorkerDeleted(state, workerId);
  saveState();
  renderAdmin();
}

function saveManualTimes(workerId, date) {
  const rows = manualIntervalRows(workerId, date);
  const result = buildManualIntervals(rows.map(readManualIntervalRow));
  if (!result.ok) {
    reportManualIntervalError(rows[result.row] || rows[0], result.code);
    return;
  }

  state.overrides = state.overrides.filter((override) => {
    return override.workerId !== workerId || override.date !== date;
  });
  state.overrides.push({
    id: crypto.randomUUID(),
    requestId: `manual-${crypto.randomUUID()}`,
    workerId,
    date,
    intervals: result.intervals.map((interval) => ({
      id: interval.id || crypto.randomUUID(),
      inAt: interval.inAt,
      outAt: interval.outAt
    })),
    approvedAt: new Date().toISOString(),
    manualEdit: true
  });
  saveState();
  showToast(t("manualSaved"));
  renderAdmin();
}

function manualIntervalRows(workerId, date) {
  return Array.from(document.querySelectorAll(`[data-interval-row][data-worker-id="${workerId}"][data-date="${date}"]`));
}

function readManualIntervalRow(row) {
  return {
    id: row.dataset.intervalId || "",
    startDate: row.querySelector('[data-interval-field="start-date"]')?.value || "",
    startTime: row.querySelector('[data-interval-field="start-time"]')?.value || "",
    endDate: row.querySelector('[data-interval-field="end-date"]')?.value || "",
    endTime: row.querySelector('[data-interval-field="end-time"]')?.value || ""
  };
}

function reportManualIntervalError(row, code) {
  const message = code === "overlap"
    ? t("intervalOverlap")
    : code === "order"
      ? t("outAfterIn")
      : t("manualNeedsBoth");
  const target = row?.querySelector('[data-interval-field="end-time"]')
    || row?.querySelector('[data-interval-field="start-time"]');
  if (target) {
    target.setCustomValidity(message);
    target.reportValidity();
    target.setCustomValidity("");
  }
  showToast(message);
}

function addManualIntervalRow(button) {
  const editor = button.closest("[data-interval-editor]");
  const list = editor?.querySelector("[data-interval-list]");
  if (!list) return;
  const index = list.querySelectorAll("[data-interval-row]").length;
  list.insertAdjacentHTML("beforeend", renderIntervalEditRow(button.dataset.workerId, button.dataset.date, null, index));
}

function removeManualIntervalRow(button) {
  const row = button.closest("[data-interval-row]");
  const list = row?.parentElement;
  if (!row || !list) return;
  const rows = list.querySelectorAll("[data-interval-row]");
  if (rows.length <= 1) {
    row.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });
    return;
  }
  row.remove();
}

function clearManualTimes(workerId, date) {
  state.overrides = state.overrides.filter((override) => {
    return override.workerId !== workerId || override.date !== date;
  });
  saveState();
  renderAdmin();
}

function requestChangeSummary(request) {
  const changes = [];
  if (request.requestedStart) changes.push(t("clockInSummary", { time: request.requestedStart }));
  if (request.requestedEnd) changes.push(t("clockOutSummary", { time: request.requestedEnd }));
  return changes.length ? changes.join(" - ") : t("noClockTime");
}

function buildApprovedShift(request) {
  const current = findShiftForDate(request.workerId, request.date);
  const inAt = request.inAt || current?.inAt;
  const outAt = request.outAt || current?.outAt;
  if (!inAt || !outAt) return null;
  if (new Date(outAt) <= new Date(inAt)) return null;
  return { inAt, outAt };
}

function findShiftForDate(workerId, date) {
  return shiftsForWorker(workerId).find((shift) => shift.date === date)
    || rawShiftsForWorker(workerId).find((shift) => shift.date === date);
}

function formatTimeOnly(value) {
  return new Intl.DateTimeFormat(language === "km" ? "km-KH" : "en-US", {
    timeZone: PHNOM_PENH_TZ,
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function renderDailyRows(workerId, weekOffset = 0) {
  return weekDateKeys(weekOffset).map((date) => {
    const shifts = weeklyShifts(workerId, weekOffset).filter((shift) => shift.date === date);
    const total = shifts.reduce((sum, shift) => sum + durationMs(shift), 0);
    const summaries = shifts.length
      ? shifts.map(renderIntervalSummary).join("")
      : `<span>${t("noTime")}</span>`;
    const editIntervals = editableIntervalsForDay(workerId, date, shifts);
    const hasManual = state.overrides.some((override) => override.workerId === workerId && override.date === date);
    return `
      <div class="day-card">
        <div class="day-row">
          <strong>${shortDateLabel(date)}</strong>
          <div class="interval-summary-list">${summaries}</div>
          <strong>${formatDuration(total)}</strong>
        </div>
        <div class="manual-edit" data-interval-editor data-worker-id="${workerId}" data-date="${date}">
          <div class="manual-edit-head">
            <span class="small">${t("manualIntervals")}</span>
            ${hasManual ? `<span class="small">${t("adminApproved")}</span>` : ""}
          </div>
          <div class="interval-edit-list" data-interval-list>
            ${editIntervals.map((interval, index) => renderIntervalEditRow(workerId, date, interval, index)).join("")}
          </div>
          <div class="actions manual-actions">
            <button class="ghost compact-button" data-interval-add="true" data-worker-id="${workerId}" data-date="${date}" type="button">${t("addInterval")}</button>
            <button class="approve compact-button" data-time-save="true" data-worker-id="${workerId}" data-date="${date}" type="button">${t("saveTimes")}</button>
            <button class="deny compact-button" data-time-clear="true" data-worker-id="${workerId}" data-date="${date}" type="button" ${hasManual ? "" : "disabled"}>${t("clearManual")}</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function editableIntervalsForDay(workerId, date, shifts) {
  const override = state.overrides.find((item) => item.workerId === workerId && item.date === date);
  const intervals = override ? overrideIntervals(override) : shifts.filter((shift) => shift.outAt);
  return intervals.length ? intervals : [null];
}

function renderIntervalEditRow(workerId, date, interval, index) {
  const startDate = interval?.inAt ? dateInputValue(interval.inAt) : date;
  const endDate = interval?.outAt ? dateInputValue(interval.outAt) : date;
  return `
    <div class="interval-edit-row" data-interval-row data-worker-id="${workerId}" data-date="${date}" data-interval-id="${interval?.id || ""}">
      <label>
        <span>${t("startDate")}</span>
        <input type="date" data-interval-field="start-date" value="${startDate}" aria-label="${t("startDate")} ${shortDateLabel(date)} ${index + 1}">
      </label>
      <label>
        <span>${t("clockInField")}</span>
        <input type="time" data-interval-field="start-time" value="${interval?.inAt ? timeInputValue(interval.inAt) : ""}" aria-label="${t("clockInField")} ${shortDateLabel(date)} ${index + 1}">
      </label>
      <label>
        <span>${t("endDate")}</span>
        <input type="date" data-interval-field="end-date" value="${endDate}" aria-label="${t("endDate")} ${shortDateLabel(date)} ${index + 1}">
      </label>
      <label>
        <span>${t("clockOutField")}</span>
        <input type="time" data-interval-field="end-time" value="${interval?.outAt ? timeInputValue(interval.outAt) : ""}" aria-label="${t("clockOutField")} ${shortDateLabel(date)} ${index + 1}">
      </label>
      <button class="deny compact-button" data-interval-remove="true" type="button">${t("removeInterval")}</button>
    </div>
  `;
}

function currentWeekDateKeys() {
  return weekDateKeys(0);
}

function weekDateKeys(weekOffset = 0) {
  const start = weekStartForOffset(weekOffset);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return dateKeyFromUtcDate(date);
  });
}

function weekRangeLabel(weekOffset = 0) {
  const dates = weekDateKeys(weekOffset);
  return `${shortDateLabel(dates[0])} - ${shortDateLabel(dates[6])}`;
}

function shortDateLabel(dateKey) {
  const date = new Date(`${dateKey}T00:00:00+07:00`);
  return new Intl.DateTimeFormat(language === "km" ? "km-KH" : "en-US", {
    timeZone: PHNOM_PENH_TZ,
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(date);
}

function switchTab(scope, tabName) {
  document.querySelectorAll(`[data-${scope}-tab]`).forEach((tab) => {
    tab.classList.toggle("active", tab.dataset[`${scope}Tab`] === tabName);
  });
  const panels = scope === "worker" ? ["hoursTab", "requestTab"] : ["teamTab", "requestsTab"];
  panels.forEach((id) => document.querySelector(`#${id}`).classList.remove("active"));
  document.querySelector(`#${tabName}Tab`).classList.add("active");
}


function setAuthMode(mode) {
  els.createError.textContent = "";
  hideToast();
  els.signInForm.classList.toggle("hidden", mode !== "signin");
  els.createAccountForm.classList.toggle("hidden", mode !== "create");
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(hideToast, 3500);
}


function hideToast() {
  els.toast.classList.add("hidden");
}

function toggleLanguage() {
  language = language === "en" ? "km" : "en";
  try { localStorage.setItem(LANGUAGE_KEY, language); } catch { /* Language stays in memory. */ }
  applyTranslations();
}


function isAdminRoute() {
  const path = window.location.pathname.replace(/\/$/, "");
  return path === "/admin" || path.endsWith("/admin.html");
}

els.signInForm.addEventListener("submit", login);
els.createAccountForm.addEventListener("submit", createAccount);
els.adminLoginForm.addEventListener("submit", adminLogin);
els.logoutButton.addEventListener("click", logout);
els.clockButton.addEventListener("click", clockToggle);
els.requestForm.addEventListener("submit", submitRequest);
els.adminRequestList.addEventListener("click", handleAdminRequestClick);
els.adminWorkerList.addEventListener("click", handleAdminRequestClick);
els.adminWorkerList.addEventListener("input", handleAdminInput);
els.languageToggle.addEventListener("click", toggleLanguage);

document.querySelectorAll("[data-worker-tab]").forEach((tab) => {
  tab.addEventListener("click", () => switchTab("worker", tab.dataset.workerTab));
});
document.querySelectorAll("[data-admin-tab]").forEach((tab) => {
  tab.addEventListener("click", () => switchTab("admin", tab.dataset.adminTab));
});
document.querySelectorAll("[data-auth-mode]").forEach((tab) => {
  tab.addEventListener("click", () => setAuthMode(tab.dataset.authMode));
});

document.querySelector("#resetDemo").addEventListener("click", resetDemo);

showScreen(isAdminRoute() ? "adminLoginScreen" : "loginScreen");
applyTranslations();
