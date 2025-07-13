// Import Firebase
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Initialize Firebase services
const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

// Global variables
const currentUser = null
const userRole = null
