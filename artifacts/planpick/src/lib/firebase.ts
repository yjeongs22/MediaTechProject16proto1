import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBI_3dRY4-ugay6HyrRbcWd_TM7AIjK0uA",
  authDomain: "planpick-3d8ed.firebaseapp.com",
  projectId: "planpick-3d8ed",
  storageBucket: "planpick-3d8ed.firebasestorage.app",
  messagingSenderId: "756109027589",
  appId: "1:756109027589:web:001ff710f8ceef6a29ef6c",
  measurementId: "G-HW6GBKKL3F",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
