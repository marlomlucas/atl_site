import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

// Run the installed CLI directly, without relying on shell-specific env syntax.
const require = createRequire(import.meta.url);
const packagePath = require.resolve("astro/package.json");
const { bin } = JSON.parse(readFileSync(packagePath, "utf8"));
const cliPath = resolve(dirname(packagePath), bin.astro);

const child = spawn(process.execPath, [cliPath, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
});

child.once("error", (error) => {
  console.error(`Unable to start Astro: ${error.message}`);
  process.exitCode = 1;
});

child.once("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
