import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import {
    AuthServiceError,
    getProfile,
    login as loginRequest,
    signup as signupRequest,
    type AuthUser,
} from "../../services/auth";
import { getToken, removeToken, saveToken } from "../../utils/token";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    removeToken();
    setToken(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const activeToken = token ?? getToken();

    if (!activeToken) {
      setUser(null);
      return;
    }

    const profile = await getProfile(activeToken);
    setUser(profile);
  }, [token]);

  useEffect(() => {
    const storedToken = getToken();

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);

    void (async () => {
      try {
        const profile = await getProfile(storedToken);
        setUser(profile);
      } catch (error) {
        if (error instanceof AuthServiceError && error.status === 401) {
          logout();
        } else {
          console.error("Failed to restore session:", error);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const accessToken = await loginRequest(email, password);
    saveToken(accessToken);
    setToken(accessToken);

    try {
      const profile = await getProfile(accessToken);
      setUser(profile);
    } catch (error) {
      logout();
      throw error;
    }
  }, [logout]);

  const signup = useCallback(async (email: string, password: string) => {
    await signupRequest(email, password);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      signup,
      logout,
      refreshProfile,
    }),
    [isLoading, login, logout, refreshProfile, signup, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
