import { API_CONFIG } from '@/src/config/api';
import type { Ticket } from '@/src/model';
import type { ApiResponse } from '../types';

export const getAllTickets = async (userId: string): Promise<ApiResponse<Ticket[]>> => {
  try {
    const response = await fetch(`${API_CONFIG.SERVER_URL}/api/data/tickets?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Silently handle 404s - endpoint may not exist yet
      if (response.status === 404) {
        return {
          success: true,
          data: [],
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
        error: data.error || 'Failed to get tickets',
      };
    }

    return {
      success: true,
      data: data.data || [],
    };
  } catch (error: any) {
    console.error('❌ Failed to get tickets:', error);
    return {
      success: false,
      error: error.message || 'Failed to get tickets',
    };
  }
};
