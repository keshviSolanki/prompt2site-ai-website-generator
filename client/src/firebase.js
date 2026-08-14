// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "prompt2site-85bcc.firebaseapp.com",
  projectId: "prompt2site-85bcc",
  storageBucket: "prompt2site-85bcc.firebasestorage.app",
  messagingSenderId: "1083269276307",
  appId: "1:1083269276307:web:e08be1b31b64cf8a0aa366",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
