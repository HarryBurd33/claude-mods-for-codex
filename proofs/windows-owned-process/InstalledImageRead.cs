// Original MIT. Proof-only read inventory, never executable/private-data authority.
// Production compiles none of these partials. No image loading or process launch.
using System;
using System.IO;
using System.Collections.Generic;
using System.Security.AccessControl;
using Microsoft.Win32.SafeHandles;

namespace CodexMods {
 public static partial class PrivateStorage {
  enum ImageReadPhase { Input, Scope, Project, Ancestor, CodeDirectory, Image, Changed }
  enum ImageReadProfile { StrictCode, InstallerInventory }
  sealed class InstallerInventoryRefusal : IOException {
   public readonly CodeAncestorAssessment Assessment;
   public InstallerInventoryRefusal(CodeAncestorAssessment assessment) {Assessment=assessment;}
  }
  // This composition freshly applies an explicit READ-INVENTORY policy while
  // handles are held; it never accepts an old assessment enum as authority.
  sealed class InstalledImageRead : IDisposable {
   Pins project;
   CodeAncestorLease ancestor;
   readonly List<SafeFileHandle> handles=new List<SafeFileHandle>();
   readonly List<string> paths=new List<string>();
   readonly List<FileInfo> identities=new List<FileInfo>();
   readonly List<byte[]> descriptors=new List<byte[]>();
   readonly ImageReadProfile profile;
   bool disposed;
   static byte[] Sample(SafeFileHandle h,ImageReadProfile profile) {
    if(profile==ImageReadProfile.StrictCode)CodeAccess(h); // Original policy unchanged.
    var sd=Descriptor(h);
    // Explicit READ-ONLY profile, freshly evaluated on EACH validated scoped
    // object. Not inherited authority and never used by CodeAccess/ProgramPins.
    if(profile==ImageReadProfile.InstallerInventory) {
     var assessment=AssessKnownCodeDescriptor(sd,true);
     if(assessment!=CodeAncestorAssessment.MatchesDraftRule)throw new InstallerInventoryRefusal(assessment);
    }
    var bytes=new byte[sd.BinaryLength];sd.GetBinaryForm(bytes,0);return bytes;
   }
   static byte[] CaptureSample(SafeFileHandle h,int segment,ImageReadProfile profile,ref string observation) {
    try {return Sample(h,profile);}
    catch(InstallerInventoryRefusal refusal) {
     observation="installer-read-assessment|"+refusal.Assessment;throw;
    }
    catch(IOException) {
     // NEW descriptor observation after refusal, not an atomic cause or authority.
     if(profile==ImageReadProfile.StrictCode)observation="inventory-read-repeat|"+segment.ToString(System.Globalization.CultureInfo.InvariantCulture)+"|"+ProbeAccessDetail(h,true);
     throw;
    }
   }
   public InstalledImageRead(string target,string codeRoot,string anchor,string selectedProject,ImageReadProfile profile,ref ImageReadPhase phase,ref string observation) {
    this.profile=profile;
    try {
     phase=ImageReadPhase.Project;
     project=new Pins(Path.Combine(selectedProject,".unused-inventory-leaf"),false,false);
     phase=ImageReadPhase.Ancestor;
     ancestor=new CodeAncestorLease(anchor);
     string directory=Path.GetDirectoryName(target),cursor=codeRoot;
     phase=ImageReadPhase.CodeDirectory;
     while(true) {
      var h=CreateFileW(cursor,ReadControl|Attributes|1,3,IntPtr.Zero,3,Backup|OpenReparse,IntPtr.Zero);
      handles.Add(h);var info=Info(h,cursor,true);var bytes=CaptureSample(h,paths.Count,profile,ref observation);
      paths.Add(cursor);identities.Add(info);descriptors.Add(bytes);
      if(String.Equals(cursor,directory,StringComparison.OrdinalIgnoreCase))break;
      string remaining=directory.Substring(cursor.Length+1);int slash=remaining.IndexOf('\\');
      cursor=Path.Combine(cursor,slash<0?remaining:remaining.Substring(0,slash));
     }
     phase=ImageReadPhase.Image;
     var image=CreateFileW(target,GenericRead|ReadControl,1,IntPtr.Zero,3,OpenReparse,IntPtr.Zero);
     handles.Add(image);var imageInfo=Info(image,target,false);
     long size=((long)imageInfo.SizeHigh<<32)|imageInfo.SizeLow;
     if(size<64 || size>32*1024*1024)throw Refuse();
     var imageBytes=CaptureSample(image,0,profile,ref observation);
     paths.Add(target);identities.Add(imageInfo);descriptors.Add(imageBytes);
     Verify();
    } catch {Dispose();throw;}
   }
   public void Verify() {
    if(disposed || ancestor==null || handles.Count==0 || handles.Count!=paths.Count)throw Refuse();
    ancestor.Verify();
    for(int n=0;n<handles.Count;n++) {
     bool directory=n<handles.Count-1;var info=Info(handles[n],paths[n],directory);var before=identities[n];
     if(info.Volume!=before.Volume || info.IndexHigh!=before.IndexHigh || info.IndexLow!=before.IndexLow
      || !directory && (info.SizeHigh!=before.SizeHigh || info.SizeLow!=before.SizeLow || info.WriteHigh!=before.WriteHigh || info.WriteLow!=before.WriteLow))throw Refuse();
     byte[] bytes=Sample(handles[n],profile);
     try {
      var old=descriptors[n];if(bytes.Length!=old.Length)throw Refuse();
      for(int i=0;i<bytes.Length;i++)if(bytes[i]!=old[i])throw Refuse();
     } finally {Array.Clear(bytes,0,bytes.Length);}
    }
   }
   public void Dispose() {
    if(disposed)return;disposed=true;
    for(int n=handles.Count-1;n>=0;n--)handles[n].Dispose();handles.Clear();
    foreach(var bytes in descriptors)Array.Clear(bytes,0,bytes.Length);
    paths.Clear();identities.Clear();descriptors.Clear();
    if(ancestor!=null){ancestor.Dispose();ancestor=null;}
    if(project!=null){project.Dispose();project=null;}
   }
  }
  static void ImageReadInputs(string target,string codeRoot,string selectedProject) {
   PathInput(target);PathInput(codeRoot);PathInput(selectedProject);
   if(!target.EndsWith(".exe",StringComparison.OrdinalIgnoreCase)
    || !Within(codeRoot,Path.GetDirectoryName(target))
    || Within(selectedProject,codeRoot) || Within(codeRoot,selectedProject)
    || target.Substring(3).Split('\\').Length>32)throw Refuse();
  }
  static void ImageReadHarness(string target,string codeRoot,string selectedProject,bool synthetic,ImageReadProfile profile) {
   ImageReadPhase phase=ImageReadPhase.Input;IDisposable parent=null;string observation=null;
   string prefix=profile==ImageReadProfile.StrictCode?"inventory-read":"installer-read";
   try {
    ImageReadInputs(target,codeRoot,selectedProject);
    string anchor=Path.GetDirectoryName(codeRoot);
    phase=ImageReadPhase.Scope;
    if(!String.Equals(Path.GetFileName(codeRoot),"Git",StringComparison.OrdinalIgnoreCase))throw Refuse();
    if(synthetic) {
     // Separately named owned-fixture assumption, never an OS-known-folder proof.
     if(!String.Equals(target,Path.Combine(codeRoot,"original.exe"),StringComparison.OrdinalIgnoreCase))throw Refuse();
     parent=new Pins(Path.GetDirectoryName(anchor),false,true);
    } else {
     // SDK lookup precedes anchor/target filesystem IO. Exact named installation
     // and two fixed image candidates only; no recursive discovery or PATH search.
     if(KnownCodeAncestorScope(anchor)!=CodeAncestorAssessment.MatchesDraftRule
      || !String.Equals(target,Path.Combine(codeRoot,"cmd","git.exe"),StringComparison.OrdinalIgnoreCase)
       && !String.Equals(target,Path.Combine(codeRoot,"mingw64","bin","git.exe"),StringComparison.OrdinalIgnoreCase))throw Refuse();
    }
    using(var inventory=new InstalledImageRead(target,codeRoot,anchor,selectedProject,profile,ref phase,ref observation)) {
     Console.WriteLine(prefix+"-held");Console.Out.Flush();
     // Parent alone performs a bounded read/hash/static parse. Readiness is not
     // an execution permission, and it cannot be reused after this lifetime.
     int control=Console.In.Read();
     if(control=='v') {
      phase=ImageReadPhase.Changed;
      try {inventory.Verify();Console.WriteLine(prefix+"-unchanged");}
      catch(IOException){Console.WriteLine(prefix+"-changed-or-refused");}
     } else Console.WriteLine(control=='c' || control<0?prefix+"-cancelled":prefix+"-control-refused");
     inventory.Dispose();inventory.Dispose();
     try {inventory.Verify();throw new InvalidOperationException();}
     catch(IOException){Console.WriteLine(prefix+"-disposed-refused");}
    }
    Console.WriteLine(prefix+"-released");
   } catch(IOException){Console.WriteLine(prefix+"-refused|"+phase);if(observation!=null)Console.WriteLine(observation);}
   finally {if(parent!=null)parent.Dispose();}
  }
  public static void KnownInstalledImageReadHarnessProof(string target,string codeRoot,string selectedProject) {
   ImageReadHarness(target,codeRoot,selectedProject,false,ImageReadProfile.StrictCode);
  }
  public static void SyntheticInstalledImageReadHarnessProof(string target,string codeRoot,string selectedProject) {
   ImageReadHarness(target,codeRoot,selectedProject,true,ImageReadProfile.StrictCode);
  }
  public static void KnownInstallerInventoryHarnessProof(string target,string codeRoot,string selectedProject) {
   ImageReadHarness(target,codeRoot,selectedProject,false,ImageReadProfile.InstallerInventory);
  }
  public static void SyntheticInstallerInventoryHarnessProof(string target,string codeRoot,string selectedProject) {
   ImageReadHarness(target,codeRoot,selectedProject,true,ImageReadProfile.InstallerInventory);
  }
 }
}
