"use client";

import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../ui/loading/LoadingSpinner";

export default function LazyLoadSection({
    children,
    rootMargin = "200px",
    placeholderStyle = "",
}: {
    children: React.ReactNode;
    rootMargin?: string;
    placeholderStyle?: string; // 👈 placeholder prop
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin }
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [rootMargin]);

    return (
        <div ref={ref}>
            {isVisible ? children : <LoadingPlaceholder className={placeholderStyle} />}
        </div>
    );
}

export const LoadingPlaceholder = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`flex items-center justify-center w-full min-h-32 ${className}`}>
            <LoadingSpinner />
        </div>
    );
}
