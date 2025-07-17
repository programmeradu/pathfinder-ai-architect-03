import { QueryClient } from "@tanstack/react-query";
import { authService } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
        return apiRequest(url as string);
      },
      retry: (failureCount, error) => {
        // Don't retry on 401 errors (authentication)
        if (error.message?.includes('401')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

export async function apiRequest(
  url: string,
  options: ApiRequestOptions = {}
): Promise<any> {
  const { method = 'GET', headers = {}, body } = options;

  // Add authentication token if available
  const token = authService.getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Add default headers
  if (body && method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `${response.status}: ${errorData.message || response.statusText}`
    );
  }

  return await response.json();
}