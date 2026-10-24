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
  // This composition freshly applies an explicit READ-INVENTORY policy while
  // handles are held; it never accepts an old assessment enum as authority.
  sealed class InstalledImageRead : IDisposable {
   Pins project;
   CodeAncestorLease ancestor;
   readonly List<SafeFileHandle> handles=new List<SafeFileHandle>();
   readonly List<string> paths=new List<string>();
   readonly List<FileInfo> identities=new List<FileInfo>();
   readonly List<byte[]> descriptors=new List<byte[]>();
   bool disposed;
   static byte[] Sample(SafeFileHandle h) {
    CodeAccess(h); // ORIGINAL strict code policy on every child and image.
    var sd=Descriptor(h);var bytes=new byte[sd.BinaryLength];sd.GetBinaryForm(bytes,0);return bytes;
   }
   public InstalledImageRead(string target,string codeRoot,string anchor,string selectedProject,ref ImageReadPhase phase) {
    try {
     phase=ImageReadPhase.Project;
     project=new Pins(Path.Combine(selectedProject,".unused-inventory-leaf"),false,false);
     phase=ImageReadPhase.Ancestor;
     ancestor=new CodeAncestorLease(anchor);
     string directory=Path.GetDirectoryName(target),cursor=codeRoot;
     phase=ImageReadPhase.CodeDirectory;
     while(true) {
      var h=CreateFileW(cursor,ReadControl|Attributes|1,3,IntPtr.Zero,3,Backup|OpenReparse,IntPtr.Zero);
      handles.Add(h);var info=Info(h,cursor,true);var bytes=Sample(h);
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
     var imageBytes=Sample(image);
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
     byte[] bytes=Sample(handles[n]);
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
  static void ImageReadHarness(string target,string codeRoot,string selectedProject,bool synthetic) {
   ImageReadPhase phase=ImageReadPhase.Input;IDisposable parent=null;
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
    using(var inventory=new InstalledImageRead(target,codeRoot,anchor,selectedProject,ref phase)) {
     Console.WriteLine("inventory-read-held");Console.Out.Flush();
     // Parent alone performs a bounded read/hash/static parse. Readiness is not
     // an execution permission, and it cannot be reused after this lifetime.
     int control=Console.In.Read();
     if(control=='v') {
      phase=ImageReadPhase.Changed;
      try {inventory.Verify();Console.WriteLine("inventory-read-unchanged");}
      catch(IOException){Console.WriteLine("inventory-read-changed-or-refused");}
     } else Console.WriteLine(control=='c' || control<0?"inventory-read-cancelled":"inventory-read-control-refused");
     inventory.Dispose();inventory.Dispose();
     try {inventory.Verify();throw new InvalidOperationException();}
     catch(IOException){Console.WriteLine("inventory-read-disposed-refused");}
    }
    Console.WriteLine("inventory-read-released");
   } catch(IOException){Console.WriteLine("inventory-read-refused|"+phase);}
   finally {if(parent!=null)parent.Dispose();}
  }
  public static void KnownInstalledImageReadHarnessProof(string target,string codeRoot,string selectedProject) {
   ImageReadHarness(target,codeRoot,selectedProject,false);
  }
  public static void SyntheticInstalledImageReadHarnessProof(string target,string codeRoot,string selectedProject) {
   ImageReadHarness(target,codeRoot,selectedProject,true);
  }
 }
}
