#!/usr/bin/env node
import("../src/index.js").catch((error) => {
  console.error(error);
  process.exit(1);
});
