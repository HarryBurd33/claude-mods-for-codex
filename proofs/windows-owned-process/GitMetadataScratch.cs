// Original MIT proof only. Typed inert metadata layout, no real project copy,
// Git binary invocation, ignore selection or production operation/gate change.
using System;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using Microsoft.Win32.SafeHandles;

namespace CodexMods {
 public static partial class PrivateStorage {
  static readonly byte[] GitScratchConfig=Encoding.ASCII.GetBytes("[core]\nrepositoryformatversion = 0\nbare = false\nfilemode = false\n");
  public sealed class GitMetadataScratchProof : IDisposable {
   readonly ScratchProof root;
   readonly List<SafeFileHandle> files=new List<SafeFileHandle>();
   readonly List<Pins> directories=new List<Pins>();
   readonly List<string> names=new List<string>();bool disposed;
   public string Path {get {return root.Path;}}
   static void Check(CancellationToken token,Stopwatch clock) {token.ThrowIfCancellationRequested();if(clock.ElapsedMilliseconds>=5000)throw Refuse();}
   void Add(string name,byte[] bytes,CancellationToken token,Stopwatch clock) {
    Check(token,clock);var handle=CreateScratchFileProof(System.IO.Path.Combine(Path,name),bytes);
    try {files.Add(handle);handle=null;}finally {if(handle!=null)handle.Dispose();}
   }
   public GitMetadataScratchProof(string parent,string headCommit,byte[] index,byte[] exclude,CancellationToken cancellation) {
    // Match the existing adapter's index/exclude bounds, not the smaller flat
    // slot/read-set proof. No arbitrary config/ref/file/directory name supplied.
    if(headCommit!=null && !System.Text.RegularExpressions.Regex.IsMatch(headCommit,@"\A[a-f0-9]{40}\z"))throw Refuse();
    if(index!=null && index.Length>33554432 || exclude!=null && exclude.Length>1048576)throw Refuse();
    var clock=Stopwatch.StartNew();Check(cancellation,clock);root=new ScratchProof(parent);
    try {
     foreach(string name in new string[]{"objects","refs","info"}) {
      Check(cancellation,clock);string path=System.IO.Path.Combine(Path,name);PathInput(path);
      CreateDirectoryPrivate(path);var pin=new Pins(path,false,true);
      try {directories.Add(pin);pin=null;names.Add(path);}finally {if(pin!=null)pin.Dispose();}
     }
     Add("config",GitScratchConfig,cancellation,clock);
     byte[] head=Encoding.ASCII.GetBytes(headCommit==null?"ref: refs/heads/mods-inspection\n":headCommit+"\n");
     Add("HEAD",head,cancellation,clock);
     if(index!=null)Add("index",index,cancellation,clock);
     if(exclude!=null)Add(System.IO.Path.Combine("info","exclude"),exclude,cancellation,clock);
     Check(cancellation,clock);
    } catch {try {Dispose();}catch(IOException){}throw;}
   }
   public void Dispose() {
    if(disposed)return;disposed=true;bool refused=false;
    // Exact created file objects only. Child readers can delay namespace removal.
    foreach(var file in files)file.Dispose();files.Clear();
    for(int i=directories.Count-1;i>=0;i--)directories[i].Dispose();directories.Clear();
    // Static, successfully created/verified directory names only; never enumerate,
    // recursively remove, adopt a stale root or delete an unexpected entry.
    for(int i=names.Count-1;i>=0;i--) {try {System.IO.Directory.Delete(names[i],false);}catch(IOException){refused=true;}}
    try {root.Dispose();}catch(IOException){refused=true;}
    if(refused)throw Refuse();
   }
  }
  // Independent fixed reader for the synthetic fixture. Shares read/write/delete
  // explicitly; actual Git reader compatibility remains a separate gate.
  public static bool GitMetadataReadProof(string root,bool optional) {
   using(var pins=new Pins(root,false,true)) {
    byte[] config=ReadFile(System.IO.Path.Combine(root,"config"),4096,false,7);
    byte[] head=ReadFile(System.IO.Path.Combine(root,"HEAD"),128,false,7);
    if(Encoding.ASCII.GetString(config)!=Encoding.ASCII.GetString(GitScratchConfig))return false;
    if(Encoding.ASCII.GetString(head)!=(optional?new string('a',40)+"\n":"ref: refs/heads/mods-inspection\n"))return false;
    if(optional) {
     byte[] index=ReadFile(System.IO.Path.Combine(root,"index"),33554432,false,7);
     byte[] exclude=ReadFile(System.IO.Path.Combine(root,"info","exclude"),1048576,false,7);
     if(index.Length!=6 || index[0]!=68 || index[1]!=73 || index[2]!=82 || index[3]!=67 || index[4]!=0 || index[5]!=255
      || Encoding.UTF8.GetString(exclude)!="synthetic-ignore\n")return false;
    }
    return true;
   }
  }
 }
}
