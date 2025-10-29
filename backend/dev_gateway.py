from pathlib import Path
from importlib.util import spec_from_file_location, module_from_spec
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

# Dev gateway: carrega os apps FastAPI dos serviços (main.py) por caminho
# e monta em um único processo para desenvolvimento. Útil para não precisar
# iniciar janelas/ports separadas.

ROOT = Path(__file__).parent

def load_app_from_main(service_dir: Path, name: str):
    main_py = service_dir / "main.py"
    if not main_py.exists():
        raise FileNotFoundError(f"{main_py} not found")
    spec = spec_from_file_location(f"{name}_main", str(main_py))
    mod = module_from_spec(spec)
    spec.loader.exec_module(mod)
    if not hasattr(mod, 'app'):
        raise RuntimeError(f"module {main_py} has no 'app' attribute")
    return getattr(mod, 'app')


def create_gateway():
    # evita escrita de bytecode enquanto rodamos (opcional)
    os.environ.setdefault('PYTHONDONTWRITEBYTECODE', '1')

    gateway = FastAPI(title="FInKids Dev Gateway")
    # Permitir o frontend Vite em dev
    gateway.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    services = {
        'auth': ROOT / 'auth-service',
        'user': ROOT / 'user-service',
        # se quiser adicionar mais serviços, coloque aqui
    }

    for mount_path, svc_dir in services.items():
        try:
            sub_app = load_app_from_main(svc_dir, mount_path)
            gateway.mount(f"/{mount_path}", sub_app)
            print(f"Mounted {mount_path} from {svc_dir}")
        except Exception as e:
            print(f"Warning: failed to mount {mount_path}: {e}")

    @gateway.get("/health")
    def health():
        return {"service": "dev-gateway", "status": "healthy", "mounted": list(services.keys())}

    return gateway


app = create_gateway()


if __name__ == '__main__':
    # Roda o gateway em 8000 por padrão
    uvicorn.run(app, host='0.0.0.0', port=8000, reload=True)
