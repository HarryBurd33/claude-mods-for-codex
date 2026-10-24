// Fixed review guidance only. No execution, approval, policy write or stored decision.
import { assessCommandImpact } from './impact.mjs';

export const MAX_IMPACT_REVIEW_CHARS = 4096;
export const MAX_IMPACT_REVIEW_BYTES = 32 * 1024;

export function createImpactReview(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || ![Object.prototype, null].includes(Object.getPrototypeOf(value))
    || Reflect.ownKeys(value).length !== 1) throw new Error('Impact review requires only a bounded command field');
  const field = Object.getOwnPropertyDescriptor(value, 'command');
  if (!field || !Object.hasOwn(field, 'value') || typeof field.value !== 'string'
    || !field.value.trim() || field.value.length > MAX_IMPACT_REVIEW_CHARS) throw new Error('Impact review requires only a bounded command field');
  const assessment = assessCommandImpact(field.value);
  return {
    ...assessment,
    review: assessment.matches.length ? 'signals-found' : 'no-known-signals',
    execution: 'not-executed',
    authority: 'Assessment only. No pending call is held or approved; no policy is changed. Any new request uses normal host permissions.',
    nextSteps: [
      { id: 'stop', label: 'Stop here', detail: 'Do not retry the operation. This choice neither cancels a running tool nor changes a guard.' },
      { id: 'revise', label: 'Revise request', detail: 'Describe a safer, narrower operation in the chat. Review it again; no matching signal is not proof of safety. This view sends no prompt or tool request.' },
      { id: 'policy', label: 'Review policy separately', detail: 'If the signal is a false positive, ask for a separate narrow configuration review. Do not rerun unchanged, disable the guard automatically, or treat this choice as permission. No policy edit or execution occurs here.' },
    ],
    privacy: 'The command is assessed in memory and omitted from this result. Do not paste credentials. CLI stdin and the host webview have their own visibility; this is not a secret store.',
  };
}
