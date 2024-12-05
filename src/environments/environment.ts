// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCIZNeY2-1H-oRsyAViEUf0aLG6B2Ggs64",
  authDomain: "cafeteria-sistema-anb.firebaseapp.com",
  projectId: "cafeteria-sistema-anb",
  storageBucket: "cafeteria-sistema-anb.appspot.com",
  messagingSenderId: "180162537832",
  appId: "1:180162537832:web:00c6f274ee9d0c02ac8edd",
  measurementId: "G-RLDXCLSR0H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);