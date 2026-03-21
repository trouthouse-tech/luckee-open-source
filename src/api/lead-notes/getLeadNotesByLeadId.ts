import { API_CONFIG } from '@/src/config/api';
import type { LeadNote } from '@/src/model/lead-note';
import type { ApiResponse } from '../types';

/**
 * GET /api/data/lead-notes/lead/:leadId
 */
export const getLeadNotesByLeadId = async (
  leadId: string
): Promise<ApiResponse<LeadNote[]>> => {
  try {
    const url = `${API_CONFIG.SERVER_URL}/api/data/lead-notes/lead/${leadId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'Failed to load notes',
      };
    }
    const notes = (data.data ?? data ?? []) as LeadNote[];
    return { success: true, data: Array.isArray(notes) ? notes : [] };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to load notes',
    };
  }
};
