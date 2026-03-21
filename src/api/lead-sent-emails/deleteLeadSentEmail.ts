import { API_CONFIG } from '@/src/config/api';

/**
 * Deletes a lead sent email by ID.
 */
export const deleteLeadSentEmail = async (id: string): Promise<void> => {
  const response = await fetch(
    `${API_CONFIG.SERVER_URL}/api/data/lead-sent-emails/${id}`,
    { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to delete lead sent email');
  }
};
