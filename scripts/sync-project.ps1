[CmdletBinding()]
param(
  [string]$ProjectPath = 'C:\Project\PeçaAki_Slz',
  [switch]$InstallDependencies
)

$ErrorActionPreference = 'Stop'
$LogDirectory = Join-Path $env:LOCALAPPDATA 'PecaAkiSlz'
$LogPath = Join-Path $LogDirectory 'sync.log'

New-Item -ItemType Directory -Force -Path $LogDirectory | Out-Null

function Write-Log {
  param([string]$Message)
  $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $Message"
  Add-Content -Path $LogPath -Value $line -Encoding UTF8
  Write-Output $line
}

try {
  if (-not (Test-Path (Join-Path $ProjectPath '.git'))) {
    throw "A pasta '$ProjectPath' não contém um repositório Git válido."
  }

  Push-Location $ProjectPath
  try {
    $branch = (& git branch --show-current).Trim()
    if ($branch -ne 'main') {
      throw "A sincronização automática exige o branch main. Branch atual: '$branch'."
    }

    $dirty = (& git status --porcelain)
    if ($dirty) {
      Write-Log 'SINCRONIZAÇÃO IGNORADA: existem alterações locais não commitadas. Nenhum arquivo foi sobrescrito.'
      exit 2
    }

    $before = (& git rev-parse HEAD).Trim()
    & git fetch origin main --prune
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao consultar origin/main.' }

    $remote = (& git rev-parse origin/main).Trim()
    if ($before -eq $remote) {
      Write-Log "Já atualizado em $before."
      exit 0
    }

    & git pull --ff-only origin main
    if ($LASTEXITCODE -ne 0) {
      throw 'Falha no git pull --ff-only. Pode existir divergência entre o notebook e o GitHub.'
    }

    $after = (& git rev-parse HEAD).Trim()
    $changedFiles = @(git diff --name-only $before $after)
    Write-Log "Atualizado de $before para $after ($($changedFiles.Count) arquivo(s))."

    $dependencyChanged = $changedFiles -contains 'package.json' -or $changedFiles -contains 'package-lock.json'
    if ($dependencyChanged) {
      if ($InstallDependencies) {
        $nodeMajor = [int]((& node -p "process.versions.node.split('.')[0]").Trim())
        if ($nodeMajor -lt 22) {
          Write-Log "DEPENDÊNCIAS NÃO INSTALADAS: Node.js 22+ é necessário; encontrado Node $nodeMajor."
        } else {
          Write-Log 'package.json/package-lock.json alterado(s); executando npm ci.'
          & npm ci --no-audit --no-fund
          if ($LASTEXITCODE -ne 0) { throw 'npm ci falhou após a atualização.' }
          Write-Log 'Dependências atualizadas com sucesso.'
        }
      } else {
        Write-Log 'ATENÇÃO: dependências alteradas. Execute npm ci ou agende o script com -InstallDependencies.'
      }
    }
  } finally {
    Pop-Location
  }
} catch {
  Write-Log "ERRO: $($_.Exception.Message)"
  exit 1
}
