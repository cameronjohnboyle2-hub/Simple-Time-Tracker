(() => {
  const STORAGE_KEY = "team-time-clock-v1";
  const REMOTE_SOURCE_KEY = "team-time-clock-remote-source";
  const originalSetItem = localStorage.setItem.bind(localStorage);
  const originalGetItem = localStorage.getItem.bind(localStorage);
  let saveTimer = null;
  let remoteReady = false;
  let remoteStateJson = "";
  let saveRemoteState = null;
  let localDirty = false;

  function parseState(json) {
    try {
      return json ? JSON.parse(json) : {};
    } catch {
      return {};
    }
  }

  function mergeById(localItems = [], remoteItems = []) {
    const byId = new Map();
    remoteItems.forEach((item) => byId.set(item.id, item));
    localItems.forEach((item) => byId.set(item.id, { ...byId.get(item.id), ...item }));
    return Array.from(byId.values());
  }

  function overrideId(workerId, date) {
    return `override-${workerId}-${date}`;
  }

  function overrideTime(override) {
    return new Date(override.approvedAt || override.reviewedAt || override.createdAt || 0).getTime();
  }

  function mergeOverrides(localItems = [], remoteItems = []) {
    const byDate = new Map();
    [...remoteItems, ...localItems].forEach((override) => {
      if (!override?.workerId || !override?.date || !override?.inAt || !override?.outAt) return;
      const key = `${override.workerId}|${override.date}`;
      const current = byDate.get(key);
      if (!current || overrideTime(override) >= overrideTime(current)) {
        byDate.set(key, {
          ...current,
          ...override,
          id: overrideId(override.workerId, override.date)
        });
      }
    });
    return Array.from(byDate.values());
  }

  function normalizeJson(json) {
    const state = parseState(json);
    return JSON.stringify({
      workers: state.workers || [],
      events: state.events || [],
      requests: state.requests || [],
      overrides: mergeOverrides(state.overrides || [], [])
    });
  }

  function mergeStateJson(localJson, remoteJson) {
    const localState = parseState(localJson);
    const remoteState = parseState(remoteJson);
    return JSON.stringify({
      workers: mergeById(localState.workers, remoteState.workers),
      events: mergeById(localState.events, remoteState.events),
      requests: mergeById(localState.requests, remoteState.requests),
      overrides: mergeOverrides(localState.overrides, remoteState.overrides)
    });
  }

  function notifyStateUpdated(json) {
    if (typeof window.__teamTimeClockApplyRemoteState === "function") {
      window.__teamTimeClockApplyRemoteState(json);
      return;
    }
    window.dispatchEvent(new CustomEvent("team-time-clock-state-updated", { detail: { json } }));
  }

  localStorage.setItem = (key, value) => {
    originalSetItem(key, value);
    if (key !== STORAGE_KEY) return;
    localDirty = value !== remoteStateJson;
    if (remoteReady && saveRemoteState && localDirty) {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => saveRemoteState(value), 250);
    }
  };

  async function init() {
    const { FIREBASE_TEAM_ID, firebaseConfig, hasFirebaseConfig } = await import("./firebase-config.js");
    if (!hasFirebaseConfig(firebaseConfig)) return;

    const [appModule, firestore] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js")
    ]);
    const { getAuth, onAuthStateChanged, signInAnonymously } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");

    const app = appModule.getApps().length ? appModule.getApp() : appModule.initializeApp(firebaseConfig);
    const auth = getAuth(app);
    if (!auth.currentUser) {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error(error);
      }
    }
    const db = firestore.initializeFirestore(app, {
      localCache: firestore.persistentLocalCache({
        tabManager: firestore.persistentMultipleTabManager()
      })
    });
    const stateRef = firestore.doc(db, "teams", FIREBASE_TEAM_ID, "state", "current");

    const attachRemoteSync = () => {
      saveRemoteState = async (json) => {
        try {
          await firestore.setDoc(stateRef, {
            json,
            updatedAt: new Date().toISOString()
          });
        } catch (error) {
          console.error(error);
        }
      };

      firestore.onSnapshot(stateRef, (snapshot) => {
        remoteReady = true;
        const remoteJson = snapshot.data()?.json || "";
        const localJson = originalGetItem(STORAGE_KEY) || "";

        if (localDirty && localJson) {
          const mergedJson = remoteJson ? mergeStateJson(localJson, remoteJson) : normalizeJson(localJson);
          remoteStateJson = mergedJson;
          localDirty = false;
          saveRemoteState(mergedJson);
          if (normalizeJson(localJson) !== mergedJson) {
            originalSetItem(STORAGE_KEY, mergedJson);
            notifyStateUpdated(mergedJson);
          }
          return;
        }

        if (!remoteJson && localJson) {
          remoteStateJson = localJson;
          saveRemoteState(localJson);
          return;
        }

        if (remoteJson && remoteJson !== localJson) {
          const mergedJson = mergeStateJson(localJson, remoteJson);
          remoteStateJson = mergedJson;
          if (normalizeJson(remoteJson) !== mergedJson) {
            saveRemoteState(mergedJson);
          }
          if (normalizeJson(localJson) !== mergedJson) {
            originalSetItem(STORAGE_KEY, mergedJson);
          }
          originalSetItem(REMOTE_SOURCE_KEY, new Date().toISOString());
          localDirty = false;
          notifyStateUpdated(mergedJson);
        }
      }, (error) => {
        console.error(error);
      });
    };

    onAuthStateChanged(auth, (user) => {
      if (user && !remoteReady) {
        attachRemoteSync();
      }
    });
  }

  init().catch((error) => console.error(error));
})();
