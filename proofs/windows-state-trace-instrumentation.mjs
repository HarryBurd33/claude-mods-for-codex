// Pure copied-source transformation. No runtime or native-helper policy changes.
export function instrumentBridge(input) {
  let source=input.replace(/\r\n/g,'\n');
  const replacements=[
    ["stdio: ['pipe', 'pipe', 'ignore']", "stdio: ['pipe', 'pipe', 'pipe']"],
    ['    let chunks = [], bytes = 0, failed = false, done = false;',
      "    let chunks = [], bytes = 0, failed = false, done = false;\n    const traceStart=performance.now();let traceText='';"],
    ['    const child = helper.child;',
      "    const child = helper.child;\n    child.stderr.on('data',b=>{if(!done && traceText.length<4096)traceText+=b.toString('ascii').slice(0,4096-traceText.length);});"],
    ['      if (error) reject(failure()); else resolve(value);',
      "      traceFrames.push({op,ok:!error,elapsedMs:Math.round((performance.now()-traceStart)*100)/100,labels:traceText.match(/R[0-9]{3}|compile-CS[0-9]+-line-[0-9]+|kind-(?:IOException|UnauthorizedAccessException|ArgumentException|InvalidOperationException|other)/g)??[]});\n      if (error) reject(failure()); else resolve(value);"]
  ];
  for(const [needle] of replacements)if(source.split(needle).length!==2)throw Error('Bridge diagnostic shape');
  for(const [needle,replacement] of replacements)source=source.replace(needle,replacement);
  return 'const traceFrames=[];export function takeTraceFrames(){return traceFrames.splice(0);}\n'+source;
}
