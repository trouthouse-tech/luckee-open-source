import { API_CONFIG } from '@/src/config/api';
import type { Ticket } from '@/src/model';
import type { ApiResponse } from '../types';

export const createTicket = async (
  ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>
): Promise<ApiResponse<Ticket>> => {
  try {
    const body = {
      userId: ticket.user_id,
      projectId: ticket.project_id,
      customerId: ticket.customer_id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      tags: ticket.tags,
      labels: ticket.labels,
    };
    const response = await fetch(`${API_CONFIG.SERVER_URL}/api/data/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
        error: data.error || 'Failed to create ticket',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    console.error('❌ Failed to create ticket:', error);
    return {
      success: false,
      error: error.message || 'Failed to create ticket',
    };
  }
};
