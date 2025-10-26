<#
Script para iniciar auth-service
#>

Write-Host "Iniciando FInKids auth-service..." -ForegroundColor Cyan

# Verifica se .venv existe
if (-Not (Test-Path ".venv")) {
    Write-Host "Criando ambiente virtual..."
    python -m venv .venv
}

# Ativa venv
Write-Host "Ativando ambiente virtual..."
& ".\.venv\Scripts\Activate.ps1"

# Instala dependências (pip ignora pacotes já instalados)
Write-Host "Instalando dependências (se necessário)..." -ForegroundColor Yellow
pip install -r "backend\auth-service\requirements.txt"

# Evita que o Python escreva arquivos .pyc em disco (previne criação de __pycache__ localmente)
# OBS: isso pode tornar imports ligeiramente mais lentos; use apenas em dev se realmente quiser evitar __pycache__
$env:PYTHONDONTWRITEBYTECODE = "1"

# Inicia servidor
Write-Host "Iniciando servidor em http://localhost:8000" -ForegroundColor Cyan
Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Red

Set-Location "backend\auth-service"
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
