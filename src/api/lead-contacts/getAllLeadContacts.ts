import { API_CONFIG } from '@/src/config/api';
import type { LeadContact } from '@/src/model/lead-contact';
import type { ApiResponse } from '../types';

/**
 * Fetches all lead contacts from the server.
 * Expects backend GET /api/data/lead-contacts (e.g. tht-express-server lead-contacts router).
 * If the endpoint is missing (404) or returns HTML, returns empty array so the app keeps working.
 */
export const getAllLeadContacts = async (): Promise<
  ApiResponse<LeadContact[]>
> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-contacts`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.status === 404) {
      return { success: true, data: [] };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return { success: true, data: [] };
    }

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'Failed to get lead contacts',
      };
    }

    return {
      success: true,
      data: data.data ?? data ?? [],
    };
  } catch (error: unknown) {
    console.error('❌ getAllLeadContacts error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get lead contacts',
    };
  }
};
