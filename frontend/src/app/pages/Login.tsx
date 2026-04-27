import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthServiceError } from "../../services/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    typeof location.state === "object" && location.state && "from" in location.state
      ? String((location.state as { from?: string }).from || "/dashboard")
      : "/dashboard";

  if (!isLoading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof AuthServiceError) {
        setError(err.message);
      } else {
        setError("Unable to login. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-semibold text-white">Welcome Back</h1>
        <p className="mt-2 text-sm text-gray-300">Login to access your skincare dashboard.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/25"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/25"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          No account yet?{" "}
          <Link to="/signup" className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200">
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
