import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCnwcGenDjR-778mBcxVxPttDUhlBgDrl0",
    authDomain: "products-pwa-8cf90.firebaseapp.com",
    projectId: "products-pwa-8cf90",
    storageBucket: "products-pwa-8cf90.appspot.com",
    messagingSenderId: "585456408123",
    appId: "1:585456408123:web:12c072b5848e5fd8f76e1e"
}

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export const productfav = collection(db, 'favorites');

export { firebaseApp, db };