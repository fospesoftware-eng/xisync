type ApiError = { error?: string };

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data && typeof data === 'object' && 'error' in data
      ? (data as ApiError).error
      : undefined;
    throw new Error(message || `XiSync request failed (${response.status}).`);
  }
  return data as T;
}