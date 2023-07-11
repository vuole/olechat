// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBa_y8vDNf6PVOw1qlEZgKSq2RKTm7JmTY",
  authDomain: "olechat-f8ab7.firebaseapp.com",
  projectId: "olechat-f8ab7",
  storageBucket: "olechat-f8ab7.appspot.com",
  messagingSenderId: "115606345392",
  appId: "1:115606345392:web:c304f5a63ed9bd69aacd75"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);