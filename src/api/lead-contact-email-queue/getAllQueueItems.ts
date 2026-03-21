import { API_CONFIG } from '@/src/config/api';
import type { LeadContactEmailQueue } from '@/src/model/lead-contact-email-queue';
import type { ApiResponse } from '../types';

export type GetQueueItemsFilters = {
  status?: 'queued' | 'sending' | 'sent' | 'failed';
  lead_id?: string;
  lead_contact_id?: string;
  campaign_id?: string;
  limit?: number;
  offset?: number;
};

/**
 * Fetches all lead contact email queue items.
 * If endpoint is missing (404) or non-JSON, returns empty array.
 */
export const getAllQueueItems = async (
  filters?: GetQueueItemsFilters
): Promise<ApiResponse<LeadContactEmailQueue[]>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.lead_id) params.append('lead_id', filters.lead_id);
    if (filters?.lead_contact_id)
      params.append('lead_contact_id', filters.lead_contact_id);
    if (filters?.campaign_id) params.append('campaign_id', filters.campaign_id);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));

    const url = `${API_CONFIG.SERVER_URL}/api/data/lead-contact-email-queue${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 404) return { success: true, data: [] };

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return { success: true, data: [] };
    }

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'Failed to get queue items',
      };
    }

    return {
      success: true,
      data: data.data ?? data ?? [],
    };
  } catch (error: unknown) {
    console.error('❌ getAllQueueItems error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get queue items',
    };
  }
};
