import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getCountFromServer,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLYFLx3_jyqKCwwCyludUaTDJJkQgUV9A",
  authDomain: "leilouy-nichmat-mmeazogui.firebaseapp.com",
  projectId: "leilouy-nichmat-mmeazogui",
  storageBucket: "leilouy-nichmat-mmeazogui.firebasestorage.app",
  messagingSenderId: "625358395361",
  appId: "1:625358395361:web:ee69f5f10849a2c87ae4a0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  getDocs,
  getCountFromServer,
  serverTimestamp
};