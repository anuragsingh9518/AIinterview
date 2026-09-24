
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
    import { formToJSON } from "axios";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_FIREBASE_KEY,
  authDomain: "interviewiq-f5916.firebaseapp.com",
  projectId: "interviewiq-f5916",
  storageBucket: "interviewiq-f5916.firebasestorage.app",
  messagingSenderId: "634895433910",
  appId: "1:634895433910:web:4ddedb14172fbbfadca617"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new  GoogleAuthProvider()
export {auth,provider}