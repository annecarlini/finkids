import { useEffect, useState } from "react";
import "./Quiz.css";

interface Question {
  id: number;
  quizId: string;
  pergunta: string;
  opcoes: string[];
  reposta_correta: string;
}

interface QuizProps {
  phaseId: string;      // "Phase1" ou "Phase2"
  quizId: string;       // ex: "quiz1" ou "quiz1_phase2"
  onFinish: (score: number) => void;
}

export function Quiz({ phaseId, quizId, onFinish }: QuizProps) {
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Importa o arquivo de perguntas da fase correta dinamicamente
  useEffect(() => {
    setLoading(true);
    setQuestionsData([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setFeedback(null);
    setScore(0);

    // Se o arquivo na phase2 se chama questions2.json, ajuste o path:
    // import(`../../data/${phaseId}/questions2.json`)
    import(`../../data/${phaseId}/questions.json`)
      .then((module) => {
        // módulo default deve ser um array de perguntas
        const allQuestions = module.default as Question[];
        setQuestionsData(allQuestions);
      })
      .catch((err) =>
        console.error("Erro ao carregar perguntas da fase:", phaseId, err)
      )
      .finally(() => setLoading(false));
  }, [phaseId]);

  if (loading) return <p>Carregando perguntas...</p>;

  // filtra apenas perguntas daquele quizId (único por fase)
  const questions = questionsData.filter((q) => q.quizId === quizId);

  if (questions.length === 0)
    return (
      <div>
        <p>Nenhuma pergunta encontrada para este quiz ({quizId}).</p>
        <p>
          Verifique: arquivo <code>data/{phaseId}/questions.json</code> e se o
          campo <code>quizId</code> bate com <code>{quizId}</code>.
        </p>
      </div>
    );

  const question = questions[currentQuestionIndex];

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);

    if (option === question.reposta_correta) {
      setFeedback("✅ Resposta correta!");
      setScore((s) => s + 1);
    } else {
      setFeedback(`❌ Resposta correta: ${question.reposta_correta}`);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedOption(null);
      setFeedback(null);
    } else {
      // fim do quiz — retorna pontos ao controller
      onFinish(score);
    }
  };

  return (
    <div className="quiz-container">
      <h3 className="quiz-question">{question.pergunta}</h3>

      <div className="quiz-options">
        {question.opcoes.map((opt, idx) => (
          <button
            key={idx}
            className={`quiz-option ${
              selectedOption === opt
                ? opt === question.reposta_correta
                  ? "correct"
                  : "incorrect"
                : ""
            }`}
            onClick={() => handleSelectOption(opt)}
            disabled={!!selectedOption}
          >
            {opt}
          </button>
        ))}
      </div>

      {feedback && <p className="quiz-feedback">{feedback}</p>}

      {selectedOption && (
        <button className="quiz-next-button" onClick={handleNext}>
          {currentQuestionIndex < questions.length - 1 ? "Próxima" : "Finalizar"}
        </button>
      )}
    </div>
  );
}
