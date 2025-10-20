import "./Init.css"
import "../../components/custom/Sidebard/Mysidebar"
import Mysidebar from "../../components/custom/Sidebard/Mysidebar"


function Init() {
  return (
    <div className="init-page">
      <Mysidebar />
      <div className="introduction">
        <h1>Bem vindo, *AQUI VAI O NOME DE QUEM LOGAR*</h1>
        <h2>Vamos iniciar o seu aprendizado?</h2>
      </div>

      <div className="card">
        <div className="content-card">
          <h3>
            Antes de começar, escolha quem vai te representar! Cada um tem uma personalidade, descubra qual combina mais com você!
          </h3>
        </div>
      </div>

    </div>
  )
}

export default Init