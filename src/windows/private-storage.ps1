# Fixed package source only. No profile/module discovery, policy override,
# elevation, downloaded code or compilation of request/configuration values.
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$PSModuleAutoLoadingPreference = 'None'
try {
  if ($PSVersionTable.PSVersion.Major -ne 5 -or $PSVersionTable.PSVersion.Minor -lt 1) { throw 'Windows PowerShell5.1 required' }
  $text = [System.Text.StringBuilder]::new()
  while (($c = [Console]::Read()) -ne -1) {
    if ($c -eq 10) { break }
    if ($text.Length -ge 32768) { throw 'Request bound' }
    [void]$text.Append([char]$c)
  }
  $parts = $text.ToString().Split('|')
  if ($parts.Length -ne 5 -or $parts[0] -cne '2') { throw 'Request frame' }
  $op = $parts[1]
  if ($op -cnotin @('prepare-directory','private-read','journal-append','journal-read','state-record','state-read','state-list','state-prune')) { throw 'Operation' }
  $utf8 = [System.Text.UTF8Encoding]::new($false,$true)
  $path = $utf8.GetString([Convert]::FromBase64String($parts[2]))
  $data = $parts[3]
  if ($parts[4] -cnotmatch '^(0|[1-9][0-9]{0,6})$') { throw 'Limit' }
  $limit = [int]$parts[4]
  $parameters = [System.CodeDom.Compiler.CompilerParameters]::new()
  $parameters.GenerateInMemory = $true
  $parameters.CompilerOptions = '/noconfig'
  [void]$parameters.ReferencedAssemblies.Add([System.Uri].Assembly.Location)
  $compiler = [Microsoft.CSharp.CSharpCodeProvider]::new()
  try {
    $compiled = $compiler.CompileAssemblyFromSource($parameters,[System.IO.File]::ReadAllText([System.IO.Path]::Combine($PSScriptRoot,'PrivateStorage.cs')))
  } finally { $compiler.Dispose() }
  if ($compiled.Errors.HasErrors) { throw 'Native source compilation failed' }
  $native = $compiled.CompiledAssembly.GetType('CodexMods.PrivateStorage',$true)
  $result = @($native.GetMethod('Run').Invoke($null,[object[]]@($op,$path,$data,$limit)))
  [Console]::WriteLine('2|ok|'+[string]$result.Length+'|'+[string]::Join('|',[string[]]$result))
} catch {
  [Console]::WriteLine('2|error')
  exit 1
}
