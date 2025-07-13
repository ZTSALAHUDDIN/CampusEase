// lib/firebase.ts

import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAs37aniS2cz20m5tKciH1jJ5Gz_FZDZNY",
  authDomain: "campusease-aa25d.firebaseapp.com",
  projectId: "campusease-aa25d",
  storageBucket: "campusease-aa25d.appspot.com", 
  messagingSenderId: "636468321008",
  appId: "1:636468321008:web:d3b1ab89ca81c5cb5a0035"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app