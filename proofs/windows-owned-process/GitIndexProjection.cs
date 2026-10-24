// Original MIT proof implementation of the documented Git index wire format.
// Narrow SHA-1/v2 subset only; no Git source code copied, IO or production API.
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using System.Threading;

namespace CodexMods {
 public static partial class PrivateStorage {
  static uint IndexWord(byte[] b,int p) {return ((uint)b[p]<<24)|((uint)b[p+1]<<16)|((uint)b[p+2]<<8)|b[p+3];}
  static void IndexCheck(CancellationToken token,Stopwatch clock) {token.ThrowIfCancellationRequested();if(clock.ElapsedMilliseconds>=5000)throw Refuse();}
  // Returns a separately owned index, not a filename list. Caller must clear it.
  // Checksum is corruption detection, NOT authenticity/repository provenance.
  public static byte[] ProjectSha1IndexV2Proof(byte[] input,CancellationToken token) {
   var clock=Stopwatch.StartNew();IndexCheck(token,clock);
   if(input==null || input.Length<32 || input.Length>33554432)throw Refuse();
   byte[] bytes=(byte[])input.Clone();
   try {
    int end=bytes.Length-20;
    if(IndexWord(bytes,0)!=0x44495243 || IndexWord(bytes,4)!=2)throw Refuse();
    uint count=IndexWord(bytes,8);if(count>10000 || count>(end-12)/64)throw Refuse();
    using(var hash=SHA1.Create()) {
     byte[] expected=hash.ComputeHash(bytes,0,end);
     for(int i=0;i<20;i++)if(expected[i]!=bytes[end+i])throw Refuse();
    }
    IndexCheck(token,clock);int pos=12,previous=-1,previousLength=0;
    var files=new Dictionary<string,bool>(StringComparer.OrdinalIgnoreCase);
    var directories=new Dictionary<string,bool>(StringComparer.OrdinalIgnoreCase);
    var utf8=new UTF8Encoding(false,true);
    for(uint entry=0;entry<count;entry++) {
     IndexCheck(token,clock);int start=pos;
     if(end-pos<64)throw Refuse();
     uint mode=IndexWord(bytes,pos+24);
     if(mode!=0x81a4 && mode!=0x81ed || IndexWord(bytes,pos+4)>999999999 || IndexWord(bytes,pos+12)>999999999)throw Refuse();
     bool objectNonzero=false;for(int i=40;i<60;i++)objectNonzero|=bytes[pos+i]!=0;
     if(!objectNonzero)throw Refuse();
     int flags=(bytes[pos+60]<<8)|bytes[pos+61],length=flags&4095;
     // Refuse assume-valid, extended/skip/intent and merge stages; no silent
     // reinterpretation of their selection/freshness semantics.
     if((flags&0xf000)!=0 || length==0 || length>1024 || length>end-pos-63)throw Refuse();
     pos+=62;
     for(int i=0;i<length;i++)if(bytes[pos+i]==0)throw Refuse();
     if(bytes[pos+length]!=0)throw Refuse();
     if(previous>=0) {
      int order=0,n=Math.Min(previousLength,length);
      for(int i=0;i<n;i++)if(bytes[previous+i]!=bytes[pos+i]) {order=bytes[previous+i]<bytes[pos+i]?-1:1;break;}
      if(order==0)order=previousLength.CompareTo(length);
      if(order>=0)throw Refuse();
     }
     string name=utf8.GetString(bytes,pos,length);
     if(name.Length>200 || name.IndexOf('\\')>=0)throw Refuse();
     for(int i=0;i<name.Length;i++) {
      var category=System.Globalization.CharUnicodeInfo.GetUnicodeCategory(name,i);
      if(category==System.Globalization.UnicodeCategory.Control || category==System.Globalization.UnicodeCategory.Format)throw Refuse();
     }
     string[] parts=name.Split('/');if(parts.Length>16)throw Refuse();
     foreach(string part in parts)if(part.Length==0 || part=="." || part==".." || String.Equals(part,".git",StringComparison.OrdinalIgnoreCase))throw Refuse();
     // Syntax check only using an inert dummy root; no filesystem access or
     // secret/ignore selection. A future caller must validate its actual root.
     PathInput("C:\\index-proof\\"+name.Replace('/','\\'));
     if(files.ContainsKey(name) || directories.ContainsKey(name))throw Refuse();
     int slash=name.IndexOf('/');
     while(slash>=0) {string parent=name.Substring(0,slash);if(files.ContainsKey(parent))throw Refuse();directories[parent]=true;slash=name.IndexOf('/',slash+1);}
     files.Add(name,true);previous=pos;previousLength=length;
     int padded=((62+length+8)/8)*8;
     if(padded>end-start)throw Refuse();
     for(int i=pos+length;i<start+padded;i++)if(bytes[i]!=0)throw Refuse();
     pos=start+padded;
    }
    int entriesEnd=pos;var signatures=new Dictionary<uint,bool>();int extensions=0;
    while(pos<end) {
     IndexCheck(token,clock);
     if(end-pos<8 || ++extensions>64 || bytes[pos]<'A' || bytes[pos]>'Z')throw Refuse();
     uint signature=IndexWord(bytes,pos);if(signatures.ContainsKey(signature))throw Refuse();signatures.Add(signature,true);
     uint size=IndexWord(bytes,pos+4);if(size>end-pos-8)throw Refuse();
     pos+=8+(int)size; // Optional payloads are never parsed/copied into output.
    }
    IndexCheck(token,clock);byte[] projected=new byte[entriesEnd+20];
    try {
     Array.Copy(bytes,projected,entriesEnd);
     using(var hash=SHA1.Create()) {byte[] checksum=hash.ComputeHash(projected,0,entriesEnd);Array.Copy(checksum,0,projected,entriesEnd,20);}
     IndexCheck(token,clock);return projected;
    } catch {Array.Clear(projected,0,projected.Length);throw;}
   } catch(DecoderFallbackException) {throw Refuse();}
     catch(CryptographicException) {throw Refuse();}
   finally {Array.Clear(bytes,0,bytes.Length);}
  }
 }
}
