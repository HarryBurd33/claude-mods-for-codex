// Original MIT proof only. Explicit synthetic read set, no project enumeration,
// Git invocation, ignore engine, public operation or production gate activation.
using System;
using System.IO;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using System.Threading;
using Microsoft.Win32.SafeHandles;

namespace CodexMods {
 public static partial class PrivateStorage {
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool ReadFile(SafeFileHandle handle,byte[] bytes,uint size,out uint read,IntPtr overlapped);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool SetFilePointerEx(SafeFileHandle handle,long distance,out long position,uint origin);

  // Same original filename exclusions as the workspace view, with strict Windows
  // path syntax added below. This is NOT a .gitignore implementation. A future
  // trusted caller must first establish which paths are allowed by ignore policy.
  static readonly Regex ExcludedProjectPart=new Regex(@"^(?:\.git|\.aws|\.ssh|\.gnupg|\.codex|\.local|\.docker|\.kube|\.azure|\.gcloud|node_modules|\.venv|venv|vendor|dist|build|coverage)$",RegexOptions.IgnoreCase|RegexOptions.CultureInvariant);
  static readonly Regex SensitiveProjectPart=new Regex(@"^(?:\.env(?:\..*)?|\.npmrc|\.netrc|\.pypirc|\.git-credentials|auth\.json|id_(?:rsa|dsa|ecdsa|ed25519)(?:\..*)?|credentials?(?:\..*)?|secrets?(?:\..*)?|.*\.(?:pem|key|p12|pfx|jks|keystore))$",RegexOptions.IgnoreCase|RegexOptions.CultureInvariant);
  static string ProjectPath(string root,string relative) {
   if(relative==null || relative.Length==0 || relative.Length>1024 || relative.IndexOf('\\')>=0)throw Refuse();
   string[] parts=relative.Split('/');if(parts.Length>16)throw Refuse();
   foreach(string part in parts) {
    if(part.Length==0 || part=="." || part==".." || ExcludedProjectPart.IsMatch(part) || SensitiveProjectPart.IsMatch(part))throw Refuse();
   }
   // PathInput rejects rooted/drive/ADS/device/normalization aliases and Unicode
   // controls before any filesystem call. Only forward-slash relative input.
   string path=root+"\\"+relative.Replace('/','\\');PathInput(path);return path;
  }
  static bool SameProjectInfo(FileInfo first,FileInfo second) {
   return first.Volume==second.Volume && first.IndexHigh==second.IndexHigh && first.IndexLow==second.IndexLow
    && first.CreationHigh==second.CreationHigh && first.CreationLow==second.CreationLow
    && first.WriteHigh==second.WriteHigh && first.WriteLow==second.WriteLow
    && first.SizeHigh==second.SizeHigh && first.SizeLow==second.SizeLow && first.Attributes==second.Attributes;
  }
  public sealed class ProjectReadSetProof : IDisposable {
   sealed class Entry {public string Path;public SafeFileHandle Handle;public FileInfo Identity;public byte[] Bytes;}
   readonly List<IDisposable> held=new List<IDisposable>();
   readonly List<Entry> entries=new List<Entry>();
   readonly CancellationToken cancellation;bool disposed;
   public int Count {get {return entries.Count;}}
   void Check(Stopwatch clock) {cancellation.ThrowIfCancellationRequested();if(disposed || clock.ElapsedMilliseconds>=5000)throw Refuse();}
   byte[] Read(Entry entry,Stopwatch clock) {
    long position;if(!SetFilePointerEx(entry.Handle,0,out position,0) || position!=0)throw Refuse();
    // Native reads avoid managed FileStream read-ahead returning stale bytes on
    // re-verification. Each source is already bounded by its held-handle metadata.
    byte[] bytes=new byte[(int)entry.Identity.SizeLow],part=new byte[4096];int total=0;
    while(total<bytes.Length) {
     Check(clock);
     uint read;if(!ReadFile(entry.Handle,part,(uint)Math.Min(part.Length,bytes.Length-total),out read,IntPtr.Zero) || read==0)throw Refuse();
     Array.Copy(part,0,bytes,total,(int)read);total+=(int)read;
    }
    uint extra;if(!ReadFile(entry.Handle,part,1,out extra,IntPtr.Zero) || extra!=0)throw Refuse();return bytes;
   }
   public ProjectReadSetProof(string selectedRoot,string[] relativePaths,CancellationToken token) {
    cancellation=token;var clock=Stopwatch.StartNew();Check(clock);PathInput(selectedRoot);
    if(relativePaths==null || relativePaths.Length<1 || relativePaths.Length>20)throw Refuse();
    var names=new Dictionary<string,bool>(StringComparer.OrdinalIgnoreCase);var paths=new List<string>();
    foreach(string relative in relativePaths) {string path=ProjectPath(selectedRoot,relative);if(names.ContainsKey(path))throw Refuse();names.Add(path,true);paths.Add(path);}
    // Validate the entire requested set before opening even the root. No missing
    // file/directory creation, symlink following, enumeration or side effects.
    try {
     Check(clock);
     held.Add(new Pins(System.IO.Path.Combine(selectedRoot,".unused-readset-proof"),false,false));int total=0;
     foreach(string path in paths) {
      Check(clock);held.Add(new Pins(path,false,false));
      var handle=CreateFileW(path,GenericRead|ReadControl|Attributes,1,IntPtr.Zero,3,OpenReparse,IntPtr.Zero);held.Add(handle);
      FileInfo info=Info(handle,path,false);CodeAccess(handle);
      if(info.SizeHigh!=0 || info.SizeLow>262144 || info.SizeLow>1048576-total)throw Refuse();
      var entry=new Entry{Path=path,Handle=handle,Identity=info};entries.Add(entry);
      entry.Bytes=Read(entry,clock);Check(clock);
      if(!SameProjectInfo(info,Info(handle,path,false)))throw Refuse();total+=(int)info.SizeLow;
     }
     // All positive entries/ancestors are held before this final consistency
     // check. New unselected directory entries are outside this read-set claim.
     Verify();Check(clock);
    } catch {Dispose();throw;}
   }
   public void Verify() {
    var clock=Stopwatch.StartNew();Check(clock);
    foreach(var entry in entries) {
     Check(clock);CodeAccess(entry.Handle);
     if(!SameProjectInfo(entry.Identity,Info(entry.Handle,entry.Path,false)))throw Refuse();
     byte[] current=Read(entry,clock);Check(clock);
     if(current.Length!=entry.Bytes.Length)throw Refuse();
     for(int i=0;i<current.Length;i++)if(current[i]!=entry.Bytes[i])throw Refuse();
     if(!SameProjectInfo(entry.Identity,Info(entry.Handle,entry.Path,false)))throw Refuse();
    }
   }
   public byte[] Bytes(int index) {
    if(index<0 || index>=entries.Count)throw Refuse();Verify();return (byte[])entries[index].Bytes.Clone();
   }
   public void Dispose() {
    if(disposed)return;disposed=true;
    for(int n=held.Count-1;n>=0;n--)held[n].Dispose();held.Clear();
    foreach(var entry in entries)if(entry.Bytes!=null)Array.Clear(entry.Bytes,0,entry.Bytes.Length);
   }
  }
 }
}
