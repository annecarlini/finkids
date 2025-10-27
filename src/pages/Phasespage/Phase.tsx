import { useState } from "react";
import { ProgressBar } from '@/components/custom/ProgressBar/Progressbar';
import { QuizController } from '@/components/Quiz/QuizController';
import './Phase.css';
import Mysidebar from '@/components/custom/Sidebard/Mysidebar';

function Phase() {
  const [selectPhase, setSelectPhase] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0); // 0 a 100

  return (
    <div className="main-page">
      <div className="trail">
        <Mysidebar />
        <h1>Trilha de aprendizado</h1>
      </div>

      <div className="phases">
        <h3 onClick={() => setSelectPhase(selectPhase === "Inicio" ? null : "Inicio")}>Inicio</h3>
        <h3 onClick={() => setSelectPhase(selectPhase === "Phase1" ? null : "Phase1")}>Fase 1</h3>
      </div>

      {selectPhase === "Phase1" && (
        <>
          <div className="card-progress2">
            <h2>Orçamento pessoal e familiar</h2>
            <ProgressBar value={progressValue} />
          </div>

          <div className="card-quizz">
            <QuizController
              onStepChange={(currentStep: number, totalSteps: number) => {
                setProgressValue(((currentStep + 1) / totalSteps) * 100);
              }}
            />
          </div>
        </>
      )}

      <div className="right-side-container">
        <div className="content"></div>
      </div>

    
    </div>
  );
}

export default Phase;
