/**
 * Formats a phone number to a standard US format: (XXX) XXX-XXXX.
 * Handles 10-digit, 11-digit (with leading 1), and returns original string for other formats.
 *
 * @param phone - Raw phone number string
 * @returns Formatted phone number or original string if unrecognized
 */
export const formatPhoneNumber = (
  phone: string | undefined | null
): string => {
  if (!phone) return '';

  const digits = phone.replace(/\D/g, '');
  if (digits.length === 0) return phone;

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return phone;
};
