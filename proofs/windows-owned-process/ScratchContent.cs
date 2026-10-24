// Original MIT proof only. Never compiled into the production storage adapter.
// Flat, owner-created, bounded synthetic files; not a Git snapshot or a writer.
using System;
using System.IO;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;

namespace CodexMods {
 public static partial class PrivateStorage {
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool WriteFile(SafeFileHandle handle,byte[] bytes,uint count,out uint written,IntPtr overlapped);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool FlushFileBuffers(SafeFileHandle handle);

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
    PathInput(path);SafeFileHandle handle=null;
    try {
     using(var security=new Creation(false)) {
      IntPtr descriptor=Marshal.AllocHGlobal(Marshal.SizeOf(typeof(SecurityAttributes)));
      try {
       Marshal.StructureToPtr(security.Attributes,descriptor,false);
       // CREATE_NEW + private descriptor + DELETE_ON_CLOSE from creation.
       // This handle is not inheritable. Compatible readers must share DELETE
       // and WRITE (our retained handle holds write access); other writes fail.
       handle=CreateFileW(path,GenericRead|GenericWrite|ReadControl|0x10000,5,descriptor,1,OpenReparse|0x04000000,IntPtr.Zero);
      } finally {Marshal.FreeHGlobal(descriptor);}
     }
     Info(handle,path,false);Access(handle,true);
     uint written;
     if(!WriteFile(handle,content,(uint)content.Length,out written,IntPtr.Zero) || written!=(uint)content.Length || !FlushFileBuffers(handle))throw Refuse();
     Info(handle,path,false);Access(handle,true);
     files.Add(handle);handle=null;total+=content.Length;return path;
    } finally {if(handle!=null)handle.Dispose();}
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
