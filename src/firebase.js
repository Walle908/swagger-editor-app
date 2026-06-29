import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCb1YgYuroAqRQaB7n7_9AxEhLHsd3cgoE',
  authDomain: '://firebaseapp.com',
  projectId: 'swagger-editor-app-f3158',
  storageBucket: 'swagger-editor-app-f3158.firebasestorage.app',
  messagingSenderId: '1056116168953',
  appId: '1:1056116168953:web:7f5b496a79f011353faa28',
  measurementId: 'G-DS4YJF6EQ5',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
