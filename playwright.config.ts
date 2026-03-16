import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm start",
    url: "http://localhost:8082",
    reuseExistingServer: true,
    timeout: 30000,
  },
  use: {
    baseURL: "http://localhost:8082",
  },
});
