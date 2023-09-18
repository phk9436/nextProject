import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const STORAGE_BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET;
const MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID;
const APP_ID = process.env.NEXT_PUBLIC_APP_ID;

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const dbService = getFirestore();
export const storageService = getStorage();