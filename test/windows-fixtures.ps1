# Test-only: adjusts ACLs of explicitly selected synthetic fixtures, never production settings.
$ErrorActionPreference = 'Stop'
try {
  $request = [Console]::In.ReadToEnd() | ConvertFrom-Json
  $sid = [System.Security.Principal.WindowsIdentity]::GetCurrent().User
  $isDirectory = [System.IO.Directory]::Exists([string]$request.path)
  $acl = if ($isDirectory) { New-Object System.Security.AccessControl.DirectorySecurity } else { New-Object System.Security.AccessControl.FileSecurity }
  $acl.SetOwner($sid)
  $acl.SetAccessRuleProtection($true,$false)
  foreach ($identity in @($sid.Value,'S-1-5-18','S-1-5-32-544')) {
    $principal = New-Object System.Security.Principal.SecurityIdentifier($identity)
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($principal,'FullControl','Allow')
    $acl.AddAccessRule($rule)
  }
  if ($request.mode -eq 'null') {
    $raw = New-Object System.Security.AccessControl.RawSecurityDescriptor(([System.Security.AccessControl.ControlFlags]::DiscretionaryAclPresent -bor [System.Security.AccessControl.ControlFlags]::DiscretionaryAclProtected),$sid,$sid,$null,$null)
    $bytes = New-Object byte[]($raw.BinaryLength)
    $raw.GetBinaryForm($bytes,0)
    $acl.SetSecurityDescriptorBinaryForm($bytes)
  } elseif ($request.mode -eq 'ancestor') {
    $principal = New-Object System.Security.Principal.SecurityIdentifier('S-1-1-0')
    $acl.AddAccessRule((New-Object System.Security.AccessControl.FileSystemAccessRule($principal,'DeleteSubdirectoriesAndFiles','Allow')))
  } elseif ($request.mode -eq 'broad' -or $request.mode -eq 'deny-and-broad') {
    $identity = if ($request.mode -eq 'deny-and-broad') { 'S-1-5-21-111-222-333-424242' } else { 'S-1-1-0' }
    $principal = New-Object System.Security.Principal.SecurityIdentifier($identity)
    $acl.AddAccessRule((New-Object System.Security.AccessControl.FileSystemAccessRule($principal,'ReadData','Allow')))
    if ($request.mode -eq 'deny-and-broad') {
      $acl.AddAccessRule((New-Object System.Security.AccessControl.FileSystemAccessRule($principal,'ReadData','Deny')))
    }
  } elseif ($request.mode -eq 'wrong-owner') {
    $acl.SetOwner((New-Object System.Security.Principal.SecurityIdentifier('S-1-5-32-544')))
  } elseif ($request.mode -eq 'inherited') {
    $acl.SetAccessRuleProtection($false,$false)
  } elseif ($request.mode -ne 'private') { throw 'Unknown test mode' }
  if ($isDirectory) { [System.IO.Directory]::SetAccessControl([string]$request.path,$acl) }
  else { [System.IO.File]::SetAccessControl([string]$request.path,$acl) }
  [Console]::WriteLine('fixture-ready')
} catch { [Console]::WriteLine('fixture-failed'); exit 1 }
