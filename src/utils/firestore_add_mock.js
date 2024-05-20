/**
 * firestore_add_mock.js
 *
 * This script is assumed to live in an existing Javascript project that has its own package.json.
 * I store this script in <PROJECT_ROOT>/tools/misc/.
 *
 * To use:
 *  1. npm init -y
 *  2. npm install firebase esm
 *  3. Edit this code to set for USER1 and FIREBASE_CONFIG
 *  4. node -r esm firestore_add_doc.js
 *
 * NOTE: this code works with the Firebase Web SDK "v9 modular API".
 *
 */

import {initializeApp} from 'firebase/app';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {
  Bytes,
  doc,
  getFirestore,
  setDoc
} from 'firebase/firestore';

let APP, AUTH, FIRESTORE;

// Firebase Console >> Authentication
const USER1 = {
  email: 'mr.magoo@test.com', // USER THAT EXISTS IN FIREBASE AUTH
  password: 'let_me_in',
};

// Firebase Console >> Project Overview >> General >> Apps
//    (use existing app values or click Add app to create new WEB app)
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA10CDhGaFrFdi6S3ICOZ9PLsk-Y1qIT1A",
  authDomain: "localechoes.firebaseapp.com",
  // databaseURL: "YOUR_DATABASE_URL",
  projectId: "localechoes",
  storageBucket: "localechoes.appspot.com",
  messagingSenderId: "331938981776",
  appId: "1:331938981776:web:86b600d04f649d6648b515"
};


const initializeFB = async () => {
  console.log(`  Initialize Firebase`);
  APP = initializeApp(FIREBASE_CONFIG);
  // AUTH = getAuth(APP);
  FIRESTORE = getFirestore(APP);

  // try {
  //   await signInWithEmailAndPassword(AUTH, USER1.email, USER1.password);
  //
  //   let currUser = AUTH.currentUser;
  //   console.log(`  Logged in with USER1 -- UID is (${currUser.uid})`);
  // } catch (ex) {
  //   console.error(ex.message);
  //   throw ex;
  // }
};

const mockData = [
  {
    id: '1',
    title: 'Story 1',
    coordinates: { latitude: 60.1699, longitude: 24.9384 },
    audioRef: 'path/to/audio1.mp3',
  },
  {
    id: '2',
    title: 'Story 2',
    coordinates: { latitude: 59.1699, longitude: 24.9684 },
    audioRef: 'path/to/audio2.mp3',
  },
  {
    id: '3',
    title: 'Story 3',
    coordinates: { latitude: 60.1899, longitude: 24.7384 },
    audioRef: 'path/to/audio3.mp3',
  },
]


const main = async () => {
  console.log('>>> START - ', Date());
  try {
    await initializeFB();

    // let theData = {
    //   strVal: "hello",
    //   numVal: 1234,
    //   bytesVal: Bytes.fromUint8Array(new Uint8Array([21,31]))
    // };

    const docRef = doc(FIRESTORE, "stories/test123");
    await setDoc(docRef, mockData[0]);

    console.log(`  Successfully wrote to: ${docRef.path}`);
    console.log('  Now check the Firebase Console to see this lovely doc!');
  } catch(ex) {
    console.error("UH-OH! ", ex.message);
    throw ex;
  }

  console.log('>>> DONE - ', Date());
  process.exit();
};

main();
