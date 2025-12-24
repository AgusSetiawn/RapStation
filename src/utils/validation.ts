import type { BookingFormData, ValidationResult } from "../types";
import { VALIDATION_RULES } from "../constants";

/**
 * Validates booking form data
 * @param data - The booking form data to validate
 * @returns ValidationResult with isValid flag and error messages
 */
export function validateBookingForm(data: BookingFormData): ValidationResult {
    const errors: ValidationResult["errors"] = {};
    let isValid = true;

    // Validate booking type
    if (!data.bookingType) {
        errors.bookingType = "Pilih jenis rental terlebih dahulu";
        isValid = false;
    }

    // Validate date
    if (!data.date) {
        errors.date = "Pilih tanggal booking";
        isValid = false;
    } else {
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            errors.date = "Tanggal tidak boleh di masa lalu";
            isValid = false;
        }
    }

    // Validate name
    if (!data.name || data.name.trim() === "") {
        errors.name = "Masukkan nama Anda";
        isValid = false;
    } else {
        const trimmedName = data.name.trim();

        if (trimmedName.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
            errors.name = `Nama minimal ${VALIDATION_RULES.NAME_MIN_LENGTH} karakter`;
            isValid = false;
        } else if (data.name.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
            errors.name = `Nama maksimal ${VALIDATION_RULES.NAME_MAX_LENGTH} karakter`;
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
            // Only allow letters and spaces
            errors.name = "Nama hanya boleh berisi huruf dan spasi";
            isValid = false;
        }
    }

    // Validate Phone with enhanced sanitization
    if (!data.phone || data.phone.trim() === "") {
        errors.phone = "Masukkan nomor WhatsApp";
        isValid = false;
    } else {
        // Sanitize: Remove all non-digit characters
        const cleaned = data.phone.replace(/\D/g, '');

        // Check length (9-15 digits is international standard)
        if (cleaned.length < 9) {
            errors.phone = "Nomor tidak valid (min 9 digit)";
            isValid = false;
        } else if (cleaned.length > 15) {
            errors.phone = "Nomor tidak valid (max 15 digit)";
            isValid = false;
        } else if (/^(\d)\1+$/.test(cleaned)) {
            // Prevent repeated digits like 0000000000 or 1111111111
            errors.phone = "Nomor tidak valid (tidak boleh semua digit sama)";
            isValid = false;
        }
    }

    return { isValid, errors };
}

/**
 * Checks if a date is valid and not in the past
 */
export function isValidFutureDate(dateString: string): boolean {
    if (!dateString) return false;

    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today;
}
