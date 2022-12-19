import { defineConfig } from "cypress";

export default defineConfig({
  setupNodeEvents(on, config) {
    config.env = {
      ...process.env,
      ...config.env,
    };
    return config;
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
