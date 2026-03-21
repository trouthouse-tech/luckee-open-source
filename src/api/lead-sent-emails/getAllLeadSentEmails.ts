import { API_CONFIG } from '@/src/config/api';
import type { LeadSentEmail } from '@/src/model/lead-sent-email';
import type { ApiResponse } from '../types';

/**
 * Fetches all lead sent emails from the server.
 * Expects backend GET /api/data/lead-sent-emails.
 * If the endpoint is missing (404) or returns non-JSON, returns empty array.
 */
export const getAllLeadSentEmails = async (): Promise<
  ApiResponse<(LeadSentEmail & { lead_id?: string })[]>
> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-sent-emails`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status === 404) return { success: true, data: [] };

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return { success: true, data: [] };
    }

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'Failed to get lead sent emails',
      };
    }

    return {
      success: true,
      data: data.data ?? data ?? [],
    };
  } catch (error: unknown) {
    console.error('❌ getAllLeadSentEmails error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get lead sent emails',
    };
  }
};
