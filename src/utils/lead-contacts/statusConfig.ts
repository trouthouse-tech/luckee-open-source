import type { LeadContactStatus } from '@/src/model/lead-contact';

export const STATUS_CONFIG: Record<
  LeadContactStatus,
  { label: string; color: string }
> = {
  not_contacted: { label: 'Not contacted', color: 'bg-gray-100 text-gray-700' },
  contacted: { label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
  responded: { label: 'Responded', color: 'bg-green-100 text-green-800' },
  not_responded: { label: 'Not responded', color: 'bg-yellow-100 text-yellow-800' },
  won: { label: 'Won', color: 'bg-emerald-100 text-emerald-800' },
  lost: { label: 'Lost', color: 'bg-red-100 text-red-800' },
};
