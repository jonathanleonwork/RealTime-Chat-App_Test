import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";


const config = {
  apiKey: "AIzaSyDGGzSXjvltzVnQ9NuknLB4z0e9wJ0Ub74",
  authDomain: "realtime-chat-app-fad2a.firebaseapp.com",
  projectId: "realtime-chat-app-fad2a",
  storageBucket: "realtime-chat-app-fad2a.firebasestorage.app",
  messagingSenderId: "138835117392",
  appId: "1:138835117392:web:c7636fbe57af4209fc5855",
  databaseURL: "https://realtime-chat-app-fad2a-default-rtdb.firebaseio.com/",
};

const app = initializeApp(config);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
