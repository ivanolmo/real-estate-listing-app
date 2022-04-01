import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // apiKey is secured at the API and application level in Google Cloud Platorm
  apiKey: 'AIzaSyDLlrvBfNaqXmkExt0tzbtyh0F1KiVx9Zk',
  authDomain: 'real-estate-listing-app.firebaseapp.com',
  projectId: 'real-estate-listing-app',
  storageBucket: 'real-estate-listing-app.appspot.com',
  messagingSenderId: '535562763484',
  appId: '1:535562763484:web:15248d765ebd50ee2a4819',
  measurementId: 'G-M7RJJNG7B2',
};

initializeApp(firebaseConfig);

export const db = getFirestore();
