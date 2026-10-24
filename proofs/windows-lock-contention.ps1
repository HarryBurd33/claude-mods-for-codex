# Fixed public source compiled in memory for owned NTFS fixtures only.
# No profile/module discovery, execution-policy change or request-supplied code.
param([Parameter(Mandatory=$true)][string]$Directory,[Parameter(Mandatory=$true)][string]$Mode)
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$PSModuleAutoLoadingPreference = 'None'
try {
  if ($PSVersionTable.PSVersion.Major -ne 5 -or $PSVersionTable.PSVersion.Minor -lt 1) { throw 'Windows PowerShell5.1 required' }
  if ($Mode -cnotin @('metadata-only','directory-data','held-lock')) { throw 'Closed lock proof mode required' }
  $parameters = [System.CodeDom.Compiler.CompilerParameters]::new()
  $parameters.GenerateInMemory = $true
  $parameters.CompilerOptions = '/noconfig'
  [void]$parameters.ReferencedAssemblies.Add([System.Uri].Assembly.Location)
  $sources = [string[]]@(
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'../src/windows/PrivateStorage.cs')),
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'windows-lock-contention.cs')))
  $compiler = [Microsoft.CSharp.CSharpCodeProvider]::new()
  try { $compiled = $compiler.CompileAssemblyFromSource($parameters,$sources) }
  finally { $compiler.Dispose() }
  if ($compiled.Errors.HasErrors) { throw 'Native source compilation failed' }
  $native = $compiled.CompiledAssembly.GetType('CodexMods.PrivateStorage',$true)
  $result = $native.GetMethod('LockContentionProof').Invoke($null,[object[]]@($Directory,$Mode))
  [Console]::WriteLine([string]$result)
} catch {
  # Test-only closed stage/numeric result. Never print exception messages or paths.
  $stage = 0; $createError = -1
  if ($null -ne $native) {
    $stage = [int]$native.GetField('LockProofStage').GetValue($null)
    $createError = [int]$native.GetField('LockProofCreateError').GetValue($null)
  }
  [Console]::WriteLine('lock-proof-refused|stage|'+$stage+'|create-error|'+$createError)
  exit 1
}
