import { defineConfig, devices } from "@playwright/test";

const externalUrl = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalUrl ?? "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./e2e",
  use: { channel: process.env.PLAYWRIGHT_CHANNEL ?? "chromium", baseURL, trace: "retain-on-failure" },
  projects: [
    { name: "escritorio", use: { ...devices["Desktop Chrome"] } },
    { name: "móvil", use: { ...devices["Pixel 7"] } },
  ],
  webServer: externalUrl ? undefined : {
    command: "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100",
    url: baseURL,
    timeout: 60000,
  },
});
