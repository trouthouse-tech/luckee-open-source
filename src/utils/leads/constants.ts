export const LEAD_STATUSES: { value: string; label: string }[] = [
  { value: 'not_contacted', label: 'Not contacted' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'not_answered', label: 'Not answered' },
  { value: 'lost', label: 'Lost' },
  { value: 'archived', label: 'Archived' },
];

export const QUALITY_FILTER_OPTIONS: {
  value: LeadQualityFilterValue;
  label: string;
}[] = [
  { value: 'all', label: 'All' },
  { value: 'unscored', label: 'Unscored' },
  { value: '<30', label: 'Under 30' },
  { value: '30-50', label: '30–50' },
  { value: '51-70', label: '51–70' },
  { value: '71+', label: '71+' },
];

export type LeadQualityFilterValue =
  | 'all'
  | 'unscored'
  | '<30'
  | '30-50'
  | '51-70'
  | '71+';
