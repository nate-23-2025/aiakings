import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../lib/motion';

// Counts the number in a stat up from zero the first time it scrolls into
// view, keeping whatever surrounds it ("7x", "40%+", "1 in 5"). Modeled on
// the "Number Ticker" component on 21st.dev. Reduced motion shows the value.
export default function NumberTicker({ value, duration = 1400, className = '' }) {
    const ref = useRef(null);
    const match = /(\d+(?:\.\d+)?)/.exec(value);
    const target = match ? parseFloat(match[1]) : null;
    const [n, setN] = useState(() => (target === null || prefersReducedMotion() ? target : 0));

    useEffect(() => {
        const el = ref.current;
        if (target === null || prefersReducedMotion() || !el) return;
        let raf = 0;
        const io = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            io.disconnect();
            const start = performance.now();
            const tick = (now) => {
                const p = Math.min(1, (now - start) / duration);
                const eased = 1 - Math.pow(1 - p, 3);
                setN(Math.round(target * eased));
                if (p < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
        }, { threshold: 0.6 });
        io.observe(el);
        return () => {
            io.disconnect();
            cancelAnimationFrame(raf);
        };
    }, [target, duration]);

    if (target === null) return <span className={className}>{value}</span>;
    const before = value.slice(0, match.index);
    const after = value.slice(match.index + match[1].length);
    return (
        <span ref={ref} className={`tabular-nums ${className}`} aria-label={value}>
            <span aria-hidden="true">{before}{n}{after}</span>
        </span>
    );
}
