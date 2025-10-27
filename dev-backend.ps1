<#
Script colaborativo para iniciar todos os microserviços backend do projeto FInKids.

Melhorias nesta versão:
- Opcional: pular a criação/uso de venvs locais (use o switch -SkipVenv ou a env var FINKIDS_SKIP_VENV=1)
- Desativa escrita de bytecode (.pyc / __pycache__) definindo PYTHONDONTWRITEBYTECODE=1
- Quando estiver no modo de pular venv, o script NÃO tentará instalar dependências automaticamente

Uso:
  powershell -ExecutionPolicy Bypass -File .\dev-backend.ps1           # modo padrão (cria/usa venvs)
  powershell -ExecutionPolicy Bypass -File .\dev-backend.ps1 -SkipVenv # pula criação de venv e não instala deps

Observação: pular venv significa que você precisa ter as dependências instaladas globalmente ou em outro ambiente.
Se você não quiser que o Python gere __pycache__/.pyc localmente, este script define PYTHONDONTWRITEBYTECODE=1
#>

param(
    [switch]$SkipVenv,
    [switch]$AutoDiscover
)

$ErrorActionPreference = 'Stop'

# Ambiente: se a env var FINKIDS_SKIP_VENV=1 estiver definida, também pulamos a criação de venvs
$skipVenv = $SkipVenv.IsPresent -or ($env:FINKIDS_SKIP_VENV -eq '1')

# Evita que o Python escreva arquivos .pyc / __pycache__ (herdado por processos filhos)
$env:PYTHONDONTWRITEBYTECODE = '1'

# Se estamos no modo SkipVenv, tenta descobrir o executável Python ativo (para usar nas novas janelas)
$currentPythonExe = $null
if ($skipVenv) {
    try {
        $raw = & python -c "import sys;print(sys.executable)" 2>$null
        if ($raw) { $currentPythonExe = $raw -replace "\r|\n", "" }
    } catch {
        # ignora
        $currentPythonExe = $null
    }
    if ($currentPythonExe) { Write-Host "[INFO] Usando python ativo: $currentPythonExe for new windows" -ForegroundColor Cyan }
}


# Se AutoDiscover for solicitado, monta $services automaticamente a partir das pastas em 'backend/'
$services = @()
$defaultPorts = @{ 'auth-service' = 8000; 'user-service' = 8001; 'gamification-service' = 8002; 'learning-service' = 8003 }

if ($AutoDiscover.IsPresent) {
    Write-Host "[INFO] AutoDiscover ativado: buscando serviços em 'backend/'..." -ForegroundColor Cyan
    $backendRoot = Join-Path $PWD 'backend'
    if (Test-Path $backendRoot) {
        $dirs = Get-ChildItem -Path $backendRoot -Directory -ErrorAction SilentlyContinue
        $nextPort = 9000
        foreach ($d in $dirs) {
            $svcMain = Join-Path $d.FullName 'main.py'
            if (Test-Path $svcMain) {
                $name = $d.Name
                $port = if ($defaultPorts.ContainsKey($name)) { $defaultPorts[$name] } else { $nextPort; $nextPort++ }
                $services += @{ Name = $name; Path = (Join-Path 'backend' $name); Port = $port }
            }
        }
    } else {
        Write-Host "[WARN] Pasta 'backend' não encontrada no diretório atual: $PWD" -ForegroundColor Yellow
    }
} else {
    # Comportamento padrão (lista fixa)
    $services = @(
        @{ Name = 'auth-service'; Path = 'backend/auth-service'; Port = 8000 },
        @{ Name = 'user-service'; Path = 'backend/user-service'; Port = 8001 },
        @{ Name = 'gamification-service'; Path = 'backend/gamification-service'; Port = 8002 },
        @{ Name = 'learning-service'; Path = 'backend/learning-service'; Port = 8003 }
    )
}

foreach ($svc in $services) {
    $servicePath = Join-Path $PWD $svc.Path
    $venvPath = Join-Path $servicePath '.venv'
    $venvActivate = Join-Path $venvPath 'Scripts/Activate.ps1'
    $mainFile = Join-Path $servicePath 'main.py'
    $requirements = Join-Path $servicePath 'requirements.txt'
    $port = $svc.Port
    $title = $svc.Name

    if (!(Test-Path $servicePath)) {
        Write-Host "[WARN] Pasta do serviço $title não existe: $servicePath, pulando..." -ForegroundColor Yellow
        continue
    }

    if (!(Test-Path $mainFile)) {
        Write-Host "[WARN] $title não possui main.py, pulando..." -ForegroundColor Yellow
        continue
    }

    # Se o usuário pediu para NÃO criar venvs, apenas avisa sobre requirements e segue
    if ($skipVenv) {
        if (Test-Path $requirements) {
            Write-Host "[INFO] Modo SkipVenv ativado. Arquivo requirements existe para $title, mas não será instalado automaticamente. Garanta que as deps estejam disponíveis." -ForegroundColor Cyan
        }
    } else {
        # Cria venv se não existir
        if (!(Test-Path $venvPath)) {
            Write-Host "[INFO] Criando venv para $title..." -ForegroundColor Cyan
            if (Get-Command py -ErrorAction SilentlyContinue) {
                & py -3 -m venv $venvPath
            } else {
                & python -3 -m venv $venvPath
            }
        }

        # Instala dependências dentro do venv se houver requirements
        if (Test-Path $requirements) {
            Write-Host "[INFO] Instalando dependências para $title dentro do venv..." -ForegroundColor Cyan
            $pipCmd = Join-Path $venvPath 'Scripts\python.exe'
            if (Test-Path $pipCmd) {
                & $pipCmd -m pip install --upgrade pip
                & $pipCmd -m pip install -r $requirements
            } else {
                # fallback para python global (pode falhar se não existir)
                if (Get-Command py -ErrorAction SilentlyContinue) {
                    & py -3 -m pip install --upgrade pip
                    & py -3 -m pip install -r $requirements
                } else {
                    & python -m pip install --upgrade pip
                    & python -m pip install -r $requirements
                }
            }
        }
    }

    # Monta comando para iniciar serviço: usamos python -B (sem escrever bytecode) ou 'py -3 -B' quando disponível.
    if (-not $skipVenv -and (Test-Path $venvActivate)) {
        # Usando python do venv
        $pythonExe = Join-Path $venvPath 'Scripts\python.exe'
        if (Test-Path $pythonExe) {
            $runCmd = "& '$pythonExe' -B -m uvicorn main:app --reload --port $port"
        } else {
            $runCmd = "py -3 -B -m uvicorn main:app --reload --port $port"
        }
        $cmd = "cd '$servicePath'; $runCmd"
    } else {
        # Sem venv: prefer usar o executável Python ativo (caminho absoluto) para que as novas janelas herdem o mesmo ambiente
        if ($currentPythonExe -and (Test-Path $currentPythonExe)) {
            $runCmd = "& '$currentPythonExe' -B -m uvicorn main:app --reload --port $port"
        } elseif (Get-Command py -ErrorAction SilentlyContinue) {
            $runCmd = "py -3 -B -m uvicorn main:app --reload --port $port"
        } else {
            $runCmd = "python -B -m uvicorn main:app --reload --port $port"
        }
        $cmd = "cd '$servicePath'; $runCmd"
    }

    Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd -WindowStyle Normal
    Write-Host "[OK] $title iniciado na porta $port." -ForegroundColor Green
}

Write-Host "Todos os serviços backend foram iniciados!" -ForegroundColor Green
Write-Host "Execute 'npm run dev' para iniciar o frontend." -ForegroundColor Cyan