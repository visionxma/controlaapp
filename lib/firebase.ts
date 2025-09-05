import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAEjIYN9KG-ipqqkelDzJ0M7L3wlphNZrE",
  authDomain: "mensalidades-b192b.firebaseapp.com",
  projectId: "mensalidades-b192b",
  storageBucket: "mensalidades-b192b.firebasestorage.app",
  messagingSenderId: "177827868814",
  appId: "1:177827868814:web:87caec8d204cf8c68059df",
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
