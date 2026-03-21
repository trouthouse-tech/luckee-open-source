import { API_CONFIG } from '@/src/config/api';
import type { Customer } from '@/src/model';
import type { ApiResponse } from '../types';

export const createCustomer = async (
  payload: { user_id: string; name: string }
): Promise<ApiResponse<Customer>> => {
  try {
    const response = await fetch(`${API_CONFIG.SERVER_URL}/api/data/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Customers API endpoint not available yet',
        };
      }
      const text = await response.text();
      console.error('❌ Non-JSON response:', text.substring(0, 200));
      return {
        success: false,
        error: 'API endpoint not found or returned invalid response',
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to create customer',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: unknown) {
    console.error('❌ Failed to create customer:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create customer',
    };
  }
};
