// Original MIT research candidate. NOT a sandbox or a production execution API.
// Caller must separately establish executable/DLL trust, private cwd, safe args
// and selected-project traversal. No product code loads this proof.
using System;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;
using Microsoft.Win32.SafeHandles;

namespace CodexMods.Proofs {
 public static class OwnedProcess {
  [StructLayout(LayoutKind.Sequential)] struct SecurityAttributes { public int Size; public IntPtr Descriptor; public int Inherit; }
  [StructLayout(LayoutKind.Sequential,CharSet=CharSet.Unicode)] struct Startup {
   public int Size; public string Reserved,Desktop,Title;
   public uint X,Y,XSize,YSize,XCount,YCount,Fill,Flags; public ushort Show,ReservedCount;
   public IntPtr ReservedBytes,Input,Output,Error;
  }
  [StructLayout(LayoutKind.Sequential)] struct StartupEx { public Startup Info; public IntPtr Attributes; }
  [StructLayout(LayoutKind.Sequential)] struct ProcessInfo { public IntPtr Process,Thread; public uint ProcessId,ThreadId; }
  [StructLayout(LayoutKind.Sequential)] struct BasicLimits {
   public long ProcessTime,JobTime; public uint Flags; public UIntPtr MinWorking,MaxWorking; public uint Active; public UIntPtr Affinity; public uint Priority,Scheduling;
  }
  [StructLayout(LayoutKind.Sequential)] struct ExtendedLimits {
   public BasicLimits Basic; public ulong ReadOps,WriteOps,OtherOps,ReadBytes,WriteBytes,OtherBytes;
   public UIntPtr ProcessMemory,JobMemory,PeakProcess,PeakJob;
  }
  [DllImport("kernel32.dll",SetLastError=true)] static extern IntPtr CreateJobObjectW(IntPtr security,IntPtr name);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool SetInformationJobObject(IntPtr job,int kind,ref ExtendedLimits info,uint size);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool TerminateJobObject(IntPtr job,uint exit);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool CloseHandle(IntPtr handle);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool CreatePipe(out IntPtr read,out IntPtr write,ref SecurityAttributes security,uint size);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool SetHandleInformation(IntPtr handle,uint mask,uint flags);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool InitializeProcThreadAttributeList(IntPtr list,int count,uint flags,ref UIntPtr size);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool UpdateProcThreadAttribute(IntPtr list,uint flags,IntPtr key,IntPtr value,UIntPtr bytes,IntPtr previous,IntPtr size);
  [DllImport("kernel32.dll")] static extern void DeleteProcThreadAttributeList(IntPtr list);
  [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern bool CreateProcessW(string application,StringBuilder command,IntPtr processSecurity,IntPtr threadSecurity,bool inherit,uint flags,IntPtr environment,string directory,ref StartupEx startup,out ProcessInfo info);
  [DllImport("kernel32.dll",SetLastError=true)] static extern uint ResumeThread(IntPtr thread);
  [DllImport("kernel32.dll",SetLastError=true)] static extern uint WaitForSingleObject(IntPtr handle,uint milliseconds);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool GetExitCodeProcess(IntPtr process,out uint code);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool PeekNamedPipe(IntPtr pipe,IntPtr buffer,uint size,IntPtr read,out uint available,IntPtr remaining);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool ReadFile(IntPtr handle,byte[] bytes,uint size,out uint read,IntPtr overlapped);

  public sealed class Result {
   public uint ExitCode; public byte[] Output,Error;
  }
  static Exception Refuse() { return new IOException("Owned process proof refused"); }
  static void Close(ref IntPtr value) { if(value!=IntPtr.Zero) { CloseHandle(value); value=IntPtr.Zero; } }
  static bool Absolute(string value) {
   return value!=null && value.Length>=4 && value.Length<=240 && value[1]==':' && value[2]=='\\'
    && ((value[0]>='A' && value[0]<='Z') || (value[0]>='a' && value[0]<='z'))
    && value.IndexOf('\0')<0 && Path.GetFullPath(value)==value;
  }
  // Standard CRT argument escaping, never cmd.exe/PowerShell source evaluation.
  static string Quote(string value) {
   if(value==null || value.Length>4096 || value.IndexOf('\0')>=0)throw Refuse();
   var b=new StringBuilder("\"");int slashes=0;
   foreach(char c in value) {
    if(c=='\\'){slashes++;continue;}
    b.Append('\\',c=='"'?slashes*2+1:slashes);b.Append(c);slashes=0;
   }
   b.Append('\\',slashes*2);b.Append('"');return b.ToString();
  }
  static bool Drain(IntPtr pipe,MemoryStream target,int maximum,ref int total) {
   uint available;
   if(!PeekNamedPipe(pipe,IntPtr.Zero,0,IntPtr.Zero,out available,IntPtr.Zero)) {
    if(Marshal.GetLastWin32Error()==109)return false;
    throw Refuse();
   }
   if(available==0)return true;
   if(available>(uint)(maximum-total))throw Refuse();
   var bytes=new byte[Math.Min((int)available,4096)];uint read;
   if(!ReadFile(pipe,bytes,(uint)bytes.Length,out read,IntPtr.Zero) || read==0)throw Refuse();
   total+=(int)read;target.Write(bytes,0,(int)read);return true;
  }
  // Only lifetime/stdio/argv/env bounds are claimed here. The Windows 10+ job-list
  // creation attribute is mandatory: no create-then-assign race/fallback.
  public static Result Run(string executable,string[] arguments,string directory,IDictionary<string,string> environment,int timeoutMs,int maximum,CancellationToken cancellation) {
   if(!Absolute(executable) || !executable.EndsWith(".exe",StringComparison.OrdinalIgnoreCase) || !Absolute(directory)
    || arguments==null || arguments.Length>32 || environment==null || environment.Count>16
    || timeoutMs<100 || timeoutMs>15000 || maximum<1 || maximum>131072)throw Refuse();
   cancellation.ThrowIfCancellationRequested();
   var command=new StringBuilder(Quote(executable));foreach(string arg in arguments)command.Append(' ').Append(Quote(arg));
   if(command.Length>16384)throw Refuse();
   var names=new List<string>(environment.Keys);names.Sort(StringComparer.OrdinalIgnoreCase);
   var block=new StringBuilder();string previous=null;
   foreach(string name in names) {
    string value=environment[name];
    if(String.IsNullOrEmpty(name) || name.Length>64 || name.IndexOfAny(new char[]{'=','\0'})>=0 || String.Equals(previous,name,StringComparison.OrdinalIgnoreCase)
     || value==null || value.Length>4096 || value.IndexOf('\0')>=0)throw Refuse();
    block.Append(name).Append('=').Append(value).Append('\0');previous=name;
   }
   if(block.Length>16384)throw Refuse();block.Append('\0');if(names.Count==0)block.Append('\0');
   IntPtr job=IntPtr.Zero,inputRead=IntPtr.Zero,inputWrite=IntPtr.Zero,outRead=IntPtr.Zero,outWrite=IntPtr.Zero,errRead=IntPtr.Zero,errWrite=IntPtr.Zero;
   IntPtr list=IntPtr.Zero,handles=IntPtr.Zero,jobs=IntPtr.Zero,env=IntPtr.Zero;bool initialized=false;
   ProcessInfo pi=new ProcessInfo();var clock=Stopwatch.StartNew();
   try {
    job=CreateJobObjectW(IntPtr.Zero,IntPtr.Zero);if(job==IntPtr.Zero)throw Refuse();
    var limits=new ExtendedLimits();limits.Basic.Flags=0x2000; // KILL_ON_JOB_CLOSE; no breakaway grants
    if(!SetInformationJobObject(job,9,ref limits,(uint)Marshal.SizeOf(typeof(ExtendedLimits))))throw Refuse();
    var security=new SecurityAttributes();security.Size=Marshal.SizeOf(typeof(SecurityAttributes));security.Inherit=1;
    if(!CreatePipe(out inputRead,out inputWrite,ref security,0) || !CreatePipe(out outRead,out outWrite,ref security,0) || !CreatePipe(out errRead,out errWrite,ref security,0))throw Refuse();
    foreach(IntPtr h in new IntPtr[]{inputWrite,outRead,errRead})if(!SetHandleInformation(h,1,0))throw Refuse();
    Close(ref inputWrite); // Child receives EOF, never the parent's stdin.
    UIntPtr size=UIntPtr.Zero;InitializeProcThreadAttributeList(IntPtr.Zero,2,0,ref size);
    if(size.ToUInt64()==0 || size.ToUInt64()>65536)throw Refuse();
    list=Marshal.AllocHGlobal((int)size.ToUInt64());
    if(!InitializeProcThreadAttributeList(list,2,0,ref size))throw Refuse();initialized=true;
    handles=Marshal.AllocHGlobal(IntPtr.Size*3);jobs=Marshal.AllocHGlobal(IntPtr.Size);
    Marshal.WriteIntPtr(handles,0,inputRead);Marshal.WriteIntPtr(handles,IntPtr.Size,outWrite);Marshal.WriteIntPtr(handles,IntPtr.Size*2,errWrite);Marshal.WriteIntPtr(jobs,job);
    if(!UpdateProcThreadAttribute(list,0,new IntPtr(0x20002),handles,new UIntPtr((uint)(IntPtr.Size*3)),IntPtr.Zero,IntPtr.Zero)
     || !UpdateProcThreadAttribute(list,0,new IntPtr(0x2000d),jobs,new UIntPtr((uint)IntPtr.Size),IntPtr.Zero,IntPtr.Zero))throw Refuse();
    env=Marshal.StringToHGlobalUni(block.ToString());
    var startup=new StartupEx();startup.Info.Size=Marshal.SizeOf(typeof(StartupEx));startup.Info.Flags=0x100;
    startup.Info.Input=inputRead;startup.Info.Output=outWrite;startup.Info.Error=errWrite;startup.Attributes=list;
    cancellation.ThrowIfCancellationRequested();if(clock.ElapsedMilliseconds>=timeoutMs)throw Refuse();
    // Job assignment happens as part of creation. If unsupported or incompatible
    // with an outer job, refuse without retrying uncontained or breakaway.
    if(!CreateProcessW(executable,command,IntPtr.Zero,IntPtr.Zero,true,0x4|0x400|0x80000|0x08000000,env,directory,ref startup,out pi))throw Refuse();
    Close(ref inputRead);Close(ref outWrite);Close(ref errWrite);
    if(ResumeThread(pi.Thread)==0xffffffff)throw Refuse();Close(ref pi.Thread);
    using(var output=new MemoryStream())using(var error=new MemoryStream()) {
     bool outOpen=true,errOpen=true,exited=false;int total=0;uint exitCode=0;long cleanupAt=0;
     while(true) {
      cancellation.ThrowIfCancellationRequested();if(clock.ElapsedMilliseconds>=timeoutMs)throw Refuse();
      if(outOpen)outOpen=Drain(outRead,output,maximum,ref total);
      if(errOpen)errOpen=Drain(errRead,error,maximum,ref total);
      uint wait=WaitForSingleObject(pi.Process,0);if(wait!=0 && wait!=258)throw Refuse();
      if(!exited && wait==0) {
       if(!GetExitCodeProcess(pi.Process,out exitCode))throw Refuse();
       exited=true;cleanupAt=clock.ElapsedMilliseconds;
       // A root that exits cannot leave owned descendants/pipes alive.
       if(!TerminateJobObject(job,1))throw Refuse();
      }
      if(exited && !outOpen && !errOpen)return new Result{ExitCode=exitCode,Output=output.ToArray(),Error=error.ToArray()};
      if(exited && clock.ElapsedMilliseconds-cleanupAt>500)throw Refuse();
      Thread.Sleep(5);
     }
    }
   } finally {
    // Closing this sole non-inherited job handle also handles external death of
    // the helper process. Child/descendant handle inheritance never includes it.
    if(job!=IntPtr.Zero)TerminateJobObject(job,1);Close(ref job);
    if(pi.Process!=IntPtr.Zero)WaitForSingleObject(pi.Process,500);
    Close(ref pi.Thread);Close(ref pi.Process);
    Close(ref inputRead);Close(ref inputWrite);Close(ref outRead);Close(ref outWrite);Close(ref errRead);Close(ref errWrite);
    if(initialized)DeleteProcThreadAttributeList(list);
    foreach(IntPtr p in new IntPtr[]{list,handles,jobs,env})if(p!=IntPtr.Zero)Marshal.FreeHGlobal(p);
   }
  }
 }
}
