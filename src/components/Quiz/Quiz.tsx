import { useState } from "react";
import questionsData from "../../data/Phase1/questions.json";
import "./Quiz.css";

interface Question {
  id: number;
  quizId: string;
  pergunta: string;
  opcoes: string[];
  reposta_correta: string;
}

interface QuizProps {
  quizId: string;
  onFinish: (score: number) => void; // recebe score
}

export function Quiz({ quizId, onFinish }: QuizProps) {
  const questions: Question[] = questionsData.filter(
    (q: Question) => q.quizId === quizId
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const question = questions[currentQuestion];

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);

    if (option === question.reposta_correta) {
      setFeedback("✅ Resposta correta! Muito bem!");
      setScore(prev => prev + 1); // soma ponto
    } else {
      setFeedback(`❌ Ops! A resposta correta era: ${question.reposta_correta}`);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setFeedback(null);
    } else {
      onFinish(score); // envia score acumulado para o controlador
    }
  };

  return (
    <div className="quiz-container">
      <h3 className="quiz-question">{question.pergunta}</h3>

      <div className="quiz-options">
        {question.opcoes.map((option, index) => (
          <button
            key={index}
            className={`quiz-option ${
              selectedOption === option
                ? option === question.reposta_correta
                  ? "correct"
                  : "incorrect"
                : ""
            }`}
            onClick={() => handleSelectOption(option)}
            disabled={!!selectedOption}
          >
            {option}
          </button>
        ))}
      </div>

      {feedback && <p className="quiz-feedback">{feedback}</p>}

      {selectedOption && (
        <button className="quiz-next-button" onClick={handleNextQuestion}>
          Próxima
        </button>
      )}
    </div>
  );
}