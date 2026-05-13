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
          remoteStateJson = localJson;
          localDirty = false;
          saveRemoteState(localJson);
          return;
        }

        if (!remoteJson && localJson) {
          remoteStateJson = localJson;
          saveRemoteState(localJson);
          return;
        }

        if (remoteJson && remoteJson !== localJson) {
          remoteStateJson = remoteJson;
          originalSetItem(STORAGE_KEY, remoteJson);
          originalSetItem(REMOTE_SOURCE_KEY, new Date().toISOString());
          localDirty = false;
          window.location.reload();
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
