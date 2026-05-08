(() => {
  const STORAGE_KEY = "team-time-clock-v1";
  const REMOTE_SOURCE_KEY = "team-time-clock-remote-source";
  const originalSetItem = localStorage.setItem.bind(localStorage);
  const originalGetItem = localStorage.getItem.bind(localStorage);
  let saveTimer = null;
  let remoteReady = false;
  let remoteStateJson = "";
  let saveRemoteState = null;

  localStorage.setItem = (key, value) => {
    originalSetItem(key, value);
    if (key === STORAGE_KEY && remoteReady && saveRemoteState && value !== remoteStateJson) {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => saveRemoteState(value), 250);
    }
  };

  async function init() {
    const { FIREBASE_TEAM_ID, firebaseConfig, hasFirebaseConfig } = await import("./firebase-config.js");
    if (!hasFirebaseConfig(firebaseConfig)) return;

    const [{ initializeApp }, firestore] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js")
    ]);

    const app = initializeApp(firebaseConfig);
    const db = firestore.initializeFirestore(app, {
      localCache: firestore.persistentLocalCache({
        tabManager: firestore.persistentMultipleTabManager()
      })
    });
    const stateRef = firestore.doc(db, "teams", FIREBASE_TEAM_ID, "state", "current");

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

      if (!remoteJson && localJson) {
        saveRemoteState(localJson);
        return;
      }

      if (remoteJson && remoteJson !== localJson) {
        remoteStateJson = remoteJson;
        originalSetItem(STORAGE_KEY, remoteJson);
        originalSetItem(REMOTE_SOURCE_KEY, new Date().toISOString());
        window.location.reload();
      }
    }, (error) => {
      console.error(error);
    });
  }

  init().catch((error) => console.error(error));
})();
