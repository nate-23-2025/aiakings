// Read once, at first render, rather than inside an effect. The loop visuals
// all fall back to a finished, static frame when the visitor has asked for
// less motion, so there is nothing to synchronize after mount.
export function prefersReducedMotion() {
    return typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
