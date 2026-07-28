import { useState } from "react";
import { Bot, LoaderCircle, Send } from "lucide-react";

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
      <div className="min-h-screen bg-slate-950 p-5 text-white sm:p-7 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-3">
                <Bot size={26} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  AI Doubt Solver
                </h1>

                <p className="mt-2 text-slate-400">
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
                onChange={(event) =>
                  setDoubt(event.target.value)
                }
                placeholder="Example: Explain normalization in DBMS with a simple example."
                rows={7}
                disabled={loading}
                className="w-full resize-y rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
                {error}
              </div>
            )}
          </div>

          {answer && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-cyan-400">
                AI Answer
              </h2>

              <div className="mt-4 whitespace-pre-wrap leading-8 text-slate-300">
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