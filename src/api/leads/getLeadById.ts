import { API_CONFIG } from '@/src/config/api';
import type { Lead } from '@/src/model';
import type { ApiResponse } from '../types';

export const getLeadById = async (
  leadId: string
): Promise<ApiResponse<Lead>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/leads/${leadId}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'Failed to load lead',
      };
    }
    const lead = data.data ?? data;
    if (!lead?.id) {
      return { success: false, error: 'Lead not found' };
    }
    return { success: true, data: lead as Lead };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to load lead',
    };
  }
};
