import { useState } from "react";
import {
  Bot,
  LoaderCircle,
  Send,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { askAI } from "../services/aiService";

function DoubtSolver() {
  const [doubt, setDoubt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanDoubt = doubt.trim();

    if (!cleanDoubt) {
      setError("Please enter your doubt.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnswer("");

      const aiAnswer = await askAI(cleanDoubt);
      setAnswer(aiAnswer);
    } catch (err) {
      setError(
        err.message || "AI could not answer your doubt."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-cyan-50 p-5 text-slate-900 transition-colors duration-300 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-white sm:p-7 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-white/5 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-3 text-white shadow-lg shadow-cyan-500/20">
                <Bot size={26} />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  AI Doubt Solver
                </h1>

                <p className="mt-2 max-w-2xl leading-6 text-slate-600 dark:text-slate-400">
                  Ask any academic doubt and get a simple
                  explanation, example, and practice question.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8"
            >
              <textarea
                value={doubt}
                onChange={(event) => {
                  setDoubt(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="Example: Explain normalization in DBMS with a simple example."
                rows={7}
                disabled={loading}
                className="w-full resize-y rounded-2xl border border-slate-300 bg-slate-50 p-4 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-600 dark:hover:border-white/20 dark:focus:border-cyan-500 dark:focus:bg-slate-900"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-medium text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                    Solving your doubt...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Ask CampusPilot AI
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </div>
            )}
          </div>

          {answer && (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-white/5 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-cyan-100 p-2 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                  <Bot size={20} />
                </div>

                <h2 className="text-xl font-semibold text-cyan-600 dark:text-cyan-400">
                  AI Answer
                </h2>
              </div>

              <div className="mt-4 whitespace-pre-wrap break-words leading-8 text-slate-700 dark:text-slate-300">
                {answer}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DoubtSolver;