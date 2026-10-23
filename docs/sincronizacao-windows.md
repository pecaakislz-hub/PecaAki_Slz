# Sincronização automática no Windows

O Manus trabalha no ambiente remoto e não consegue gravar diretamente em `C:\Project\PeçaAki_Slz`. A sincronização é feita pelo GitHub:

1. O Manus altera e testa o projeto no Sandbox.
2. As alterações validadas são publicadas no branch `main` do GitHub.
3. O notebook verifica `origin/main` a cada cinco minutos.
4. O notebook executa `git pull --ff-only` somente quando não existem alterações locais.

O modo `--ff-only` impede que a tarefa faça merge automático ou sobrescreva trabalho local.

## Configuração única

Abra o PowerShell e execute:

```powershell
cd "C:\Project\PeçaAki_Slz"
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\install-sync-task.ps1 -ProjectPath "C:\Project\PeçaAki_Slz" -InstallDependencies
```

A tarefa criada será:

```text
PecaAki Slz - Sincronizacao GitHub
```

Ela verifica o GitHub a cada cinco minutos e grava o histórico em:

```text
%LOCALAPPDATA%\PecaAkiSlz\sync.log
```

## Pré-requisitos

O repositório local precisa ter `origin` configurado e acesso ao GitHub. Verifique com:

```powershell
git remote -v
git branch --show-current
```

O branch deve ser `main`. O projeto exige Node.js 22 ou superior:

```powershell
node -v
```

Se aparecer Node 20, instale/ative Node 22 antes de usar `-InstallDependencies`.

## Teste manual

```powershell
powershell -ExecutionPolicy Bypass -File ".\scripts\sync-project.ps1" -ProjectPath "C:\Project\PeçaAki_Slz" -InstallDependencies
```

## Proteção contra sobrescrita

Se houver alterações locais não commitadas, a sincronização será interrompida e nada será sobrescrito. Depois de salvar o trabalho local, use uma destas opções:

```powershell
git add .
git commit -m "trabalho local"
git push origin main
```

ou descarte conscientemente as alterações locais antes de sincronizar:

```powershell
git restore .
git clean -fd
```

O segundo comando é destrutivo e deve ser usado somente quando tiver certeza de que não precisa dos arquivos locais.

## Remover a tarefa

```powershell
Unregister-ScheduledTask -TaskName "PecaAki Slz - Sincronizacao GitHub" -Confirm:$false
```
