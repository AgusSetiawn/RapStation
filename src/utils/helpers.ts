import type { BookingFormData } from "../types";

/**
 * Formats a date string to Indonesian locale format
 * 
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted date string in Indonesian (e.g., "18 Desember 2025")
 * 
 * @example
 * ```typescript
 * formatDateIndonesian("2025-12-18") // "18 Desember 2025"
 * ```
 */
export function formatDateIndonesian(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
}

/**
 * Generates a unique booking ID
 * 
 * @returns A unique booking ID string in format: BOOK-TIMESTAMP-RANDOM
 * 
 * @example
 * ```typescript
 * generateBookingId() // "BOOK-1702908000000-A3F"
 * ```
 */
export function generateBookingId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `BOOK-${timestamp}-${random}`;
}

/**
 * Formats booking data for logging or API submission
 * 
 * @param data - The booking form data
 * @returns Formatted booking object with additional metadata
 * 
 * @example
 * ```typescript
 * const formatted = formatBookingData({
 *   bookingType: "ps5",
 *   date: "2025-12-18",
 *   name: "John Doe"
 * });
 * ```
 */
export function formatBookingData(data: BookingFormData) {
    return {
        id: generateBookingId(),
        ...data,
        formattedDate: formatDateIndonesian(data.date),
        createdAt: new Date().toISOString(),
    };
}

/**
 * Capitalizes the first letter of each word
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 * 
 * @example
 * ```typescript
 * capitalizeWords("john doe") // "John Doe"
 * ```
 */
export function capitalizeWords(str: string): string {
    return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}
