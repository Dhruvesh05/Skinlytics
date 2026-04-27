import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthServiceError, getProfile, type AuthUser } from "../../services/auth";
import { useAuth } from "../context/AuthContext";

function formatMemberSince(value?: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Profile() {
  const { token, user, logout } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(user);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        const data = await getProfile(token);
        setProfile(data);
      } catch (err) {
        if (err instanceof AuthServiceError && err.status === 401) {
          logout();
          navigate("/login", { replace: true });
          return;
        }

        const message = err instanceof Error ? err.message : "Failed to load profile.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [logout, navigate, token]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-white/10 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">Profile</h1>
            <p className="mt-2 text-sm text-gray-300">Account details</p>
          </div>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
            Active
          </span>
        </div>

        {isLoading ? (
          <div className="mt-8 flex min-h-32 items-center justify-center text-sm text-gray-300">
            <div className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-emerald-300/40 border-t-emerald-300" />
            Loading profile...
          </div>
        ) : error ? (
          <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5 transition-colors duration-300 hover:border-emerald-300/20 hover:bg-black/40">
              <p className="text-sm text-gray-400">Email</p>
              <p className="mt-1 text-lg font-medium text-white">{profile?.email ?? "-"}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5 transition-colors duration-300 hover:border-emerald-300/20 hover:bg-black/40">
                <p className="text-sm text-gray-400">Member since</p>
                <p className="mt-1 text-lg font-medium text-white">
                  {formatMemberSince((profile as AuthUser & { created_at?: string } | null)?.created_at)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-5 transition-colors duration-300 hover:border-emerald-300/20 hover:bg-black/40">
                <p className="text-sm text-gray-400">User ID</p>
                <p className="mt-1 text-lg font-medium text-white">#{profile?.id ?? "-"}</p>
                <p className="mt-2 text-xs text-gray-500">Internal account identifier</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
