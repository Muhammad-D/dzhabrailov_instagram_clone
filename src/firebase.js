import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCNV_KAob7EbRXcIJQkMQpP7lsSSlfUpmM",
  authDomain: "instagram-clone-a2f19.firebaseapp.com",
  databaseURL: "https://instagram-clone-a2f19.firebaseio.com",
  projectId: "instagram-clone-a2f19",
  storageBucket: "instagram-clone-a2f19.appspot.com",
  messagingSenderId: "533571529463",
  appId: "1:533571529463:web:d4878b692745137166c1f2",
  measurementId: "G-FESFHN9HQX",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
