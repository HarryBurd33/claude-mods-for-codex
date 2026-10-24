// Original MIT, isolated metadata/lifetime proof. Never code/data admission.
using System;
using System.IO;
using System.Collections.Generic;
using System.Security.AccessControl;
using Microsoft.Win32.SafeHandles;

namespace CodexMods {
 public static partial class PrivateStorage {
  // Private to this proof. No path, handle, descriptor or capability escapes.
  sealed class CodeAncestorLease : IDisposable {
   readonly List<SafeFileHandle> handles=new List<SafeFileHandle>();
   readonly List<string> paths=new List<string>();
   readonly List<FileInfo> identities=new List<FileInfo>();
   readonly List<byte[]> descriptors=new List<byte[]>();
   bool disposed;
   static byte[] Bytes(RawSecurityDescriptor sd) {
    if(sd.BinaryLength<20 || sd.BinaryLength>65536)throw Refuse();
    var bytes=new byte[sd.BinaryLength];sd.GetBinaryForm(bytes,0);return bytes;
   }
   static bool Equal(byte[] first,byte[] second) {
    if(first.Length!=second.Length)return false;
    for(int n=0;n<first.Length;n++)if(first[n]!=second[n])return false;
    return true;
   }
   static RawSecurityDescriptor Check(SafeFileHandle h,bool final) {
    if(!final)Access(h,false); // Original prefix policy, no Installer exception.
    var sd=Descriptor(h);
    if(final && AssessKnownCodeDescriptor(sd,true)!=CodeAncestorAssessment.MatchesDraftRule)throw Refuse();
    return sd;
   }
   // Caller supplies scope before construction: real SDK match, or separately
   // named synthetic fixture assumption with a private parent retained outside.
   public CodeAncestorLease(string candidate) {
    PathInput(candidate);
    try {
     string cursor=candidate.Substring(0,3);if(GetDriveTypeW(cursor)!=3)throw Refuse();
     string[] parts=candidate.Substring(3).Split('\\');
     for(int n=-1;n<parts.Length;n++) {
      if(n>=0)cursor=Path.Combine(cursor,parts[n]);
      var h=CreateFileW(cursor,ReadControl|Attributes|1,3,IntPtr.Zero,3,Backup|OpenReparse,IntPtr.Zero);
      handles.Add(h);var info=Info(h,cursor,true);if(n<0)Volume(h,candidate);
      var sd=Check(h,n==parts.Length-1);
      paths.Add(cursor);identities.Add(info);descriptors.Add(Bytes(sd));
     }
     Verify(); // Same retained handles; no assessment enum reused as authority.
    } catch {Dispose();throw;}
   }
   public void Verify() {
    if(disposed || handles.Count==0 || handles.Count!=paths.Count)throw Refuse();
    for(int n=0;n<handles.Count;n++) {
     var info=Info(handles[n],paths[n],true);var original=identities[n];
     if(info.Volume!=original.Volume || info.IndexHigh!=original.IndexHigh || info.IndexLow!=original.IndexLow)throw Refuse();
     var bytes=Bytes(Check(handles[n],n==handles.Count-1));
     try {if(!Equal(bytes,descriptors[n]))throw Refuse();}
     finally {Array.Clear(bytes,0,bytes.Length);}
    }
   }
   public void Dispose() {
    if(disposed)return;disposed=true;
    for(int n=handles.Count-1;n>=0;n--)handles[n].Dispose();handles.Clear();
    foreach(var bytes in descriptors)Array.Clear(bytes,0,bytes.Length);
    descriptors.Clear();paths.Clear();identities.Clear();
   }
  }
  static void AncestorLeaseHarness(string candidate,bool synthetic) {
   IDisposable parent=null;
   try {
    if(synthetic) {
     PathInput(candidate);
     // Explicit test assumption only, never usable as a known-folder witness.
     parent=new Pins(Path.GetDirectoryName(candidate),false,true);
    } else {
     var scope=KnownCodeAncestorScope(candidate);
     if(scope!=CodeAncestorAssessment.MatchesDraftRule){Console.WriteLine(scope);return;}
    }
    using(var lease=new CodeAncestorLease(candidate)) {
     Console.WriteLine("held");Console.Out.Flush();
     // One fixed control byte; no unbounded line or arbitrary callback. Parent
     // test process enforces its15s deadline and waits for exit before cleanup.
     int command=Console.In.Read();
     if(command=='v') {
      try {lease.Verify();Console.WriteLine("unchanged");}
      catch(IOException){Console.WriteLine("changed-or-refused");}
     } else Console.WriteLine(command=='c' || command<0?"cancelled":"control-refused");
     lease.Dispose();lease.Dispose();
     try {lease.Verify();throw new InvalidOperationException();}
     catch(IOException){Console.WriteLine("disposed-refused");}
    }
    Console.WriteLine("released");
   } catch(IOException){Console.WriteLine("refused");}
   finally {if(parent!=null)parent.Dispose();}
  }
  public static void KnownCodeAncestorLeaseHarnessProof(string candidate) {AncestorLeaseHarness(candidate,false);}
  public static void SyntheticCodeAncestorLeaseHarnessProof(string candidate) {AncestorLeaseHarness(candidate,true);}
 }
}
