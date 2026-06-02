import { useState, useEffect } from "react";

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Use the native matchMedia API
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        
        // Set the initial value
        setIsMobile(mediaQuery.matches);

        // Create the event listener for when the breakpoint is crossed
        const handleChange = (e) => setIsMobile(e.matches);

        // Modern browsers use addEventListener on MediaQueryList
        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    return isMobile;
}