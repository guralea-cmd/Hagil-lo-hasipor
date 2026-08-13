var firebaseConfig = {
  apiKey: "AIzaSyDpIyfmtt5rSJ10tkXrqURup6iE4utfTig",
  authDomain: "hagil-lo-hasipor.firebaseapp.com",
  projectId: "hagil-lo-hasipor",
  storageBucket: "hagil-lo-hasipor.firebasestorage.app",
  messagingSenderId: "617409966023",
  appId: "1:617409966023:web:5f9785bfbf8059e21df3e2"
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var storage = firebase.storage();
var auth = typeof firebase.auth === "function" ? firebase.auth() : null;
