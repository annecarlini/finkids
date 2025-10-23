import './Phase.css'
import Mysidebar from '@/components/custom/Sidebard/Mysidebar'
import { useState } from "react";

function Phase() {
  const [selectPhase, setSelectPhase] = useState <string | null> (null);


  return (
    <div className="main-page">
      
        <div className="trail">
          <Mysidebar />
          <h1>Trilha de aprendizado</h1>
        </div>
        <div className="phases">
          <h3 onClick={() => setSelectPhase (selectPhase === "Inicio" ? null : "Inicio")}>Inicio</h3>
          <h3 onClick={() => setSelectPhase(selectPhase === "Phase 1" ? null : "Phase 1")}>Fase 1</h3>
          <h3>Fase 2</h3>
          <h3>Fase 3</h3>
          <h3>Fase 4</h3>
        </div>

        {selectPhase === "Inicio" && (
      
        <div className="card-progress1">
          <h3>Vamos começar? 😄 <br />
          Cada fase tem um tema diferente, e você vai aprender um conceito importante sobre finanças. Depois, é só responder o quiz! 💰 <br />

          Mas não precisa se preocupar se errar, o objetivo é te ajudar a entender melhor como o dinheiro funciona. <br />

          Ah, e fique de olho!
          Durante o quiz, você pode encontrar surpresas especiais que vão deixar o jogo ainda mais divertido! </h3>
        </div>
        )}

        {selectPhase === "Phase1" && (
      
        <div className="card-progress1">
          <h2>Orçamento pessoal e familiar</h2>
        </div>
        )}




    </div>
  )
}

export default Phase