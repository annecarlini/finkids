import { useState, useEffect } from "react";
import stepsDataPhase1 from "../../data/Phase1/stepsDataPhase1.json";
import { Quiz } from "./Quiz";
import "./QuizController.css";

interface QuizControllerProps {
  onStepChange?: (currentStep: number, totalSteps: number) => void;
}

export function QuizController({ onStepChange }: QuizControllerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = stepsDataPhase1[currentStep];
  const totalSteps = stepsDataPhase1.length;

  const [lastQuizScore, setLastQuizScore] = useState<number | null>(null);

  const handleNext = (quizScore?: number) => {
    // se houver pontuação de quiz, atualiza o último score
    if (quizScore !== undefined) {
      setLastQuizScore(quizScore);
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  useEffect(() => {
    onStepChange?.(currentStep, totalSteps);
  }, [currentStep, totalSteps]);

  return (
    <div className="quiz-controller">
      {step.tipo === "texto" && (
        <div className="quiz-text">
          <p className="quiz-content">{step.conteudo}</p>
          <button className="quiz-next-button" onClick={() => handleNext()}>
            Próximo
          </button>
        </div>
      )}

      {step.tipo === "quiz" && step.quizId && (
        <Quiz key={step.id} quizId={step.quizId} onFinish={(score) => handleNext(score)} />
      )}

      {/* Mostra pontuação do último quiz se existir */}
      {lastQuizScore !== null && (
        <div className="quiz-score">
          <p>Você marcou {lastQuizScore} ponto{lastQuizScore > 1 ? "s" : ""} neste quiz!</p>
        </div>
      )}
    </div>
  );
}
