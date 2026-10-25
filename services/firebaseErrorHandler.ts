import { i18n } from "@/i18n";

const KNOWN = new Set([
  "auth/invalid-email",
  "auth/user-not-found",
  "auth/wrong-password",
  "auth/email-already-in-use",
  "auth/weak-password",
  "auth/invalid-credential",
  "auth/too-many-requests",
  "auth/requires-recent-login",
]);

// maps a Firebase auth error code to a translated message
export const getFirebaseErrorMessage = (errorCode: string | undefined): string => {
  const key = errorCode && KNOWN.has(errorCode) ? errorCode.replace("auth/", "") : "unknown";
  return i18n.t(`errors.auth.${key}`);
};
