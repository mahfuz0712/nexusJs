import test from "node:test";
import assert from "node:assert/strict";
import { detectPackageManager } from "../src/installer.js";

test("detects pnpm from user agent", () => {
  const original = process.env.npm_config_user_agent;
  process.env.npm_config_user_agent = "pnpm/9.0.0 npm/? node/v20";
  assert.equal(detectPackageManager(), "pnpm");
  if (original === undefined) delete process.env.npm_config_user_agent;
  else process.env.npm_config_user_agent = original;
});
