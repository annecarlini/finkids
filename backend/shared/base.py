"""
Classes base compartilhadas entre todos os microsserviços do FInKids
Facilita na utilização de funções
"""
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional, Dict, Any
from dataclasses import dataclass
import uuid


class BaseEntity:
    #Classe base para todas as entidades do sistema

    def __init__(self):
        self.id: str = str(uuid.uuid4())
        self.created_at: datetime = datetime.now()
        self.updated_at: datetime = datetime.now()

    def update_timestamp(self):
        #Atualiza timestamp de modificação
        self.updated_at = datetime.now()

    def to_dict(self) -> Dict[str, Any]:
        #Converte entidade para dicionário
        return {
            'id': self.id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class BaseService(ABC):
    #Classe base para todos os serviços

    @abstractmethod
    async def create(self, data: Dict[str, Any]) -> Any:
        #Cria nova entidade
        pass

    @abstractmethod
    async def get_by_id(self, entity_id: str) -> Optional[Any]:
        #Busca entidade por ID
        pass

    @abstractmethod
    async def update(self, entity_id: str, data: Dict[str, Any]) -> Any:
        #Atualiza entidade
        pass

    @abstractmethod
    async def delete(self, entity_id: str) -> bool:
        #Remove entidade
        pass


@dataclass
class ServiceResponse:
    #Resposta padrão dos serviços
    success: bool
    data: Optional[Any] = None
    message: Optional[str] = None
    error: Optional[str] = None

    @classmethod
    def success_response(cls, data: Any = None, message: str = None) -> 'ServiceResponse':
        return cls(success=True, data=data, message=message)

    @classmethod
    def error_response(cls, error: str, message: str = None) -> 'ServiceResponse':
        return cls(success=False, error=error, message=message)