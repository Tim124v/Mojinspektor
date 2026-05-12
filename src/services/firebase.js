import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInAnonymously as firebaseSignInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  EmailAuthProvider,
  linkWithCredential,
} from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

/** Поточний користувач Firebase Auth (може бути null). */
export function getCurrentUser() {
  return auth.currentUser
}

/** Анонімний вхід, якщо ще немає сесії (для uid у Firestore / Premium). */
export async function signInAnonymously() {
  try {
    const cred = await firebaseSignInAnonymously(auth)
    return { success: true, uid: cred.user.uid }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function registerWithEmail(email, password) {
  try {
    const existing = auth.currentUser
    if (existing?.isAnonymous) {
      const credential = EmailAuthProvider.credential(email, password)
      const result = await linkWithCredential(existing, credential)
      return { success: true, uid: result.user.uid }
    }
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return { success: true, uid: result.user.uid }
  } catch (error) {
    const msg =
      error.code === 'auth/email-already-in-use'
        ? 'Цей email вже використовується. Увійдіть або використайте інший.'
        : error.code === 'auth/weak-password'
          ? 'Пароль надто короткий. Мінімум 6 символів.'
          : error.code === 'auth/invalid-email'
            ? 'Невірний формат email.'
            : 'Помилка реєстрації. Спробуйте ще раз.'
    return { success: false, error: msg }
  }
}

export async function loginWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, uid: result.user.uid }
  } catch (error) {
    const msg =
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/invalid-credential'
        ? 'Невірний email або пароль.'
        : 'Помилка входу. Спробуйте ще раз.'
    return { success: false, error: msg }
  }
}

export async function logoutUser() {
  try {
    await signOut(auth)
    return { success: true }
  } catch {
    return { success: false }
  }
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}

/** Запис Premium після оплати (MVP: клієнт; у проді краще webhook → Cloud Function). */
export async function enablePremiumInFirestore(uid) {
  try {
    const ref = doc(db, 'users', uid)
    await setDoc(
      ref,
      {
        isPremium: true,
        activatedAt: new Date().toISOString(),
        source: 'stripe',
      },
      { merge: true }
    )
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Чи є Premium у Firestore для uid.
 * @returns {Promise<boolean|null>} true/false або null, якщо запит не вдався (мережа тощо) — не змінюйте локальний стан.
 */
export async function checkPremiumInFirestore(uid) {
  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    if (!snap.exists) return false
    return snap.data()?.isPremium === true
  } catch {
    return null
  }
}

export async function saveProgressToFirestore(uid, progressData) {
  try {
    const ref = doc(db, 'users', uid)
    await setDoc(
      ref,
      { progress: progressData, updatedAt: new Date().toISOString() },
      { merge: true }
    )
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function loadProgressFromFirestore(uid) {
  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    if (!snap.exists) return { success: true, data: null }
    return { success: true, data: snap.data()?.progress ?? null }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
