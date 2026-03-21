/**
 * Resolve a customer id to a display name from a customers map.
 * Returns em dash when id is null, the customer name when found, or the id when not found.
 */
export const getCustomerName = (
  customers: Record<string, { name: string }>,
  customerId: string | null,
): string => {
  if (!customerId) return '—';
  return customers[customerId]?.name ?? customerId;
};
