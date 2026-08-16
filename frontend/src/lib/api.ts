const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000'

const clearSessionStorage = () => {
  localStorage.removeItem('skilllink_token')
  localStorage.removeItem('skilllink_user')
  localStorage.removeItem('skilllink_page')
  localStorage.removeItem('skilllink_page_params')
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('skilllink_token')

  const headers = new Headers(options.headers)

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    },
  )

  const data = await response.json().catch(() => null)

  // Global authentication failure handling
  if (response.status === 401) {
    clearSessionStorage()

    window.dispatchEvent(
      new Event('skilllink:unauthorized'),
    )

    throw new Error(
      data?.message ||
        'Your session has expired. Please log in again.',
    )
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        'Something went wrong. Please try again.',
    )
  }

  return data as T
}

export const api = {
  get: <T>(endpoint: string) =>
    apiRequest<T>(endpoint),

  post: <T>(
    endpoint: string,
    body: unknown,
  ) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(
    endpoint: string,
    body: unknown,
  ) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: <T>(
    endpoint: string,
    body?: unknown,
  ) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      ...(body !== undefined && {
        body: JSON.stringify(body),
      }),
    }),

  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, {
      method: 'DELETE',
    }),
}