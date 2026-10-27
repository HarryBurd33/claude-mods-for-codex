// Closed proof-only digest receipt. Never executable or private-data admission.
export const LINKED_LAYOUT='git-for-windows-ucrt64-v1';
export function linkedImageFamily(layout) {
  if(layout!==LINKED_LAYOUT)throw new Error('Linked inventory layout refused');
  return ['cmd/git.exe','ucrt64/bin/git.exe'];
}
export function linkedInventoryFrame(text) {
  if(typeof text!=='string'||Buffer.byteLength(text)>512)throw new Error('Linked inventory frame refused');
  const lines=text.trim().split(/\r?\n/);
  if(lines.length===1 && /^linked-inventory-refused\|(Input|Scope|Project|Ancestor|CodeDirectory|Image|Changed)$/.test(lines[0]))
    return {accepted:false,phase:lines[0].split('|')[1],executionAuthority:false};
  if(lines[0]!=='linked-inventory-held'||lines[1]!=='linked-inventory-released'||lines.length!==3) {
    if(lines.length===3 && lines[0]==='linked-inventory-held' && lines[2]==='linked-inventory-released'
      && /^linked-inventory-(cancelled|control-refused|changed-or-refused)$/.test(lines[1]))
      return {accepted:false,executionAuthority:false};
    throw new Error('Linked inventory frame refused');
  }
  const m=/^linked-inventory-sample\|([1-9][0-9]{0,7})\|([1-9][0-9]{0,9})\|([a-f0-9]{64})\|not-performed$/.exec(lines[2]);
  if(!m||Number(m[1])<64||Number(m[1])>33554432||Number(m[2])>4294967295)
    throw new Error('Linked inventory frame refused');
  return {accepted:true,bytes:Number(m[1]),links:Number(m[2]),sha256:m[3],pe:'not-performed',executionAuthority:false};
}
