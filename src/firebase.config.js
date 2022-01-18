import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDLlrvBfNaqXmkExt0tzbtyh0F1KiVx9Zk',
  authDomain: 'real-estate-listing-app.firebaseapp.com',
  projectId: 'real-estate-listing-app',
  storageBucket: 'real-estate-listing-app.appspot.com',
  messagingSenderId: '535562763484',
  appId: '1:535562763484:web:15248d765ebd50ee2a4819',
  measurementId: 'G-M7RJJNG7B2',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore();
