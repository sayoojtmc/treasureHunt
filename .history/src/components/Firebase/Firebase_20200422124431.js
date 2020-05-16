import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyBcNS7B_DYqJnfROX1fG-2-wRe9_7HJhu4",
  authDomain: "treasurehunt-9dde7.firebaseapp.com",
  databaseURL: "https://treasurehunt-9dde7.firebaseio.com",
  projectId: "treasurehunt-9dde7",
  storageBucket: "treasurehunt-9dde7.appspot.com",
  messagingSenderId: "762663104229",
  appId: "1:762663104229:web:f928dcb9c38777f5636e0c",
  measurementId: "G-RJRBQ0RTP6",
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.firestore = app.firestore();
    this.storage = app.storage();
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();
}

export default Firebase;
