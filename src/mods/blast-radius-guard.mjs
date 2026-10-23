import { assessCommandImpact,impactDenial,IMPACT_CATEGORIES } from '../impact.mjs';

export const blastRadiusGuard={
  type:'blastRadiusGuard',inspectReplacement:true,allowedKeys:['categories'],
  validate(raw,context){
    const categories=context.cleanStringArray(raw.categories,`${context.where}.categories`,{maxItems:IMPACT_CATEGORIES.length,maxChars:32});
    if(new Set(categories).size!==categories.length||categories.some(c=>!IMPACT_CATEGORIES.includes(c)))context.fail('select known unique impact categories');
    return{categories};
  },
  handle(event,options){
    if(event.hook_event_name!=='PreToolUse'||event.tool_name!=='Bash'||typeof event.tool_input?.command!=='string')return{kind:'abstain'};
    const assessment=assessCommandImpact(event.tool_input.command,options.categories);
    return assessment.matches.length?{kind:'deny',reason:impactDenial(assessment)}:{kind:'abstain'};
  },
};
