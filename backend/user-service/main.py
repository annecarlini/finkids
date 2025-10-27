from fastapi import FastAPI, Header, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import httpx

# Modelo de resposta do perfil do usuário
class UserProfile(BaseModel):
    id: str
    nome: str
    email: str
    avatar: str  # Deve ser 'Nina', 'Leo', 'Duda' ou caminho da imagem

# Instância do FastAPI

app = FastAPI(
    title="User Service",
    description="Serviço de perfil e dados do usuário",
    version="1.0.0"
)

# Middleware de CORS para liberar acesso do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Função para validar token no auth-service
async def validar_token(token: str) -> Optional[dict]:
    # Faz requisição para o auth-service para validar o token
    url = "http://localhost:8000/auth/validate"
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, params={"token": token})
            if resp.status_code == 200:
                return resp.json().get("user")
    except Exception:
        pass
    return None

# Endpoint para retornar perfil do usuário
@app.get("/user/profile", response_model=UserProfile)
async def get_profile(
    token: Optional[str] = Query(None, description="Token do usuário (query)"),
    authorization: Optional[str] = Header(None, description="Token do usuário (header)")
):
    # Extrai o token do header Authorization se presente
    token_final = token
    if authorization and authorization.lower().startswith("bearer "):
        token_final = authorization[7:]
    if not token_final:
        raise HTTPException(status_code=401, detail="Token não informado")

    # Valida o token no auth-service
    usuario = await validar_token(token_final)
    if not usuario:
        raise HTTPException(status_code=401, detail="Token inválido")

    # Garante que o campo avatar sempre retorna um valor válido
    avatar = usuario.get("avatar")
    if avatar not in ["Nina", "Leo", "Duda"]:
        avatar = "Nina"  # valor padrão

    # Retorna dados reais do usuário
    return UserProfile(
        id=usuario.get("user_id", ""),
        nome=usuario.get("name", ""),
        email=usuario.get("email", ""),
        avatar=avatar
    )

# Endpoint de saúde
@app.get("/health")
def health():
    # Verifica se o serviço está rodando
    return {"service": "user-service", "status": "healthy"}
