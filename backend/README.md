# Backend (auth-service) - Instruções rápidas

Este README contém passos rápidos para desenvolvedores iniciarem o serviço de autenticação localmente em Windows (PowerShell).

Requisitos
- Python 3.10+ instalado (com `py` ou `python` no PATH)

Modo recomendado (helper):

Abra PowerShell na raiz do repositório e execute:

```powershell
powershell -ExecutionPolicy Bypass -File .\dev-backend.ps1
```

Isso criará `.venv` (se necessário), instalará dependências e iniciará o servidor Uvicorn em `http://localhost:8000` com reload.

Modo de verificação (não inicia servidor):

```powershell
powershell -ExecutionPolicy Bypass -File .\dev-backend.ps1 -CheckOnly
```

Passos manuais (alternativa):

```powershell
# Criar virtualenv
py -3 -m venv .venv
# ou
python -m venv .venv

# Usar o python do venv para instalar deps
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r backend\auth-service\requirements.txt

# Iniciar o servidor (a partir da raiz do repo)
Set-Location backend\auth-service
..\..\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Problemas comuns
- Se aparecer erro sobre `email-validator`/`EmailStr`, verá ImportError. Foi adicionada `email-validator` em `requirements.txt` para evitar isso — instale com pip como acima.
- Se receber erro "execution of scripts is disabled", use o prefixo `-ExecutionPolicy Bypass` (já presente no helper) ou rode:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Verificação rápida
- Abra `http://localhost:8000/docs` para a Swagger UI.

Contato
- Se algo falhar, copie/cole o erro do terminal e abra uma issue no repositório ou envie para o time de backend.
# FInKids Backend - Auth Service

Microsserviço de autenticação focado no **login** do FInKids.

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
cd backend/auth-service
pip install -r requirements.txt
```

### 2. Executar o Serviço

```bash
cd backend/auth-service
python main.py
```

O serviço ficará disponível em: http://localhost:8001

## 📋 Endpoints

### POST `/auth/login`
Login de usuário - conecta com `Logincard.tsx`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "abc123...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "Usuário Teste"
  },
  "message": "Login realizado com sucesso"
}
```

### POST `/auth/register`
Registro de novo usuário

### POST `/auth/logout`
Logout do usuário

### GET `/auth/validate`
Valida token de sessão

## 🧪 Testando

```bash
# Login
curl -X POST "http://localhost:8001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "123456"}'
```

## 📚 Documentação

Acesse: http://localhost:8001/docs

## 🎯 Integração com Frontend

O `vite.config.ts` já está configurado com proxy. No React, use:

```javascript
// Já funciona!
fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
```

## 📁 Estrutura

```
backend/
├── shared/
│   └── base.py              # Classes base POO
├── auth-service/
│   ├── main.py             # FastAPI app
│   ├── service.py          # Lógica de negócio
│   ├── models.py           # Modelos POO
│   └── requirements.txt    # Dependências
```

## 🔑 Usuário de Teste

- **Email:** user@example.com
- **Senha:** 123456

---

**Próximo:** User Service (avatares) → Learning Service (fases) → Gamification Service (pontos)