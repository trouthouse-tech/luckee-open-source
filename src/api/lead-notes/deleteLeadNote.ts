import { API_CONFIG } from '@/src/config/api';
import type { ApiResponse } from '../types';

/**
 * DELETE /api/data/lead-notes/:id
 */
export const deleteLeadNote = async (
  id: string
): Promise<ApiResponse<void>> => {
  try {
    const url = `${API_CONFIG.SERVER_URL}/api/data/lead-notes/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'Failed to delete note',
      };
    }
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to delete note',
    };
  }
};
