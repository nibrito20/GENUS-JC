import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // coloque o front se quiser
    setupNodeEvents() {
      // node events
    },
  },
});
