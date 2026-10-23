[CmdletBinding()]
param(
  [string]$ProjectPath = 'C:\Project\PeçaAki_Slz',
  [switch]$InstallDependencies
)

$ErrorActionPreference = 'Stop'
$TaskName = 'PecaAki Slz - Sincronizacao GitHub'
$SyncScript = Join-Path $ProjectPath 'scripts\sync-project.ps1'

if (-not (Test-Path $SyncScript)) {
  throw "Script de sincronização não encontrado: $SyncScript"
}

$dependencyArgument = if ($InstallDependencies) { ' -InstallDependencies' } else { '' }
$arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$SyncScript`" -ProjectPath `"$ProjectPath`"$dependencyArgument"
$action = New-ScheduledTaskAction -Execute 'PowerShell.exe' -Argument $arguments -WorkingDirectory $ProjectPath
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 5) -RepetitionDuration (New-TimeSpan -Days 3650)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force | Out-Null
Write-Output "Tarefa '$TaskName' configurada para verificar o GitHub a cada 5 minutos."
Write-Output "Log: $env:LOCALAPPDATA\PecaAkiSlz\sync.log"
Write-Output "Para testar agora: powershell -ExecutionPolicy Bypass -File `"$SyncScript`" -ProjectPath `"$ProjectPath`"$dependencyArgument"
