import json
import os
from pathlib import Path
from typing import Optional, Dict, Any


def load_users(path: Path) -> Optional[Dict[str, Any]]:
    """Tenta carregar o arquivo JSON de usuários.
    Retorna um dict (email -> user dict) ou None se não existir/estiver corrompido.
    Em caso de arquivo corrompido, faz backup para users.json.bak e retorna None.
    """
    if not path.exists():
        return None

    try:
        with path.open("r", encoding="utf-8") as f:
            data = json.load(f)
            # Garantir que é um dicionário
            if isinstance(data, dict):
                return data
            return None
    except Exception as e:
        # arquivo corrompido: renomear para backup e retornar None
        try:
            bak = path.with_suffix(path.suffix + ".bak")
            os.replace(str(path), str(bak))
        except Exception:
            pass
        return None


def save_users(path: Path, users: Dict[str, Any]) -> None:
    """Salva users dict de forma atômica usando um arquivo temporário e replace.
    Converte objetos não-serializáveis usando str().
    """
    tmp = path.with_suffix(path.suffix + ".tmp")
    # Garante diretório
    path.parent.mkdir(parents=True, exist_ok=True)

    def default(o):
        return str(o)

    with tmp.open("w", encoding="utf-8") as f:
        json.dump(users, f, ensure_ascii=False, indent=2, default=default)

    # substituir atomically
    try:
        os.replace(str(tmp), str(path))
    except Exception:
        # fallback: try write directly
        with path.open("w", encoding="utf-8") as f:
            json.dump(users, f, ensure_ascii=False, indent=2, default=default)
