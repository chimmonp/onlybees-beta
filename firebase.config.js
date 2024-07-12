// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOvd471RTC64eFveDyo6Jzk55eJ3WEhyw",
  authDomain: "onlybees-b817c.firebaseapp.com",
  projectId: "onlybees-b817c",
  storageBucket: "onlybees-b817c.appspot.com",
  messagingSenderId: "1084332570097",
  appId: "1:1084332570097:web:1498d2171eabe378a48050",
  measurementId: "G-WCJ5TG8NZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
