import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function AnimatedCounter({ value, suffix = "", duration = 2 }) {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView && !hasAnimated) {
            setHasAnimated(true);
            const numericValue = parseInt(value.toString().replace(/\D/g, ''), 10) || 0;
            
            if (numericValue === 0) {
                setCount(0);
                return;
            }

            const startTime = Date.now();
            const endTime = startTime + (duration * 1000);

            const updateCount = () => {
                const now = Date.now();
                const progress = Math.min((now - startTime) / (duration * 1000), 1);
                
                // Easing function for smooth animation
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const currentCount = Math.floor(easeOutCubic * numericValue);
                
                setCount(currentCount);

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    setCount(numericValue);
                }
            };

            requestAnimationFrame(updateCount);
        }
    }, [isInView, hasAnimated, value, duration]);

    return (
        <motion.span
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {count}{suffix}
        </motion.span>
    );
}