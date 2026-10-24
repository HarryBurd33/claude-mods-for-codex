// Installed fixed local renderer. User choices are ephemeral guidance, never authority.
function mountImpactReview(doc, source, result, assess, clear) {
  let generation = 0, disposed = false;
  function reset() { generation++; result.replaceChildren(); }
  function add(parent, tag, value) { const e = doc.createElement(tag); e.textContent = value; parent.append(e); return e; }
  source.oninput = reset;
  assess.onclick = () => {
    if (disposed) return;
    reset();
    let review;
    try { review = createImpactReview({ command: source.value }); }
    catch { add(result, 'p', 'Enter 1–4,096 characters to assess. Nothing was executed or approved.'); return; }
    const current = generation;
    add(result, 'h3', review.review === 'signals-found' ? 'Potential impact signals' : 'No known signals; safety is unknown');
    for (const match of review.matches) add(result, 'p', match.impact);
    add(result, 'p', review.limits);
    add(result, 'p', review.authority);
    add(result, 'h3', 'Choose a next step');
    const choices = add(result, 'div', ''); choices.setAttribute('class', 'row');
    const choice = add(result, 'p', 'No next step chosen.'); choice.setAttribute('role', 'status');
    for (const step of review.nextSteps) {
      const button = add(choices, 'button', step.label); button.setAttribute('type', 'button');
      button.onclick = () => {
        if (current !== generation) return;
        choice.textContent = `${step.label}: ${step.detail}`;
      };
    }
  };
  clear.onclick = () => { if (!disposed) { source.value = ''; reset(); } };
  return () => { disposed = true; source.value = ''; reset(); source.disabled = assess.disabled = clear.disabled = true; };
}
