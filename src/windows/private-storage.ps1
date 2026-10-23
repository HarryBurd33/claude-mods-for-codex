# No policy override, profile, module import, elevation or downloaded code.
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
try {
  [Console]::InputEncoding = New-Object System.Text.UTF8Encoding($false)
  [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
  $text = New-Object System.Text.StringBuilder
  while (($c = [Console]::Read()) -ne -1) {
    if ($text.Length -ge 32768) { throw 'Request bound' }
    [void]$text.Append([char]$c)
  }
  $request = $text.ToString() | ConvertFrom-Json
  if (($request.PSObject.Properties.Name | Sort-Object) -join ',' -ne 'data,limit,op,path,version' -or $request.version -ne 1) { throw 'Request shape' }
  if ($request.op -notin @('prepare-directory','private-read','journal-append','journal-read')) { throw 'Operation' }
  Add-Type -Path (Join-Path $PSScriptRoot 'PrivateStorage.cs')
  $result = @([CodexMods.PrivateStorage]::Run([string]$request.op,[string]$request.path,[string]$request.data,[int]$request.limit))
  [Console]::WriteLine((@{version=1;ok=$true;data=$result} | ConvertTo-Json -Compress))
} catch {
  [Console]::WriteLine('{"version":1,"ok":false}')
  exit 1
}
