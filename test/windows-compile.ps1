# Compile only public package source. On failure emit bounded source diagnostics,
# replacing the checkout path; no fixture/settings/export input is involved.
$ErrorActionPreference = 'Stop'
try {
  Add-Type -Path (Join-Path $PSScriptRoot '../src/windows/PrivateStorage.cs')
  [Console]::WriteLine('native-source-compiled')
} catch {
  $root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
  $message = ($_ | Out-String).Replace($root,'<package>')
  [Console]::WriteLine($message.Substring(0,[Math]::Min($message.Length,4096)))
  exit 1
}
