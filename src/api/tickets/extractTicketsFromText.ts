import { API_CONFIG } from '@/src/config/api';
import type { Ticket } from '@/src/model';
import type { ApiResponse } from '../types';

export type ExtractTicketsFromTextInput = {
  userId: string;
  projectId: string;
  customerId?: string | null;
  textBlob: string;
};

export type ExtractedTicketItem = {
  title: string;
  description?: string | null;
  status?: string;
  priority?: string;
};

export type ExtractionDuplicate = {
  extracted: ExtractedTicketItem;
  existingTicketId: string;
  existingTicketTitle: string;
};

export type ExtractTicketsFromTextResponse = {
  created: Ticket[];
  duplicates: ExtractionDuplicate[];
};

/**
 * Call the backend extract-from-text API. Backend extracts, reconciles against existing,
 * creates only new tickets, returns created + duplicates for approve/deny.
 */
export const extractTicketsFromText = async (
  input: ExtractTicketsFromTextInput,
): Promise<ApiResponse<ExtractTicketsFromTextResponse>> => {
  try {
    const response = await fetch(`${API_CONFIG.SERVER_URL}/api/data/tickets/extract-from-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: input.userId,
        projectId: input.projectId,
        customerId: input.customerId ?? null,
        textBlob: input.textBlob,
      }),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ extractTicketsFromText non-JSON:', text.substring(0, 200));
      return {
        success: false,
        error: 'Extract endpoint returned invalid response',
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to extract tickets',
      };
    }

    return {
      success: true,
      data: {
        created: Array.isArray(data.created) ? data.created : [],
        duplicates: Array.isArray(data.duplicates) ? data.duplicates : [],
      },
    };
  } catch (error: unknown) {
    console.error('❌ extractTicketsFromText:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract tickets',
    };
  }
};
