import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyBcNS7B_DYqJnfROX1fG-2-wRe9_7HJhu4",
    authDomain: "treasurehunt-9dde7.firebaseapp.com",
    databaseURL: "https://treasurehunt-9dde7.firebaseio.com",
    projectId: "treasurehunt-9dde7",
    storageBucket: "treasurehunt-9dde7.appspot.com",
    messagingSenderId: "762663104229",
    appId: "1:762663104229:web:f928dcb9c38777f5636e0c",
    measurementId: "G-RJRBQ0RTP6"
  };
  const fire = firebase.initializeApp(firebaseConfig);

  export default fire;