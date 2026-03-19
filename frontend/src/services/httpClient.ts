import axios from 'axios';
import type { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? 'http://localhost:8080/api/v1' : '/api/v1'
);

let tokenGetter: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: () => Promise<string | null>) {
  tokenGetter = fn;
}

const http = axios.create({
  baseURL: API_URL,
});

http.interceptors.request.use(async (config) => {
  if (tokenGetter) {
    const token = await tokenGetter();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

http.interceptors.response.use(
  response => response,
  (error: AxiosError<{ error?: { message?: string; code?: string } }>) => {
    if (error.response?.status === 401) {
      return Promise.reject(new Error('Authentication required. Please sign in again.'));
    }

    const apiMessage = error.response?.data?.error?.message;
    const status = error.response?.status;
    const fallbackMessage = error.message || 'Request failed';
    const message = apiMessage || (status ? `Request failed with status ${status}` : fallbackMessage);

    return Promise.reject(new Error(message));
  },
);

export default http;
