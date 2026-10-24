// Original MIT fixture-only composition. Object pins are NOT executable/DLL
// provenance; only the independently compiled fixed public fixture is tested.
using System;
using System.Collections.Generic;
using System.Threading;
using CodexMods.Proofs;

namespace CodexMods {
 public static partial class PrivateStorage {
  public static OwnedProcess.Result RunMetadataOperationProof(string codeRoot,string selectedMetadata,string privateParent,string kind,CancellationToken token) {
   token.ThrowIfCancellationRequested();
   if(kind!="complete" && kind!="stall" && kind!="exit" && kind!="before" && kind!="flood")throw Refuse();
   PathInput(codeRoot);PathInput(selectedMetadata);PathInput(privateParent);
   if(Within(codeRoot,selectedMetadata) || Within(selectedMetadata,codeRoot)
    || Within(codeRoot,privateParent) || Within(privateParent,codeRoot)
    || Within(selectedMetadata,privateParent) || Within(privateParent,selectedMetadata))throw Refuse();
   string executable=System.IO.Path.Combine(codeRoot,"owned-proof.exe");PathInput(executable);
   ProjectPath(selectedMetadata,"HEAD");PathInput(System.IO.Path.Combine(selectedMetadata,"index"));
   PathInput(System.IO.Path.Combine(selectedMetadata,"info","exclude"));
   foreach(string suffix in new string[]{".pid",".scratch",".ready"})PathInput(System.IO.Path.Combine(privateParent,"operation"+suffix));
   string systemRoot=Environment.GetEnvironmentVariable("SystemRoot");PathInput(systemRoot);
   // Parent-side preflight IO precedes the child deadline. This proof makes no
   // claim that these filesystem calls are interruptible by the child timer.
   using(var program=new ProgramPins(executable,codeRoot,selectedMetadata))
   using(var parent=new Pins(privateParent,false,true)) {
    var environment=new Dictionary<string,string>();environment.Add("SystemRoot",systemRoot);
    return OwnedProcess.Run(executable,new string[]{"child","metadata-operation",selectedMetadata,privateParent,kind},
     privateParent,environment,4000,4096,token);
   }
  }
 }
}
