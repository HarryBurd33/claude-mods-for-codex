// Original local callback. Only a fixed ID reaches our own root attribute.
// No host variables, arbitrary CSS, storage, tool/prompt/network/model calls.
function mountAppearance(doc, select, reset, status) {
  let disposed = false;
  const labels = new Map([['quiet-dark', 'Quiet dark'], ['quiet-light', 'Quiet light']]);
  function apply(value) {
    if (disposed) return;
    const chosen = typeof value === 'string' && labels.has(value) ? value : 'host';
    if (chosen === 'host') doc.documentElement.removeAttribute('data-mods-appearance');
    else doc.documentElement.setAttribute('data-mods-appearance', chosen);
    select.value = chosen;
    status.textContent = chosen === 'host'
      ? 'Following host colors. Only this panel; a new view starts here. No preference is saved.'
      : `${labels.get(chosen)} for this panel only. Host and CLI settings are unchanged. Forced colors take precedence.`;
  }
  select.onchange = () => apply(select.value);
  reset.onclick = () => apply('host');
  apply('host');
  return () => {
    apply('host'); disposed = true; select.disabled = reset.disabled = true;
  };
}
