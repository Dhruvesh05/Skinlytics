/**
 * Skinlytix API Service
 * Handles all communication with the FastAPI backend
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export interface RequestOptions extends RequestInit {
  authToken?: string | null;
  useAuth?: boolean;
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function extractErrorMessage(payload: unknown): string | null {
  if (!payload) {
    return null;
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (typeof payload === "object") {
    const data = payload as Record<string, unknown>;

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (typeof data.message === "string") {
      return data.message;
    }

    if (typeof data.error === "string") {
      return data.error;
    }
  }

  return null;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => null);
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  try {
    const token =
      options.authToken ??
      (options.useAuth === false
        ? null
        : localStorage.getItem("skinlytix_access_token"));

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(((options.headers as Record<string, string> | undefined) || {})),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const payload = await parseResponseBody(response);

    if (!response.ok) {
      const message =
        extractErrorMessage(payload) ||
        `Request failed with status ${response.status}`;

      throw new ApiError(message, response.status);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (
      error instanceof Error &&
      (error.message === "Failed to fetch" ||
        error.message === "Load failed" ||
        error.message.includes("NetworkError"))
    ) {
      throw new ApiError("Server not reachable. Please try again.");
    }

    throw error;
  }
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PredictRequest {
  skin_type: string;
  sensitivity: string;
  concern: string;
}

export interface PredictResponse {
  success: boolean;
  ingredient: string;
  cluster_label: string;
  cluster_number: number;
  confidence: number;
  ingredient_confidence: number;
  cluster_confidence: number;
  error?: string;
}

export interface RecommendRequest {
  skin_type: string;
  concerns: string[];
  age: number;
  preferences?: Record<string, any>;
}

export interface Recommendation {
  ingredient: string;
  score: number;
  reasoning: string;
}

export interface RecommendResponse {
  success: boolean;
  recommendations: Recommendation[];
  count: number;
  error?: string;
}

export interface RoutineRequest {
  skin_type: string;
  sensitivity: string;
  concern: string;
  routine_type?: string;
  routine_focus?: string;
}

export interface RoutineStep {
  order: number;
  name: string;
  duration: string;
}

export interface RoutineResponse {
  success: boolean;
  morning_routine: RoutineStep[];
  evening_routine: RoutineStep[];
  tips: string[];
  error?: string;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Call the predict endpoint to get skin analysis
 */
export async function predictSkin(data: PredictRequest): Promise<PredictResponse> {
  return request<PredictResponse>("/api/predict", {
    method: "POST",
    body: JSON.stringify(data),
    useAuth: false,
  });
}

/**
 * Call the recommend endpoint to get product recommendations
 */
export async function getRecommendations(
  data: RecommendRequest
): Promise<RecommendResponse> {
  return request<RecommendResponse>("/api/recommend", {
    method: "POST",
    body: JSON.stringify(data),
    useAuth: false,
  });
}

/**
 * Call the routine endpoint to get personalized skincare routine
 */
export async function getRoutine(data: RoutineRequest): Promise<RoutineResponse> {
  return request<RoutineResponse>("/api/routine", {
    method: "POST",
    body: JSON.stringify(data),
    useAuth: false,
  });
}

/**
 * Health check to verify backend is running
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await request<unknown>("/health", { method: "GET", useAuth: false });
    return true;
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
}
