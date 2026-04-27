import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthServiceError, getHistory, type HistoryRecord } from "../../services/auth";
import { useAuth } from "../context/AuthContext";

function formatTimestamp(item: HistoryRecord): string {
  const raw = item.timestamp ?? item.created_at;
  if (!raw) return "Recently";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "Recently";

  return date.toLocaleString();
}

export default function Dashboard() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    void (async () => {
      setError(null);
      setIsLoading(true);

      try {
        const data = await getHistory(token);
        setHistory(data);
      } catch (err) {
        if (err instanceof AuthServiceError && err.status === 401) {
          logout();
          navigate("/login", { replace: true });
          return;
        }

        const message = err instanceof Error ? err.message : "Failed to load history.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [logout, navigate, token]);

  const sortedHistory = useMemo(
    () =>
      [...history].sort((a, b) => {
        const aRaw = a.timestamp ?? a.created_at;
        const bRaw = b.timestamp ?? b.created_at;
        return new Date(bRaw ?? 0).getTime() - new Date(aRaw ?? 0).getTime();
      }),
    [history]
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-300">Welcome back, {user?.email ?? "User"}</p>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Skin Analysis History</h2>
          <span className="text-sm text-gray-400">{sortedHistory.length} records</span>
        </div>

        {isLoading ? (
          <div className="flex min-h-40 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-300/40 border-t-emerald-300" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : sortedHistory.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/20 px-6 py-10 text-center text-sm text-gray-300">
            No analysis history yet. Run a skin analysis and your results will appear here.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sortedHistory.map((item, index) => (
              <article
                key={`${item.skin_type}-${item.concern}-${index}`}
                className="group rounded-xl border border-white/10 bg-black/30 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/30 hover:bg-black/40"
              >
                <p className="text-xs uppercase tracking-wide text-emerald-200/80">
                  {formatTimestamp(item)}
                </p>
                <div className="mt-3 grid gap-2 text-sm text-gray-200">
                  <p>
                    <span className="text-gray-400">Skin Type:</span> {item.skin_type}
                  </p>
                  <p>
                    <span className="text-gray-400">Concern:</span> {item.concern}
                  </p>
                  <p>
                    <span className="text-gray-400">Sensitivity:</span> {item.sensitivity}
                  </p>
                  <p>
                    <span className="text-gray-400">Ingredient:</span> {item.result?.ingredient ?? "-"}
                  </p>
                  <p>
                    <span className="text-gray-400">Confidence:</span>{" "}
                    {typeof item.result?.confidence === "number"
                      ? `${Math.round(item.result.confidence)}%`
                      : "-"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
