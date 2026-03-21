import { API_CONFIG } from '@/src/config/api';
import type { ApiResponse } from '../types';

export const deleteTicket = async (ticketId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${API_CONFIG.SERVER_URL}/api/data/tickets/${ticketId}`, {
      method: 'DELETE',
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
          success: false,
          error: 'Ticket API endpoint not available yet',
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
        error: data.error || 'Failed to delete ticket',
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('❌ Failed to delete ticket:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete ticket',
    };
  }
};
