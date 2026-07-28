import { useMemo, useState } from "react";

import {
  AlertCircle,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Loader2,
  Medal,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { generateQuiz } from "../services/aiService";

function QuizGenerator() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [questionCount, setQuestionCount] = useState(5);

  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const score = useMemo(() => {
    if (!submitted) {
      return 0;
    }

    return questions.reduce((total, question, index) => {
      const selectedAnswer = selectedAnswers[index];

      return selectedAnswer === question.answer
        ? total + 1
        : total;
    }, 0);
  }, [questions, selectedAnswers, submitted]);

  const percentage = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0;

  const answeredCount = Object.keys(selectedAnswers).length;

  const suggestedTopics = [
    "Python",
    "JavaScript",
    "React",
    "DBMS",
    "Operating Systems",
    "Computer Networks",
  ];

  const difficulties = ["Easy", "Medium", "Hard"];
  const questionCounts = [5, 10, 15];

  const normalizeQuestions = (quizData) => {
    return quizData
      .filter(
        (question) =>
          question &&
          question.question &&
          Array.isArray(question.options)
      )
      .map((question) => {
        const options = question.options.slice(0, 4);

        let correctAnswer = question.answer;

        if (
          typeof correctAnswer === "number" &&
          options[correctAnswer]
        ) {
          correctAnswer = options[correctAnswer];
        }

        if (
          typeof correctAnswer === "string" &&
          /^[A-D]$/i.test(correctAnswer.trim())
        ) {
          const answerIndex =
            correctAnswer.trim().toUpperCase().charCodeAt(0) -
            65;

          correctAnswer = options[answerIndex];
        }

        return {
          question: question.question,
          options,
          answer: correctAnswer,
          explanation:
            question.explanation ||
            "This option correctly answers the question.",
        };
      });
  };

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      setError("Please enter a quiz topic.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setQuestions([]);
      setSelectedAnswers({});
      setSubmitted(false);

      const quizData = await generateQuiz(
        topic.trim(),
        difficulty,
        questionCount
      );

      const normalizedQuiz = normalizeQuestions(quizData);

      if (!normalizedQuiz.length) {
        throw new Error(
          "AI did not return valid questions. Please try again."
        );
      }

      setQuestions(normalizedQuiz);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to generate quiz. Check the backend and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionIndex, option) => {
    if (submitted) {
      return;
    }

    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionIndex]: option,
    }));
  };
const handleSubmitQuiz = () => {
  if (answeredCount !== questions.length) {
    setError("Please answer every question before submitting.");
    return;
  }

  const finalScore = questions.reduce((total, question, index) => {
    return selectedAnswers[index] === question.answer
      ? total + 1
      : total;
  }, 0);

  const finalPercentage = Math.round(
    (finalScore / questions.length) * 100
  );

  localStorage.setItem(
    "campusPilotQuizAverage",
    String(finalPercentage)
  );
  const existingActivities =
  JSON.parse(
    localStorage.getItem("campusPilotRecentActivities")
  ) || [];

const newActivity = {
  id: Date.now(),
  title: "Quiz Completed",
  description: `${topic} quiz completed with ${finalPercentage}% score.`,
  time: new Date().toLocaleString(),
};

const updatedActivities = [
  newActivity,
  ...existingActivities,
].slice(0, 6);

localStorage.setItem(
  "campusPilotRecentActivities",
  JSON.stringify(updatedActivities)
);

  setError("");
  setSubmitted(true);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNewQuiz = () => {
    setQuestions([]);
    setSelectedAnswers({});
    setSubmitted(false);
    setError("");
  };

  const getResultMessage = () => {
    if (percentage >= 90) {
      return "Excellent performance!";
    }

    if (percentage >= 70) {
      return "Great work!";
    }

    if (percentage >= 50) {
      return "Good attempt!";
    }

    return "Keep practising!";
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-100 px-4 py-8 transition-colors duration-300 dark:bg-slate-950 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900 sm:p-8">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                  <Sparkles size={16} />
                  Gemini AI Powered
                </div>

                <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                  AI Quiz Generator
                </h1>

                <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
                  Enter any topic and generate a personalised quiz
                  instantly using Gemini AI.
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-white/5">
                <div className="rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-3 text-white">
                  <Brain size={28} />
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Learning Mode
                  </p>

                  <p className="font-semibold text-slate-900 dark:text-white">
                    Smart Practice
                  </p>
                </div>
              </div>
            </div>
          </section>

          {submitted && questions.length > 0 && (
            <section className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                    <Trophy size={24} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Final Score
                    </p>

                    <p className="text-2xl font-bold text-slate-950 dark:text-white">
                      {score}/{questions.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                    <Target size={24} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Accuracy
                    </p>

                    <p className="text-2xl font-bold text-slate-950 dark:text-white">
                      {percentage}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                    <Medal size={24} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Result
                    </p>

                    <p className="font-bold text-slate-950 dark:text-white">
                      {getResultMessage()}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-slate-900 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
              <div>
                <label
                  htmlFor="quiz-topic"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Quiz Topic
                </label>

                <input
                  id="quiz-topic"
                  type="text"
                  value={topic}
                  onChange={(event) =>
                    setTopic(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleGenerateQuiz();
                    }
                  }}
                  placeholder="Example: Python Functions"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="quiz-difficulty"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Difficulty
                </label>

                <select
                  id="quiz-difficulty"
                  value={difficulty}
                  onChange={(event) =>
                    setDifficulty(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                >
                  {difficulties.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="question-count"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Questions
                </label>

                <select
                  id="question-count"
                  value={questionCount}
                  onChange={(event) =>
                    setQuestionCount(Number(event.target.value))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                >
                  {questionCounts.map((count) => (
                    <option key={count} value={count}>
                      {count} Questions
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {suggestedTopics.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setTopic(suggestion)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 transition hover:border-blue-400 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                <AlertCircle
                  className="mt-0.5 shrink-0"
                  size={19}
                />

                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleGenerateQuiz}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={20}
                  />
                  Generating with Gemini...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate AI Quiz
                </>
              )}
            </button>
          </section>

          {loading && (
            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg dark:border-white/10 dark:bg-slate-900">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Brain className="animate-pulse" size={32} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
                Gemini is creating your quiz
              </h2>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Preparing personalised {difficulty.toLowerCase()}
                questions about {topic}.
              </p>
            </section>
          )}

          {!loading && questions.length > 0 && (
            <section className="mt-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                    {topic} Quiz
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {answeredCount} of {questions.length} answered
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
                  <Clock3 size={17} />
                  {difficulty} Level
                </div>
              </div>

              <div className="space-y-5">
                {questions.map((question, questionIndex) => (
                  <article
                    key={`${question.question}-${questionIndex}`}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                        {questionIndex + 1}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold leading-7 text-slate-950 dark:text-white">
                          {question.question}
                        </h3>

                        <div className="mt-5 grid gap-3">
                          {question.options.map(
                            (option, optionIndex) => {
                              const isSelected =
                                selectedAnswers[questionIndex] ===
                                option;

                              const isCorrect =
                                submitted &&
                                option === question.answer;

                              const isWrong =
                                submitted &&
                                isSelected &&
                                option !== question.answer;

                              return (
                                <button
                                  key={`${option}-${optionIndex}`}
                                  type="button"
                                  onClick={() =>
                                    handleSelectAnswer(
                                      questionIndex,
                                      option
                                    )
                                  }
                                  disabled={submitted}
                                  className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition ${
                                    isCorrect
                                      ? "border-green-500 bg-green-50 text-green-800 dark:bg-green-500/10 dark:text-green-300"
                                      : isWrong
                                        ? "border-red-500 bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-300"
                                        : isSelected
                                          ? "border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-500/10 dark:bg-blue-500/10 dark:text-blue-300"
                                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/5"
                                  }`}
                                >
                                  <span className="flex items-center gap-3">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                                      {String.fromCharCode(
                                        65 + optionIndex
                                      )}
                                    </span>

                                    {option}
                                  </span>

                                  {isCorrect && (
                                    <CheckCircle2
                                      className="shrink-0"
                                      size={20}
                                    />
                                  )}

                                  {isWrong && (
                                    <XCircle
                                      className="shrink-0"
                                      size={20}
                                    />
                                  )}

                                  {!submitted && isSelected && (
                                    <ChevronRight
                                      className="shrink-0"
                                      size={20}
                                    />
                                  )}
                                </button>
                              );
                            }
                          )}
                        </div>

                        {submitted && (
                          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                              Explanation
                            </p>

                            <p className="mt-1 text-sm leading-6 text-blue-700 dark:text-blue-200">
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                {submitted ? (
                  <>
                    <button
                      type="button"
                      onClick={handleNewQuiz}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      New Quiz
                    </button>

                    <button
                      type="button"
                      onClick={handleRetry}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20"
                    >
                      <RotateCcw size={19} />
                      Retry Quiz
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
                  >
                    <CheckCircle2 size={19} />
                    Submit Quiz
                  </button>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default QuizGenerator;