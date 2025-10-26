# FInKids - Desenvolvimento local (rápido)

Objetivo: permitir que um desenvolvedor frontend consiga rodar o backend localmente com 1 comando, sem se preocupar com criação manual de venv ou instalação de dependências.

## Requisitos
- Python 3.11+ (para criar venv se necessário)
- Node.js + npm (para rodar frontend)
- (Opcional) Git

## Rodando o backend (Windows)
Abra PowerShell na raiz do repositório e execute:

```powershell
# executa script que cuida de venv, instala dependências e inicia auth-service
.\dev-backend.ps1
```

Alternativamente, se preferir executar via npm (útil para quem já usa comandos npm), rode na raiz do projeto:

```bash
npm run dev:backend
```

## Rodando o backend (mac / linux)
Abra um terminal na raiz do repositório e execute:

```bash
# torne executável, se necessário
chmod +x ./dev-backend.sh
# executa script
./dev-backend.sh
```

## Rodando o frontend
Em outro terminal (na raiz do projeto):

```bash
npm install
npm run dev
```

## Notas importantes
- O script cria um arquivo `.deps_installed` dentro de cada serviço em `backend/*` após instalar dependências, para evitar reinstalações subsequentes.
- O script ativa/usa a venv local `.venv/`. A pasta `.venv/` está ignorada pelo Git.
- Se preferir, você pode usar Docker mais adiante para padronizar o ambiente entre a equipe.

## Serviços e portas padrão
- Auth Service: http://localhost:8000
- Frontend (Vite): http://localhost:5173

## Credenciais de teste
- Email: `user@example.com`
- Senha: `123456`

## Problemas comuns
- Se você tiver problemas com pacotes, execute dentro da venv:

```powershell
# Windows
.\.venv\Scripts\Activate.ps1
pip install -r backend\auth-service\requirements.txt
```
