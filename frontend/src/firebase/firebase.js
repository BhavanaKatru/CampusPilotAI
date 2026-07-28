import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNIT9KkbhmfPgiGsCSJ8SJW2IACWGgGes",
  authDomain: "campuspilotai-a9991.firebaseapp.com",
  projectId: "campuspilotai-a9991",
  storageBucket: "campuspilotai-a9991.firebasestorage.app",
  messagingSenderId: "995110846792",
  appId: "1:995110846792:web:9387b2ee9a65623a04f37d",
  measurementId: "G-PV41LRQBZ8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;