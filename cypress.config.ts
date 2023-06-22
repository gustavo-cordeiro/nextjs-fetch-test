import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'https://nextjs-fetch-test.vercel.app',
    env: {
      dev_token: 'naobeE9zc_lZTKI8JtuBJdGmRVUNTY19mu8MVhhSyZI',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
