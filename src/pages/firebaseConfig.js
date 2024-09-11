import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyArb3_HVqw2Rfgdl5W7mpxUchbfbTuimec",
  authDomain: "babaclean-c5114.firebaseapp.com",
  projectId: "babaclean-c5114",
  storageBucket: "babaclean-c5114.appspot.com",
  messagingSenderId: "1077863138555",
  appId: "1:1077863138555:web:1fa55a419779e653e05c5e",
  measurementId: "G-7BDWDW6LZD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { auth, db };
