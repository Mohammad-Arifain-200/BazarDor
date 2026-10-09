import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { randomBytes } from "node:crypto";
import { parseEnv } from "node:util";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const filename = resolve(root, ".env.local");
let source = existsSync(filename) ? readFileSync(filename, "utf8") : readFileSync(resolve(root, ".env.example"), "utf8");
const existing = parseEnv(source);
const defaults = {
  MONGODB_URI: "mongodb://127.0.0.1:27017/bazardor",
  MONGODB_DB: "bazardor",
  MONGODB_TRANSACTIONS: "false",
  BETTER_AUTH_URL: "http://localhost:3000",
  BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
};
let changes = 0;
for (const [key, fallback] of Object.entries(defaults)) {
  if (existing[key]?.trim()) continue;
  const pattern = new RegExp(`^${key}\\s*=.*$`, "m");
  const line = `${key}=${fallback}`;
  source = pattern.test(source) ? source.replace(pattern, () => line) : `${source.trimEnd()}\n${line}\n`;
  changes++;
}
if (changes || !existsSync(filename)) writeFileSync(filename, source, { mode: 0o600 });
console.log(changes ? "Local configuration prepared. Existing non-empty settings were preserved." : "Local configuration already exists; nothing changed.");
console.log("Start MongoDB (local service, your Atlas connection, or npm run db:start). Then run npm run check:db and npm run dev.");
console.log("For Google/GitHub sign-in, add your provider keys to .env.local. See README.md.");
