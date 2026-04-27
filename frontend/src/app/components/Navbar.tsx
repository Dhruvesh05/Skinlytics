import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
    isActive
      ? "bg-emerald-400/20 text-emerald-200"
      : "text-gray-300 hover:bg-white/10 hover:text-white"
  }`;
}

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="text-lg font-semibold tracking-wide text-white transition-colors hover:text-emerald-200"
        >
          Skinlytix AI
        </NavLink>

        <div className="flex items-center gap-2 sm:gap-3">
          <NavLink to="/" className={navLinkClass}>
            Analyze
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-3 py-2 text-sm font-medium text-emerald-100 transition-all duration-300 hover:bg-emerald-400/20"
              >
                Logout
              </button>
              <span className="hidden max-w-[190px] truncate text-xs text-gray-400 sm:inline">
                {user?.email}
              </span>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={navLinkClass}>
                Signup
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
