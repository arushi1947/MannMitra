import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyAI0N5eeElBqOIm-FmF8atSTpRpZTJuFEI",

  authDomain: "mannmitra-ee930.firebaseapp.com",

  projectId: "mannmitra-ee930",

  storageBucket: "mannmitra-ee930.firebasestorage.app",

  messagingSenderId: "327901938768",

  appId: "1:327901938768:web:4b3bc0ad4ad5d7739f7d55"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();