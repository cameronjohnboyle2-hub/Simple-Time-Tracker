export const firebaseConfig = {
  apiKey: "PASTE_FIREBASE_API_KEY",
  authDomain: "PASTE_FIREBASE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_FIREBASE_PROJECT_ID",
  storageBucket: "PASTE_FIREBASE_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "PASTE_FIREBASE_MESSAGING_SENDER_ID",
  appId: "PASTE_FIREBASE_APP_ID"
};

export const FIREBASE_TEAM_ID = "cambodia-team";

export function hasFirebaseConfig(config) {
  return Boolean(
    config?.apiKey
      && config?.projectId
      && !config.apiKey.includes("PASTE_")
      && !config.projectId.includes("PASTE_")
  );
}
