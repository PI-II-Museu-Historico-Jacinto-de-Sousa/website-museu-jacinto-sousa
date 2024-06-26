// ***********************************************************
// This example support/e2e.ts is Cypressed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import { connectAuthEmulator, getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import { attachCustomCommands } from "cypress-firebase";

const firebaseConfig = {
  apiKey: Cypress.env("VITE_FIREBASE_API_KEY"),
  authDomain: Cypress.env("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: Cypress.env("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: Cypress.env("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: Cypress.env("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: Cypress.env("VITE_FIREBASE_APP_ID"),
};
//inicializando app do firebase para os testes
firebase.initializeApp(firebaseConfig);
//utilizando emuladores
connectFirestoreEmulator(getFirestore(), "127.0.0.1", 8080);
connectAuthEmulator(getAuth(), "http://127.0.0.1:9099");
connectStorageEmulator(getStorage(), "127.0.0.1", 9199);
attachCustomCommands({ Cypress, cy, firebase });
