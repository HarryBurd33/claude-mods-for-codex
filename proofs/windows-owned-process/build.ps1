# Compile fixed original public sources into the explicit disposable OS test root.
# No execution-policy override, elevation, external compiler or module discovery.
param([Parameter(Mandatory=$true)][string]$Destination)
$ErrorActionPreference = 'Stop'
$PSModuleAutoLoadingPreference = 'None'
try {
  if ($PSVersionTable.PSVersion.Major -ne 5) { throw 'Windows PowerShell5.1 required' }
  $parameters = [System.CodeDom.Compiler.CompilerParameters]::new()
  $parameters.GenerateExecutable = $true
  $parameters.OutputAssembly = [System.IO.Path]::Combine($Destination,'owned-proof.exe')
  $parameters.CompilerOptions = '/noconfig'
  [void]$parameters.ReferencedAssemblies.Add([System.Uri].Assembly.Location)
  $sources = [string[]]@(
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'OwnedProcess.cs')),
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'ProgramBoundary.cs')),
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'ProgramDiagnostics.cs')),
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'CodeAncestorAssessment.cs')),
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'CodeAncestorLease.cs')),
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'ScratchContent.cs')),
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'ProjectReadSet.cs')),
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'GitMetadataScratch.cs')),
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'GitMetadataCapture.cs')),
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'GitIndexProjection.cs')),
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'GitSelectedMetadata.cs')),
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'MetadataOperation.cs')),
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'../../src/windows/PrivateStorage.cs')),
    [System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'Harness.cs')))
  $compiler = [Microsoft.CSharp.CSharpCodeProvider]::new()
  try { $result = $compiler.CompileAssemblyFromSource($parameters,$sources) }
  finally { $compiler.Dispose() }
  if ($result.Errors.HasErrors) {
    foreach ($item in $result.Errors) {
      [Console]::WriteLine([string]$item.ErrorNumber+':'+[string]$item.Line+':'+[string]$item.ErrorText)
    }
    exit 1
  }
  [Console]::WriteLine('proof-compiled')
} catch { [Console]::WriteLine('proof-build-refused');exit 1 }
