// Test-only original MIT executable. Fixed synthetic actions, never product data.
using System;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;
using CodexMods.Proofs;

public static class Harness {
 [StructLayout(LayoutKind.Sequential)] struct Security { public int Size; public IntPtr Descriptor; public int Inherit; }
 [DllImport("kernel32.dll",SetLastError=true)] static extern IntPtr CreateEventW(ref Security security,bool manual,bool initial,IntPtr name);
 [DllImport("kernel32.dll")] static extern bool SetEvent(IntPtr handle);
 [DllImport("kernel32.dll")] static extern uint WaitForSingleObject(IntPtr handle,uint milliseconds);
 [DllImport("kernel32.dll")] static extern bool CloseHandle(IntPtr handle);
 static string Exe { get {return System.Reflection.Assembly.GetExecutingAssembly().Location;} }
 static string B64(string value) { return Convert.ToBase64String(Encoding.UTF8.GetBytes(value)); }
 static Process Spawn(string mode,string path) {
  var p=new ProcessStartInfo(Exe,"child "+mode+" \""+path+"\"");p.UseShellExecute=false;p.CreateNoWindow=true;
  return Process.Start(p);
 }
 static int Child(string[] a) {
  Console.OutputEncoding=new UTF8Encoding(false);
  switch(a[1]) {
   case "print": Console.Write("fixed-output");Console.Error.Write("fixed-error");return 0;
   case "exit": return 23;
   case "args": for(int i=2;i<a.Length;i++)Console.WriteLine(B64(a[i]));return 0;
   case "env": Console.Write(B64(Environment.GetEnvironmentVariable("MODS_SYNTHETIC_ALLOWED")??""));Console.Write("|");Console.Write(B64(Environment.GetEnvironmentVariable("MODS_SYNTHETIC_FORBIDDEN")??""));return 0;
   case "stdin": Console.Write(Console.In.Read()==-1?"eof":"unexpected-input");return 0;
   case "handle": return SetEvent(new IntPtr(Int64.Parse(a[2])))?24:0;
   case "sleep": File.WriteAllText(a[2],Process.GetCurrentProcess().Id.ToString());Thread.Sleep(60000);return 0;
   case "fork": case "fork-exit":
    using(var child=Spawn("sleep",a[2]+".descendant")) { }
    File.WriteAllText(a[2]+".root",Process.GetCurrentProcess().Id.ToString());
    if(a[1]=="fork-exit") {for(int i=0;i<200 && !File.Exists(a[2]+".descendant");i++)Thread.Sleep(5);return 0;}
    Thread.Sleep(60000);return 0;
   case "flood": while(true) {Console.Write(new string('x',4096));Console.Error.Write(new string('y',4096));}
   default: throw new IOException("Synthetic action refused");
  }
 }
 public static int Main(string[] a) {
  try {
   if(a.Length>1 && a[0]=="child")return Child(a);
   if(a.Length<3 || a[0]!="run")return 2;
   string mode=a[1],directory=a[2];
   var args=new List<string>();args.Add("child");args.Add(mode=="cancel"||mode=="outer-kill"?"fork":mode);
   for(int i=3;i<a.Length;i++)args.Add(a[i]);
   var environment=new Dictionary<string,string>();
   environment.Add("SystemRoot",Environment.GetEnvironmentVariable("SystemRoot"));
   environment.Add("MODS_SYNTHETIC_ALLOWED","visible-value");
   IntPtr sentinel=IntPtr.Zero;
   if(mode=="handle") {
    var sa=new Security();sa.Size=Marshal.SizeOf(typeof(Security));sa.Inherit=1;
    sentinel=CreateEventW(ref sa,true,false,IntPtr.Zero);if(sentinel==IntPtr.Zero)throw new IOException();
    args.Add(sentinel.ToInt64().ToString());
   }
   using(var cancel=new CancellationTokenSource()) {
    // Bounds are part of proof input; the fixed runner never reads project files.
    int timeout=mode=="outer-kill"?15000:mode=="fork"||mode=="sleep"?1500:10000;
    if(mode=="cancel")cancel.CancelAfter(1500);
    if(mode=="pre-cancel") {cancel.Cancel();args[1]="sleep";}
    if(mode=="invalid-exe")args[1]="sleep";
    try {
     var result=OwnedProcess.Run(mode=="invalid-exe"?"relative.exe":mode=="missing-exe"?Path.Combine(directory,"absent.exe"):Exe,args.ToArray(),directory,environment,timeout,8192,cancel.Token);
     if(sentinel!=IntPtr.Zero && WaitForSingleObject(sentinel,0)!=258)throw new IOException();
     Console.WriteLine("ok|"+result.ExitCode+"|"+Convert.ToBase64String(result.Output)+"|"+Convert.ToBase64String(result.Error));
    } catch(OperationCanceledException) {Console.WriteLine("cancelled");}
      catch(IOException) {Console.WriteLine("refused");}
    finally {if(sentinel!=IntPtr.Zero)CloseHandle(sentinel);}
   }
   return 0;
  } catch { Console.WriteLine("harness-failed");return 1; }
 }
}
