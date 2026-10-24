// Original MIT. Observation-only repeat probe after ProgramPins refusal. Never
// grants authority, reads image content, launches code or changes production ACLs.
using System;
using System.IO;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Security.AccessControl;
using Microsoft.Win32.SafeHandles;

namespace CodexMods {
 public static partial class PrivateStorage {
  enum ProbeRole { Input, ProjectAncestor, CodeAncestor, CodeDirectory, Executable, Complete }
  enum ProbeReason { PathPolicy, ScopePolicy, Missing, AccessDenied, Sharing, OpenOther,
   ObjectPolicy, VolumePolicy, DescriptorPolicy, OwnerPolicy, AcePolicy,
   ForeignInstallerGrant, ForeignMutationGrant, AccessUnclassified, NoRepeatRefusal, ProbeUnavailable }
  static string ProbeFrame(ProbeRole role,ProbeReason reason,int segment) {
   return role.ToString()+"|"+reason.ToString()+"|"+segment.ToString(System.Globalization.CultureInfo.InvariantCulture);
  }
  // Classification of a NEW descriptor sample only after the real shared Access/
  // CodeAccess policy refused. Mirrors relevant predicates for explanation, never
  // substitutes for the actual policy or establishes atomic causal identity.
  static ProbeReason ProbeAccessDetail(SafeFileHandle h,bool code) {
   try {
    var sd=Descriptor(h);
    if(!Trusted(sd.Owner.Value) && sd.Owner.Value!=Installer)return ProbeReason.OwnerPolicy;
    const uint ancestorMutation=0x10000000|0x40000000|0x80000|0x40000|0x10000|0x100|0x40;
    const uint codeMutation=0x10000000|0x40000000|0x80000|0x40000|0x10000|0x100|0x10|0x4|0x2;
    foreach(GenericAce entry in sd.DiscretionaryAcl) {
     var ace=entry as CommonAce;
     if(ace==null || ace.IsCallback || (ace.AceQualifier!=AceQualifier.AccessAllowed && ace.AceQualifier!=AceQualifier.AccessDenied))return ProbeReason.AcePolicy;
     if(ace.AceQualifier==AceQualifier.AccessAllowed && (ace.AceFlags&AceFlags.InheritOnly)==0
      && !Trusted(ace.SecurityIdentifier.Value) && (unchecked((uint)ace.AccessMask)&ancestorMutation)!=0)
      return ace.SecurityIdentifier.Value==Installer?ProbeReason.ForeignInstallerGrant:ProbeReason.ForeignMutationGrant;
    }
    // Original CodeAccess first runs Access, then applies its stricter code mask.
    if(code) {
     foreach(GenericAce entry in sd.DiscretionaryAcl) {
      var ace=(CommonAce)entry;
      if(ace.AceQualifier==AceQualifier.AccessAllowed && (ace.AceFlags&AceFlags.InheritOnly)==0
       && !Trusted(ace.SecurityIdentifier.Value) && (unchecked((uint)ace.AccessMask)&codeMutation)!=0)
       return ace.SecurityIdentifier.Value==Installer?ProbeReason.ForeignInstallerGrant:ProbeReason.ForeignMutationGrant;
     }
    }
    return ProbeReason.AccessUnclassified;
   } catch(IOException) {return ProbeReason.DescriptorPolicy;}
  }
  static string ProbeObject(List<IDisposable> held,string path,bool directory,bool code,bool volume,ProbeRole role,int segment) {
   var h=CreateFileW(path,(directory?Attributes|1:GenericRead)|ReadControl,directory?3u:1u,IntPtr.Zero,3,(directory?Backup:0)|OpenReparse,IntPtr.Zero);
   int error=h.IsInvalid?Marshal.GetLastWin32Error():0;
   held.Add(h);
   if(h.IsInvalid) {
    var reason=(error==2 || error==3)?ProbeReason.Missing:error==5?ProbeReason.AccessDenied:
     (error==32 || error==33)?ProbeReason.Sharing:ProbeReason.OpenOther;
    return ProbeFrame(role,reason,segment);
   }
   try {Info(h,path,directory);}catch(IOException){return ProbeFrame(role,ProbeReason.ObjectPolicy,segment);}
   try {if(code)CodeAccess(h);else Access(h,false);}
   catch(IOException){return ProbeFrame(role,ProbeAccessDetail(h,code),segment);}
   if(volume)try {Volume(h,path);}catch(IOException){return ProbeFrame(role,ProbeReason.VolumePolicy,segment);}
   return null;
  }
  static string ProbeAncestors(List<IDisposable> held,string path,bool targetDirectory,ProbeRole role) {
   string root=path.Substring(0,3),cursor=root;
   if(GetDriveTypeW(root)!=3)return ProbeFrame(role,ProbeReason.VolumePolicy,0);
   string result=ProbeObject(held,root,true,false,true,role,0);if(result!=null)return result;
   string[] parts=path.Substring(3).Split('\\');int end=targetDirectory?parts.Length:parts.Length-1;
   for(int n=0;n<end;n++) {
    cursor=Path.Combine(cursor,parts[n]);
    result=ProbeObject(held,cursor,true,false,false,role,n+1);if(result!=null)return result;
   }
   return null;
  }
  public static string ProgramPinDiagnosisProof(string executable,string codeRoot,string selectedProject) {
   try {PathInput(executable);PathInput(codeRoot);PathInput(selectedProject);}
   catch(IOException){return ProbeFrame(ProbeRole.Input,ProbeReason.PathPolicy,0);}
   if(!executable.EndsWith(".exe",StringComparison.OrdinalIgnoreCase) || !Within(codeRoot,Path.GetDirectoryName(executable))
    || Within(selectedProject,codeRoot) || Within(codeRoot,selectedProject))return ProbeFrame(ProbeRole.Input,ProbeReason.ScopePolicy,0);
   var held=new List<IDisposable>();
   try {
    string result=ProbeAncestors(held,selectedProject,true,ProbeRole.ProjectAncestor);if(result!=null)return result;
    result=ProbeAncestors(held,executable,false,ProbeRole.CodeAncestor);if(result!=null)return result;
    string directory=Path.GetDirectoryName(executable),cursor=codeRoot;int segment=0;
    while(true) {
     result=ProbeObject(held,cursor,true,true,false,ProbeRole.CodeDirectory,segment++);if(result!=null)return result;
     if(String.Equals(cursor,directory,StringComparison.OrdinalIgnoreCase))break;
     string remaining=directory.Substring(cursor.Length+1);int slash=remaining.IndexOf('\\');
     cursor=Path.Combine(cursor,slash<0?remaining:remaining.Substring(0,slash));
    }
    result=ProbeObject(held,executable,false,true,false,ProbeRole.Executable,0);
    return result??ProbeFrame(ProbeRole.Complete,ProbeReason.NoRepeatRefusal,0);
   } catch(IOException) {return ProbeFrame(ProbeRole.Input,ProbeReason.ProbeUnavailable,0);}
   finally {for(int n=held.Count-1;n>=0;n--)held[n].Dispose();}
  }
 }
}
