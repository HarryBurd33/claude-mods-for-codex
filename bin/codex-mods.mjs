#!/usr/bin/env node
import process from "node:process";
import { runCli } from "../src/cli.mjs";

runCli(process.argv.slice(2)).catch((error) => {
  process.stderr.write(`codex-mods: ${error.message}\n`);
  process.exitCode = 1;
});
