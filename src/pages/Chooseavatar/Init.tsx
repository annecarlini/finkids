import "./Init.css"
import Mysidebar from "../../components/custom/Sidebard/Mysidebar"
import AvatarN from '../../assets/AvatarN.png';
import AvatarL from '../../assets/AvatarL.png';
import AvatarD from '../../assets/AvatarD.png';
import { useState, useEffect } from "react"; /* hook do react que cria uma variável reativa, ou seja, quando ela muda, o React renderiza novamente o componente */
import { ButtonInit } from "../../components/custom/ButtonInit/buttoninit"
import { useNavigate } from "react-router-dom"


function Init() {
  const [activateAvatar, setActivateAvatar] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("")
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (raw) {
        const u = JSON.parse(raw)
        setUserName(u.name || u.email || '')
      }
    } catch {
      setUserName('')
    }
  }, [])

  async function handleStart() {
    if (!activateAvatar) return
    // salvar avatar localmente
    try { localStorage.setItem('avatar', activateAvatar) } catch {}

    // tentar persistir no backend (se houver token)
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await fetch('/auth/avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, avatar: activateAvatar })
        })
      }
    } catch (e) {
      console.warn('Falha ao persistir avatar no backend', e)
    }

    // navegar para a página de fases (rota definida em App.tsx)
    navigate('/phase')
  }


  return (
    <div className="init-page">
      <Mysidebar />
      <div className="first">
        <div className="main-introduction">
          <div className="introduction">
            <h1>Bem vindo, {userName || 'amigo(a)'}</h1>
          </div>
          <div className="choose-avatar">
            <h2>Vamos iniciar o seu aprendizado?</h2>
          </div>
        </div>

        <div className="card">
          <div className="content-card">
            <h3>
              Antes de começar, escolha quem vai te representar! <br /> Cada um tem uma personalidade, descubra qual combina mais com você!
            </h3>
            <div className="images">
              <img 
              src={AvatarN} 
              alt="Avatar Nina" 
              onClick={() => setActivateAvatar(activateAvatar === "Nina" ? null : "Nina")} 
              />

              <img 
              src={AvatarL} 
              alt="Avatar Leo" 
              onClick={() => setActivateAvatar(activateAvatar === "Leo" ? null : "Leo")}
              
              />

              <img
              src={AvatarD}
              alt="Avatar Duda"
              onClick={() => setActivateAvatar(activateAvatar === "Duda" ? null : "Duda")}
              />
            </div>

          </div>

        </div>
        {activateAvatar === "Nina" && (
          <div className="presentation-nina">

            <h3>Oi, eu sou a Nina Cálculo! <br />
            Eu gosto de entender como funciona o dinheiro. Faço contas, analiso o que entra e o que sai, e sempre tento equilibrar tudo.
            </h3>
            <ButtonInit onClick={handleStart} />
          </div>
        )}

        {activateAvatar === "Leo" && (
          <div className="presentation-leo">
            <h3>Oi, eu sou o Léo Grana! <br />
            Sou do tipo que gosta de pensar antes de gastar. Curto planejar, comparar preços e entender se algo vale mesmo a pena.
            </h3>
            <ButtonInit onClick={handleStart} />
          </div>
        )}

        {activateAvatar === "Duda" && (
          <div className="presentation-duda">
            <h3>Oi, eu sou a Duda Vest! <br />
            Eu penso no futuro. Gosto de descobrir formas de fazer o dinheiro render mais, seja investindo ou tomando decisões inteligentes. 
            </h3>
            <ButtonInit onClick={handleStart} />
          </div>
        )}

      </div>
    </div>
  )
}

export default Init

