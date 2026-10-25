import { readBoundedFile } from './io.mjs';
import { fileURLToPath } from 'node:url';

// Bundle only fixed trusted package assets; no settings/project/argument paths.
export async function loadDashboardHtml() {
  const asset = (path, limit) => readBoundedFile(fileURLToPath(new URL(path, import.meta.url)), limit);
  const [html, rendering, impact, review, impactUi, appearanceCss, appearanceUi] = await Promise.all([
    asset('../ui/dashboard.html', 128 * 1024), asset('../ui/rendering.js', 64 * 1024),
    asset('./impact.mjs', 16 * 1024), asset('./impact-review.mjs', 16 * 1024),
    asset('../ui/impact-review.js', 16 * 1024),
    asset('../ui/appearance.css', 16 * 1024), asset('../ui/appearance.js', 16 * 1024),
  ]);
  // These exact installed modules are also used by the CLI. Strip their static
  // module declarations for the single offline script, never execute user code.
  const importLine = "import { assessCommandImpact } from './impact.mjs';";
  if (review.split(importLine).length !== 2) throw Error('Invalid packaged UI assets');
  const local = [impact, review.replace(importLine, ''), impactUi].join('\n').replace(/^export (?=(?:const|function) )/gm, '');
  const marker = '/* LOCAL_RENDERING */', cssMarker = '/* LOCAL_APPEARANCE_CSS */';
  if (html.split(marker).length !== 2 || html.split(cssMarker).length !== 2
    || /<\/style/i.test(appearanceCss) || /<\/script/i.test(rendering + local + appearanceUi)
    || /(?:^|\n)\s*(?:import|export)\s/.test(local)) throw Error('Invalid packaged UI assets');
  return html.replace(cssMarker, () => appearanceCss).replace(marker, () => rendering + '\n' + local + '\n' + appearanceUi);
}
