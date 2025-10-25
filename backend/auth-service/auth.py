#Auth Service - Modelos + Serviço de Autenticação Consolidado

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from shared.base import BaseEntity, BaseService, ServiceResponse
import secrets
import hashlib


# ===== MODELOS =====

class AuthSession(BaseEntity):
    #Sessão de autenticação

    def __init__(self, user_id: str):
        super().__init__()
        self.user_id = user_id
        self.token = secrets.token_urlsafe(32)
        self.expires_at = datetime.now() + timedelta(hours=24)
        self.is_active = True
        self.last_activity = datetime.now()

    def is_expired(self) -> bool:
        #Verifica se sessão expirou
        return datetime.now() > self.expires_at

    def refresh(self):
        #Renova sessão
        self.last_activity = datetime.now()
        self.expires_at = datetime.now() + timedelta(hours=24)
        self.update_timestamp()

    def logout(self):
        #Faz logout
        self.is_active = False
        self.update_timestamp()


class AuthCredentials:
    #Utilitários para credenciais de autenticação

    @staticmethod
    def hash_password(password: str) -> str:
        #Gera hash seguro da senha
        salt = secrets.token_hex(16)
        pwd_hash = hashlib.pbkdf2_hmac('sha256',
                                     password.encode(),
                                     salt.encode(),
                                     100000)
        return f"{pwd_hash.hex()}:{salt}"

    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        #Verifica senha contra hash
        try:
            pwd_hash, salt = hashed.split(':')
            return pwd_hash == hashlib.pbkdf2_hmac('sha256',
                                                 password.encode(),
                                                 salt.encode(),
                                                 100000).hex()
        except:
            return False


# ===== SERVIÇO =====

class AuthService(BaseService):
    #Serviço de autenticação e gestão de sessões

    def __init__(self):
        self.sessions: Dict[str, AuthSession] = {}
        self.users_db: Dict[str, Dict[str, Any]] = {
            "user@example.com": {
                "id": "user_123",
                "email": "user@example.com",
                "password_hash": AuthCredentials.hash_password("123456"),
                "name": "Usuário Teste",
                "is_active": True
            }
        }

    async def create(self, data: Dict[str, Any]) -> ServiceResponse:
        #Cria nova conta de usuário
        email = data.get('email')
        password = data.get('password')
        name = data.get('name', '')

        if not email or not password:
            return ServiceResponse.error_response("Email e senha são obrigatórios")

        if email in [u['email'] for u in self.users_db.values()]:
            return ServiceResponse.error_response("Email já cadastrado")

        user_id = f"user_{len(self.users_db) + 1}"
        self.users_db[email] = {
            "id": user_id,
            "email": email,
            "password_hash": AuthCredentials.hash_password(password),
            "name": name,
            "is_active": True,
            "created_at": datetime.now()
        }

        return ServiceResponse.success_response(
            {"user_id": user_id, "email": email},
            "Conta criada com sucesso"
        )

    async def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        #Autentica usuário e retorna dados se válido
        user = self.users_db.get(email)
        if not user:
            return None

        if not AuthCredentials.verify_password(password, user['password_hash']):
            return None

        # Criar sessão
        session = AuthSession(user['id'])
        self.sessions[session.token] = session

        return {
            "user_id": user['id'],
            "email": user['email'],
            "name": user['name'],
            "token": session.token,
            "expires_at": session.expires_at.isoformat()
        }

    async def validate_token(self, token: str) -> Optional[Dict[str, Any]]:
        #Valida token de sessão
        session = self.sessions.get(token)
        if not session or not session.is_active or session.is_expired():
            return None

        session.refresh()
        user = next((u for u in self.users_db.values() if u['id'] == session.user_id), None)

        if not user:
            return None

        return {
            "user_id": user['id'],
            "email": user['email'],
            "name": user['name'],
            "token": token
        }

    async def logout(self, token: str) -> bool:
        #Faz logout do usuário
        session = self.sessions.get(token)
        if session:
            session.logout()
            return True
        return False

    async def get_by_id(self, entity_id: str) -> Optional[Any]:
        #Busca usuário por ID
        return next((u for u in self.users_db.values() if u['id'] == entity_id), None)

    async def update(self, entity_id: str, data: Dict[str, Any]) -> ServiceResponse:
        #Atualiza dados do usuário
        user = await self.get_by_id(entity_id)
        if not user:
            return ServiceResponse.error_response("Usuário não encontrado")

        # Campos permitidos para atualização
        allowed_fields = ['name']
        for field in allowed_fields:
            if field in data:
                user[field] = data[field]

        return ServiceResponse.success_response(user, "Usuário atualizado")

    async def delete(self, entity_id: str) -> bool:
        #Remove usuário (soft delete)
        user = await self.get_by_id(entity_id)
        if user:
            user['is_active'] = False
            return True
        return False