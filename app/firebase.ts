import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBSdKnqCorie729BqE2Cd_Sk9J12zh8h-k",
  authDomain: "smart-motos.firebaseapp.com",
  projectId: "smart-motos",
  storageBucket: "smart-motos.firebasestorage.app",
  messagingSenderId: "387738052261",
  appId: "1:387738052261:web:1d2ec69e9a215980580f4c",
  measurementId: "G-9BV32PLY1L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 