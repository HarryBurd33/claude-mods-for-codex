import { readBoundedFile } from './io.mjs';
import { fileURLToPath } from 'node:url';

// Bundle two fixed trusted package assets into a single offline resource. Never
// resolve asset paths from runtime settings, project contents or tool arguments.
export async function loadDashboardHtml() {
  const [html, rendering] = await Promise.all([
    readBoundedFile(fileURLToPath(new URL('../ui/dashboard.html', import.meta.url)), 128 * 1024),
    readBoundedFile(fileURLToPath(new URL('../ui/rendering.js', import.meta.url)), 64 * 1024),
  ]);
  const marker = '/* LOCAL_RENDERING */';
  if (html.split(marker).length !== 2 || /<\/script/i.test(rendering)) throw Error('Invalid packaged UI assets');
  return html.replace(marker, () => rendering);
}
