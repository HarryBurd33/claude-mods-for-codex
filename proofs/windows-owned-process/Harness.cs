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
 [DllImport("kernel32.dll")] static extern bool ResetEvent(IntPtr handle);
 [DllImport("kernel32.dll")] static extern uint WaitForSingleObject(IntPtr handle,uint milliseconds);
 [DllImport("kernel32.dll")] static extern bool CloseHandle(IntPtr handle);
 [DllImport("kernel32.dll",CharSet=CharSet.Unicode)] static extern IntPtr CreateFileMappingW(Microsoft.Win32.SafeHandles.SafeFileHandle file,IntPtr security,uint protection,uint high,uint low,IntPtr name);
 [DllImport("kernel32.dll")] static extern IntPtr MapViewOfFile(IntPtr mapping,uint access,uint high,uint low,UIntPtr bytes);
 [DllImport("kernel32.dll")] static extern bool FlushViewOfFile(IntPtr address,UIntPtr bytes);
 [DllImport("kernel32.dll")] static extern bool UnmapViewOfFile(IntPtr address);
 static string Exe { get {return System.Reflection.Assembly.GetExecutingAssembly().Location;} }
 static string B64(string value) { return Convert.ToBase64String(Encoding.UTF8.GetBytes(value)); }
 static void OperationMarker(string parent,string suffix,string value) {
  // Private synthetic fixture markers only, never adopted/overwritten or product
  // telemetry. They intentionally survive abrupt death for the independent test.
  using(var file=new FileStream(Path.Combine(parent,"operation"+suffix),FileMode.CreateNew,FileAccess.Write,FileShare.Read)) {
   byte[] bytes=new UTF8Encoding(false).GetBytes(value);file.Write(bytes,0,bytes.Length);
  }
 }
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
   case "metadata-operation":
    try {
     if(Environment.GetEnvironmentVariable("MODS_SYNTHETIC_FORBIDDEN")!=null || Environment.CurrentDirectory!=a[3] || Console.In.Read()!=-1)throw new IOException();
     OperationMarker(a[3],".pid",Process.GetCurrentProcess().Id.ToString());
     if(a[4]=="before") {OperationMarker(a[3],".ready","before-capture");Thread.Sleep(60000);return 0;}
     using(var selected=new CodexMods.PrivateStorage.GitSelectedMetadataProof(a[2],a[3],true,CancellationToken.None)) {
      OperationMarker(a[3],".scratch",selected.Path);OperationMarker(a[3],".ready","captured");
      if(a[4]=="stall")Thread.Sleep(60000);
      if(a[4]=="exit")Environment.Exit(23); // Deliberately skips managed cleanup.
      if(a[4]=="flood")while(true)Console.Write(new string('x',4096));
      selected.Verify();
     }
     Console.Write("metadata-complete");return 0;
    } catch(IOException) {Console.Write("metadata-refused");return 7;}
   case "scratch-read": Console.Write(CodexMods.PrivateStorage.ScratchReadProof(a[2])?"verified":"mismatch");return 0;
   case "metadata-read": Console.Write(CodexMods.PrivateStorage.GitMetadataReadProof(a[2],a[3]=="full")?"verified-layout":"mismatch");return 0;
   case "metadata-incompatible":
    try {using(var file=new FileStream(Path.Combine(a[2],"index"),FileMode.Open,FileAccess.Read,FileShare.Read)){};Console.Write("unexpected-reader");}
    catch(IOException){Console.Write("reader-refused");}return 0;
   case "scratch-reader":
    // Keep a compatible read handle open in an owned descendant. No raw content
    // is printed; the parent test checks actual object cleanup after job death.
    using(var file=new FileStream(a[2],FileMode.Open,FileAccess.Read,FileShare.ReadWrite|FileShare.Delete)) {
     File.WriteAllText(a[3]+".reader",Process.GetCurrentProcess().Id.ToString());Thread.Sleep(60000);
    }return 0;
   case "scratch-fork": case "scratch-fork-exit":
    using(var reader=Process.Start(new ProcessStartInfo(Exe,"child scratch-reader \""+a[2]+"\" \""+a[3]+"\""){UseShellExecute=false,CreateNoWindow=true})) { }
    File.WriteAllText(a[3]+".root",Process.GetCurrentProcess().Id.ToString());
    if(a[1]=="scratch-fork-exit") {
     for(int i=0;i<200 && !File.Exists(a[3]+".reader");i++)Thread.Sleep(5);
     if(!File.Exists(a[3]+".reader"))throw new IOException();return 0;
    }
    Thread.Sleep(60000);return 0;
   // Numeric handles can be reused by the child's CLR. The parent checks the
   // original event object, never infers inheritance from this return value.
   case "handle": SetEvent(new IntPtr(Int64.Parse(a[2])));Console.Write("attempted");return 0;
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
 static string MetadataFailure(string phase,Exception failure) {
  string detail=failure.Data["mods-metadata-phase"] as string;
  switch(detail) {
   case "directories":case "directory-objects":case "directory-refs":case "directory-info":
   case "config":case "head":case "index":case "exclude":case "final-check":phase=detail;break;
  }
  string kind=failure is CodexMods.PrivateStorage.MetadataScratchDeadlineProofException?"deadline":failure is OperationCanceledException?"cancelled":failure is UnauthorizedAccessException?"access":failure is IOException?"io":"other";
  string cleanup=failure.Data["mods-metadata-cleanup"] as string;
  if(cleanup!="completed" && cleanup!="refused")cleanup="unknown";
  return "metadata-bounds-failed|"+phase+"|"+kind+"|"+cleanup;
 }
 public static int Main(string[] a) {
  string metadataPhase=null;
  try {
   if(a.Length>1 && a[0]=="child")return Child(a);
   if(a.Length<3 || a[0]!="run")return 2;
   string mode=a[1],directory=a[2];
   if(mode=="metadata-bounds" || mode=="capture" || mode=="capture-hold")CodexMods.PrivateStorage.BeginMetadataTraceProof();
   if(mode=="metadata-operation" || mode=="metadata-operation-cancel" || mode=="metadata-operation-pre-cancel") {
    using(var cancellation=new CancellationTokenSource()) {
     if(mode=="metadata-operation-pre-cancel")cancellation.Cancel();
     if(mode=="metadata-operation-cancel") {
      var request=new Thread(delegate(){Console.In.ReadLine();try {cancellation.Cancel();}catch(ObjectDisposedException){}});request.IsBackground=true;request.Start();
     }
     try {
      var value=CodexMods.PrivateStorage.RunMetadataOperationProof(a[4],directory,a[3],a[5],cancellation.Token);
      Console.WriteLine("ok|"+value.ExitCode+"|"+Convert.ToBase64String(value.Output)+"|"+Convert.ToBase64String(value.Error));
     } catch(OperationCanceledException){Console.WriteLine("cancelled");}
       catch(IOException){Console.WriteLine("refused");}
    }return 0;
   }
   if(mode=="transient-pin" || mode=="held-pin") {
    try {CodexMods.PrivateStorage.SharingPinProof(directory,mode=="transient-pin");Console.WriteLine("pinned");}
    catch(IOException) {Console.WriteLine("refused");}return 0;
   }
   if(mode=="pin") {
    try {using(var pin=new CodexMods.PrivateStorage.ProgramPins(a[3],a[4],a[5]))Console.WriteLine("pinned");}
    catch(IOException){Console.WriteLine("refused");}return 0;
   }
   if(mode=="pin-diagnosis") {
    Console.WriteLine(CodexMods.PrivateStorage.ProgramPinDiagnosisProof(a[3],a[4],a[5]));return 0;
   }
   if(mode=="code-ancestor") {
    Console.WriteLine(CodexMods.PrivateStorage.AssessKnownCodeAncestorProof(a[3]));return 0;
   }
   if(mode=="code-ancestor-case") {
    Console.WriteLine(CodexMods.PrivateStorage.CodeAncestorDescriptorCaseProof(a[3]));return 0;
   }
   if(mode=="known-ancestor-lease" || mode=="synthetic-ancestor-lease") {
    if(mode=="known-ancestor-lease")CodexMods.PrivateStorage.KnownCodeAncestorLeaseHarnessProof(a[3]);
    else CodexMods.PrivateStorage.SyntheticCodeAncestorLeaseHarnessProof(a[3]);
    return 0;
   }
   if(mode=="inventory-pin") {
    // Test-only retained object boundary. No image loading, version query, Git
    // execution or content read here. Parent reads only after this readiness.
    try {
     using(var pin=new CodexMods.PrivateStorage.ProgramPins(a[3],a[4],a[5])) {
      Console.WriteLine("pinned");Console.Out.Flush();Console.In.ReadLine();
     }
     Console.WriteLine("released");
    } catch(IOException){Console.WriteLine("refused|"+CodexMods.PrivateStorage.ProgramPinDiagnosisProof(a[3],a[4],a[5]));}return 0;
   }
   if(mode=="known-image-read" || mode=="synthetic-image-read") {
    if(mode=="known-image-read")CodexMods.PrivateStorage.KnownInstalledImageReadHarnessProof(a[3],a[4],a[5]);
    else CodexMods.PrivateStorage.SyntheticInstalledImageReadHarnessProof(a[3],a[4],a[5]);
    return 0;
   }
   if(mode=="linked-attribute-change") {
    string path=Path.GetFullPath(a[3]);
    if(!path.StartsWith(Path.GetFullPath(directory)+Path.DirectorySeparatorChar,StringComparison.OrdinalIgnoreCase))throw new IOException();
    FileAttributes before=File.GetAttributes(path);File.SetAttributes(path,before^FileAttributes.Hidden);
    if(File.GetAttributes(path)==before)throw new IOException();
    Console.WriteLine("attributes-changed");return 0;
   }
   if(mode=="linked-mapping-holder") {
    string path=Path.GetFullPath(a[3]);
    if(!path.StartsWith(Path.GetFullPath(directory)+Path.DirectorySeparatorChar,StringComparison.OrdinalIgnoreCase))throw new IOException();
    IntPtr mapping=IntPtr.Zero,view=IntPtr.Zero;
    try {
     using(var file=new FileStream(path,FileMode.Open,FileAccess.ReadWrite,FileShare.ReadWrite|FileShare.Delete)) {
      mapping=CreateFileMappingW(file.SafeFileHandle,IntPtr.Zero,4,0,0,IntPtr.Zero);
      if(mapping==IntPtr.Zero)throw new IOException();
      view=MapViewOfFile(mapping,2,0,0,UIntPtr.Zero);if(view==IntPtr.Zero)throw new IOException();
     }
     // The write file handle is closed, but the actual writable view stays live.
     Console.WriteLine("mapping-held");Console.Out.Flush();Console.In.Read();return 0;
    } finally {if(view!=IntPtr.Zero)UnmapViewOfFile(view);if(mapping!=IntPtr.Zero)CloseHandle(mapping);}
   }
   if(mode=="known-linked-inventory" || mode=="synthetic-linked-inventory") {
    if(a.Length!=7)throw new IOException();
    if(mode=="known-linked-inventory")CodexMods.PrivateStorage.KnownLinkedInventoryHarnessProof(a[3],a[4],a[5],a[6]);
    else CodexMods.PrivateStorage.SyntheticLinkedInventoryHarnessProof(a[3],a[4],a[5],a[6]);
    return 0;
   }
   if(mode=="known-installer-read" || mode=="synthetic-installer-read") {
    if(mode=="known-installer-read")CodexMods.PrivateStorage.KnownInstallerInventoryHarnessProof(a[3],a[4],a[5]);
    else CodexMods.PrivateStorage.SyntheticInstallerInventoryHarnessProof(a[3],a[4],a[5]);
    return 0;
   }
   if(mode=="scratch") {
    using(var scratch=new CodexMods.PrivateStorage.ScratchProof(directory)) {
     Console.WriteLine(B64(scratch.Path));Console.Out.Flush();Console.In.ReadLine();
    }
    Console.WriteLine("removed");return 0;
   }
   if(mode=="scratch-bounds") {
    var scratch=new CodexMods.PrivateStorage.ScratchContentProof(directory);
    string path=scratch.Path;
    using(scratch) {
     int refused=0;
     try {scratch.Add(null);}catch(IOException){refused++;}
     try {scratch.Add(new byte[262145]);}catch(IOException){refused++;}
     for(int i=0;i<4;i++)scratch.Add(new byte[262144]);
     try {scratch.Add(new byte[1]);}catch(IOException){refused++;}
     for(int i=4;i<16;i++)scratch.Add(new byte[0]);
     try {scratch.Add(new byte[0]);}catch(IOException){refused++;}
     if(refused!=4 || System.IO.Directory.GetFiles(path).Length!=16)throw new IOException();
    }
    scratch.Dispose(); // idempotent; Add must refuse after disposal.
    try {scratch.Add(new byte[1]);throw new InvalidOperationException();}catch(IOException){}
    if(System.IO.Directory.Exists(path))throw new IOException();
    Console.WriteLine("bounded");return 0;
   }
   if(mode=="selected-metadata" || mode=="selected-metadata-cancel" || mode=="selected-metadata-cancel-after") {
    using(var cancellation=new CancellationTokenSource()) {
     if(mode=="selected-metadata-cancel")cancellation.Cancel();
     try {
      using(var selected=new CodexMods.PrivateStorage.GitSelectedMetadataProof(directory,a[3],a[4]=="exclude",cancellation.Token)) {
       Console.WriteLine(B64(selected.Path));Console.Out.Flush();Console.In.ReadLine();
       if(mode=="selected-metadata-cancel-after")cancellation.Cancel();
       selected.Verify();Console.WriteLine("verified-source-head");
       selected.Dispose();
       try {selected.Verify();throw new InvalidOperationException();}catch(IOException){}
      }
     } catch(OperationCanceledException){Console.WriteLine("cancelled");}
       catch(IOException){Console.WriteLine("refused");}
    }return 0;
   }
   if(mode=="index-project" || mode=="index-project-cancel") {
    using(var cancellation=new CancellationTokenSource()) {
     if(mode=="index-project-cancel")cancellation.Cancel();
     // This test-only request reads explicit synthetic fixture bytes, never
     // a production operation or undisclosed project/config/session discovery.
     byte[] input=File.ReadAllBytes(Path.Combine(directory,"index")),projected=null;
     try {
      projected=CodexMods.PrivateStorage.ProjectSha1IndexV2Proof(input,cancellation.Token);
      using(var hash=System.Security.Cryptography.SHA256.Create())Console.WriteLine("projected|"+projected.Length+"|"+BitConverter.ToString(hash.ComputeHash(projected)).Replace("-","").ToLowerInvariant());
     } catch(IOException){Console.WriteLine("refused");}
       catch(OperationCanceledException){Console.WriteLine("cancelled");}
     finally {Array.Clear(input,0,input.Length);if(projected!=null)Array.Clear(projected,0,projected.Length);}
    }return 0;
   }
   if(mode=="capture" || mode=="capture-hold" || mode=="capture-cancel" || mode=="capture-cancel-after" || mode=="capture-projected") {
    using(var cancellation=new CancellationTokenSource()) {
     if(mode=="capture-cancel")cancellation.Cancel();
     try {
      using(var capture=new CodexMods.PrivateStorage.GitMetadataCaptureProof(directory,a[3],new string('a',40),a[4]=="index" || a[4]=="both",a[4]=="exclude" || a[4]=="both",cancellation.Token,mode=="capture-projected")) {
       Console.WriteLine(B64(capture.Path));Console.Out.Flush();
       if(mode=="capture-hold" || mode=="capture-cancel-after" || mode=="capture-projected")Console.In.ReadLine();
       if(mode=="capture-cancel-after")cancellation.Cancel();
       capture.Verify();Console.WriteLine("verified-capture");
       capture.Dispose();
       try {capture.Verify();throw new InvalidOperationException();}catch(IOException){}
      }
     } catch(OperationCanceledException){Console.WriteLine("cancelled");}
       catch(IOException){Console.WriteLine("refused");}
    }return 0;
   }
   if(mode=="metadata-bounds-diagnostics") {
    var error=new IOException("PRIVATE_SYNTHETIC_PATH\\never-emit");
    error.Data["mods-metadata-phase"]="PRIVATE_UNSUPPORTED";
    error.Data["mods-metadata-cleanup"]="PRIVATE_UNSUPPORTED";
    Console.WriteLine(MetadataFailure("max-create",error));
    error.Data["mods-metadata-phase"]="index";error.Data["mods-metadata-cleanup"]="refused";
    Console.WriteLine(MetadataFailure("max-create",error));
    Console.WriteLine(MetadataFailure("max-create",new CodexMods.PrivateStorage.MetadataScratchDeadlineProofException()));
    Console.WriteLine(MetadataFailure("max-create",new OperationCanceledException("PRIVATE_CANCEL")));
    Console.WriteLine(MetadataFailure("max-create",new UnauthorizedAccessException("PRIVATE_ACCESS")));
    Console.WriteLine(MetadataFailure("lengths",new InvalidOperationException("PRIVATE_OTHER")));
    return 0;
   }
   if(mode=="metadata-bounds") {
    metadataPhase="invalid-heads";int refused=0;
    foreach(string head in new string[]{"HEAD",new string('A',40),new string('a',40)+"\n","ref: refs/heads/other"}) {
     try {using(var invalid=new CodexMods.PrivateStorage.GitMetadataScratchProof(directory,head,null,null,CancellationToken.None)){};}
     catch(IOException){refused++;}
    }
    metadataPhase="oversize-index";try {using(var invalid=new CodexMods.PrivateStorage.GitMetadataScratchProof(directory,null,new byte[33554433],null,CancellationToken.None)){};}
    catch(IOException){refused++;}
    metadataPhase="oversize-exclude";try {using(var invalid=new CodexMods.PrivateStorage.GitMetadataScratchProof(directory,null,null,new byte[1048577],CancellationToken.None)){};}
    catch(IOException){refused++;}
    metadataPhase="pre-cancel";using(var cancellation=new CancellationTokenSource()) {
     cancellation.Cancel();
     try {using(var invalid=new CodexMods.PrivateStorage.GitMetadataScratchProof(directory,null,null,null,cancellation.Token)){};}
     catch(OperationCanceledException){refused++;}
    }
    metadataPhase="refusal-count";if(refused!=7)throw new IOException();
    metadataPhase="max-create";string path;
    using(var valid=new CodexMods.PrivateStorage.GitMetadataScratchProof(directory,new string('a',40),new byte[33554432],new byte[1048576],CancellationToken.None)) {
     path=valid.Path;metadataPhase="lengths";
     if(new FileInfo(Path.Combine(path,"index")).Length!=33554432 || new FileInfo(Path.Combine(path,"info","exclude")).Length!=1048576)throw new IOException();
     metadataPhase="dispose";
    }
    metadataPhase="root-absence";if(System.IO.Directory.Exists(path))throw new IOException();Console.WriteLine("bounded");return 0;
   }
   if(mode=="metadata" || mode=="metadata-empty" || mode=="metadata-job" || mode=="metadata-cancel") {
    bool optional=mode!="metadata-empty";
    var metadata=new CodexMods.PrivateStorage.GitMetadataScratchProof(directory,optional?new string('a',40):null,
     optional?new byte[]{68,73,82,67,0,255}:null,optional?Encoding.UTF8.GetBytes("synthetic-ignore\n"):null,CancellationToken.None);
    try {
     Console.WriteLine(B64(metadata.Path));Console.Out.Flush();
     if(mode=="metadata-job" || mode=="metadata-cancel") {
      var env=new Dictionary<string,string>();env.Add("SystemRoot",Environment.GetEnvironmentVariable("SystemRoot"));
      using(var cancellation=new CancellationTokenSource()) {
       if(mode=="metadata-cancel")cancellation.CancelAfter(1500);
       try {OwnedProcess.Run(Exe,new string[]{"child","scratch-fork",Path.Combine(metadata.Path,"index"),a[3]},metadata.Path,env,15000,1024,cancellation.Token);}
       catch(OperationCanceledException){Console.WriteLine("cancelled");}
      }
     } else Console.In.ReadLine();
    } finally {
     try {metadata.Dispose();Console.WriteLine("removed");}catch(IOException){Console.WriteLine("retained-root");}
    }return 0;
   }
   if(mode=="readset" || mode=="readset-hold" || mode=="readset-cancel" || mode=="readset-cancel-after") {
    string[] paths=new string[a.Length-3];Array.Copy(a,3,paths,0,paths.Length);
    using(var cancellation=new CancellationTokenSource()) {
     if(mode=="readset-cancel")cancellation.Cancel();
     try {
      using(var selected=new CodexMods.PrivateStorage.ProjectReadSetProof(directory,paths,cancellation.Token)) {
       int count=selected.Count,total=0;
       for(int i=0;i<count;i++)total+=selected.Bytes(i).Length;
       Console.WriteLine("captured|"+count+"|"+total);Console.Out.Flush();
       if(mode=="readset-hold" || mode=="readset-cancel-after")Console.In.ReadLine();
       if(mode=="readset-cancel-after")cancellation.Cancel();
       selected.Verify();Console.WriteLine("verified");
       // Disposal releases every pin; reading a disposed object must refuse.
       selected.Dispose();
       try {selected.Bytes(0);throw new InvalidOperationException();}catch(IOException){}
      }
     } catch(OperationCanceledException){Console.WriteLine("cancelled");}
       catch(IOException){Console.WriteLine("refused");}
    }return 0;
   }
   if(mode=="readset-mapping") {
    string path=Path.Combine(directory,"sample.txt");DateTime time=File.GetLastWriteTimeUtc(path);
    IntPtr mapping=IntPtr.Zero,view=IntPtr.Zero;
    try {
     using(var file=new FileStream(path,FileMode.Open,FileAccess.ReadWrite,FileShare.ReadWrite|FileShare.Delete)) {
      mapping=CreateFileMappingW(file.SafeFileHandle,IntPtr.Zero,4,0,0,IntPtr.Zero);
      if(mapping==IntPtr.Zero)throw new IOException();
      view=MapViewOfFile(mapping,2,0,0,UIntPtr.Zero);if(view==IntPtr.Zero)throw new IOException();
     }
     // A writable view can outlive its original file handle. If the OS refuses
     // our subsequent read handle, that is also a safe bounded outcome.
     CodexMods.PrivateStorage.ProjectReadSetProof selected;
     try {selected=new CodexMods.PrivateStorage.ProjectReadSetProof(directory,new string[]{"sample.txt"},CancellationToken.None);}
     catch(IOException){Console.WriteLine("mapping-refused");return 0;}
     using(selected) {
      time=File.GetLastWriteTimeUtc(path);
      Marshal.WriteByte(view,0,88);if(!FlushViewOfFile(view,new UIntPtr(1)))throw new IOException();
      File.SetLastWriteTimeUtc(path,time);
      if(File.GetLastWriteTimeUtc(path)!=time)throw new IOException();
      try {selected.Verify();Console.WriteLine("unexpected-stale-read");}
      catch(IOException){Console.WriteLine("changed-refused");}
     }
    } finally {if(view!=IntPtr.Zero)UnmapViewOfFile(view);if(mapping!=IntPtr.Zero)CloseHandle(mapping);}
    return 0;
   }
   if(mode=="readset-scratch") {
    using(var selected=new CodexMods.PrivateStorage.ProjectReadSetProof(directory,new string[]{"sample.txt"},CancellationToken.None))
    using(var scratch=new CodexMods.PrivateStorage.ScratchContentProof(a[3])) {
     string target=scratch.Add(selected.Bytes(0));
     selected.Verify();
     Console.WriteLine(CodexMods.PrivateStorage.ScratchReadProof(target)?"verified-copy":"mismatch");
    }return 0;
   }
   if(mode=="scratch-content" || mode=="scratch-collision" || mode=="scratch-job" || mode=="scratch-job-exit") {
    var scratch=new CodexMods.PrivateStorage.ScratchContentProof(directory);
    try {
     if(mode=="scratch-collision") {
      Console.WriteLine(B64(scratch.Path));Console.Out.Flush();Console.In.ReadLine();
      try {scratch.Add(Encoding.UTF8.GetBytes("synthetic-private-content"));Console.WriteLine("unexpected-adoption");}
      catch(IOException){Console.WriteLine("refused-slot");}
     } else {
      string file=scratch.Add(Encoding.UTF8.GetBytes("synthetic-private-content"));
      Console.WriteLine(B64(scratch.Path)+"|"+B64(file));Console.Out.Flush();
      if(mode=="scratch-job" || mode=="scratch-job-exit") {
       var env=new Dictionary<string,string>();env.Add("SystemRoot",Environment.GetEnvironmentVariable("SystemRoot"));
       var result=OwnedProcess.Run(Exe,new string[]{"child",mode=="scratch-job"?"scratch-fork":"scratch-fork-exit",file,a[3]},scratch.Path,env,15000,1024,CancellationToken.None);
       if(result.ExitCode!=0)throw new IOException();
      } else Console.In.ReadLine();
     }
    } finally {
     try {scratch.Dispose();Console.WriteLine("removed");}catch(IOException){Console.WriteLine("retained-root");}
    }
    return 0;
   }
   var args=new List<string>();args.Add("child");args.Add(mode=="cancel"||mode=="outer-kill"?"fork":mode);
   for(int i=3;i<a.Length;i++)args.Add(a[i]);
   var environment=new Dictionary<string,string>();
   environment.Add("SystemRoot",Environment.GetEnvironmentVariable("SystemRoot"));
   environment.Add("MODS_SYNTHETIC_ALLOWED","visible-value");
   IntPtr sentinel=IntPtr.Zero;
   if(mode=="handle") {
    var sa=new Security();sa.Size=Marshal.SizeOf(typeof(Security));sa.Inherit=1;
    sentinel=CreateEventW(ref sa,true,false,IntPtr.Zero);if(sentinel==IntPtr.Zero)throw new IOException();
    if(!SetEvent(sentinel) || WaitForSingleObject(sentinel,0)!=0 || !ResetEvent(sentinel))throw new IOException();
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
  } catch(Exception failure) { Console.WriteLine(metadataPhase==null?"harness-failed":MetadataFailure(metadataPhase,failure));return 1; }
 }
}
