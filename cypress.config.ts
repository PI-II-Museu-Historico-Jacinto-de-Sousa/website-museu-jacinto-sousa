import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    specPattern: "**/*.test.{js,jsx,ts,tsx}", //padrao de nome dos testes
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/e2e/*.test.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:5173",
  },
});
