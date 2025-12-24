/**
 * Type Definitions for RapStation Project
 */



// Booking types available
export type BookingType = "ps4" | "ps5" | "warnet" | "";

// Booking form data structure
export interface BookingFormData {
    bookingType: BookingType;
    date: string;
    phone: string;
    name: string;
    bookingCode?: string;
}

// Facility item structure
export interface FacilityItem {
    title: string;
    desc: string;
    icon: React.ReactNode;
    img: string;
    type?: BookingType;
}

// Navigation item structure
export interface NavItem {
    label: string;
    href: string;
}

// Form validation result
export interface ValidationResult {
    isValid: boolean;
    errors: {
        bookingType?: string;
        date?: string;
        phone?: string;
        name?: string;
    };
}
