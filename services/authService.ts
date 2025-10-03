import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  type User
} from "firebase/auth";
import { auth } from "../firebase/config";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const logout = (): Promise<void> => {
  return signOut(auth);
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
    return onFirebaseAuthStateChanged(auth, callback);
};
