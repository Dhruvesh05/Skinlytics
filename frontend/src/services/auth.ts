import { ApiError, request } from "./api";

export interface AuthUser {
  email: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
}

export interface HistoryRecord {
  skin_type: string;
  sensitivity: string;
  concern: string;
  result: {
    ingredient: string;
    confidence: number;
  };
  timestamp?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface SaveHistoryPayload {
  skin_type: string;
  sensitivity: string;
  concern: string;
  result: {
    ingredient: string;
    confidence: number;
  };
}

export class AuthServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthServiceError";
    this.status = status;
  }
}

function normalizeError(
  error: unknown,
  fallbackMessage: string,
  fallbackStatus = 500
): AuthServiceError {
  if (error instanceof AuthServiceError) {
    return error;
  }

  if (error instanceof ApiError) {
    return new AuthServiceError(
      error.message || fallbackMessage,
      error.status ?? fallbackStatus
    );
  }

  if (error instanceof Error) {
    return new AuthServiceError(error.message || fallbackMessage, fallbackStatus);
  }

  return new AuthServiceError(fallbackMessage, fallbackStatus);
}

async function authRequest<T>(
  endpoint: string,
  init: RequestInit = {},
  token?: string
): Promise<T> {
  try {
    return await request<T>(endpoint, {
      ...init,
      authToken: token,
    });
  } catch (error) {
    throw normalizeError(error, "Something went wrong");
  }
}

export async function signup(email: string, password: string): Promise<void> {
  await authRequest<unknown>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string): Promise<string> {
  const data = await authRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return data.access_token;
}

export async function getProfile(token: string): Promise<AuthUser> {
  return authRequest<AuthUser>("/profile", { method: "GET" }, token);
}

export async function getHistory(token: string): Promise<HistoryRecord[]> {
  const data = await authRequest<HistoryRecord[] | { history?: HistoryRecord[] }>(
    "/history",
    { method: "GET" },
    token
  );

  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data.history) ? data.history : [];
}

export async function saveHistory(
  payload: SaveHistoryPayload,
  token: string
): Promise<unknown> {
  return authRequest<unknown>(
    "/history/save",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token
  );
}
