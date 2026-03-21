/**
 * Format a date as relative time (e.g., "2 hours ago", "3 days ago")
 * For dates older than 7 days, shows the actual date
 * 
 * @param date - The date to format (Date, string, or number)
 * @param options - Optional configuration
 * @returns Formatted relative time string
 */
export const getTimeAgoFormatted = (
  date: Date | string | number,
  options?: {
    shortFormat?: boolean;
    maxDays?: number;
  }
): string => {
  const { shortFormat = false, maxDays = 7 } = options || {};

  try {
    const targetDate = new Date(date);
    const now = new Date();

    // Validate the date
    if (isNaN(targetDate.getTime())) {
      return 'Invalid date';
    }

    const diffInMs = now.getTime() - targetDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // If date is in the future
    if (diffInMs < 0) {
      return shortFormat ? 'now' : 'just now';
    }

    // Less than 1 minute
    if (diffInMinutes < 1) {
      return shortFormat ? 'now' : 'just now';
    }

    // Less than 1 hour
    if (diffInMinutes < 60) {
      const unit = shortFormat ? 'm' : diffInMinutes === 1 ? ' minute ago' : ' minutes ago';
      return `${diffInMinutes}${unit}`;
    }

    // Less than 24 hours
    if (diffInHours < 24) {
      const unit = shortFormat ? 'h' : diffInHours === 1 ? ' hour ago' : ' hours ago';
      return `${diffInHours}${unit}`;
    }

    // Less than maxDays
    if (diffInDays <= maxDays) {
      const unit = shortFormat ? 'd' : diffInDays === 1 ? ' day ago' : ' days ago';
      return `${diffInDays}${unit}`;
    }

    // For dates older than maxDays, show the actual date
    return targetDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: targetDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch (error) {
    console.error('Error formatting time ago:', error);
    return 'Invalid date';
  }
};
