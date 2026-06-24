import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

/**
 * Opens a Google login popup and signs the user in.
 * @returns {Promise<UserCredential>}
 */
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

/**
 * Signs the current user out.
 * @returns {Promise<void>}
 */
export const signOut = () => {
  return firebaseSignOut(auth);
};

/**
 * Subscribes to auth state changes.
 * @param {function} callback - Called with the user object (or null on sign-out).
 * @returns {function} Unsubscribe function.
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
