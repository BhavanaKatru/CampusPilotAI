import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const {
    currentUser,
    login,
    loginWithGoogle,
    resetPassword,
  } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (firebaseError) {
      console.error(firebaseError);

      if (firebaseError.code === "auth/invalid-credential") {
        setError("Email or password incorrect.");
      } else if (firebaseError.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Login failed. Please check your details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (firebaseError) {
      console.error(firebaseError);

      if (firebaseError.code === "auth/popup-closed-by-user") {
        setError("Google login popup was closed.");
      } else {
        setError("Google login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!formData.email) {
      setError("First enter your email address.");
      return;
    }

    try {
      await resetPassword(formData.email);
      setMessage("Password reset email sent successfully.");
    } catch (firebaseError) {
      console.error(firebaseError);
      setError("Unable to send password reset email.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="absolute left-[-100px] top-[-100px] h-80 w-80 rounded-full bg-blue-600/20 blur-3xl"></div>

      <div className="absolute bottom-[-120px] right-[-100px] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"></div>

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-600/30 to-cyan-500/10 p-10 lg:flex">
          <div>
            <div className="mb-8 inline-flex rounded-2xl bg-white/10 p-4 text-3xl">
              🎓
            </div>

            <h1 className="text-4xl font-bold text-white">
              CampusPilot AI
            </h1>

            <p className="mt-3 text-lg text-slate-300">
              Your Complete AI Academic Ecosystem
            </p>
          </div>

          <div>
            <p className="text-sm leading-7 text-slate-300">
              Plan your studies, analyze PDFs, solve doubts,
              generate quizzes and prepare for your career using AI.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8 lg:hidden">
            <h1 className="text-3xl font-bold text-white">
              CampusPilot AI
            </h1>

            <p className="mt-2 text-slate-400">
              Your Complete AI Academic Ecosystem
            </p>
          </div>

          <h2 className="text-3xl font-bold text-white">
            Welcome Back
          </h2>

          <p className="mt-2 text-slate-400">
            Login to continue your academic journey.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
              {message}
            </div>
          )}

          <form
            onSubmit={handleEmailLogin}
            className="mt-7 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@example.com"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">
                  Password
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Forgot password?
                </button>
              </div>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength={6}
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-sm text-slate-500">OR</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            <span className="text-xl">G</span>
            Continue with Google
          </button>

          <p className="mt-7 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;