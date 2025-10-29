
#Auth Service - Microsserviço de Autenticação/Login
import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from email_validator import validate_email, EmailNotValidError, EmailUndeliverableError

# Configuração do path para imports
parent_dir = Path(__file__).parent.parent
sys.path.insert(0, str(parent_dir))

from auth import AuthService

app = FastAPI(
    title="FInKids Auth Service",
    description="Microsserviço de autenticação",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instância do serviço
auth_service = AuthService()

# ===== MODELOS Pydantic =====

class LoginRequest(BaseModel):
    email:  str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

# ===== ROTAS =====

@app.post("/auth/login")
async def login(request: LoginRequest):
    #Login de usuário - mapeia Logincard
    # Validação/normalização do e-mail em dev (não checar deliverability)
    try:
        ve = validate_email(request.email, check_deliverability=False)
        email_norm = ve.email
    except (EmailNotValidError, EmailUndeliverableError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"E-mail inválido: {e}")

    user_data = await auth_service.authenticate_user(email_norm, request.password)

    if not user_data:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    return {
        "success": True,
        "token": user_data['token'],
        "user": {
            "id": user_data['user_id'],
            "email": user_data['email'],
            "name": user_data['name']
        },
        "message": "Login realizado com sucesso"
    }

@app.post("/auth/register")
async def register(request: RegisterRequest):
    #Registro de novo usuário
    # Validação/normalização do e-mail em dev (não checar deliverability)
    try:
        ve = validate_email(request.email, check_deliverability=False)
        email_norm = ve.email
    except (EmailNotValidError, EmailUndeliverableError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"E-mail inválido: {e}")

    result = await auth_service.create({
        "email": email_norm,
        "password": request.password,
        "name": request.name
    })

    if not result.success:
        raise HTTPException(status_code=400, detail=result.error)

    return result.data


@app.post("/auth/avatar")
async def set_avatar(payload: dict):
    # Atualiza avatar do usuário (recebe { token, avatar })
    token = payload.get('token') if isinstance(payload, dict) else None
    avatar = payload.get('avatar') if isinstance(payload, dict) else None

    if not token or not avatar:
        raise HTTPException(status_code=400, detail="token e avatar são obrigatórios")

    user_data = await auth_service.validate_token(token)
    if not user_data:
        raise HTTPException(status_code=401, detail="Token inválido")

    result = await auth_service.update(user_data['user_id'], { 'avatar': avatar })
    if not result.success:
        raise HTTPException(status_code=400, detail=result.error)

    return { 'success': True, 'user': result.data, 'message': 'Avatar atualizado' }

@app.post("/auth/logout")
async def logout(token: str):
    #Logout do usuário
    success = await auth_service.logout(token)
    return {"success": success, "message": "Logout realizado"}

@app.get("/auth/validate")
async def validate_token(token: str):
    #Valida token atual
    user_data = await auth_service.validate_token(token)
    if not user_data:
        raise HTTPException(status_code=401, detail="Token inválido")

    return {
        "valid": True,
        "user": user_data
    }



@app.get("/health")
async def health_check():
    #Verificação de saúde do serviço
    return {
        "service": "auth-service",
        "status": "healthy",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)