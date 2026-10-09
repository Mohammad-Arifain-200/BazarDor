import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
const local = existsSync(".env.local") ? parseEnv(readFileSync(".env.local", "utf8")) : {};
const env = { ...local, ...process.env };
let errors = 0;
for (const key of ["MONGODB_URI", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL"]) {
  if (!env[key]) { console.error(`${key}: missing`); errors++; } else console.log(`${key}: set`);
}
if (env.BETTER_AUTH_SECRET && env.BETTER_AUTH_SECRET.length < 32) { console.error("BETTER_AUTH_SECRET: must be at least 32 characters"); errors++; }
if (env.BETTER_AUTH_URL) { try { const url = new URL(env.BETTER_AUTH_URL); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); } catch { console.error("BETTER_AUTH_URL: invalid URL"); errors++; } }
for (const provider of ["GOOGLE", "GITHUB"]) {
  const id = Boolean(env[`${provider}_CLIENT_ID`]), secret = Boolean(env[`${provider}_CLIENT_SECRET`]);
  console.log(`${provider} OAuth: ${id && secret ? "configured" : "not configured"}`);
  if (id !== secret) { console.error(`${provider}: set both client ID and secret`); errors++; }
}
process.exitCode = errors ? 1 : 0;
