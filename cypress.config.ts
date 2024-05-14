import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };
import { defineConfig } from "cypress";
import { plugin as cypressFirebasePlugin } from "cypress-firebase";
import dotenv from "dotenv";

//cypress não suporta import.meta
dotenv.config();

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    excludeSpecPattern: "**/*/integration_test",
    specPattern: "**/*.test.{js,jsx,ts,tsx}", //padrao de nome dos testes
  },

  e2e: {
    setupNodeEvents(on, config) {
      return cypressFirebasePlugin(on, config, admin, {
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount
        ),
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      });
    },
    specPattern: "cypress/e2e/*.test.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:5173",
  },
});
