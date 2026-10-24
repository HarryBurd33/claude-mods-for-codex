// Original MIT proof only. Positive detached/one-loose-ref source binding;
// no repository discovery, ref fallback, Git execution or production operation.
using System;
using System.Diagnostics;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;

namespace CodexMods {
 public static partial class PrivateStorage {
  public sealed class GitSelectedMetadataProof : IDisposable {
   ProjectReadSetProof head,reference;GitMetadataCaptureProof metadata;
   readonly CancellationToken cancellation;bool disposed;
   public string Path {get {if(disposed || metadata==null)throw Refuse();return metadata.Path;}}
   void Check(Stopwatch clock) {cancellation.ThrowIfCancellationRequested();if(disposed || clock.ElapsedMilliseconds>=5000)throw Refuse();}
   static string Line(byte[] bytes) {
    // Reader caps are the inherited256KiB/file; parse limits are narrower.
    if(bytes.Length==0 || bytes.Length>512)throw Refuse();
    foreach(byte value in bytes)if(value==0 || value>127)throw Refuse();
    string line=Encoding.ASCII.GetString(bytes);
    if(line.EndsWith("\r\n",StringComparison.Ordinal))line=line.Substring(0,line.Length-2);
    else if(line.EndsWith("\n",StringComparison.Ordinal))line=line.Substring(0,line.Length-1);
    // No Trim(), BOM, embedded line break or trailing whitespace normalization.
    if(line.IndexOf('\r')>=0 || line.IndexOf('\n')>=0)throw Refuse();return line;
   }
   static string Commit(string line) {
    if(!Regex.IsMatch(line,@"\A[a-f0-9]{40}\z") || line==new string('0',40))throw Refuse();return line;
   }
   static string Reference(string line,string root) {
    if(!line.StartsWith("ref: refs/heads/",StringComparison.Ordinal))throw Refuse();
    string path=line.Substring(5);
    if(path.Length>160 || path.Contains(".."))throw Refuse();
    string[] parts=path.Split('/');if(parts.Length>16)throw Refuse();
    foreach(string part in parts) {
     if(!Regex.IsMatch(part,@"\A[A-Za-z0-9_-][A-Za-z0-9_.-]*\z") || part.EndsWith(".",StringComparison.Ordinal)
      || part.EndsWith(".lock",StringComparison.OrdinalIgnoreCase))throw Refuse();
    }
    // Reuse the existing strict relative/secret-name policy and actual-root
    // syntax validation before opening the single source-controlled ref name.
    ProjectPath(root,path);return path;
   }
   public GitSelectedMetadataProof(string selectedMetadata,string privateParent,bool exclude,CancellationToken token) {
    cancellation=token;var clock=Stopwatch.StartNew();Check(clock);
    PathInput(selectedMetadata);PathInput(privateParent);
    if(Within(selectedMetadata,privateParent) || Within(privateParent,selectedMetadata))throw Refuse();
    ProjectPath(selectedMetadata,"HEAD");
    PathInput(System.IO.Path.Combine(selectedMetadata,"index"));
    PathInput(System.IO.Path.Combine(selectedMetadata,"info","exclude"));
    byte[] headBytes=null,refBytes=null;
    try {
     head=new ProjectReadSetProof(selectedMetadata,new string[]{"HEAD"},token);
     headBytes=head.Bytes(0);Check(clock);string line=Line(headBytes),commit;
     if(line.StartsWith("ref:",StringComparison.Ordinal)) {
      string path=Reference(line,selectedMetadata);
      reference=new ProjectReadSetProof(selectedMetadata,new string[]{path},token);
      refBytes=reference.Bytes(0);Check(clock);commit=Commit(Line(refBytes));
     } else commit=Commit(line);
     head.Verify();if(reference!=null)reference.Verify();Check(clock);
     metadata=new GitMetadataCaptureProof(selectedMetadata,privateParent,commit,true,exclude,token,true);
     Verify(clock);
    } catch {try {Dispose();}catch(System.IO.IOException){}throw;}
    finally {
     if(headBytes!=null)Array.Clear(headBytes,0,headBytes.Length);
     if(refBytes!=null)Array.Clear(refBytes,0,refBytes.Length);
    }
   }
   void Verify(Stopwatch clock) {
    Check(clock);head.Verify();if(reference!=null)reference.Verify();Check(clock);
    if(metadata!=null)metadata.Verify();Check(clock);
   }
   public void Verify() {Verify(Stopwatch.StartNew());}
   public void Dispose() {
    if(disposed)return;disposed=true;
    try {if(metadata!=null)metadata.Dispose();}
    finally {try {if(reference!=null)reference.Dispose();}finally {if(head!=null)head.Dispose();}}
   }
  }
 }
}
