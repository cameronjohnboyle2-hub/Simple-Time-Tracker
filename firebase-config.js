export const firebaseConfig = {
  apiKey: "AIzaSyD8KL1O0IOvZPKtzvFXtxaqHKj7gq4b32s",
  authDomain: "simple-time-tracker-c8924.firebaseapp.com",
  projectId: "simple-time-tracker-c8924",
  storageBucket: "simple-time-tracker-c8924.firebasestorage.app",
  messagingSenderId: "372594487906",
  appId: "1:372594487906:web:9a4079abbb90221b00173b",
  measurementId: "G-H4GG95WZX9"
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
