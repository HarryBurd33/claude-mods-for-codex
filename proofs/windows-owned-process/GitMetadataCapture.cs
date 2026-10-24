// Original MIT proof only. Fixed synthetic source metadata, same-helper private
// scratch composition. No Git discovery/parser/launch or production operation.
using System;
using System.IO;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using Microsoft.Win32.SafeHandles;

namespace CodexMods {
 public static partial class PrivateStorage {
  public sealed class GitMetadataCaptureProof : IDisposable {
   sealed class Source {public string Path;public SafeFileHandle Handle;public FileInfo Identity;public byte[] Bytes;}
   readonly List<IDisposable> held=new List<IDisposable>();
   readonly List<Source> sources=new List<Source>();
   readonly CancellationToken cancellation;GitMetadataScratchProof scratch;bool disposed;
   public string Path {get {if(disposed || scratch==null)throw Refuse();return scratch.Path;}}
   void Check(Stopwatch clock) {cancellation.ThrowIfCancellationRequested();if(disposed || clock.ElapsedMilliseconds>=5000)throw Refuse();}
   byte[] Read(Source source,Stopwatch clock) {
    long position;if(!SetFilePointerEx(source.Handle,0,out position,0) || position!=0)throw Refuse();
    byte[] bytes=new byte[(int)source.Identity.SizeLow],part=new byte[65536];int total=0;
    try {
     while(total<bytes.Length) {
      Check(clock);uint read;
      if(!ReadFile(source.Handle,part,(uint)Math.Min(part.Length,bytes.Length-total),out read,IntPtr.Zero) || read==0)throw Refuse();
      Array.Copy(part,0,bytes,total,(int)read);total+=(int)read;
     }
     Check(clock);uint extra;if(!ReadFile(source.Handle,part,1,out extra,IntPtr.Zero) || extra!=0)throw Refuse();
     return bytes;
    } catch {Array.Clear(bytes,0,bytes.Length);throw;}
    finally {Array.Clear(part,0,part.Length);}
   }
   Source Capture(string path,int maximum,Stopwatch clock) {
    Check(clock);held.Add(new Pins(path,false,false));
    var handle=CreateFileW(path,GenericRead|ReadControl|Attributes,1,IntPtr.Zero,3,OpenReparse,IntPtr.Zero);held.Add(handle);
    FileInfo info=Info(handle,path,false);CodeAccess(handle);
    if(info.SizeHigh!=0 || info.SizeLow>maximum)throw Refuse();
    var source=new Source{Path=path,Handle=handle,Identity=info};sources.Add(source);
    source.Bytes=Read(source,clock);
    if(!SameProjectInfo(info,Info(handle,path,false)))throw Refuse();return source;
   }
   void Verify(Stopwatch clock) {
    Check(clock);
    foreach(var source in sources) {
     Check(clock);CodeAccess(source.Handle);
     if(!SameProjectInfo(source.Identity,Info(source.Handle,source.Path,false)))throw Refuse();
     byte[] current=Read(source,clock);
     try {
      for(int i=0;i<current.Length;i++)if(current[i]!=source.Bytes[i])throw Refuse();
     } finally {Array.Clear(current,0,current.Length);}
     if(!SameProjectInfo(source.Identity,Info(source.Handle,source.Path,false)))throw Refuse();
    }
    Check(clock);
   }
   // Explicit selected root + booleans select exactly index and/or info/exclude.
   // A selected missing file refuses; omission asserts nothing about absence.
   // HEAD is already selected inert data, not discovered/parsed from this root.
   public GitMetadataCaptureProof(string selectedMetadata,string privateParent,string headCommit,bool index,bool exclude,CancellationToken token)
    : this(selectedMetadata,privateParent,headCommit,index,exclude,token,false) {}
   public GitMetadataCaptureProof(string selectedMetadata,string privateParent,string headCommit,bool index,bool exclude,CancellationToken token,bool projectSha1Index) {
    cancellation=token;var clock=Stopwatch.StartNew();Check(clock);
    PathInput(selectedMetadata);PathInput(privateParent);
    if(projectSha1Index && !index || Within(selectedMetadata,privateParent) || Within(privateParent,selectedMetadata)
     || headCommit!=null && !System.Text.RegularExpressions.Regex.IsMatch(headCommit,@"\A[a-f0-9]{40}\z"))throw Refuse();
    // Validate every fixed source path before any IO. No arbitrary relative name,
    // enumeration, optional missing-file probing or changes to source objects.
    string indexPath=System.IO.Path.Combine(selectedMetadata,"index");
    string excludePath=System.IO.Path.Combine(selectedMetadata,"info","exclude");
    PathInput(indexPath);PathInput(excludePath);
    try {
     held.Add(new Pins(System.IO.Path.Combine(selectedMetadata,".unused-metadata-proof"),false,false));
     Source capturedIndex=index?Capture(indexPath,33554432,clock):null;
     Source capturedExclude=exclude?Capture(excludePath,1048576,clock):null;
     Verify(clock);
     byte[] projected=null;
     try {
      if(projectSha1Index)projected=ProjectSha1IndexV2Proof(capturedIndex.Bytes,token);
      Check(clock);
      scratch=new GitMetadataScratchProof(privateParent,headCommit,projectSha1Index?projected:capturedIndex==null?null:capturedIndex.Bytes,capturedExclude==null?null:capturedExclude.Bytes,token);
     } finally {if(projected!=null)Array.Clear(projected,0,projected.Length);}
     // Sources stay pinned for the complete scratch lifetime. Bytes never cross
     // the public 32KiB/3MiB bridge, command line, environment or diagnostic output.
     Verify(clock);
    } catch {try {Dispose();}catch(IOException){}throw;}
   }
   public void Verify() {Verify(Stopwatch.StartNew());}
   public void Dispose() {
    if(disposed)return;disposed=true;
    try {if(scratch!=null)scratch.Dispose();}
    finally {
     for(int n=held.Count-1;n>=0;n--)held[n].Dispose();held.Clear();
     foreach(var source in sources)if(source.Bytes!=null)Array.Clear(source.Bytes,0,source.Bytes.Length);
    }
   }
  }
 }
}
