// Original MIT, proof-only partial extension. Production compiles only the
// original PrivateStorage.cs, not this file. Reuses its audited no-follow handles
// and ACL parsing instead of introducing a second implementation of those checks.
using System;
using System.IO;
using System.Collections.Generic;
using System.Security.AccessControl;
using Microsoft.Win32.SafeHandles;

namespace CodexMods {
 public static partial class PrivateStorage {
  // This checks mutable executable objects/containing directories, NOT code
  // provenance, signatures, DLL dependency closure or all Git-specific behavior.
  static void CodeAccess(SafeFileHandle handle) {
   Access(handle,false);
   var descriptor=Descriptor(handle);
   foreach(GenericAce entry in descriptor.DiscretionaryAcl) {
    var ace=(CommonAce)entry; // Access already refuses unsupported ACE forms.
    const uint mutation=0x10000000|0x40000000|0x80000|0x40000|0x10000|0x100|0x10|0x4|0x2;
    if(ace.AceQualifier==AceQualifier.AccessAllowed && (ace.AceFlags&AceFlags.InheritOnly)==0
     && !Trusted(ace.SecurityIdentifier.Value) && (unchecked((uint)ace.AccessMask)&mutation)!=0)throw Refuse();
   }
  }
  static bool Within(string root,string target) {
   return String.Equals(root,target,StringComparison.OrdinalIgnoreCase) || target.StartsWith(root+"\\",StringComparison.OrdinalIgnoreCase);
  }
  public sealed class ProgramPins : IDisposable {
   readonly List<IDisposable> held=new List<IDisposable>();
   public ProgramPins(string executable,string codeRoot,string selectedProject) {
    PathInput(executable);PathInput(codeRoot);PathInput(selectedProject);
    // Authority is an explicit separately reviewed installation root. Nothing
    // from the selected project may become executable through this proof API.
    if(!executable.EndsWith(".exe",StringComparison.OrdinalIgnoreCase) || !Within(codeRoot,System.IO.Path.GetDirectoryName(executable))
     || Within(selectedProject,codeRoot) || Within(codeRoot,selectedProject))throw Refuse();
    try {
     // Pins(..., targetDirectory:false) checks/pins only ancestors, not the
     // final leaf. This synthetic unused leaf lets us verify the selected
     // project directory without requiring private-data ACLs or opening content.
     // In particular a project junction must not bypass the overlap check.
     held.Add(new Pins(System.IO.Path.Combine(selectedProject,".unused-proof-leaf"),false,false));
     held.Add(new Pins(executable,false,false));
     string directory=Path.GetDirectoryName(executable);
     // Validate each code-root directory, including intermediate dependency
     // locations along this path, against foreign create/write/ACL mutation.
     string cursor=codeRoot;
     while(true) {
      var h=CreateFileW(cursor,ReadControl|Attributes|1,3,IntPtr.Zero,3,Backup|OpenReparse,IntPtr.Zero);
      held.Add(h);Info(h,cursor,true);CodeAccess(h);
      if(String.Equals(cursor,directory,StringComparison.OrdinalIgnoreCase))break;
      string remaining=directory.Substring(cursor.Length+1);int slash=remaining.IndexOf('\\');
      cursor=Path.Combine(cursor,slash<0?remaining:remaining.Substring(0,slash));
     }
     var file=CreateFileW(executable,GenericRead|ReadControl,1,IntPtr.Zero,3,OpenReparse,IntPtr.Zero);
     held.Add(file);Info(file,executable,false);CodeAccess(file);
    } catch { Dispose();throw; }
   }
   public void Dispose() {for(int n=held.Count-1;n>=0;n--)held[n].Dispose();held.Clear();}
  }
  public sealed class ScratchProof : IDisposable {
   readonly string path; Pins root;
   public string Path {get {return path;}}
   public ScratchProof(string parent) {
    PathInput(parent);
    using(var pins=new Pins(parent,false,true)) {
     path=System.IO.Path.Combine(parent,"owned-"+Guid.NewGuid().ToString("N"));PathInput(path);
     // Creation, descriptor verification and pin occur before any use. The
     // pre-existing selected parent must already be current-user private.
     CreateDirectoryPrivate(path);root=new Pins(path,false,true);
    }
   }
   public void Dispose() {
    if(root==null)return;
    // Proof writes no content. Refuse to delete unexpected entries recursively;
    // a future Git scratch requires a separate exact-owned-file cleanup design.
    root.Dispose();root=null;System.IO.Directory.Delete(path,false);
   }
  }
 }
}
