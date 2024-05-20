import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA10CDhGaFrFdi6S3ICOZ9PLsk-Y1qIT1A",
  authDomain: "localechoes.firebaseapp.com",
  // databaseURL: "YOUR_DATABASE_URL",
  projectId: "localechoes",
  storageBucket: "localechoes.appspot.com",
  messagingSenderId: "331938981776",
  appId: "1:331938981776:web:86b600d04f649d6648b515"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export default firebase;
