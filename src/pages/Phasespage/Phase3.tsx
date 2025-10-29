import { useState } from "react";
import { ProgressBar } from '@/components/custom/ProgressBar/Progressbar';
import { QuizController } from '@/components/Quiz/QuizController';
import './Phase.css';
import Mysidebar from '@/components/custom/Sidebard/Mysidebar';

function Phase2() {
  const [progressValue, setProgressValue] = useState(0);

  return (
    <div className="main-page">
      <div className="trail">
        <Mysidebar />
        <h1>Trilha de aprendizado - Fase 2</h1>
      </div>

      <div className="card-progress2">
        <h2>Investimentos iniciais</h2>
        <ProgressBar value={progressValue} />
      </div>

      <div className="card-quizz">
        <QuizController
          phaseId="Phase2" // Passa o ID da fase
          onStepChange={(currentStep, totalSteps) => {
            setProgressValue(((currentStep + 1) / totalSteps) * 100);
          }}
        />
      </div>
    </div>
  );
}

export default Phase2;
