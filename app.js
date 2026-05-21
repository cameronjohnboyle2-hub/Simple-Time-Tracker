const STORAGE_KEY = "team-time-clock-v1";
const LANGUAGE_KEY = "team-time-clock-language";
const PHNOM_PENH_TZ = "Asia/Phnom_Penh";
const ADMIN_PASSCODE_HASH = "ab798d4c1bb849f872f170f871945d50160df91b5e4e4e9ee2cce31074d0731f";

const translations = {
  en: {
    brand: "Cambodia Team",
    appTitle: "Time Clock",
    exit: "Exit",
    workerSignIn: "Worker sign in",
    pinHelp: "Use your PIN to clock in and out.",
    pin: "PIN",
    enterPin: "Enter PIN",
    signIn: "Sign in",
    createAccount: "Create account",
    name: "Name",
    yourName: "Your name",
    createPin: "Create PIN",
    choosePin: "Choose a PIN",
    backToSignIn: "Back to sign in",
    adminLogin: "Admin login",
    admin: "Admin",
    adminLoginHelp: "Enter the admin passcode to view and approve hours.",
    passcode: "Passcode",
    adminPasscode: "Admin passcode",
    openAdmin: "Open admin",
    workerLogin: "Worker login",
    hello: "Hello",
    notClockedIn: "Not clocked in",
    clockedInSince: "Clocked in since {time}",
    clockIn: "Clock In",
    clockOut: "Clock Out",
    onlineSync: "Online. Changes save to the shared tracker.",
    offlineSync: "Offline. Connect to the internet before changing hours.",
    readyOffline: "Online only",
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
    incorrectPin: "Incorrect PIN, please try again",
    incorrectAdmin: "Incorrect admin password, please try again",
    enterName: "Enter your name",
    fourNumbers: "Use at least 4 numbers",
    pinTaken: "This PIN is taken, please choose another",
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
    saved: "Saved",
    inProgress: "In progress",
    now: "Now",
    duration: "{hours}h {minutes}m",
    languageToggle: "ភាសាខ្មែរ",
    switchLanguage: "Switch language",
    signOutLabel: "Sign out",
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
    manualNeedsBoth: "Choose both clock-in and clock-out times to save an admin edit",
    manualSaved: "Manual time edit saved"
  },
  km: {
    brand: "ក្រុមការងារកម្ពុជា",
    appTitle: "កម្មវិធីកត់ម៉ោងធ្វើការ",
    exit: "ចេញ",
    workerSignIn: "ចូលគណនីបុគ្គលិក",
    pinHelp: "ប្រើលេខ PIN របស់អ្នក ដើម្បីចូល និងចេញធ្វើការ។",
    pin: "លេខ PIN",
    enterPin: "បញ្ចូលលេខ PIN",
    signIn: "ចូល",
    createAccount: "បង្កើតគណនី",
    name: "ឈ្មោះ",
    yourName: "ឈ្មោះរបស់អ្នក",
    createPin: "បង្កើត PIN",
    choosePin: "ជ្រើស PIN",
    backToSignIn: "ត្រឡប់ទៅចូល",
    adminLogin: "ចូលអ្នកគ្រប់គ្រង",
    admin: "អ្នកគ្រប់គ្រង",
    adminLoginHelp: "បញ្ចូលលេខសម្ងាត់អ្នកគ្រប់គ្រង ដើម្បីមើល និងអនុម័តម៉ោង។",
    passcode: "លេខសម្ងាត់",
    adminPasscode: "លេខសម្ងាត់អ្នកគ្រប់គ្រង",
    openAdmin: "បើកផ្នែកគ្រប់គ្រង",
    workerLogin: "ចូលបុគ្គលិក",
    hello: "សួស្តី",
    notClockedIn: "មិនទាន់ចូលធ្វើការ",
    clockedInSince: "បានចូលតាំងពី {time}",
    clockIn: "ចូលធ្វើការ",
    clockOut: "ចេញធ្វើការ",
    onlineSync: "មានអ៊ីនធឺណិត។ ការផ្លាស់ប្តូររក្សាទុកទៅកម្មវិធីរួម។",
    offlineSync: "គ្មានអ៊ីនធឺណិត។ សូមភ្ជាប់អ៊ីនធឺណិត មុនពេលកែម៉ោង។",
    readyOffline: "ប្រើតែពេលមានអ៊ីនធឺណិត",
    hours: "ម៉ោង",
    request: "សំណើ",
    thisWeek: "សប្តាហ៍នេះ",
    noShifts: "មិនមានវេនសប្តាហ៍នេះទេ។",
    date: "កាលបរិច្ឆេទ",
    clockInField: "ម៉ោងចូល",
    clockOutField: "ម៉ោងចេញ",
    reason: "មូលហេតុ",
    requestExample: "ឧទាហរណ៍៖ ខ្ញុំភ្លេចចេញម៉ោង 5:00 ល្ងាច។",
    submitRequest: "ដាក់សំណើ",
    noRequests: "មិនទាន់មានសំណើ។",
    weeklyHours: "ម៉ោងប្រចាំសប្តាហ៍",
    team: "ក្រុម",
    requests: "សំណើ",
    noWorkers: "មិនទាន់មានបុគ្គលិក។",
    noPending: "មិនមានសំណើកំពុងរង់ចាំ។",
    working: "កំពុងធ្វើការ",
    out: "ចេញ",
    showDays: "បង្ហាញថ្ងៃ",
    hideDays: "លាក់ថ្ងៃ",
    noTime: "គ្មានម៉ោង",
    deleteWorker: "លុបបុគ្គលិក",
    deleteConfirm: "អូសទៅស្តាំដើម្បីបញ្ជាក់លុប {name}។",
    cancel: "បោះបង់",
    delete: "លុប",
    incorrectPin: "PIN មិនត្រឹមត្រូវ សូមព្យាយាមម្តងទៀត",
    incorrectAdmin: "លេខសម្ងាត់មិនត្រឹមត្រូវ សូមព្យាយាមម្តងទៀត",
    enterName: "បញ្ចូលឈ្មោះរបស់អ្នក",
    fourNumbers: "ប្រើលេខយ៉ាងតិច 4 ខ្ទង់",
    pinTaken: "លេខ PIN នេះមានអ្នកប្រើហើយ សូមជ្រើសលេខផ្សេង",
    addTimeOrNote: "បញ្ចូលម៉ោង ឬកំណត់ចំណាំ",
    outAfterIn: "ម៉ោងចេញត្រូវក្រោយម៉ោងចូល",
    pending: "រង់ចាំ",
    approved: "អនុម័ត",
    denied: "បដិសេធ",
    approveAction: "អនុម័ត",
    denyAction: "បដិសេធ",
    noClockTime: "មិនបានជ្រើសម៉ោង",
    needsShift: "ត្រូវមានវេន ឬបញ្ចូលទាំងម៉ោងចូលនិងចេញ។",
    willBecome: "នឹងក្លាយជា {time}",
    adminApproved: "អនុម័តដោយអ្នកគ្រប់គ្រង",
    pendingSync: "រង់ចាំសមកាលកម្ម",
    saved: "បានរក្សាទុក",
    inProgress: "កំពុងធ្វើការ",
    now: "ឥឡូវនេះ",
    duration: "{hours} ម៉ោង {minutes} នាទី",
    languageToggle: "English",
    switchLanguage: "ប្តូរភាសា",
    signOutLabel: "ចេញពីគណនី",
    workerViews: "ផ្នែកបុគ្គលិក",
    adminViews: "ផ្នែកគ្រប់គ្រង",
    confirmDeleteLabel: "បញ្ជាក់លុប {name}",
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
  newWorkerPin: document.querySelector("#newWorkerPin"),
  createError: document.querySelector("#createError"),
  adminLoginForm: document.querySelector("#adminLoginForm"),
  adminPasscode: document.querySelector("#adminPasscode"),
  pinError: document.querySelector("#pinError"),
  adminError: document.querySelector("#adminError"),
  pinInput: document.querySelector("#pinInput"),
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

let language = localStorage.getItem(LANGUAGE_KEY) || "en";
let session = { role: "guest", workerId: null };
let adminWeekOffset = 0;
let state = normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
saveState();

function normalizeState(saved) {
  const workers = saved.workers || [];
  const workerIds = new Set(workers.map((worker) => worker.id));
  return {
    workers,
    events: (saved.events || []).filter((event) => workerIds.has(event.workerId)),
    requests: (saved.requests || []).filter((request) => workerIds.has(request.workerId)),
    overrides: dedupeOverrides((saved.overrides || []).filter((override) => workerIds.has(override.workerId)))
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function t(key, values = {}) {
  const template = translations[language][key] || translations.en[key] || key;
  return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template);
}

function applyTranslations() {
  document.documentElement.lang = language === "km" ? "km" : "en";
  document.title = t("appTitle");
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => { node.placeholder = t(node.dataset.i18nPlaceholder); });
  els.languageToggle.textContent = t("languageToggle");
  els.languageToggle.setAttribute("aria-label", t("switchLanguage"));
  els.logoutButton.title = t("signOutLabel");
  els.logoutButton.setAttribute("aria-label", t("signOutLabel"));
  document.querySelectorAll("[data-nav-label]").forEach((node) => node.setAttribute("aria-label", t(node.dataset.navLabel)));
  if (session.role === "worker") renderWorker();
  if (session.role === "admin") renderAdmin();
}

function showScreen(name) {
  [els.loginScreen, els.adminLoginScreen, els.workerScreen, els.adminScreen].forEach((screen) => screen.classList.remove("active"));
  document.querySelector(`#${name}`).classList.add("active");
  els.logoutButton.classList.toggle("visible", name === "workerScreen" || name === "adminScreen");
}

function login(event) {
  event?.preventDefault();
  els.pinError.textContent = "";
  const pin = els.pinInput.value.trim();
  const worker = state.workers.find((person) => person.pin === pin);
  if (!worker) return showFieldError(els.pinInput, els.pinError, t("incorrectPin"));
  session = { role: "worker", workerId: worker.id };
  els.pinInput.value = "";
  renderWorker();
  showScreen("workerScreen");
}

function createAccount(event) {
  event.preventDefault();
  if (!requireOnline()) return;
  els.createError.textContent = "";
  const name = els.newWorkerName.value.trim();
  const pin = els.newWorkerPin.value.trim();
  if (!name) return showFieldError(els.newWorkerName, els.createError, t("enterName"));
  if (!/^\d{4,}$/.test(pin)) return showFieldError(els.newWorkerPin, els.createError, t("fourNumbers"));
  if (state.workers.some((worker) => worker.pin === pin)) {
    showToast(t("pinTaken"));
    return showFieldError(els.newWorkerPin, els.createError, t("pinTaken"));
  }
  const worker = { id: crypto.randomUUID(), name, pin, createdAt: new Date().toISOString() };
  state.workers.push(worker);
  saveState();
  session = { role: "worker", workerId: worker.id };
  els.createAccountForm.reset();
  renderWorker();
  showScreen("workerScreen");
}

async function adminLogin(event) {
  event.preventDefault();
  els.adminError.textContent = "";
  if (await sha256Hex(els.adminPasscode.value) !== ADMIN_PASSCODE_HASH) {
    return showFieldError(els.adminPasscode, els.adminError, t("incorrectAdmin"));
  }
  session = { role: "admin", workerId: null };
  els.adminPasscode.value = "";
  renderAdmin();
  showScreen("adminScreen");
}

function showFieldError(input, output, message) {
  output.textContent = message;
  input.select?.();
  input.setCustomValidity(message);
  input.reportValidity();
  input.setCustomValidity("");
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hashBuffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function logout() {
  session = { role: "guest", workerId: null };
  showScreen(isAdminRoute() ? "adminLoginScreen" : "loginScreen");
}

function workerEvents(workerId) {
  return state.events.filter((event) => event.workerId === workerId).sort((a, b) => new Date(a.at) - new Date(b.at));
}

function currentOpenShift(workerId) {
  let open = null;
  for (const event of workerEvents(workerId)) {
    if (event.type === "in") open = event;
    if (event.type === "out") open = null;
  }
  return open;
}

function clockToggle() {
  if (!requireOnline()) return;
  const open = currentOpenShift(session.workerId);
  state.events.push({ id: crypto.randomUUID(), workerId: session.workerId, type: open ? "out" : "in", at: new Date().toISOString(), pending: false });
  saveState();
  renderWorker();
}

function getCambodiaDateParts(date) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: PHNOM_PENH_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function cambodiaDateKey(value) {
  const parts = getCambodiaDateParts(new Date(value));
  return `${parts.year}-${parts.month}-${parts.day}`;
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
  return [date.getUTCFullYear(), String(date.getUTCMonth() + 1).padStart(2, "0"), String(date.getUTCDate()).padStart(2, "0")].join("-");
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

function rawShiftsForWorker(workerId) {
  const shifts = [];
  let open = null;
  for (const event of workerEvents(workerId)) {
    if (event.type === "in") open = event;
    if (event.type === "out" && open) {
      shifts.push({ workerId, date: cambodiaDateKey(open.at), inAt: open.at, outAt: event.at, pending: open.pending || event.pending });
      open = null;
    }
  }
  if (open) shifts.push({ workerId, date: cambodiaDateKey(open.at), inAt: open.at, outAt: null, pending: open.pending });
  return shifts;
}

function shiftsForWorker(workerId) {
  const approvedOverrides = dedupeOverrides(state.overrides.filter((override) => override.workerId === workerId));
  const overrideDates = new Set(approvedOverrides.map((override) => override.date));
  const rawShifts = rawShiftsForWorker(workerId).filter((shift) => !overrideDates.has(shift.date));
  const manualShifts = approvedOverrides.map((override) => ({ workerId, date: override.date, inAt: override.inAt, outAt: override.outAt, pending: false, manual: true, requestId: override.requestId }));
  return [...rawShifts, ...manualShifts].sort((a, b) => new Date(b.inAt) - new Date(a.inAt));
}

function overrideDateKey(override) {
  return `${override.workerId}|${override.date}`;
}

function overrideId(workerId, date) {
  return `override-${workerId}-${date}`;
}

function overrideSortTime(override) {
  return new Date(override.approvedAt || override.reviewedAt || override.createdAt || 0).getTime();
}

function dedupeOverrides(overrides = []) {
  const byDate = new Map();
  overrides.forEach((override) => {
    if (!override.workerId || !override.date || !override.inAt || !override.outAt) return;
    const key = overrideDateKey(override);
    const current = byDate.get(key);
    if (!current || overrideSortTime(override) >= overrideSortTime(current)) {
      byDate.set(key, { ...override, id: overrideId(override.workerId, override.date) });
    }
  });
  return Array.from(byDate.values());
}

function weeklyShifts(workerId, weekOffset = 0) {
  const dates = new Set(weekDateKeys(weekOffset));
  return shiftsForWorker(workerId).filter((shift) => dates.has(shift.date || cambodiaDateKey(shift.inAt)));
}

function durationMs(shift) {
  return Math.max(0, (shift.outAt ? new Date(shift.outAt) : new Date()) - new Date(shift.inAt));
}

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  return t("duration", { hours: Math.floor(minutes / 60), minutes: String(minutes % 60).padStart(2, "0") });
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat(language === "km" ? "km-KH" : "en-US", { timeZone: PHNOM_PENH_TZ, weekday: "short", hour: "numeric", minute: "2-digit", month: "short", day: "numeric" }).format(new Date(value));
}

function formatTimeOnly(value) {
  return new Intl.DateTimeFormat(language === "km" ? "km-KH" : "en-US", { timeZone: PHNOM_PENH_TZ, hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function shortDateLabel(dateKey) {
  return new Intl.DateTimeFormat(language === "km" ? "km-KH" : "en-US", { timeZone: PHNOM_PENH_TZ, weekday: "short", month: "short", day: "numeric" }).format(new Date(`${dateKey}T00:00:00+07:00`));
}

function weekRangeLabel(weekOffset = 0) {
  const dates = weekDateKeys(weekOffset);
  return `${shortDateLabel(dates[0])} - ${shortDateLabel(dates[6])}`;
}

function timeInputValue(value) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: PHNOM_PENH_TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));
}

function renderWorker() {
  const worker = state.workers.find((person) => person.id === session.workerId);
  if (!worker) return logout();
  const open = currentOpenShift(worker.id);
  const shifts = weeklyShifts(worker.id);
  const total = shifts.reduce((sum, shift) => sum + durationMs(shift), 0);
  els.workerName.textContent = worker.name;
  els.shiftStatus.textContent = open ? t("clockedInSince", { time: formatDateTime(open.at) }) : t("notClockedIn");
  els.clockButton.textContent = open ? t("clockOut") : t("clockIn");
  els.clockButton.classList.toggle("out", Boolean(open));
  els.syncNote.textContent = navigator.onLine ? t("onlineSync") : t("offlineSync");
  els.weekTotal.textContent = formatDuration(total);
  els.workerShiftList.innerHTML = shifts.length ? shifts.map(renderShiftItem).join("") : `<div class="item small">${t("noShifts")}</div>`;
  const requests = state.requests.filter((request) => request.workerId === worker.id);
  els.workerRequestList.innerHTML = requests.length ? requests.map(renderWorkerRequest).join("") : `<div class="item small">${t("noRequests")}</div>`;
}

function renderShiftItem(shift) {
  const status = shift.outAt ? formatDuration(durationMs(shift)) : t("inProgress");
  const out = shift.outAt ? formatDateTime(shift.outAt) : t("now");
  const savedLabel = shift.manual ? t("adminApproved") : shift.pending ? t("pendingSync") : t("saved");
  return `<div class="item"><div class="item-row"><strong>${status}</strong><span class="small">${savedLabel}</span></div><div class="small">${formatDateTime(shift.inAt)} - ${out}</div></div>`;
}

function submitRequest(event) {
  event.preventDefault();
  if (!requireOnline()) return;
  const hasStart = Boolean(els.requestStart.value);
  const hasEnd = Boolean(els.requestEnd.value);
  const reason = els.requestText.value.trim();
  if (!hasStart && !hasEnd && !reason) return showFieldError(els.requestText, els.requestText, t("addTimeOrNote"));
  const inAt = hasStart ? cambodiaDateTimeToIso(els.requestDate.value, els.requestStart.value) : null;
  const outAt = hasEnd ? cambodiaDateTimeToIso(els.requestDate.value, els.requestEnd.value) : null;
  if (inAt && outAt && new Date(outAt) <= new Date(inAt)) return showFieldError(els.requestEnd, els.requestEnd, t("outAfterIn"));
  state.requests.push({ id: crypto.randomUUID(), workerId: session.workerId, date: els.requestDate.value, requestedStart: els.requestStart.value, requestedEnd: els.requestEnd.value, inAt, outAt, text: reason, status: "pending", createdAt: new Date().toISOString() });
  els.requestForm.reset();
  saveState();
  renderWorker();
}

function cambodiaDateTimeToIso(date, time) {
  return new Date(`${date}T${time}:00+07:00`).toISOString();
}

function renderWorkerRequest(request) {
  return `<div class="item"><div class="item-row"><strong>${request.date}</strong><span class="small">${t(request.status)}</span></div><div class="small">${requestChangeSummary(request)}</div><div>${escapeHtml(request.text)}</div></div>`;
}

function renderAdmin() {
  const weekControls = renderWeekControls();
  if (!state.workers.length) {
    els.adminWorkerList.innerHTML = `${weekControls}<div class="item small">${t("noWorkers")}</div>`;
    els.adminRequestList.innerHTML = `<div class="item small">${t("noPending")}</div>`;
    return;
  }
  els.adminWorkerList.innerHTML = `${weekControls}${state.workers.map(renderAdminWorker).join("")}`;
  const pending = state.requests.filter((request) => request.status === "pending");
  els.adminRequestList.innerHTML = pending.length ? pending.map(renderAdminRequest).join("") : `<div class="item small">${t("noPending")}</div>`;
}

function renderWeekControls() {
  return `<div class="item week-nav"><button class="ghost week-button" data-week-nav="-1" type="button">${t("previousWeek")}</button><div><strong>${adminWeekOffset === 0 ? t("currentWeek") : t("weekOf", { range: weekRangeLabel(adminWeekOffset) })}</strong><div class="small">${weekRangeLabel(adminWeekOffset)}</div></div><button class="ghost week-button" data-week-nav="1" type="button" ${adminWeekOffset === 0 ? "disabled" : ""}>${t("nextWeek")}</button></div>`;
}

function renderAdminWorker(worker) {
  const shifts = weeklyShifts(worker.id, adminWeekOffset);
  const total = shifts.reduce((sum, shift) => sum + durationMs(shift), 0);
  const open = currentOpenShift(worker.id);
  const weekLabel = adminWeekOffset === 0 ? t("thisWeek") : t("weekOf", { range: weekRangeLabel(adminWeekOffset) });
  return `<details class="item worker-details"><summary><div class="item-row"><strong>${escapeHtml(worker.name)}</strong><span class="status-pill">${open ? t("working") : t("out")}</span></div><div class="item-row"><span class="small">${weekLabel}</span><strong>${formatDuration(total)}</strong></div><div class="item-row details-labels"><span class="small show-label">${t("showDays")}</span><span class="small hide-label">${t("hideDays")}</span></div></summary><div class="day-list">${renderDailyRows(worker.id, adminWeekOffset)}</div><div class="delete-zone"><button class="delete-start" data-delete-start="${worker.id}" type="button">${t("deleteWorker")}</button><div class="delete-confirm hidden" data-delete-confirm="${worker.id}"><p class="small">${t("deleteConfirm", { name: escapeHtml(worker.name) })}</p><input class="delete-slider" data-delete-slider="${worker.id}" type="range" min="0" max="100" value="0" aria-label="${t("confirmDeleteLabel", { name: escapeHtml(worker.name) })}"><div class="actions"><button class="deny" data-delete-cancel="${worker.id}" type="button">${t("cancel")}</button><button class="delete-final" data-delete-final="${worker.id}" type="button" disabled>${t("delete")}</button></div></div></div></details>`;
}

function renderDailyRows(workerId, weekOffset = 0) {
  return weekDateKeys(weekOffset).map((date) => {
    const shifts = weeklyShifts(workerId, weekOffset).filter((shift) => shift.date === date);
    const total = shifts.reduce((sum, shift) => sum + durationMs(shift), 0);
    const times = shifts.length ? shifts.map((shift) => `${formatTimeOnly(shift.inAt)} - ${shift.outAt ? formatTimeOnly(shift.outAt) : t("now")}`).join(", ") : t("noTime");
    const editShift = shifts.find((shift) => shift.outAt) || shifts[0];
    const hasManual = state.overrides.some((override) => override.workerId === workerId && override.date === date);
    return `<div class="day-card"><div class="day-row editable-day-row"><strong>${shortDateLabel(date)}</strong><div class="inline-time-edit"><input type="time" data-time-edit="start" data-worker-id="${workerId}" data-date="${date}" value="${editShift?.inAt ? timeInputValue(editShift.inAt) : ""}" aria-label="${t("clockInField")} ${shortDateLabel(date)}"><input type="time" data-time-edit="end" data-worker-id="${workerId}" data-date="${date}" value="${editShift?.outAt ? timeInputValue(editShift.outAt) : ""}" aria-label="${t("clockOutField")} ${shortDateLabel(date)}"></div><strong>${formatDuration(total)}</strong></div><div class="manual-edit"><span class="small">${times}</span><button class="approve compact-button" data-time-save="true" data-worker-id="${workerId}" data-date="${date}" type="button">${t("saveTimes")}</button><button class="deny compact-button" data-time-clear="true" data-worker-id="${workerId}" data-date="${date}" type="button" ${hasManual ? "" : "disabled"}>${t("clearManual")}</button></div></div>`;
  }).join("");
}

function renderAdminRequest(request) {
  const worker = state.workers.find((person) => person.id === request.workerId);
  if (!worker) return "";
  const preview = buildApprovedShift(request);
  const canApprove = Boolean(preview);
  const previewText = preview ? t("willBecome", { time: `${formatTimeOnly(preview.inAt)} - ${formatTimeOnly(preview.outAt)} (${formatDuration(new Date(preview.outAt) - new Date(preview.inAt))})` }) : t("needsShift");
  return `<div class="item"><div class="item-row"><strong>${escapeHtml(worker.name)}</strong><span class="small">${request.date}</span></div><div class="small">${requestChangeSummary(request)}</div><div class="small">${previewText}</div><div>${escapeHtml(request.text)}</div><div class="actions"><button class="approve" data-request-action="approved" data-request-id="${request.id}" ${canApprove ? "" : "disabled"}>${t("approveAction")}</button><button class="deny" data-request-action="denied" data-request-id="${request.id}">${t("denyAction")}</button></div></div>`;
}

function handleAdminClick(event) {
  const weekButton = event.target.closest("[data-week-nav]");
  if (weekButton) {
    adminWeekOffset += Number(weekButton.dataset.weekNav);
    if (adminWeekOffset > 0) adminWeekOffset = 0;
    renderAdmin();
    return;
  }
  const saveTime = event.target.closest("[data-time-save]");
  if (saveTime) return saveManualTimes(saveTime.dataset.workerId, saveTime.dataset.date);
  const clearTime = event.target.closest("[data-time-clear]");
  if (clearTime) return clearManualTimes(clearTime.dataset.workerId, clearTime.dataset.date);
  const deleteStart = event.target.closest("[data-delete-start]");
  if (deleteStart) return showDeleteConfirm(deleteStart.dataset.deleteStart);
  const deleteCancel = event.target.closest("[data-delete-cancel]");
  if (deleteCancel) return hideDeleteConfirm(deleteCancel.dataset.deleteCancel);
  const deleteFinal = event.target.closest("[data-delete-final]");
  if (deleteFinal && !deleteFinal.disabled) return deleteWorker(deleteFinal.dataset.deleteFinal);
  const button = event.target.closest("[data-request-action]");
  if (!button) return;
  reviewRequest(button.dataset.requestId, button.dataset.requestAction);
}

function reviewRequest(requestId, status) {
  if (!requireOnline()) return;
  const request = state.requests.find((item) => item.id === requestId);
  if (!request) return;
  const approvedShift = buildApprovedShift(request);
  if (status === "approved" && !approvedShift) return;
  request.status = status;
  request.reviewedAt = new Date().toISOString();
  if (status === "approved") {
    state.overrides = state.overrides.filter((override) => override.workerId !== request.workerId || override.date !== request.date);
    state.overrides.push({ id: overrideId(request.workerId, request.date), requestId: request.id, workerId: request.workerId, date: request.date, inAt: approvedShift.inAt, outAt: approvedShift.outAt, approvedAt: request.reviewedAt });
  }
  state.overrides = dedupeOverrides(state.overrides);
  saveState();
  renderAdmin();
}

function handleAdminInput(event) {
  const slider = event.target.closest("[data-delete-slider]");
  if (!slider) return;
  const button = document.querySelector(`[data-delete-final="${slider.dataset.deleteSlider}"]`);
  button.disabled = Number(slider.value) < 100;
}

function showDeleteConfirm(workerId) {
  document.querySelector(`[data-delete-confirm="${workerId}"]`).classList.remove("hidden");
  document.querySelector(`[data-delete-start="${workerId}"]`).classList.add("hidden");
  document.querySelector(`[data-delete-slider="${workerId}"]`).value = "0";
  document.querySelector(`[data-delete-final="${workerId}"]`).disabled = true;
}

function hideDeleteConfirm(workerId) {
  document.querySelector(`[data-delete-confirm="${workerId}"]`).classList.add("hidden");
  document.querySelector(`[data-delete-start="${workerId}"]`).classList.remove("hidden");
  document.querySelector(`[data-delete-slider="${workerId}"]`).value = "0";
  document.querySelector(`[data-delete-final="${workerId}"]`).disabled = true;
}

function deleteWorker(workerId) {
  if (!requireOnline()) return;
  state.workers = state.workers.filter((worker) => worker.id !== workerId);
  state.events = state.events.filter((event) => event.workerId !== workerId);
  state.requests = state.requests.filter((request) => request.workerId !== workerId);
  state.overrides = state.overrides.filter((override) => override.workerId !== workerId);
  saveState();
  renderAdmin();
}

function saveManualTimes(workerId, date) {
  if (!requireOnline()) return;
  const startInput = document.querySelector(`[data-time-edit="start"][data-worker-id="${workerId}"][data-date="${date}"]`);
  const endInput = document.querySelector(`[data-time-edit="end"][data-worker-id="${workerId}"][data-date="${date}"]`);
  if (!startInput || !endInput) return;
  const start = startInput.value;
  const end = endInput.value;
  if (!start || !end) {
    const message = t("manualNeedsBoth");
    showToast(message);
    return showFieldError(start ? endInput : startInput, start ? endInput : startInput, message);
  }
  const inAt = cambodiaDateTimeToIso(date, start);
  const outAt = cambodiaDateTimeToIso(date, end);
  if (new Date(outAt) <= new Date(inAt)) return showFieldError(endInput, endInput, t("outAfterIn"));
  state.overrides = state.overrides.filter((override) => override.workerId !== workerId || override.date !== date);
  state.overrides.push({ id: overrideId(workerId, date), requestId: `manual-${workerId}-${date}`, workerId, date, inAt, outAt, approvedAt: new Date().toISOString(), manualEdit: true });
  state.overrides = dedupeOverrides(state.overrides);
  saveState();
  showToast(t("manualSaved"));
  renderAdmin();
}

function clearManualTimes(workerId, date) {
  if (!requireOnline()) return;
  state.overrides = state.overrides.filter((override) => override.workerId !== workerId || override.date !== date);
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
  if (!inAt || !outAt || new Date(outAt) <= new Date(inAt)) return null;
  return { inAt, outAt };
}

function findShiftForDate(workerId, date) {
  return shiftsForWorker(workerId).find((shift) => shift.date === date) || rawShiftsForWorker(workerId).find((shift) => shift.date === date);
}

function switchTab(scope, tabName) {
  document.querySelectorAll(`[data-${scope}-tab]`).forEach((tab) => tab.classList.toggle("active", tab.dataset[`${scope}Tab`] === tabName));
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
  localStorage.setItem(LANGUAGE_KEY, language);
  applyTranslations();
}

function requireOnline() {
  if (navigator.onLine) return true;
  showToast(t("offlineSync"));
  return false;
}

function applyRemoteState(json) {
  try {
    state = normalizeState(JSON.parse(json || "{}"));
  } catch {
    return;
  }
  if (session.role === "worker") renderWorker();
  if (session.role === "admin") renderAdmin();
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function isAdminRoute() {
  const path = window.location.pathname.replace(/\/$/, "");
  return path === "/admin" || path.endsWith("/admin.html");
}

els.signInForm.addEventListener("submit", login);
els.createAccountForm.addEventListener("submit", createAccount);
els.adminLoginForm.addEventListener("submit", adminLogin);
els.pinInput.addEventListener("keydown", (event) => { if (event.key === "Enter") login(event); });
els.logoutButton.addEventListener("click", logout);
els.clockButton.addEventListener("click", clockToggle);
els.requestForm.addEventListener("submit", submitRequest);
els.adminRequestList.addEventListener("click", handleAdminClick);
els.adminWorkerList.addEventListener("click", handleAdminClick);
els.adminWorkerList.addEventListener("input", handleAdminInput);
els.languageToggle.addEventListener("click", toggleLanguage);
document.querySelectorAll("[data-worker-tab]").forEach((tab) => tab.addEventListener("click", () => switchTab("worker", tab.dataset.workerTab)));
document.querySelectorAll("[data-admin-tab]").forEach((tab) => tab.addEventListener("click", () => switchTab("admin", tab.dataset.adminTab)));
document.querySelectorAll("[data-auth-mode]").forEach((tab) => tab.addEventListener("click", () => setAuthMode(tab.dataset.authMode)));
window.addEventListener("online", () => { state.events.forEach((event) => { event.pending = false; }); saveState(); if (session.role === "worker") renderWorker(); });
window.addEventListener("offline", () => { if (session.role === "worker") renderWorker(); });
window.addEventListener("team-time-clock-state-updated", (event) => applyRemoteState(event.detail?.json));
window.__teamTimeClockApplyRemoteState = applyRemoteState;
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
}
if ("caches" in window) {
  caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
}
showScreen(isAdminRoute() ? "adminLoginScreen" : "loginScreen");
applyTranslations();
