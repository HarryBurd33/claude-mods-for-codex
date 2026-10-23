# No policy override, profile, elevation or downloaded code.
# Load only the built-in signed Utility assembly; no module auto-discovery.
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$PSModuleAutoLoadingPreference = 'None'
try {
  $text = [System.Text.StringBuilder]::new()
  while (($c = [Console]::Read()) -ne -1) {
    if ($c -eq 10) { break }
    if ($text.Length -ge 32768) { throw 'Request bound' }
    [void]$text.Append([char]$c)
  }
  Import-Module -Name ([System.IO.Path]::Combine($PSHOME,'Microsoft.PowerShell.Commands.Utility.dll')) -ErrorAction Stop
  $request = $text.ToString() | ConvertFrom-Json
  if (($request.PSObject.Properties.Name | Sort-Object) -join ',' -ne 'data,limit,op,path,version' -or $request.version -ne 1) { throw 'Request shape' }
  if ($request.op -notin @('prepare-directory','private-read','journal-append','journal-read','state-record','state-read','state-list','state-prune')) { throw 'Operation' }
  Add-Type -Path ([System.IO.Path]::Combine($PSScriptRoot,'PrivateStorage.cs'))
  $result = @([CodexMods.PrivateStorage]::Run([string]$request.op,[string]$request.path,[string]$request.data,[int]$request.limit))
  [Console]::WriteLine((@{version=1;ok=$true;data=$result} | ConvertTo-Json -Compress))
} catch {
  [Console]::WriteLine('{"version":1,"ok":false}')
  exit 1
}
