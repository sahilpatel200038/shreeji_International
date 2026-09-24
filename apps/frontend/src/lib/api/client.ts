const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8010/api";

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]> | null;

  constructor(message: string, status: number, errors: Record<string, string[]> | null = null) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

function getToken(): string | null {
  return localStorage.getItem("shreeji_admin_token");
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("Unable to reach the tracking server. Please check your connection.", 0);
  }

  let payload: ApiEnvelope<T> | null = null;
  try {
    payload = await response.json();
  } catch {
    // no JSON body
  }

  if (!response.ok || !payload || payload.success === false) {
    const errors = (payload as unknown as { errors?: Record<string, string[]> })?.errors ?? null;
    const firstFieldError = errors ? Object.values(errors)[0]?.[0] : undefined;
    const message = firstFieldError ?? payload?.message ?? "Something went wrong. Please try again.";
    throw new ApiError(message, response.status, errors);
  }

  return payload.data;
}
