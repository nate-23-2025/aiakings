// Read once, at first render, rather than inside an effect. The loop visuals
// all fall back to a finished, static frame when the visitor has asked for
// less motion, so there is nothing to synchronize after mount.
export function prefersReducedMotion() {
    return typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Cursor effects (spotlight, tilt, magnetic pull, hero glow) only make sense
// with a real mouse. On a phone they would fire on tap and stick.
export function canHover() {
    return typeof window !== 'undefined'
        && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

// iPhones in Low Power Mode refuse to autoplay any video, muted or not, and
// some data saver modes do the same. When play() is refused, try again on the
// visitor's first tap or key, which the browser always allows. Returns a
// cleanup that drops the listeners.
export function playOrWaitForTap(video) {
    const events = ['touchstart', 'touchend', 'pointerup', 'keydown'];
    let cancelled = false;
    let waiting = false;
    const stop = () => {
        cancelled = true;
        if (!waiting) return;
        waiting = false;
        events.forEach((ev) => window.removeEventListener(ev, retry, true));
    };
    const retry = () => { video.play().then(stop, () => {}); };
    video.play()?.catch(() => {
        if (cancelled || waiting) return;
        waiting = true;
        events.forEach((ev) => window.addEventListener(ev, retry, { capture: true, passive: true }));
    });
    return stop;
}
