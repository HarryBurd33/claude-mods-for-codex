import { scaffoldMod } from "./scaffold.mjs";
import { runComponentCli } from "./component-authoring.mjs";
import { runRetentionCli } from "./retention.mjs";
import { checkMetadataScope } from "./scope.mjs";
import { prepareRestorePlan,reviewRestorePlan,applyRestorePlan } from "./restore.mjs";
import { createImpactReview, MAX_IMPACT_REVIEW_BYTES } from './impact-review.mjs';
import { assessCommandImpact } from "./impact.mjs";
import { readSelectedUsage } from "./usage.mjs";
import { readSelectedObservations } from "./observations.mjs";
import { readdir } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.mjs";
import { dispatch } from "./dispatcher.mjs";
import { MAX_STDIN_BYTES } from "./constants.mjs";
import { parseJsonObject, readBoundedFile, readBoundedStream } from "./io.mjs";
import { listProjectFiles, inspectProjectChanges, inspectCheckpointChanges } from "./workspace.mjs";
import { readJournalEntries, summarizeJournal } from "./journal.mjs";

const PLUGIN_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_CONFIG = join(PLUGIN_ROOT, "config", "mods.json");
const MAX_FIXTURE_FILES = 128;
const MAX_FIXTURE_BYTES = 8 * 1024 * 1024;

export const HELP = `Claude Mods for Codex

Usage:
  codex-mods validate [--config PATH]
  codex-mods replay [--config PATH] (--event PATH | --fixtures DIRECTORY | --stdin)
  codex-mods scaffold --spec PATH --output NEW_ABSOLUTE_DIRECTORY
  codex-mods scaffold-component --spec PRIVATE_JSON --output NEW_ABSOLUTE_DIRECTORY
  codex-mods validate-component --bundle PRIVATE_DIRECTORY
  codex-mods component-plan --bundle PRIVATE_DIRECTORY [--intent PRIVATE_JSON]
  codex-mods replay-component --bundle PRIVATE_DIRECTORY [--intent PRIVATE_JSON]
  codex-mods scope --project PATH --session-cwd PATH
  codex-mods impact --stdin
  codex-mods impact-review --stdin
  codex-mods usage --export PRIVATE_JSONL
  codex-mods observations --export PRIVATE_JSONL
  codex-mods files --project PATH
  codex-mods changes --project PATH [--include-diffs]
  codex-mods checkpoints --project PATH --from COMMIT --to COMMIT [--path FILE] [--include-diffs]
  codex-mods restore-plan --project PATH --from COMMIT --to COMMIT --path FILE --output PRIVATE_NEW_FILE
  codex-mods restore-review --plan PRIVATE_FILE
  codex-mods restore-apply --plan PRIVATE_FILE --confirm-plan SHA256
  codex-mods report --data-dir PATH
  codex-mods retention-preview --settings PRIVATE_FILE --before UTC_TIMESTAMP
  codex-mods retention-cleanup --settings PRIVATE_FILE --before UTC_TIMESTAMP --confirm-preview SHA256
  codex-mods help

Commands:
  validate  Check the local mod configuration without running a hook.
  replay    Replay saved JSON envelopes offline and print restricted responses.
  scaffold  Generate disabled declarative configuration, access review and
            matching/nonmatching offline replay fixtures. Never executes them.
  scaffold-component  Create an inert observer/status/local-preview/native-agent bundle with review,
                      integrity marker and synthetic tests (new POSIX output only).
  validate-component  Verify private complete bundle data; hashes are not trust.
  component-plan      Print registration/storage/display fragments or native-profile review plan.
  replay-component    Test synthetic events/counts, local UI or static profile contracts; never execute or
                      install. Optional intent changes only activation booleans.
  scope     Check supplied native session/project capture boundary without logging.
            Windows requires the exact explicitly selected root string.
  impact    Explain fixed lexical signals in a stdin JSON command object;
            assessment only, never executes or approves the command.
  impact-review  Print bounded impact and explicit review/retry guidance from stdin;
                 no command echo, execution, policy edit or approval.
  usage     Read only reported counters from an explicit private exec export.
            No private-session discovery, model call, cost or context inference.
  observations  Summarize structured command/turn records in one selected private
                exec export. Read-only POSIX approximation, separate from hooks.
  files     List bounded non-secret project filenames and Git status, read-only.
  changes   Inspect Git working-tree changes against HEAD, read-only.
            Patch text requires --include-diffs and may contain sensitive data.
  checkpoints  Compare two explicitly selected full commit IDs, read-only.
               This does not attribute commits to an assistant turn or restore.
  restore-plan  Save both versions of one existing text file for explicit review.
                Selected project is unchanged; output must be private/outside it.
  restore-review  Recheck a private plan against its selected Git checkpoints.
  restore-apply  Explicit mutation: restore only the reviewed file after a fresh
                conflict check. Never call automatically from inspection.
  report    Summarize the opt-in metadata journal. Raw records are not printed.
  retention-preview  Read-only age/count/size preview for the exact reviewed scope.
  retention-cleanup  Explicit POSIX deletion of that unchanged eligible scope;
                     requires its preview fingerprint. No automatic cleanup.

The default config is config/mods.json in this plugin. Journaling is disabled by
default and report requires an explicit --data-dir path.`;

function parseOptions(args, allowed) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    if (!allowed.has(flag)) throw new Error(`unknown option: ${flag}`);
    if (["--stdin", "--include-diffs"].includes(flag)) {
      options[flag.slice(2).replaceAll("-", "_")] = true;
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
  if (["scaffold-component", "validate-component", "component-plan", "replay-component"].includes(command)) return runComponentCli(command, args, streams);
  if (command === "validate") {
    const options = parseOptions(args, new Set(["--config"]));
    const config = await loadConfig(options.config || DEFAULT_CONFIG);
    streams.stdout.write(`Configuration is valid (${config.mods.length} mods).\n`);
    return;
  }
  if (command === "replay") return replay(args, streams);
  if (command === "retention-preview" || command === "retention-cleanup") return runRetentionCli(command, args, streams);
  if (command === "scaffold") {
    const options = parseOptions(args, new Set(["--spec", "--output"]));
    if (!options.spec || !options.output) throw new Error("scaffold requires --spec and --output");
    const spec = parseJsonObject(await readBoundedFile(options.spec, 16384), "scaffold spec");
    streams.stdout.write(`${JSON.stringify(await scaffoldMod(spec, options.output), null, 2)}\n`);
    return;
  }
  if (command === "scope") {
    const options = parseOptions(args, new Set(["--project", "--session-cwd"]));
    if (!options.project || !options.session_cwd) throw new Error("scope requires --project and --session-cwd");
    streams.stdout.write(`${JSON.stringify(await checkMetadataScope(options.project, options.session_cwd), null, 2)}\n`);
    return;
  }
  if (command === "impact-review") {
    const options = parseOptions(args, new Set(["--stdin"]));
    if (!options.stdin) throw new Error("impact-review requires --stdin JSON with exactly a command field");
    const value = parseJsonObject(await readBoundedStream(streams.stdin, MAX_IMPACT_REVIEW_BYTES), "impact review input");
    streams.stdout.write(`${JSON.stringify(createImpactReview(value), null, 2)}\n`);
    return;
  }
  if (command === "impact") {
    const options=parseOptions(args,new Set(["--stdin"]));if(!options.stdin)throw new Error("impact requires --stdin JSON with exactly a command field");
    const value=parseJsonObject(await readBoundedStream(streams.stdin,MAX_STDIN_BYTES),"impact input");
    if(Object.keys(value).join()!=="command")throw new Error("impact input requires exactly a command field");
    streams.stdout.write(`${JSON.stringify(assessCommandImpact(value.command),null,2)}\n`);
    return;
  }
  if(command==="usage"){
    const options=parseOptions(args,new Set(["--export"]));if(!options.export)throw new Error("usage requires --export PRIVATE_JSONL");
    streams.stdout.write(`${JSON.stringify(await readSelectedUsage(options.export),null,2)}\n`);return;
  }
  if(command==="observations"){
    const options=parseOptions(args,new Set(["--export"]));if(!options.export)throw new Error("observations requires --export PRIVATE_JSONL");
    streams.stdout.write(`${JSON.stringify(await readSelectedObservations(options.export),null,2)}\n`);return;
  }
  if (command === "files" || command === "changes") {
    const options = parseOptions(args, new Set(["--project", ...(command === "changes" ? ["--include-diffs"] : [])]));
    if (options.project === undefined) throw new Error(`${command} requires --project PATH`);
    const result = command === "files" ? await listProjectFiles(options.project) : await inspectProjectChanges(options.project, {includeDiffs: options.include_diffs === true});
    streams.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  if (command === "checkpoints") {
    const options = parseOptions(args,new Set(["--project","--from","--to","--path","--include-diffs"]));
    if(!options.project||!options.from||!options.to)throw new Error("checkpoints requires --project, --from and --to");
    streams.stdout.write(`${JSON.stringify(await inspectCheckpointChanges(options.project,{fromCommit:options.from,toCommit:options.to,...(options.path!==undefined?{path:options.path}:{}),includeDiffs:options.include_diffs===true}),null,2)}\n`);
    return;
  }
  if (command === "restore-plan") {
    const options=parseOptions(args,new Set(["--project","--from","--to","--path","--output"]));
    if(!options.project||!options.from||!options.to||!options.path||!options.output)throw new Error("restore-plan requires --project, --from, --to, --path and --output");
    streams.stdout.write(`${JSON.stringify(await prepareRestorePlan(options.project,{fromCommit:options.from,toCommit:options.to,path:options.path},options.output),null,2)}\n`);
    return;
  }
  if (command === "restore-review" || command === "restore-apply") {
    const options=parseOptions(args,new Set(["--plan",...(command==="restore-apply"?["--confirm-plan"]:[])]));
    if(!options.plan||(command==="restore-apply"&&!options.confirm_plan))throw new Error("restore requires --plan and apply requires --confirm-plan");
    const result=command==="restore-review"?await reviewRestorePlan(options.plan):await applyRestorePlan(options.plan,options.confirm_plan);
    streams.stdout.write(`${JSON.stringify(result,null,2)}\n`);
    return;
  }
  if (command === "report") {
    const options = parseOptions(args, new Set(["--data-dir"]));
    if (options.data_dir === undefined) throw new Error("report requires --data-dir PATH");
    streams.stdout.write(`${JSON.stringify(summarizeJournal(await readJournalEntries(options.data_dir)), null, 2)}\n`);
    return;
  }
  throw new Error(`unknown command: ${command}`);
}
