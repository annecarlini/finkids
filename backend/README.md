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