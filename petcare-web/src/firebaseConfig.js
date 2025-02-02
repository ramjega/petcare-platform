import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCEgkgGAZV2Id5WSFW81Y2ilWh_uj2-7sA",
    authDomain: "petcare-cf68c.firebaseapp.com",
    projectId: "petcare-cf68c",
    storageBucket: "petcare-cf68c.firebasestorage.app",
    messagingSenderId: "142559380425",
    appId: "1:142559380425:web:a7ddbdbfe273ddc7465e18",
    measurementId: "G-LN3FSZDJSV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };