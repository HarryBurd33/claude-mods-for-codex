import { lstat, realpath } from 'node:fs/promises';
import { isAbsolute, resolve, dirname, relative, sep } from 'node:path';
import { readBoundedFile, parseJsonObject } from './io.mjs';
import { validateStatusComponents } from './component-contract.mjs';

// Paths are configuration, never tool parameters. This file can grant local
// reads and must therefore be reviewed outside the model's project contents.
export async function loadRuntimeSettings(path) {
  if (!path) return null;
  // Fail before any filesystem traversal: enabling private reads alone would
  // also expose unvalidated Windows project/Git and scratch-directory paths.
  if (process.platform === 'win32') throw new Error('Windows dashboard settings unavailable pending project/Git boundary validation; use explicit storage CLI commands');
  if (!isAbsolute(path)) throw new Error('Settings path must be absolute');
  const file = resolve(path);
  let cursor = file;
  while (true) {
    const info = await lstat(cursor);
    if (info.isSymbolicLink()) throw new Error('Settings path cannot contain links');
    if (cursor === file && (!info.isFile() || info.nlink !== 1)) throw new Error('Settings must be a regular unlinked file');
    if (cursor === file && process.platform !== 'win32' && ((info.mode & 0o077) || (process.getuid && info.uid !== process.getuid()))) throw new Error('Settings must be private');
    const parent = dirname(cursor); if (parent === cursor) break; cursor = parent;
  }
  const value = parseJsonObject(await readBoundedFile(file, 16384), 'settings');
  if (Object.keys(value).some(key => !['version','projectRoot','dataDirectory','stateScope','sessionId','allowChanges','checkpoints','usageExport','observationExport','statusComponents'].includes(key)) || value.version !== 1) throw new Error('Unsupported settings');
  for (const key of ['projectRoot','dataDirectory']) {
    if (typeof value[key] !== 'string' || !isAbsolute(value[key]) || value[key].length > 4096 || /\p{Cc}/u.test(value[key])) throw new Error('Settings paths must be absolute and bounded');
  }
  const projectRoot = await realpath(value.projectRoot);
  // A linked selected root is refused by workspace adapter; keep scope identity
  // canonical for matching native hook cwd while never displaying this raw path.
  if (resolve(value.projectRoot) !== projectRoot) throw new Error('Select the canonical project root');
  const settingsRelative = relative(projectRoot, file);
  if (settingsRelative === '' || (!isAbsolute(settingsRelative) && settingsRelative !== '..' && !settingsRelative.startsWith(`..${sep}`))) throw new Error('Keep reviewed runtime settings outside the selected project');
  if (!['session','project'].includes(value.stateScope ?? 'session')) throw new Error('Unsupported state scope');
  if (value.sessionId !== undefined && (typeof value.sessionId !== 'string' || !value.sessionId || value.sessionId.length > 4096 || /\p{Cc}/u.test(value.sessionId))) throw new Error('Invalid session scope');
  if (value.allowChanges !== undefined && typeof value.allowChanges !== 'boolean') throw new Error('Invalid changes opt-in');
  if(value.checkpoints!==undefined){
    const selected=value.checkpoints;
    if(!selected||typeof selected!=='object'||Array.isArray(selected)||Object.keys(selected).sort().join()!=='fromCommit,toCommit'||![selected.fromCommit,selected.toCommit].every(id=>typeof id==='string'&&/^[a-f0-9]{40}$/.test(id)))throw new Error('Select exactly two full lowercase commit IDs');
    Object.freeze(selected);
  }
  if(value.usageExport!==undefined){
    if(typeof value.usageExport!=='string'||!isAbsolute(value.usageExport)||value.usageExport.length>4096||/\p{Cc}/u.test(value.usageExport))throw new Error('Select an absolute bounded private usage export');
    const exportRelative=relative(projectRoot,resolve(value.usageExport));
    if(exportRelative===''||(!isAbsolute(exportRelative)&&exportRelative!=='..'&&!exportRelative.startsWith(`..${sep}`)))throw new Error('Keep the selected raw usage export outside the project');
  }
  if(value.observationExport!==undefined){
    if(typeof value.observationExport!=='string'||!isAbsolute(value.observationExport)||value.observationExport.length>4096||/\p{Cc}/u.test(value.observationExport))throw new Error('Select an absolute bounded private observation export');
    const exportRelative=relative(projectRoot,resolve(value.observationExport));
    if(exportRelative===''||(!isAbsolute(exportRelative)&&exportRelative!=='..'&&!exportRelative.startsWith(`..${sep}`)))throw new Error('Keep the selected raw observation export outside the project');
  }
  const statusComponents = validateStatusComponents(value.statusComponents);
  return Object.freeze({ ...value, statusComponents, projectRoot, dataDirectory: resolve(value.dataDirectory), stateScope: value.stateScope ?? 'session', allowChanges: value.allowChanges === true });
}
