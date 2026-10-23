// Fixed lexical signals only. No shell execution, path expansion, project scan,
// dynamic regex/configuration code, network, model call or command echo.
const signals = [
  ['delete', /(?:^|[\s;&|()])(?:rm|rmdir|del|rd|remove-item)(?:$|[\s;&|()])/i, 'Deletion may remove files or directories; recursive options can affect descendants.'],
  ['git-history', /(?:^|[\s;&|()])git\s+(?:reset|rebase|checkout|restore)(?:$|[\s;&|()])/i, 'Git operations may replace working files, alter the index or change history depending on options.'],
  ['git-clean', /(?:^|[\s;&|()])git\s+clean(?:$|[\s;&|()])/i, 'Git clean may remove untracked files; recovery may require a separate backup.'],
  ['permissions', /(?:^|[\s;&|()])(?:chmod|chown|icacls|set-acl)(?:$|[\s;&|()])/i, 'Permission or ownership changes may change who can read, write or execute selected content.'],
  ['remote-write', /(?:^|[\s;&|()])(?:git\s+push|scp|rsync)(?:$|[\s;&|()])/i, 'This may change a remote repository or transfer local data to another location.'],
  ['install-scripts', /(?:^|[\s;&|()])(?:npm|pnpm|yarn|pip|pip3)\s+(?:install|add|update|upgrade)(?:$|[\s;&|()])/i, 'Package operations may download code, run install scripts and change dependency files.'],
];
export const IMPACT_CATEGORIES=Object.freeze(signals.map(([id])=>id));
export function assessCommandImpact(command,categories=IMPACT_CATEGORIES){
  if(typeof command!=='string'||Buffer.byteLength(command)>1024*1024)throw new Error('Impact assessment requires a bounded command string');
  if(!Array.isArray(categories)||!categories.length||categories.length>IMPACT_CATEGORIES.length||categories.some(c=>!IMPACT_CATEGORIES.includes(c))||new Set(categories).size!==categories.length)throw new Error('Select known, unique impact categories');
  const matches=signals.filter(([id,pattern])=>categories.includes(id)&&pattern.test(command)).map(([category,,impact])=>({category,impact}));
  return{source:'fixed-lexical-signals',assessmentOnly:true,matches,targetScope:'unknown',
    limits:'No shell parsing or file counts. Quoting, aliases, wrappers, flags and help/dry-run text can cause misses or false positives. No matches does not mean safe.'};
}

export function impactDenial(assessment){
  const impacts=assessment.matches.slice(0,2).map(m=>m.impact).join(' ');
  return `Impact review: ${impacts} Targets and extent are unknown; lexical signals can be wrong. This covered call is denied, not held for approval. Review a safer operation or an explicit narrow policy decision, then retry through normal host permissions.`;
}
