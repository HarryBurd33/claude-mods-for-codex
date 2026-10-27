// Original MIT proof only. Never compiled into the production storage adapter.
// Flat, owner-created, bounded synthetic files; not a Git snapshot or a writer.
using System;
using System.IO;
using System.Diagnostics;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;

namespace CodexMods {
 public static partial class PrivateStorage {
  static Stopwatch metadataTraceClock;static int metadataTraceFrames;
  public static void BeginMetadataTraceProof() {metadataTraceClock=Stopwatch.StartNew();metadataTraceFrames=0;}
  static void MetadataMarkProof(string phase,string state) {
   if(metadataTraceClock==null || metadataTraceFrames>=128)return;
   switch(phase) {
    case "acquire":case "read":case "verify":case "scratch-root":case "directory-objects":case "directory-refs":case "directory-info":
    case "config":case "head":case "index":case "exclude":case "write":case "flush":case "final-check":case "dispose":break;
    default:throw Refuse();
   }
   if(state!="start" && state!="end")throw Refuse();
   if(metadataTraceFrames==127){phase="truncated";state="end";}
   metadataTraceFrames++;
   Console.Error.WriteLine("metadata-stage|"+phase+"|"+state+"|"+metadataTraceClock.ElapsedMilliseconds.ToString(System.Globalization.CultureInfo.InvariantCulture));
  }
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool WriteFile(SafeFileHandle handle,byte[] bytes,uint count,out uint written,IntPtr overlapped);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool FlushFileBuffers(SafeFileHandle handle);

  // Shared proof-only creation primitive. Every caller selects a closed set of
  // names and tighter type-specific bounds before IO; this is not a public API.
  static SafeFileHandle CreateScratchFileProof(string path,byte[] content) {
   PathInput(path);if(content==null || content.Length>33554432)throw Refuse();SafeFileHandle handle=null;
   try {
    using(var security=new Creation(false)) {
     IntPtr descriptor=Marshal.AllocHGlobal(Marshal.SizeOf(typeof(SecurityAttributes)));
     try {
      Marshal.StructureToPtr(security.Attributes,descriptor,false);
      // CREATE_NEW + private descriptor + DELETE_ON_CLOSE from creation.
      // Noninherited handle; compatible readers share WRITE and DELETE.
      handle=CreateFileW(path,GenericRead|GenericWrite|ReadControl|0x10000,5,descriptor,1,OpenReparse|0x04000000,IntPtr.Zero);
     } finally {Marshal.FreeHGlobal(descriptor);}
    }
    Info(handle,path,false);Access(handle,true);uint written;
    MetadataMarkProof("write","start");
    if(!WriteFile(handle,content,(uint)content.Length,out written,IntPtr.Zero) || written!=(uint)content.Length)throw Refuse();
    MetadataMarkProof("write","end");MetadataMarkProof("flush","start");
    if(!FlushFileBuffers(handle))throw Refuse();
    MetadataMarkProof("flush","end");
    Info(handle,path,false);Access(handle,true);
    var result=handle;handle=null;return result;
   } finally {if(handle!=null)handle.Dispose();}
  }

  public sealed class ScratchContentProof : IDisposable {
   readonly ScratchProof directory;
   readonly List<SafeFileHandle> files=new List<SafeFileHandle>();
   int total;bool disposed;
   public string Path {get {return directory.Path;}}
   public ScratchContentProof(string parent) {directory=new ScratchProof(parent);}
   // No caller-supplied names, adoption, enumeration, reopens or path deletion.
   // A pre-existing slot is refused, even if it has a seemingly acceptable ACL.
   public string Add(byte[] content) {
    if(disposed || content==null || content.Length>262144 || files.Count>=16 || content.Length>1048576-total)throw Refuse();
    string path=System.IO.Path.Combine(Path,"slot-"+files.Count.ToString("D4",System.Globalization.CultureInfo.InvariantCulture)+".bin");
    var handle=CreateScratchFileProof(path,content);
    try {files.Add(handle);handle=null;total+=content.Length;return path;}
    finally {if(handle!=null)handle.Dispose();}
   }
   public void Dispose() {
    if(disposed)return;disposed=true;
    // Close only handles we created. Windows disposes those exact file objects.
    // Unrecognized entries/readers may keep the root nonempty: refuse root
    // removal, never recursively clean it or adopt it in a later invocation.
    try {for(int i=files.Count-1;i>=0;i--)files[i].Dispose();files.Clear();}
    finally {directory.Dispose();}
   }
  }
  // Independent synthetic reader uses the existing ACL/no-follow/size checks.
  // The proof flag requires read/write/delete sharing; production reads stay as-is.
  public static bool ScratchReadProof(string path) {
   using(var pins=new Pins(path,false,false)) {
    byte[] bytes=ReadFile(path,262144,false,7);
    return System.Text.Encoding.UTF8.GetString(bytes)=="synthetic-private-content";
   }
  }
 }
}
