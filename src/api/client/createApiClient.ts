import { API_CONFIG } from '@/src/config/api';

type ApiClient = {
  get: <T = any>(url: string, config?: { params?: Record<string, any> }) => Promise<{ data: T }>;
  post: <T = any>(url: string, data?: any) => Promise<{ data: T }>;
  patch: <T = any>(url: string, data?: any) => Promise<{ data: T }>;
  delete: <T = any>(url: string) => Promise<{ data: T }>;
};

/**
 * Create API client using native fetch (built into Next.js/Node.js 18+)
 * Simpler than axios, no dependency needed
 */
const createApiClient = (): ApiClient => {
  const baseURL = API_CONFIG.SERVER_URL;

  const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // TODO: Add auth token from Supabase session if needed
    // const session = await supabase.auth.getSession();
    // if (session.data.session?.access_token) {
    //   headers.Authorization = `Bearer ${session.data.session.access_token}`;
    // }

    return headers;
  };

  const handleResponse = async <T>(response: Response, url: string): Promise<{ data: T }> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', {
        status: response.status,
        message: errorData?.message || errorData?.error || response.statusText,
        url,
      });
      throw new Error(errorData?.error || errorData?.message || `Request failed: ${response.statusText}`);
    }

    const data = await response.json().catch(() => ({}));
    return { data };
  };

  return {
    get: async <T = any>(url: string, config?: { params?: Record<string, any> }): Promise<{ data: T }> => {
      let fullUrl = `${baseURL}${url}`;
      
      // Add query params
      if (config?.params) {
        const params = new URLSearchParams();
        Object.entries(config.params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        const queryString = params.toString();
        if (queryString) {
          fullUrl += `?${queryString}`;
        }
      }

      try {
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: getHeaders(),
        });

        return handleResponse<T>(response, fullUrl);
      } catch (error: any) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('Network Error: No response from server');
        }
        throw error;
      }
    },

    post: async <T = any>(url: string, data?: any): Promise<{ data: T }> => {
      const fullUrl = `${baseURL}${url}`;

      try {
        const response = await fetch(fullUrl, {
          method: 'POST',
          headers: getHeaders(),
          body: data ? JSON.stringify(data) : undefined,
        });

        return handleResponse<T>(response, fullUrl);
      } catch (error: any) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('Network Error: No response from server');
        }
        throw error;
      }
    },

    patch: async <T = any>(url: string, data?: any): Promise<{ data: T }> => {
      const fullUrl = `${baseURL}${url}`;

      try {
        const response = await fetch(fullUrl, {
          method: 'PATCH',
          headers: getHeaders(),
          body: data ? JSON.stringify(data) : undefined,
        });

        return handleResponse<T>(response, fullUrl);
      } catch (error: any) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('Network Error: No response from server');
        }
        throw error;
      }
    },

    delete: async <T = any>(url: string): Promise<{ data: T }> => {
      const fullUrl = `${baseURL}${url}`;

      try {
        const response = await fetch(fullUrl, {
          method: 'DELETE',
          headers: getHeaders(),
        });

        return handleResponse<T>(response, fullUrl);
      } catch (error: any) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('Network Error: No response from server');
        }
        throw error;
      }
    },
  };
};

// Create singleton instance
let _apiClient: ApiClient | null = null;

export const getApiClient = (): ApiClient => {
  if (!_apiClient) {
    _apiClient = createApiClient();
  }
  return _apiClient;
};

export const apiClient = getApiClient();
