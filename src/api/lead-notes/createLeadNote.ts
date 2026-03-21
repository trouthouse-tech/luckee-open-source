import { API_CONFIG } from '@/src/config/api';
import type { LeadNote } from '@/src/model/lead-note';
import type { ApiResponse } from '../types';

export type CreateLeadNoteInput = {
  lead_id: string;
  content: string;
};

/**
 * POST /api/data/lead-notes
 */
export const createLeadNote = async (
  input: CreateLeadNoteInput
): Promise<ApiResponse<LeadNote>> => {
  try {
    const url = `${API_CONFIG.SERVER_URL}/api/data/lead-notes`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'Failed to create note',
      };
    }
    const note = data.data ?? data;
    if (!note?.id) {
      return { success: false, error: 'Invalid response from server' };
    }
    return { success: true, data: note as LeadNote };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to create note',
    };
  }
};
