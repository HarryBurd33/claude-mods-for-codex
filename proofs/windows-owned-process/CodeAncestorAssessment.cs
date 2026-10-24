// Original MIT, proof-only. Metadata assessment for ONE OS-known directory.
// Never executable/private-data admission, image IO, an update or an ACL repair.
using System;
using System.IO;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Security.AccessControl;
using System.Security.Principal;

namespace CodexMods {
 public static partial class PrivateStorage {
  public enum CodeAncestorAssessment { MatchesDraftRule, InputPolicy, ScopePolicy, PlatformPolicy,
   KnownFolderUnavailable, ObjectPolicy, AncestorPolicy, DescriptorPolicy, OwnerPolicy,
   AcePolicy, ForeignMutation, ProbeUnavailable }
  [DllImport("shell32.dll",ExactSpelling=true)]
  static extern int SHGetKnownFolderPath(ref Guid id,uint flags,IntPtr token,out IntPtr path);

  // Private predicate: true scope is supplied only after OS-known-folder matching,
  // except the separately named closed synthetic-case harness below.
  static CodeAncestorAssessment AssessKnownCodeDescriptor(RawSecurityDescriptor sd,bool scopeMatched) {
   if(!scopeMatched)return CodeAncestorAssessment.ScopePolicy;
   if(sd==null || sd.Owner==null || sd.DiscretionaryAcl==null || sd.DiscretionaryAcl.Count>128
    || (sd.ControlFlags&ControlFlags.DiscretionaryAclPresent)==0)return CodeAncestorAssessment.DescriptorPolicy;
   if(!Trusted(sd.Owner.Value) && sd.Owner.Value!=Installer)return CodeAncestorAssessment.OwnerPolicy;
   // Union of original ancestor/code mutation masks. A child directory or image
   // cannot inherit this scope exception; it is not assessed by this predicate.
   const uint mutation=0x10000000|0x40000000|0x80000|0x40000|0x10000|0x100|0x40|0x10|0x4|0x2;
   foreach(GenericAce entry in sd.DiscretionaryAcl) {
    var ace=entry as CommonAce;
    if(ace==null || ace.IsCallback || (ace.AceQualifier!=AceQualifier.AccessAllowed && ace.AceQualifier!=AceQualifier.AccessDenied))
     return CodeAncestorAssessment.AcePolicy;
    if(ace.AceQualifier!=AceQualifier.AccessAllowed || (ace.AceFlags&AceFlags.InheritOnly)!=0)continue;
    string sid=ace.SecurityIdentifier.Value;
    if(!Trusted(sid) && sid!=Installer && (unchecked((uint)ace.AccessMask)&mutation)!=0)return CodeAncestorAssessment.ForeignMutation;
   }
   return CodeAncestorAssessment.MatchesDraftRule;
  }
  static CodeAncestorAssessment KnownCodeAncestorScope(string candidate) {
   try {PathInput(candidate);}catch(IOException){return CodeAncestorAssessment.InputPolicy;}
   // Microsoft documents ProgramFilesX64 as unsupported for 32-bit OS/processes.
   if(!Environment.Is64BitOperatingSystem || !Environment.Is64BitProcess)return CodeAncestorAssessment.PlatformPolicy;
   IntPtr memory=IntPtr.Zero;string known;
   try {
    var id=new Guid("6d809377-6af0-444b-8957-a3773f02200e");
    // DONT_VERIFY only: no CREATE/INIT/DEFAULT_PATH and no alternate-user token.
    if(SHGetKnownFolderPath(ref id,0x4000,IntPtr.Zero,out memory)!=0 || memory==IntPtr.Zero)return CodeAncestorAssessment.KnownFolderUnavailable;
    // Bound conversion of OS-returned UTF16; no registry/environment/path dump.
    int n=0;while(n<=240 && Marshal.ReadInt16(memory,n*2)!=0)n++;
    if(n>240)return CodeAncestorAssessment.KnownFolderUnavailable;
    known=Marshal.PtrToStringUni(memory,n);PathInput(known);
   } catch(IOException) {return CodeAncestorAssessment.KnownFolderUnavailable;}
   finally {if(memory!=IntPtr.Zero)Marshal.FreeCoTaskMem(memory);}
   return String.Equals(candidate,known,StringComparison.OrdinalIgnoreCase)?CodeAncestorAssessment.MatchesDraftRule:CodeAncestorAssessment.ScopePolicy;
  }
  public static CodeAncestorAssessment AssessKnownCodeAncestorProof(string candidate) {
   var scope=KnownCodeAncestorScope(candidate);
   if(scope!=CodeAncestorAssessment.MatchesDraftRule)return scope;
   var held=new List<IDisposable>();
   try {
    string root=candidate.Substring(0,3),cursor=root;
    if(GetDriveTypeW(root)!=3)return CodeAncestorAssessment.ObjectPolicy;
    string[] parts=candidate.Substring(3).Split('\\');
    for(int n=-1;n<parts.Length;n++) {
     if(n>=0)cursor=Path.Combine(cursor,parts[n]);
     var h=CreateFileW(cursor,ReadControl|Attributes|1,3,IntPtr.Zero,3,Backup|OpenReparse,IntPtr.Zero);held.Add(h);
     try {Info(h,cursor,true);if(n<0)Volume(h,candidate);}
     catch(IOException){return CodeAncestorAssessment.ObjectPolicy;}
     if(n==parts.Length-1)return AssessKnownCodeDescriptor(Descriptor(h),true);
     try {Access(h,false);}catch(IOException){return CodeAncestorAssessment.AncestorPolicy;}
    }
    return CodeAncestorAssessment.ProbeUnavailable;
   } catch(IOException){return CodeAncestorAssessment.DescriptorPolicy;}
   finally {for(int n=held.Count-1;n>=0;n--)held[n].Dispose();}
  }

  // Synthetic descriptor tests. No arbitrary SDDL input, lookup, file or OS ACL
  // mutation; scopeMatched here is a test assumption, never an OS observation.
  public static CodeAncestorAssessment CodeAncestorDescriptorCaseProof(string kind) {
   var owner=new SecurityIdentifier(User);var foreign=new SecurityIdentifier("S-1-1-0");
   var installer=new SecurityIdentifier(Installer);
   var acl=new RawAcl(GenericAcl.AclRevisionDS,8);
   foreach(string sid in new string[]{User,"S-1-5-18","S-1-5-32-544"})
    acl.InsertAce(acl.Count,new CommonAce(AceFlags.None,AceQualifier.AccessAllowed,0x1f01ff,new SecurityIdentifier(sid),false,null));
   bool scopeMatched=true;var flags=ControlFlags.DiscretionaryAclPresent;
   switch(kind) {
    case "base":break;
    case "unscoped":scopeMatched=false;break;
    case "installer":acl.InsertAce(acl.Count,new CommonAce(AceFlags.None,AceQualifier.AccessAllowed,0x1f01ff,installer,false,null));break;
    case "installer-owner":owner=installer;goto case "installer";
    case "foreign-read":acl.InsertAce(acl.Count,new CommonAce(AceFlags.None,AceQualifier.AccessAllowed,0x1200a9,foreign,false,null));break;
    case "foreign-write":acl.InsertAce(acl.Count,new CommonAce(AceFlags.None,AceQualifier.AccessAllowed,2,foreign,false,null));break;
    case "foreign-generic":acl.InsertAce(acl.Count,new CommonAce(AceFlags.None,AceQualifier.AccessAllowed,0x40000000,foreign,false,null));break;
    case "foreign-deny-allow":
     acl.InsertAce(acl.Count,new CommonAce(AceFlags.None,AceQualifier.AccessDenied,2,foreign,false,null));goto case "foreign-write";
    case "foreign-service":acl.InsertAce(acl.Count,new CommonAce(AceFlags.None,AceQualifier.AccessAllowed,2,new SecurityIdentifier("S-1-5-80-1-2-3-4-5"),false,null));break;
    case "foreign-owner":owner=foreign;break;
    case "no-owner":owner=null;break;
    case "missing-dacl-flag":flags=ControlFlags.None;break;
    case "inherit-only":acl.InsertAce(acl.Count,new CommonAce(AceFlags.InheritOnly|AceFlags.ContainerInherit,AceQualifier.AccessAllowed,2,foreign,false,null));break;
    case "callback":acl.InsertAce(acl.Count,new CommonAce(AceFlags.None,AceQualifier.AccessAllowed,1,foreign,true,new byte[4]));break;
    case "object-ace":acl.InsertAce(acl.Count,new ObjectAce(AceFlags.None,AceQualifier.AccessAllowed,1,foreign,ObjectAceFlags.ObjectAceTypePresent,new Guid("11111111-1111-1111-1111-111111111111"),Guid.Empty,false,null));break;
    case "too-many":for(int n=0;n<126;n++)acl.InsertAce(acl.Count,new CommonAce(AceFlags.None,AceQualifier.AccessAllowed,1,foreign,false,null));break;
    case "null-dacl":acl=null;break;
    default:return CodeAncestorAssessment.InputPolicy;
   }
   var sd=new RawSecurityDescriptor(flags,owner,owner,null,acl);
   return AssessKnownCodeDescriptor(sd,scopeMatched);
  }
 }
}
