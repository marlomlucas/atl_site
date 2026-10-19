import { existsSync } from "node:fs";
import { join } from "node:path";
import { chromium, defineConfig, devices } from "@playwright/test";

const systemBrowsers =
  process.platform === "win32"
    ? [
        join(
          process.env.ProgramFiles || "C:\\Program Files",
          "Google/Chrome/Application/chrome.exe",
        ),
        join(
          process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)",
          "Microsoft/Edge/Application/msedge.exe",
        ),
        join(
          process.env.ProgramFiles || "C:\\Program Files",
          "Microsoft/Edge/Application/msedge.exe",
        ),
        ...(process.env.LOCALAPPDATA
          ? [
              join(
                process.env.LOCALAPPDATA,
                "Google/Chrome/Application/chrome.exe",
              ),
            ]
          : []),
      ]
    : process.platform === "darwin"
      ? ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]
      : [
          "/usr/bin/chromium",
          "/usr/bin/chromium-browser",
          "/usr/bin/google-chrome",
        ];

// Prefer the managed browser; use an installed browser when it is unavailable.
const chromiumExecutable =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  [chromium.executablePath(), ...systemBrowsers].find((path) =>
    existsSync(path),
  );

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    viewport: { width: 1440, height: 1000 },
    baseURL: "http://127.0.0.1:4321",
    locale: "pt-BR",
    reducedMotion: "reduce",
    launchOptions: { executablePath: chromiumExecutable },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --port 4321",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
    env: { ASTRO_TELEMETRY_DISABLED: "1" },
    timeout: 30_000,
  },
});
