const DEFAULT_API_BASE_URL = 'http://localhost:3000/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

const NO_CONTENT_STATUS = 204;

/** Error carrying the API's HTTP status so the UI can react to it. */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ErrorPayload = {
  statusCode?: number;
  error?: string;
  message?: string | string[];
};

function toErrorMessage(payload: ErrorPayload, fallback: string): string {
  if (Array.isArray(payload.message)) {
    return payload.message.join(', ');
  }
  return payload.message ?? fallback;
}

export async function apiRequest<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ErrorPayload;
    throw new ApiError(response.status, toErrorMessage(payload, response.statusText));
  }

  if (response.status === NO_CONTENT_STATUS) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}
