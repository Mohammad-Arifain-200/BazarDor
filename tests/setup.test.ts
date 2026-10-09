import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { parseEnv } from "node:util";

test("setup generates a secret once and preserves existing connection settings", () => {
  const root = mkdtempSync(join(tmpdir(), "bazardor-setup-"));
  try {
    mkdirSync(join(root, "scripts"));
    copyFileSync(new URL("../scripts/setup.mjs", import.meta.url), join(root, "scripts/setup.mjs"));
    writeFileSync(join(root, ".env.example"), "MONGODB_URI=mongodb://127.0.0.1:27017/bazardor\nBETTER_AUTH_SECRET=\n");
    const run = () => execFileSync(process.execPath, [join(root, "scripts/setup.mjs")], { encoding: "utf8" });
    const log = run(), first = readFileSync(join(root, ".env.local"), "utf8"), parsed = parseEnv(first);
    assert.equal(first.split("\n").filter(line => /^BETTER_AUTH_SECRET\s*=/.test(line)).length, 1);
    assert.equal(parsed.BETTER_AUTH_SECRET.length, 64); assert.ok(!log.includes(parsed.BETTER_AUTH_SECRET));
    run(); assert.equal(readFileSync(join(root, ".env.local"), "utf8"), first);
    const customized = first.replace("mongodb://127.0.0.1:27017/bazardor", "mongodb://database.example/bazardor");
    writeFileSync(join(root, ".env.local"), customized); run();
    assert.equal(readFileSync(join(root, ".env.local"), "utf8"), customized);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
