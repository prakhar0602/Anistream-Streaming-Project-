import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBLWHKX-U9O9CUgaKbR5Fj6gLUPEPx6Vc4",
  authDomain: "anistream-98400.firebaseapp.com",
  projectId: "anistream-98400",
  storageBucket: "anistream-98400.appspot.com",
  messagingSenderId: "365774643900",
  appId: "1:365774643900:web:1ab35406b0efa58bc9a6b9",
  measurementId: "G-1QWFF5E2J4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)

export {app,auth}