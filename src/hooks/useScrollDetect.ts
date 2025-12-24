import { useState, useEffect } from "react";

/**
 * Custom hook for detecting when user scrolls past a threshold
 * @param threshold - Number of pixels to scroll before triggering
 * @returns boolean indicating if scrolled past threshold
 */
export function useScrollDetect(threshold: number = 24) {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    useEffect(() => {
        // Since we moved scrolling to #root to fix double scrollbars,
        // we must listen to #root instead of window.
        const root = document.getElementById("root");
        const target = root || window;

        const onScroll = () => {
            const scrollTop = root ? root.scrollTop : window.scrollY;
            setIsScrolled(scrollTop > threshold);
        };

        target.addEventListener("scroll", onScroll, { passive: true });

        // Initial check
        onScroll();

        return () => target.removeEventListener("scroll", onScroll);
    }, [threshold]);

    return isScrolled;
}
