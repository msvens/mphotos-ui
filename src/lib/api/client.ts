import type { ApiError as BackendApiError } from './types';
import { createApiUrl, RequestConfig } from './config';

interface MPhotosResponse<T> {
  error?: BackendApiError;
  data?: T;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  
  let jsonResponse;
  try {
    jsonResponse = JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse JSON response:', e);
    throw new Error('Response was not valid JSON');
  }
  
  // Check for error in the response
  if (jsonResponse.error) {
    console.error('API error:', jsonResponse.error);
    throw new ApiError(
      jsonResponse.error.code || response.status,
      jsonResponse.error.message || 'Unknown error'
    );
  }
  
  return jsonResponse.data || jsonResponse;
}

export async function apiRequest<T>(
  endpoint: string,
  config?: RequestConfig
): Promise<T> {
  const url = createApiUrl(endpoint, config);
  const method = config?.method || 'GET';
  
  try {
    const response = await fetch(url, {
      method,
      ...(config?.body && {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config.body)
      })
    });

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }

    return handleResponse<T>(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export async function uploadFile(
  endpoint: string,
  file: File,
  config?: Omit<RequestConfig, 'body'>
): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);

  const url = createApiUrl(endpoint, config);
  
  const response = await fetch(url, {
    ...config,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
    body: formData,
  });

  return handleResponse(response);
}

// Helper methods for common HTTP methods
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) => 
    apiRequest<T>(endpoint, { ...config, method: 'GET' }),
    
  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    apiRequest<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data,
    }),
    
  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    apiRequest<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data,
    }),
    
  delete: <T>(endpoint: string, config?: RequestConfig) =>
    apiRequest<T>(endpoint, { ...config, method: 'DELETE' }),
    
  upload: (endpoint: string, file: File, config?: Omit<RequestConfig, 'body'>) =>
    uploadFile(endpoint, file, config),
}; 