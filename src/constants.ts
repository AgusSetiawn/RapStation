/**
 * Design System Constants with Mathematical Structure
 * Using 8pt Grid System and Golden Ratio (φ = 1.618)
 */

import type { NavItem } from "./types";

// ============================================
// MATHEMATICAL SPACING SYSTEM (8pt Grid)
// ============================================
export const SPACING = {
    xs: 8,      // 1 unit
    sm: 16,     // 2 units
    md: 24,     // 3 units
    lg: 32,     // 4 units
    xl: 48,     // 6 units
    "2xl": 64,  // 8 units
    "3xl": 96,  // 12 units
    "4xl": 128, // 16 units
} as const;

// Golden Ratio based spacing
export const GOLDEN_RATIO = 1.618;
export const GOLDEN_SPACING = {
    base: 16,
    phi: Math.round(16 * GOLDEN_RATIO),      // ~26px
    phi2: Math.round(16 * GOLDEN_RATIO ** 2), // ~42px
    phi3: Math.round(16 * GOLDEN_RATIO ** 3), // ~68px
} as const;

// ============================================
// TYPOGRAPHY SCALE (Modular Scale 1.25 - Major Third)
// ============================================
export const TYPOGRAPHY = {
    xs: "0.8rem",      // 12.8px
    sm: "0.875rem",    // 14px
    base: "1rem",      // 16px
    lg: "1.125rem",    // 18px
    xl: "1.25rem",     // 20px
    "2xl": "1.563rem", // 25px
    "3xl": "1.953rem", // 31.25px
    "4xl": "2.441rem", // 39px
    "5xl": "3.052rem", // 48.8px
} as const;

// ============================================
// ANIMATION SYSTEM
// ============================================
export const ANIMATION = {
    duration: {
        instant: 100,
        fast: 200,
        normal: 300,
        slow: 500,
        slower: 700,
        slowest: 1000,
    },
    easing: {
        // Smooth, natural easing
        smooth: "cubic-bezier(0.4, 0.0, 0.2, 1)",
        // Energetic, bouncy easing
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        // Elegant, sophisticated
        elegant: "cubic-bezier(0.16, 1, 0.3, 1)",
        // Quick entry, slow exit
        decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)",
        // Slow entry, quick exit
        accelerate: "cubic-bezier(0.4, 0.0, 1, 1)",
    },
    stagger: {
        cards: 120,      // ms between card animations
        list: 50,        // ms between list item animations
        fast: 30,        // ms for quick sequences
    },
} as const;

// ============================================
// SHADOW SYSTEM (Elevated depth)
// ============================================
export const SHADOWS = {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    glow: {
        blue: "0 0 40px rgba(59, 130, 246, 0.5)",
        purple: "0 0 40px rgba(168, 85, 247, 0.5)",
        cyan: "0 0 40px rgba(34, 211, 238, 0.5)",
    },
} as const;

// ============================================
// EXISTING CONSTANTS (keeping for backward compatibility)
// ============================================

export const SLIDESHOW_INTERVAL_MS = 7000; // Changed to 7s for better UX
export const SLIDESHOW_TRANSITION_MS = 800; // Smoother transition

export const CARD_ANIMATION_DELAY_MS = ANIMATION.stagger.cards;
export const SCROLL_THRESHOLD = 24;
export const CARD_VISIBILITY_THRESHOLD = 0.15; // Show earlier for smoother reveal

export const NAV_ITEMS: NavItem[] = [
    { label: "Home", href: "#home" },
    { label: "Booking", href: "#booking" },
    { label: "Fasilitas", href: "#fasilitas" },
    { label: "About", href: "#about" },
];

export const BOOKING_OPTIONS = [
    { value: "", label: "Pilih Jenis Rental" },
    { value: "ps4", label: "PlayStation 4" },
    { value: "ps5", label: "PlayStation 5" },
    { value: "warnet", label: "PC Gaming" },
] as const;

export const VALIDATION_RULES = {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    DATE_MIN: new Date().toISOString().split("T")[0],
} as const;

export const CARD_3D_SETTINGS = {
    ROTATION_FACTOR: 20,  // Reduced for more subtle effect
    SHADOW_MULTIPLIER: 2.5,
    PARALLAX_MULTIPLIER: 2,
    SCALE_HOVER: 1.03,    // More subtle scale
    PERSPECTIVE: 1200,
} as const;

// ============================================
// BREAKPOINTS (Mathematical progression)
// ============================================
export const BREAKPOINTS = {
    sm: 640,   // Mobile
    md: 768,   // Tablet
    lg: 1024,  // Desktop
    xl: 1280,  // Large Desktop
    "2xl": 1536, // Extra Large
} as const;

// ============================================
// Z-INDEX SYSTEM (Organized layers)
// ============================================
export const Z_INDEX = {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    overlay: 40,
    modal: 50,
    popover: 60,
    toast: 70,
} as const;

export const BOOKING_STATUSES = [
    { value: "BOOKED", label: "Booked", color: "blue" },
    { value: "PAID", label: "Paid", color: "emerald" },
    { value: "PLAYING", label: "Playing", color: "green" },
    { value: "DONE", label: "Done", color: "gray" },
    { value: "CANCELLED", label: "Cancelled", color: "red" },
] as const;
