// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD9M_oQN88JHDV2ask2E5_qKXomWJq_v3g",
    authDomain: "isea-cc218.firebaseapp.com",
    projectId: "isea-cc218",
    storageBucket: "isea-cc218.firebasestorage.app",
    messagingSenderId: "18605555614",
    appId: "1:18605555614:web:56866fe1b1968c59d0208f",
    measurementId: "G-3S9ELTXGM1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
