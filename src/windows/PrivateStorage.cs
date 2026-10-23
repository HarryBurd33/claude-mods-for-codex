// Original MIT implementation. All IO and ACL checks stay in this process.
using System;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Threading;
using Microsoft.Win32.SafeHandles;

namespace CodexMods {
 public static class PrivateStorage {
  const uint ReadControl=0x20000, Attributes=0x80, GenericRead=0x80000000, GenericWrite=0x40000000;
  const uint Reparse=0x400, Directory=0x10, Backup=0x02000000, OpenReparse=0x00200000;
  const int JournalLimit=1048576;
  static readonly string User=WindowsIdentity.GetCurrent().User.Value;
  static readonly string Installer="S-1-5-80-956008885-3418522649-1831038044-1853292631-2271478464";
  [StructLayout(LayoutKind.Sequential)] struct FileInfo {
   public uint Attributes,CreationLow,CreationHigh,AccessLow,AccessHigh,WriteLow,WriteHigh,Volume,SizeHigh,SizeLow,Links,IndexHigh,IndexLow;
  }
  [StructLayout(LayoutKind.Sequential)] struct SecurityAttributes { public int Length; public IntPtr Descriptor; public int Inherit; }
  [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern SafeFileHandle CreateFileW(string p,uint a,uint s,IntPtr security,uint disposition,uint flags,IntPtr template);
  [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern bool CreateDirectoryW(string p,ref SecurityAttributes security);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool GetFileInformationByHandle(SafeFileHandle h,out FileInfo i);
  [DllImport("kernel32.dll")] static extern uint GetFileType(SafeFileHandle h);
  [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern uint GetFinalPathNameByHandleW(SafeFileHandle h,StringBuilder b,uint n,uint flags);
  [DllImport("kernel32.dll",CharSet=CharSet.Unicode)] static extern uint GetDriveTypeW(string root);
  [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern bool GetVolumeInformationByHandleW(SafeFileHandle h,StringBuilder label,uint size,out uint serial,out uint component,out uint flags,StringBuilder fs,uint fsSize);
  [DllImport("advapi32.dll")] static extern uint GetSecurityInfo(SafeFileHandle h,int type,uint sections,out IntPtr owner,out IntPtr group,out IntPtr dacl,out IntPtr sacl,out IntPtr descriptor);
  [DllImport("advapi32.dll")] static extern uint GetSecurityDescriptorLength(IntPtr descriptor);
  [DllImport("kernel32.dll")] static extern IntPtr LocalFree(IntPtr p);
  static Exception Refuse() { return new IOException("Private Windows storage unavailable"); }
  static bool Trusted(string sid) { return sid==User || sid=="S-1-5-18" || sid=="S-1-5-32-544"; }

  // No UNC, device, ADS, drive-relative, normalization aliases or long-path syntax.
  // Names are literal data, never interpolated into a shell/PowerShell expression.
  static string PathInput(string p) {
   if(p==null || p.Length<4 || p.Length>240 || !Char.IsLetter(p[0]) || p[1]!=':' || p[2]!='\\') throw Refuse();
   foreach(char c in p) if(Char.IsControl(c) || Char.GetUnicodeCategory(c)==System.Globalization.UnicodeCategory.Format) throw Refuse();
   string[] parts=p.Substring(3).Split('\\');
   foreach(string part in parts) {
    if(part.Length==0 || part=="." || part==".." || part.EndsWith(".") || part.EndsWith(" ") || part.IndexOfAny(new char[]{'/','?', '*', ':', '"', '<', '>', '|'})>=0) throw Refuse();
    string stem=part.Split('.')[0].ToUpperInvariant();
    if(stem=="CON" || stem=="PRN" || stem=="AUX" || stem=="NUL" || System.Text.RegularExpressions.Regex.IsMatch(stem,@"^(COM|LPT)[0-9\u00b9\u00b2\u00b3]$")) throw Refuse();
   }
   if(!String.Equals(Path.GetFullPath(p),p,StringComparison.OrdinalIgnoreCase)) throw Refuse();
   return p;
  }
  static FileInfo Info(SafeFileHandle h,string path,bool directory) {
   FileInfo i;
   if(h.IsInvalid || !GetFileInformationByHandle(h,out i) || GetFileType(h)!=1 || (i.Attributes & Reparse)!=0 || ((i.Attributes & Directory)!=0)!=directory || (!directory && i.Links!=1)) throw Refuse();
   var b=new StringBuilder(512);uint n=GetFinalPathNameByHandleW(h,b,512,0);
   if(n==0 || n>=512 || !String.Equals(b.ToString(),@"\\?\"+path,StringComparison.OrdinalIgnoreCase)) throw Refuse();
   return i;
  }
  static RawSecurityDescriptor Descriptor(SafeFileHandle h) {
   IntPtr owner,group,dacl,sacl,descriptor;
   if(GetSecurityInfo(h,1,5,out owner,out group,out dacl,out sacl,out descriptor)!=0) throw Refuse();
   try {
    uint length=GetSecurityDescriptorLength(descriptor);
    if(length<20 || length>65536 || dacl==IntPtr.Zero) throw Refuse();
    byte[] bytes=new byte[length];Marshal.Copy(descriptor,bytes,0,(int)length);
    var sd=new RawSecurityDescriptor(bytes,0);
    if(sd.Owner==null || sd.DiscretionaryAcl==null || sd.DiscretionaryAcl.Count>128 || (sd.ControlFlags & ControlFlags.DiscretionaryAclPresent)==0) throw Refuse();
    return sd;
   } finally { if(descriptor!=IntPtr.Zero) LocalFree(descriptor); }
  }
  static void Access(SafeFileHandle h,bool privateObject) {
   var sd=Descriptor(h);string owner=sd.Owner.Value;
   if(privateObject ? owner!=User : (!Trusted(owner) && owner!=Installer)) throw Refuse();
   if(privateObject && (sd.ControlFlags & ControlFlags.DiscretionaryAclProtected)==0) throw Refuse();
   foreach(GenericAce entry in sd.DiscretionaryAcl) {
    var ace=entry as CommonAce;
    if(ace==null || ace.IsCallback || (ace.AceQualifier!=AceQualifier.AccessAllowed && ace.AceQualifier!=AceQualifier.AccessDenied)) throw Refuse();
    if(ace.AceQualifier==AceQualifier.AccessDenied) continue; // never subtract denies to excuse broad grants
    bool applies=(ace.AceFlags & AceFlags.InheritOnly)==0;
    uint mask=unchecked((uint)ace.AccessMask);
    // Ancestor grants must not permit replacement, ACL takeover or reparse mutation.
    const uint dangerous=0x10000000|0x40000000|0x80000|0x40000|0x10000|0x100|0x40;
    if(!Trusted(ace.SecurityIdentifier.Value) && (privateObject || (applies && (mask & dangerous)!=0))) throw Refuse();
   }
  }
  static void Volume(SafeFileHandle h,string path) {
   uint serial,component,flags;var fs=new StringBuilder(64);
   if(GetDriveTypeW(path.Substring(0,3))!=3 || !GetVolumeInformationByHandleW(h,null,0,out serial,out component,out flags,fs,64) || fs.ToString()!="NTFS" || (flags&8)==0) throw Refuse();
  }
  sealed class Creation : IDisposable {
   public SecurityAttributes Attributes;
   public Creation(bool directory) {
    string inherit=directory?"OICI":"";
    var sd=new RawSecurityDescriptor("O:"+User+"D:P(A;"+inherit+";FA;;;"+User+")(A;"+inherit+";FA;;;SY)(A;"+inherit+";FA;;;BA)");
    byte[] bytes=new byte[sd.BinaryLength];sd.GetBinaryForm(bytes,0);
    Attributes=new SecurityAttributes{Length=Marshal.SizeOf(typeof(SecurityAttributes)),Descriptor=Marshal.AllocHGlobal(bytes.Length),Inherit=0};
    Marshal.Copy(bytes,0,Attributes.Descriptor,bytes.Length);
   }
   public void Dispose(){Marshal.FreeHGlobal(Attributes.Descriptor);}
  }
  static void CreateDirectoryPrivate(string path) {
   using(var security=new Creation(true)) {
    if(!CreateDirectoryW(path,ref security.Attributes)) throw Refuse();
   }
  }
  sealed class Pins : IDisposable {
   readonly List<SafeFileHandle> handles=new List<SafeFileHandle>();
   public bool Exists=true;
   public Pins(string path,bool create,bool targetDirectory,bool allowMissing=false) {
    PathInput(path);
    try {
     string root=path.Substring(0,3),cursor=root;
     if(GetDriveTypeW(root)!=3)throw Refuse(); // reject mapped/network drives before any CreateFile
     Pin(root,false);Volume(handles[0],path);
     string[] parts=path.Substring(3).Split('\\');
     int end=targetDirectory?parts.Length:parts.Length-1;
     for(int index=0;index<end;index++) {
      cursor=Path.Combine(cursor,parts[index]);
      var h=OpenDirectory(cursor);
      if(h.IsInvalid) {
       int error=Marshal.GetLastWin32Error();h.Dispose();
       if(!create && allowMissing && (error==2 || error==3)){Dispose();Exists=false;return;}
       if(!create || error!=2 && error!=3) throw Refuse();
       // Atomic private descriptor at creation: no create-then-chmod window.
       // Another cooperating creator may win; open and verify the actual object.
       using(var security=new Creation(true)) {
        if(!CreateDirectoryW(cursor,ref security.Attributes) && Marshal.GetLastWin32Error()!=183) throw Refuse();
       }
       h=OpenDirectory(cursor);
      }
      handles.Add(h);Info(h,cursor,true);Access(h,index==end-1 && targetDirectory);
     }
    } catch {Dispose();throw;}
   }
   static SafeFileHandle OpenDirectory(string path) { return CreateFileW(path,ReadControl|Attributes,3,IntPtr.Zero,3,Backup|OpenReparse,IntPtr.Zero); }
   void Pin(string path,bool privateObject) {
    var h=OpenDirectory(path);handles.Add(h);Info(h,path,true);Access(h,privateObject);
   }
   public void Dispose(){for(int n=handles.Count-1;n>=0;n--)handles[n].Dispose();handles.Clear();}
  }
  static SafeFileHandle OpenPrivateFile(string path,bool write,bool create,uint share=1,bool missing=false) {
   uint access=GenericRead|ReadControl|(write?GenericWrite:0);SafeFileHandle h;
   if(create) {
    using(var security=new Creation(false)) {
     IntPtr p=Marshal.AllocHGlobal(Marshal.SizeOf(typeof(SecurityAttributes)));
     try {Marshal.StructureToPtr(security.Attributes,p,false);h=CreateFileW(path,access,share,p,1,OpenReparse,IntPtr.Zero);}
     finally {Marshal.FreeHGlobal(p);}
    }
    if(h.IsInvalid) {int error=Marshal.GetLastWin32Error();h.Dispose();if(error!=80 && error!=183)throw Refuse();h=CreateFileW(path,access,share,IntPtr.Zero,3,OpenReparse,IntPtr.Zero);}
   } else h=CreateFileW(path,access,share,IntPtr.Zero,3,OpenReparse,IntPtr.Zero);
   if(h.IsInvalid && missing && Marshal.GetLastWin32Error()==2){h.Dispose();return null;}
   try {Info(h,path,false);Access(h,true);return h;} catch {h.Dispose();throw;}
  }
  static byte[] ReadFile(string path,int limit,bool missing,uint share=1) {
   using(var h=OpenPrivateFile(path,false,false,share,missing)) {
    if(h==null)return new byte[0];
    using(var stream=new FileStream(h,FileAccess.Read)) {
    if(stream.Length>limit)throw Refuse();
    byte[] buffer=new byte[limit+1];int total=0,n;
    while(total<buffer.Length && (n=stream.Read(buffer,total,buffer.Length-total))>0)total+=n;
    if(total>limit)throw Refuse();
    byte[] result=new byte[total];Array.Copy(buffer,result,total);return result;
    }
   }
  }
  sealed class JournalLock : IDisposable {
   readonly string path;
   public JournalLock(string directory,string name=".activity-journal.lock") {
    path=Path.Combine(directory,name);
    for(int n=0;n<50;n++) {
     using(var security=new Creation(true)) {
      if(CreateDirectoryW(path,ref security.Attributes))return;
      if(Marshal.GetLastWin32Error()!=183)throw Refuse();
     }
     using(var pins=new Pins(path,false,true)){} // never steal or remove an existing lock
     Thread.Sleep(10);
    }
    throw Refuse();
   }
   public void Dispose(){System.IO.Directory.Delete(path,false);}
  }
  static void Append(string path,byte[] line) {
   if(line.Length==0 || line.Length>2048 || line[line.Length-1]!=10)throw Refuse();
   using(var pins=new Pins(path,true,true)) using(var locked=new JournalLock(path)) {
    string current=Path.Combine(path,"activity.jsonl"),archive=Path.Combine(path,"activity.previous.jsonl");
    var existing=ReadFile(current,JournalLimit,true);
    if(existing.Length+line.Length>JournalLimit) {
     ReadFile(archive,JournalLimit,true); // inspect existing archive before unlinking
     File.Delete(archive);
     File.Move(current,archive);
    }
    using(var h=OpenPrivateFile(current,true,true)) using(var stream=new FileStream(h,FileAccess.ReadWrite)) {
     if(stream.Length+line.Length>JournalLimit)throw Refuse();
     stream.Position=stream.Length;stream.Write(line,0,line.Length);stream.Flush(true);
    }
   }
  }
  static bool LockExists(string directory) {
   string path=Path.Combine(directory,".activity-journal.lock");
   using(var h=CreateFileW(path,Attributes|ReadControl,7,IntPtr.Zero,3,Backup|OpenReparse,IntPtr.Zero)) {
    if(h.IsInvalid){if(Marshal.GetLastWin32Error()==2)return false;throw Refuse();}
    Info(h,path,true);Access(h,true);return true;
   }
  }
  static string Snapshot(string directory) {
   var result=new StringBuilder();
   foreach(string name in new string[]{"activity.previous.jsonl","activity.jsonl"}) {
    string path=Path.Combine(directory,name);
    using(var h=CreateFileW(path,GenericRead|ReadControl,7,IntPtr.Zero,3,OpenReparse,IntPtr.Zero)) {
     if(h.IsInvalid){if(Marshal.GetLastWin32Error()==2){result.Append("missing;");continue;}throw Refuse();}
     var i=Info(h,path,false);Access(h,true);
     result.Append(i.Volume).Append(':').Append(i.IndexHigh).Append(':').Append(i.IndexLow).Append(':').Append(i.SizeHigh).Append(':').Append(i.SizeLow).Append(':').Append(i.WriteHigh).Append(':').Append(i.WriteLow).Append(';');
    }
   }
   return result.ToString();
  }
  static string[] ReadJournal(string path) {
    using(var pins=new Pins(path,false,true)) {
     for(int attempt=0;attempt<50;attempt++) {
      if(LockExists(path)){Thread.Sleep(10);continue;}
      string before=Snapshot(path);
      byte[] archive=ReadFile(Path.Combine(path,"activity.previous.jsonl"),JournalLimit,true,7);
      byte[] current=ReadFile(Path.Combine(path,"activity.jsonl"),JournalLimit,true,7);
      string after=Snapshot(path);
      if(!LockExists(path) && before==after)return new string[]{Convert.ToBase64String(archive),Convert.ToBase64String(current)};
      Thread.Sleep(10);
     }
     throw Refuse();
    }
  }
  static List<string> StateNames(string root) {
   var names=new List<string>();
   foreach(string entry in System.IO.Directory.EnumerateFileSystemEntries(root)) {
    string name=Path.GetFileName(entry);
    if(name==".state.lock")continue;
    if(!System.Text.RegularExpressions.Regex.IsMatch(name,"^[a-f0-9]{64}$"))throw Refuse();
    using(var pins=new Pins(entry,false,true)){}
    names.Add(name);if(names.Count>64)throw Refuse();
   }
   names.Sort(StringComparer.Ordinal);return names;
  }
  static string Digest(byte[] first,byte[] second) {
   using(var stream=new MemoryStream())using(var hash=System.Security.Cryptography.SHA256.Create()) {
    stream.Write(first,0,first.Length);stream.WriteByte(0);stream.Write(second,0,second.Length);
    stream.Position=0;return BitConverter.ToString(hash.ComputeHash(stream)).Replace("-","").ToLowerInvariant();
   }
  }
  static string[] State(string op,string dataRoot,string data) {
   if(dataRoot.Length+83>240)throw Refuse();
   bool write=op=="state-record";
   using(var dataPins=new Pins(dataRoot,write,true,!write)) {
    if(!dataPins.Exists)return op=="state-list"?new string[]{"W10="}:new string[]{"",""};
    string root=Path.Combine(dataRoot,"metadata-state-v1");
    using(var rootPins=new Pins(root,write,true,!write)) {
     if(!rootPins.Exists)return op=="state-list"?new string[]{"W10="}:new string[]{"",""};
     if(op=="state-list") {
      var names=StateNames(root);string json="["+String.Join(",",names.ConvertAll(n=>"\""+n+"\""))+ "]";
      return new string[]{Convert.ToBase64String(Encoding.UTF8.GetBytes(json))};
     }
     if(data==null || data.Length<64 || !System.Text.RegularExpressions.Regex.IsMatch(data.Substring(0,64),"^[a-f0-9]{64}$"))throw Refuse();
     string key=data.Substring(0,64),scope=Path.Combine(root,key);
     if(op=="state-read") {
      if(data.Length!=64)throw Refuse();
      using(var scopePins=new Pins(scope,false,true,true)) {
       if(!scopePins.Exists)return new string[]{"",""};
       return ReadJournal(scope);
      }
     }
     using(var rootLock=new JournalLock(root,".state.lock")) {
      var names=StateNames(root);
      if(op=="state-record") {
       if(data.Length<66 || data[64]!=':' || !names.Contains(key) && names.Count>=64)throw Refuse();
       using(var scopePins=new Pins(scope,true,true))Append(scope,Convert.FromBase64String(data.Substring(65)));
       return new string[0];
      }
      if(op!="state-prune" || data.Length!=129 || data[64]!=':' || !System.Text.RegularExpressions.Regex.IsMatch(data.Substring(65),"^[a-f0-9]{64}$") || !names.Contains(key))throw Refuse();
      using(var scopePins=new Pins(scope,false,true))using(var scopeLock=new JournalLock(scope)) {
       foreach(string entry in System.IO.Directory.EnumerateFileSystemEntries(scope)) {
        string name=Path.GetFileName(entry);
        if(name!="activity.jsonl" && name!="activity.previous.jsonl" && name!=".activity-journal.lock")throw Refuse();
       }
       string archive=Path.Combine(scope,"activity.previous.jsonl"),current=Path.Combine(scope,"activity.jsonl");
       byte[] first=ReadFile(archive,JournalLimit,true),second=ReadFile(current,JournalLimit,true);
       if(Digest(first,second)!=data.Substring(65))throw Refuse(); // freshness is not authenticated consent
       File.Delete(archive);
       File.Delete(current);
      }
      System.IO.Directory.Delete(scope,false);
      return new string[0];
     }
    }
   }
  }
  public static string[] Run(string op,string path,string data,int limit) {
   path=PathInput(path);
   if(op=="prepare-directory") {using(var pins=new Pins(path,true,true)){};return new string[0];}
   if(op=="private-read") {
    if(limit<1 || limit>JournalLimit)throw Refuse();
    using(var pins=new Pins(path,false,false))return new string[]{Convert.ToBase64String(ReadFile(path,limit,false))};
   }
   if(op=="journal-append") {Append(path,Convert.FromBase64String(data));return new string[0];}
   if(op=="journal-read")return ReadJournal(path);
   if(op=="state-record" || op=="state-read" || op=="state-list" || op=="state-prune")return State(op,path,data);
   throw Refuse();
  }
 }
}
