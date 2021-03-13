// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyC_zzWw28loIdyWd46AMm4B6kwP1Hu4kb0",
    authDomain: "challenge-5383a.firebaseapp.com",
    projectId: "challenge-5383a",
    storageBucket: "challenge-5383a.appspot.com",
    messagingSenderId: "1098211778468",
    appId: "1:1098211778468:web:ee71df7ad490dc9015eb31",
    measurementId: "G-CC243D8MK7"
};

const firebaseApp=firebase.initializeApp(firebaseConfig);

const db=firebaseApp.firestore();
const auth=firebase.auth();

export {db, auth};