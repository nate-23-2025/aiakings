import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion';

// A looping clock for the agent diagrams: counts 0, 1, 2... up to total - 1,
// then starts over. Each diagram decides what happens at which tick. With
// reduced motion it parks on `settled`, the finished frame, and never moves.
export function useTicks(total, ms, settled = total - 1) {
    const [reduced] = useState(prefersReducedMotion);
    const [t, setT] = useState(() => (prefersReducedMotion() ? settled : 0));

    useEffect(() => {
        if (reduced) return;
        const id = setInterval(() => setT((v) => (v + 1) % total), ms);
        return () => clearInterval(id);
    }, [reduced, total, ms]);

    return t;
}
