import { useEffect, useState } from "react";
import { NavUser } from "@/components/nav-user";

// Tipagem do usuário
interface User {
  name: string;
  email: string;
  avatar: string;
}

// Função para converter nome do avatar em caminho de imagem
function getAvatarPath(avatar: string): string {
  if (avatar === "Nina") return "/assets/AvatarN.png";
  if (avatar === "Leo") return "/assets/AvatarL.png";
  if (avatar === "Duda") return "/assets/AvatarD.png";
  // Se já for um caminho, retorna direto
  if (avatar && avatar.startsWith("/")) return avatar;
  return "/assets/avatar-default.png";
}

// Usuário padrão para fallback
const defaultUser: User = {
  name: "Usuário",
  email: "-",
  avatar: getAvatarPath(""),
};

// Componente que busca o perfil do usuário no backend e renderiza o menu de usuário
export function UserProviderNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    const userApiBase = import.meta.env.VITE_API_USER ?? 'http://localhost:8001';
    const profileUrl = `${userApiBase}/user/profile`;

    fetch(profileUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setUser({
            name: data.nome || data.name || defaultUser.name,
            email: data.email || defaultUser.email,
            avatar: getAvatarPath(data.avatar),
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Enquanto carrega, mostra avatar genérico e texto
  if (loading) {
    return (
      <NavUser user={{
        name: "Carregando...",
        email: "",
        avatar: getAvatarPath(""),
      }} />
    );
  }

  // Se não tiver usuário, mostra fallback padrão
  if (!user) {
    return <NavUser user={defaultUser} />;
  }

  // Renderiza o menu de usuário com os dados reais
  return <NavUser user={user} />;
}
