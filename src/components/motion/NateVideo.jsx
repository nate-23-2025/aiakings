import { useEffect, useRef, useState } from 'react';
import { playOrWaitForTap, prefersReducedMotion } from '../../lib/motion';

// Short clips of me, played as one loop: each clip crossfades into the next a
// beat before it ends, and the last one hands back to the first. Clips live in
// public/videos, each with a first-frame still in public/videos/posters.
//
// Nothing downloads until the player is on screen, it pauses whenever it
// scrolls away, and reduced motion or data saver get the still. A phone in
// Low Power Mode starts the clip on the first tap.
// `stillOnPhones` keeps big background clips off phone data.
// `idleStart` waits until the browser is idle after loading, so a background
// clip never competes with the headline for bandwidth, then loops on its own.
// `waitForInput` is stricter: the clip waits for the first scroll, tap, or
// key. Chrome counts a full-width video as the page's largest paint, and stops
// counting at the first input, so waiting keeps the headline as the thing that
// paints first. Pair it with `poster={false}` so no big still competes either.
const CROSSFADE_MS = 900;
const HANDOFF_S = 0.6;

const posterFor = (name) => `/videos/posters/${name}.jpg`;
const srcFor = (name) => `/videos/${name}.mp4`;

export default function NateVideo({ clips, className = '', objectPosition = 'center', stillOnPhones = false, waitForInput = false, idleStart = false, poster = true }) {
    const wrapRef = useRef(null);
    const vidRefs = useRef([]);
    const handing = useRef(false);
    const [enabled] = useState(() => {
        if (typeof window === 'undefined') return false;
        if (prefersReducedMotion()) return false;
        if (navigator.connection?.saveData) return false;
        if (stillOnPhones && !window.matchMedia('(min-width: 768px)').matches) return false;
        return true;
    });
    const [armed, setArmed] = useState(false);
    const [inView, setInView] = useState(false);
    const [active, setActive] = useState(0);
    const [ready, setReady] = useState(false);

    // Watch the screen. Arm (start downloading) the first time it is close,
    // or, with waitForInput, at the first scroll, tap, or key after that.
    useEffect(() => {
        const el = wrapRef.current;
        if (!enabled || !el) return;
        const events = ['scroll', 'pointerdown', 'keydown', 'touchstart'];
        let waiting = false;
        let idleId = 0;
        const arm = () => {
            setArmed(true);
            events.forEach((ev) => window.removeEventListener(ev, arm));
        };
        const io = new IntersectionObserver(([entry]) => {
            setInView(entry.isIntersecting);
            if (!entry.isIntersecting || waiting) return;
            waiting = true;
            if (waitForInput) events.forEach((ev) => window.addEventListener(ev, arm, { passive: true, once: true }));
            else if (idleStart) idleId = window.requestIdleCallback ? window.requestIdleCallback(arm, { timeout: 2000 }) : setTimeout(arm, 1200);
            else arm();
        }, { rootMargin: '200px' });
        io.observe(el);
        return () => {
            io.disconnect();
            events.forEach((ev) => window.removeEventListener(ev, arm));
            if (window.cancelIdleCallback) window.cancelIdleCallback(idleId);
            clearTimeout(idleId);
        };
    }, [enabled, waitForInput, idleStart]);

    // Play the active clip while on screen, pause everything when not. If the
    // phone refuses to autoplay, it starts on the first tap.
    useEffect(() => {
        if (!armed) return;
        const stops = [];
        vidRefs.current.forEach((v, i) => {
            if (!v) return;
            if (inView && i === active) stops.push(playOrWaitForTap(v));
            else if (!inView) v.pause();
        });
        return () => stops.forEach((stop) => stop());
    }, [armed, inView, active]);

    // Hand off to the next clip a beat before this one ends. If a throttled tab
    // misses that window and the clip runs out, 'ended' hands off instead, so
    // the loop never stalls.
    useEffect(() => {
        if (!armed || clips.length < 2) return;
        const v = vidRefs.current[active];
        if (!v) return;
        const handOff = () => {
            if (handing.current) return;
            handing.current = true;
            const next = (active + 1) % clips.length;
            const nv = vidRefs.current[next];
            if (nv) {
                nv.currentTime = 0;
                nv.play().catch(() => {});
            }
            setActive(next);
            setTimeout(() => { handing.current = false; }, CROSSFADE_MS);
        };
        const onTime = () => {
            if (v.duration && v.duration - v.currentTime <= HANDOFF_S) handOff();
        };
        v.addEventListener('timeupdate', onTime);
        v.addEventListener('ended', handOff);
        return () => {
            v.removeEventListener('timeupdate', onTime);
            v.removeEventListener('ended', handOff);
        };
    }, [armed, active, clips.length]);

    const fitStyle = { objectPosition };

    return (
        <div ref={wrapRef} className={`overflow-hidden ${className}`}>
            {poster && (
                <img
                    src={posterFor(clips[0])}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={fitStyle}
                />
            )}
            {armed && clips.map((name, i) => (
                <video
                    key={name}
                    ref={(el) => { vidRefs.current[i] = el; }}
                    src={srcFor(name)}
                    muted
                    playsInline
                    loop={clips.length === 1}
                    preload="auto"
                    aria-hidden="true"
                    onPlaying={i === 0 ? () => setReady(true) : undefined}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        ...fitStyle,
                        opacity: ready && active === i ? 1 : 0,
                        transition: `opacity ${CROSSFADE_MS}ms ease-in-out`,
                    }}
                />
            ))}
        </div>
    );
}
