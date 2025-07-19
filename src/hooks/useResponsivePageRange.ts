import { useEffect, useState } from "react";

export function useResponsivePageWindow() {
    const [windowSize, setWindowSize] = useState<number>(9);

    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth;
            if (width < 540) {
                setWindowSize(2); // xs
            } else if (width < 700) {
                setWindowSize(4); // sm
            } else if (width < 1024) {
                setWindowSize(6); // md
            }
            else {
                setWindowSize(7); // lg+
            }
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return windowSize;
}
