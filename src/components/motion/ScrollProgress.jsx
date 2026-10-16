import { useEffect, useRef } from 'react';

// A gold hairline across the top that fills as the page is read. Written
// straight to the style on a frame, never through React state, so scrolling
// never re-renders anything.
export default function ScrollProgress() {
    const barRef = useRef(null);

    useEffect(() => {
        let raf = 0;
        const update = () => {
            raf = 0;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
            if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
        };
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
}
