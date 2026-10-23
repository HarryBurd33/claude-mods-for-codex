import { readdir } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.mjs";
import { dispatch } from "./dispatcher.mjs";
import { MAX_STDIN_BYTES } from "./constants.mjs";
import { parseJsonObject, readBoundedFile, readBoundedStream } from "./io.mjs";
import { readJournalEntries, summarizeJournal } from "./journal.mjs";

const PLUGIN_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_CONFIG = join(PLUGIN_ROOT, "config", "mods.json");
const MAX_FIXTURE_FILES = 128;
const MAX_FIXTURE_BYTES = 8 * 1024 * 1024;

export const HELP = `Claude Mods for Codex

Usage:
  codex-mods validate [--config PATH]
  codex-mods replay [--config PATH] (--event PATH | --fixtures DIRECTORY | --stdin)
  codex-mods report --data-dir PATH
  codex-mods help

Commands:
  validate  Check the local mod configuration without running a hook.
  replay    Replay saved JSON envelopes offline and print restricted responses.
  report    Summarize the opt-in metadata journal. Raw records are not printed.

The default config is config/mods.json in this plugin. Journaling is disabled by
default and report requires an explicit --data-dir path.`;

function parseOptions(args, allowed) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    if (!allowed.has(flag)) throw new Error(`unknown option: ${flag}`);
    if (flag === "--stdin") {
      options.stdin = true;
      continue;
    }
    const value = args[index + 1];
    if (typeof value !== "string" || value.startsWith("--")) throw new Error(`${flag} requires a value`);
    options[flag.slice(2).replaceAll("-", "_")] = value;
    index += 1;
  }
  return options;
}

async function eventFiles(directory) {
  const entries = await readdir(resolve(directory), { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && extname(entry.name) === ".json")
    .map((entry) => join(resolve(directory), entry.name))
    .sort((a, b) => a.localeCompare(b));
  if (files.length > MAX_FIXTURE_FILES) throw new Error("fixtures exceed the 128-file limit");
  return files;
}

async function replay(args, streams) {
  const options = parseOptions(args, new Set(["--config", "--event", "--fixtures", "--stdin"]));
  const sources = Number(options.event !== undefined) + Number(options.fixtures !== undefined) + Number(options.stdin === true);
  if (sources !== 1) throw new Error("replay requires exactly one of --event, --fixtures, or --stdin");
  const config = await loadConfig(options.config || DEFAULT_CONFIG);
  const events = [];
  if (options.stdin) {
    events.push({ name: "stdin", text: await readBoundedStream(streams.stdin, MAX_STDIN_BYTES) });
  } else {
    const files = options.event ? [resolve(options.event)] : await eventFiles(options.fixtures);
    let totalBytes = 0;
    for (const path of files) {
      const text = await readBoundedFile(path, MAX_STDIN_BYTES);
      totalBytes += Buffer.byteLength(text);
      if (totalBytes > MAX_FIXTURE_BYTES) throw new Error("fixtures exceed the 8 MiB aggregate limit");
      events.push({ name: basename(path), text });
    }
  }
  const results = events.map(({ name, text }) => {
    const { output, diagnostic } = dispatch(parseJsonObject(text, `event ${name}`), config);
    return { fixture: name, response: output, ...(diagnostic === null ? {} : { diagnostic }) };
  });
  streams.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
}

export async function runCli(argv, streams = process) {
  const [command = "help", ...args] = argv;
  if (command === "help" || command === "--help" || command === "-h") {
    streams.stdout.write(`${HELP}\n`);
    return;
  }
  if (command === "validate") {
    const options = parseOptions(args, new Set(["--config"]));
    const config = await loadConfig(options.config || DEFAULT_CONFIG);
    streams.stdout.write(`Configuration is valid (${config.mods.length} mods).\n`);
    return;
  }
  if (command === "replay") return replay(args, streams);
  if (command === "report") {
    const options = parseOptions(args, new Set(["--data-dir"]));
    if (options.data_dir === undefined) throw new Error("report requires --data-dir PATH");
    streams.stdout.write(`${JSON.stringify(summarizeJournal(await readJournalEntries(options.data_dir)), null, 2)}\n`);
    return;
  }
  throw new Error(`unknown command: ${command}`);
}
