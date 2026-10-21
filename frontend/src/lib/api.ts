const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('sra_token');
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
};

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }

    const errorMessage =
      (typeof data === 'object' && data !== null && (data.message || data.error)) ||
      response.statusText ||
      'An unexpected error occurred';

    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...getAuthHeaders(),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    // Note: Do NOT set Content-Type header when sending FormData!
    // The browser automatically sets multipart/form-data with the correct boundary.
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...getAuthHeaders(),
      },
      body: formData,
    });
    return handleResponse<T>(response);
  },
};
