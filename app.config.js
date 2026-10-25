export default ({ config }) => ({
  ...config,
  name: "My Daily Pet",
  slug: "my-daily-pet-v2",
  owner: "biam18",
  android: {
    package: "com.biam18.mydailypet",
  },
  extra: {
    ...config.extra,
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,
  },
});
