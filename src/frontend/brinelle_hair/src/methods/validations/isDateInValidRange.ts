import { DATE_CONSTRAINTS } from "@/constants/business-rules/business-rules";

/**
 * Check if date is within valid booking range
 */

export function isDateInValidRange(date: Date): boolean {
    return date >= DATE_CONSTRAINTS.minDate && date <= DATE_CONSTRAINTS.maxDate;
}
