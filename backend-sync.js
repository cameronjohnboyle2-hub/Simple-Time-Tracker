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
  const stateLogic = import("./state-logic.mjs");

  async function normalizeJson(json) {
    const { normalizeStateJson } = await stateLogic;
    return normalizeStateJson(json);
  }

  async function mergeStateJson(localJson, remoteJson) {
    const { mergeStateJson: mergeJson } = await stateLogic;
    return mergeJson(localJson, remoteJson);
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
    const db = firestore.getFirestore(app);
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

      firestore.onSnapshot(stateRef, async (snapshot) => {
        remoteReady = true;
        const remoteJson = snapshot.data()?.json || "";
        const localJson = originalGetItem(STORAGE_KEY) || "";

        if (localDirty && localJson) {
          const mergedJson = remoteJson ? await mergeStateJson(localJson, remoteJson) : await normalizeJson(localJson);
          remoteStateJson = mergedJson;
          localDirty = false;
          saveRemoteState(mergedJson);
          if (await normalizeJson(localJson) !== mergedJson) {
            originalSetItem(STORAGE_KEY, mergedJson);
            notifyStateUpdated(mergedJson);
          }
          return;
        }

        if (!remoteJson && localJson) {
          const normalizedLocalJson = await normalizeJson(localJson);
          remoteStateJson = normalizedLocalJson;
          saveRemoteState(normalizedLocalJson);
          return;
        }

        if (remoteJson && remoteJson !== localJson) {
          const mergedJson = await mergeStateJson(localJson, remoteJson);
          remoteStateJson = mergedJson;
          if (await normalizeJson(remoteJson) !== mergedJson) {
            saveRemoteState(mergedJson);
          }
          if (await normalizeJson(localJson) !== mergedJson) {
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
