import { realpath, stat } from 'node:fs/promises';
import { isAbsolute, relative, sep } from 'node:path';

export const CAPTURE_NOTE = 'Hook scope follows the native session directory, not an individual shell call workdir. Start the session in the selected project; changing a tool workdir does not select a different logging scope. Retained counts do not establish producer health.';

async function directory(path) {
  if (typeof path !== 'string' || !isAbsolute(path) || path.length > 4096 || /\p{Cc}/u.test(path)) throw new Error('Scope paths must be absolute and bounded');
  const canonical = await realpath(path);
  if (!(await stat(canonical)).isDirectory()) throw new Error('Scope path must be a directory');
  return canonical;
}

// No probing of private sessions, state writes or argument-based attribution.
export async function resolveMetadataProject(sessionCwd, selectedProject) {
  const cwd = await directory(sessionCwd);
  const projectId = selectedProject === undefined ? cwd : await directory(selectedProject);
  const child = relative(projectId, cwd);
  return { projectId, matches: child !== '..' && !child.startsWith(`..${sep}`) && !isAbsolute(child) };
}

export async function checkMetadataScope(project, sessionCwd) {
  const { matches } = await resolveMetadataProject(sessionCwd, project);
  return { matches, boundary: 'native-session-directory', producerHealth: 'unknown',
    reason: matches ? 'The supplied session directory is within the selected project. This does not attest installation, trust or event delivery.' : 'The supplied session directory is outside the selected project; its metadata will not be recorded for that project.',
    guidance: CAPTURE_NOTE };
}
