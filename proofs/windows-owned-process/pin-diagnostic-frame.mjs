// Original MIT. Closed proof-only wire decoder. A repeat observation never
// changes the original refusal, even when it does not reproduce that refusal.
const roles = new Set(['Input','ProjectAncestor','CodeAncestor','CodeDirectory','Executable','Complete']);
const reasons = new Set(['PathPolicy','ScopePolicy','Missing','AccessDenied','Sharing','OpenOther',
  'ObjectPolicy','VolumePolicy','DescriptorPolicy','OwnerPolicy','AcePolicy',
  'ForeignInstallerGrant','ForeignMutationGrant','AccessUnclassified','NoRepeatRefusal','ProbeUnavailable']);
export function pinRefusal(frame) {
  if (typeof frame !== 'string' || frame.length > 120 || /[\r\n]/.test(frame)) throw new Error('Pin diagnosis frame refused');
  const [status, role, reason, segment, extra] = frame.split('|');
  if (status !== 'refused' || extra !== undefined || !roles.has(role) || !reasons.has(reason)
    || !/^(0|[1-9][0-9]{0,2})$/.test(segment ?? '') || Number(segment) > 120
    || ((role === 'Complete') !== (reason === 'NoRepeatRefusal')))
    throw new Error('Pin diagnosis frame refused');
  return { pin:'refused', dataRead:false, repeatProbe:{ role, reason, segment:Number(segment), authority:false } };
}
