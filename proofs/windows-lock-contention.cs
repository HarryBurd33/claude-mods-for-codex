// Original MIT test-only partial. Compile with the unchanged production helper.
// Own disposable roots only; no production telemetry, new retry or ACL repair.
using System;
using System.IO;
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;

namespace CodexMods {
 public static partial class PrivateStorage {
  public static int LockProofStage=0;
  public static int LockProofCreateError=-1;
  static void LockProofRequire(bool value) {
   if(!value)throw new InvalidOperationException("Lock proof invariant refused");
  }
  static FileInfo LockProofInfo(string path) {
   using(var handle=CreateFileW(path,Attributes|ReadControl,7,IntPtr.Zero,3,Backup|OpenReparse,IntPtr.Zero)) {
    var info=Info(handle,path,true);Access(handle,true);return info;
   }
  }
  static bool LockProofRefused(string directory) {
   JournalLock contender;
   try {contender=new JournalLock(directory);}
   catch(IOException) {return true;}
   contender.Dispose();return false; // Disposal failure is not acquisition refusal.
  }
  public static string LockContentionProof(string directory,string mode) {
   if(mode!="metadata-only" && mode!="directory-data" && mode!="held-lock")throw new ArgumentException("Closed lock proof mode required");
   LockProofStage=1;
   using(var pins=new Pins(directory,true,true)) {
    LockProofRequire(System.IO.Directory.GetFileSystemEntries(directory).Length==0);
    string path=Path.Combine(directory,".activity-journal.lock");
    JournalLock owner=null;SafeFileHandle metadata=null;
    int creationError=0;bool refused=true;
    try {
     owner=new JournalLock(directory);
     LockProofStage=2;
     if(mode!="held-lock") {
      // Contrast actual LockExists metadata-only rights with FILE_LIST_DIRECTORY.
      // Observe instead of assuming both access masks retain a deleted name.
      uint access=Attributes|ReadControl|(mode=="directory-data"?1u:0u);
      metadata=CreateFileW(path,access,7,IntPtr.Zero,3,Backup|OpenReparse,IntPtr.Zero);
      Info(metadata,path,true);Access(metadata,true);
      LockProofStage=3;
      owner.Dispose();owner=null;
      LockProofStage=4;
      bool created;
      using(var security=new Creation(true)) {
       created=CreateDirectoryW(path,ref security.Attributes);
       // Capture immediately, before cleanup or any other native call.
       creationError=created?0:Marshal.GetLastWin32Error();
       LockProofCreateError=creationError;
      }
      LockProofStage=5;
      if(created)System.IO.Directory.Delete(path,false); // only our new object
      LockProofStage=6;
      refused=LockProofRefused(directory);
      LockProofStage=7;
      metadata.Dispose();metadata=null;
      LockProofStage=8;
     } else {
      var before=LockProofInfo(path);
      // The actual 50-attempt lock policy must refuse while its owner persists.
      LockProofRequire(LockProofRefused(directory));
      var after=LockProofInfo(path);
      LockProofRequire(before.Volume==after.Volume && before.IndexHigh==after.IndexHigh && before.IndexLow==after.IndexLow);
      LockProofRequire(System.IO.Directory.GetFileSystemEntries(directory).Length==1);
      owner.Dispose();owner=null;
     }
     // This is a new acquisition after explicit owner/metadata-handle release,
     // not event replay. Normal disposal must leave no lock or other fixture file.
     using(var next=new JournalLock(directory)){}
     LockProofStage=9;
     LockProofRequire(System.IO.Directory.GetFileSystemEntries(directory).Length==0);
     return "lock-proof|"+mode+"|create-error|"+creationError+"|contender|"+(refused?"refused":"acquired")+"|released|acquired|empty|true";
    } finally {
     if(metadata!=null)metadata.Dispose();
     if(owner!=null)owner.Dispose();
    }
   }
  }
 }
}
