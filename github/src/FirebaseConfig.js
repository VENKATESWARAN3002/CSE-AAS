import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB7d2oylP9wF9ObBUBZ987F5a-skGZFzxM",
    authDomain: "cse-aas-beta.firebaseapp.com",
    projectId: "cse-aas-beta",
    storageBucket: "cse-aas-beta.appspot.com",
    messagingSenderId: "834647267198",
    appId: "1:834647267198:web:de571358d671ce544c852f"
};
const app = initializeApp(firebaseConfig);

 

export {auth}