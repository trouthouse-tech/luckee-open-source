/**
 * Frontend route paths. Use these instead of hardcoded strings for navigation.
 */
export const FIND_LEADS_PATH = '/leads/find';

export const LEAD_DETAIL_PATH = '/lead-detail-page';

/** Query: `?leadId=&contactId=` */
export const LEAD_CONTACT_DETAIL_PATH = '/lead-contact-detail-page';

export const buildLeadContactDetailHref = (
  leadId: string,
  contactId: string
): string =>
  `${LEAD_CONTACT_DETAIL_PATH}?leadId=${encodeURIComponent(leadId)}&contactId=${encodeURIComponent(contactId)}`;
