import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCX-5tXWD2Z8_FESUaiaYGJvnx9ZGXRxHw",
  authDomain: "links-173f2.firebaseapp.com",
  databaseURL: "https://links-173f2-default-rtdb.firebaseio.com",
  projectId: "links-173f2",
  storageBucket: "links-173f2.appspot.com",
  messagingSenderId: "674433244888",
  appId: "1:674433244888:web:daba00c87f3723a67101ad"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };