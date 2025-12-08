import { formatDate } from "./formatDate";

/**
 * Check if date is today or in the future
 */

export function isFutureDate(dateString: string): boolean {
    const today = formatDate(new Date());
    return dateString >= today;
}
