import { useEffect, useRef, useState } from 'react';

// The looping cards tick on an interval. Nobody is watching a card that is
// three screens away, so the loop only runs while it is actually on screen.
export function useInView(rootMargin = '120px') {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === 'undefined') return;
        const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
        io.observe(el);
        return () => io.disconnect();
    }, [rootMargin]);

    return [ref, inView];
}
