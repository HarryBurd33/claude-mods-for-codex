import { readBoundedFile } from './io.mjs';
import { fileURLToPath } from 'node:url';
import { validateInteractionComponents } from './interaction-contract.mjs';

// Bundle only fixed trusted package assets; no settings/project/argument paths.
export async function loadDashboardHtml(definitions = []) {
  const interactions = validateInteractionComponents(definitions).filter(c => c.enabled);
  const asset = (path, limit) => readBoundedFile(fileURLToPath(new URL(path, import.meta.url)), limit);
  const [html, renderingModule, impact, review, impactUi, appearanceCss, appearanceUi, interactionContract, interactionModule] = await Promise.all([
    asset('../ui/dashboard.html', 128 * 1024), asset('../ui/rendering.js', 64 * 1024),
    asset('./impact.mjs', 16 * 1024), asset('./impact-review.mjs', 16 * 1024),
    asset('../ui/impact-review.js', 16 * 1024),
    asset('../ui/appearance.css', 16 * 1024), asset('../ui/appearance.js', 16 * 1024),
    asset('./interaction-contract.mjs', 16 * 1024), asset('../ui/interactions.js', 16 * 1024),
  ]);
  // These exact installed modules are also used by the CLI. Strip their static
  // module declarations for the single offline script, never execute user code.
  const importLine = "import { assessCommandImpact } from './impact.mjs';";
  if (review.split(importLine).length !== 2) throw Error('Invalid packaged UI assets');
  const renderExport = 'export { parseFlowchart, jsonTokens, renderLocalPreview };';
  if (renderingModule.split(renderExport).length !== 2) throw Error('Invalid packaged UI assets');
  const rendering = renderingModule.replace(renderExport, '');
  let interactionUi = interactionModule;
  for (const line of ["import { validateInteractionComponents } from '../src/interaction-contract.mjs';", "import { renderLocalPreview } from './rendering.js';"]) {
    if (interactionUi.split(line).length !== 2) throw Error('Invalid packaged UI assets');
    interactionUi = interactionUi.replace(line, '');
  }
  const local = [impact, review.replace(importLine, ''), impactUi, interactionContract, interactionUi].join('\n').replace(/^export (?=(?:const|function) )/gm, '');
  const marker = '/* LOCAL_RENDERING */', cssMarker = '/* LOCAL_APPEARANCE_CSS */', dataMarker = '/* LOCAL_INTERACTIONS_DATA */';
  if (html.split(marker).length !== 2 || html.split(cssMarker).length !== 2 || html.split(dataMarker).length !== 2
    || /<\/style/i.test(appearanceCss) || /<\/script/i.test(rendering + local + appearanceUi)
    || /(?:^|\n)\s*(?:import|export)\s/.test(local)) throw Error('Invalid packaged UI assets');
  // Configuration is data, never HTML/script. Escape before insertion even when
  // labels contain closing tags, ampersands or JS line separators.
  const data = JSON.stringify(interactions).replace(/[<>&\u2028\u2029]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
  return html.replace(cssMarker, () => appearanceCss).replace(dataMarker, () => data).replace(marker, () => rendering + '\n' + local + '\n' + appearanceUi);
}
