import { useEffect, useRef } from 'react';
import { canHover, prefersReducedMotion } from '../../lib/motion';

// The light behind the whole site. Sits under every page, below the content,
// and the section backgrounds are slightly see-through so it shows.
//
//   Two big lights, champagne and sapphire, that trade sides as the page
//   scrolls, so every section gets its own lighting, and that gather behind
//   the last ask at the bottom of the page.
//   A faint dot grid, like engineering paper under glass.
//   On a mouse, the dots around the cursor wake up.
//
// Everything moves by transform. The animation loop only runs while something
// is actually catching up to a new target, then stops, so an idle page costs
// nothing. Reduced motion gets the lights placed once and nothing else.
const GRID = 28;
const WAKE = 420;
const LERP = 0.07;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);

export default function AmbientLight() {
    const goldRef = useRef(null);
    const blueRef = useRef(null);
    const wakeRef = useRef(null);

    useEffect(() => {
        const gold = goldRef.current;
        const blue = blueRef.current;
        const wake = wakeRef.current;
        if (!gold || !blue) return;

        const reduced = prefersReducedMotion();
        const cur = { gx: 0, gy: 0, bx: 0, by: 0, wx: -WAKE, wy: -WAKE };
        const tgt = { ...cur };
        let gs = 0;
        let bs = 0;

        const measure = () => {
            gs = gold.offsetWidth;
            bs = blue.offsetWidth;
        };

        // Where the lights want to be for the current scroll position.
        const aim = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const max = document.documentElement.scrollHeight - h;
            const p = max > 0 ? clamp01(window.scrollY / max) : 0;
            const end = smooth(clamp01((p - 0.82) / 0.18));

            let gx = w * (0.5 + 0.36 * Math.cos(p * Math.PI * 3));
            let gy = h * (0.24 + 0.12 * Math.sin(p * Math.PI * 2));
            let bx = w * (0.5 - 0.4 * Math.cos(p * Math.PI * 3 + 0.7));
            let by = h * (0.76 - 0.12 * Math.sin(p * Math.PI * 2 + 1));

            gx += (w * 0.5 - gx) * end;
            gy += (h * 0.55 - gy) * end;
            bx += (w * 0.5 - bx) * end * 0.6;
            by += (h * 0.85 - by) * end * 0.6;

            Object.assign(tgt, { gx, gy, bx, by });
        };

        const apply = () => {
            gold.style.transform = `translate3d(${cur.gx - gs / 2}px, ${cur.gy - gs / 2}px, 0)`;
            blue.style.transform = `translate3d(${cur.bx - bs / 2}px, ${cur.by - bs / 2}px, 0)`;
            if (wake) {
                const x = cur.wx - WAKE / 2;
                const y = cur.wy - WAKE / 2;
                wake.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                // Counter-shift the pattern so the bright dots sit exactly on the grid.
                wake.style.backgroundPosition = `${-x}px ${-y}px, center`;
            }
        };

        measure();
        aim();
        Object.assign(cur, tgt);
        apply();
        if (reduced) {
            const onResize = () => { measure(); aim(); Object.assign(cur, tgt); apply(); };
            window.addEventListener('resize', onResize);
            return () => window.removeEventListener('resize', onResize);
        }

        let raf = 0;
        const tick = () => {
            raf = 0;
            let moving = false;
            for (const k of Object.keys(tgt)) {
                const d = tgt[k] - cur[k];
                if (Math.abs(d) > 0.4) {
                    cur[k] += d * LERP;
                    moving = true;
                } else {
                    cur[k] = tgt[k];
                }
            }
            apply();
            if (moving) raf = requestAnimationFrame(tick);
        };
        const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

        const onScroll = () => { aim(); kick(); };
        const onResize = () => { measure(); aim(); kick(); };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });

        const hover = canHover() && wake;
        const onMove = (e) => {
            tgt.wx = e.clientX;
            tgt.wy = e.clientY;
            wake.style.opacity = '1';
            kick();
        };
        const onLeave = () => { wake.style.opacity = '0'; };
        if (hover) {
            // Start the wake where the cursor first appears instead of sliding in from a corner.
            const first = (e) => { cur.wx = tgt.wx = e.clientX; cur.wy = tgt.wy = e.clientY; };
            window.addEventListener('pointermove', first, { once: true, passive: true });
            window.addEventListener('pointermove', onMove, { passive: true });
            document.documentElement.addEventListener('pointerleave', onLeave);
        }

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            if (hover) {
                window.removeEventListener('pointermove', onMove);
                document.documentElement.removeEventListener('pointerleave', onLeave);
            }
        };
    }, []);

    return (
        <div aria-hidden="true" className="ambient fixed inset-0 -z-10 pointer-events-none overflow-hidden">
            <div ref={goldRef} className="ambient-orb ambient-gold" />
            <div ref={blueRef} className="ambient-orb ambient-sapphire" />
            <div className="ambient-grid" style={{ backgroundSize: `${GRID}px ${GRID}px` }} />
            <div ref={wakeRef} className="ambient-wake" style={{ width: WAKE, height: WAKE, backgroundSize: `${GRID}px ${GRID}px, 100% 100%` }} />
        </div>
    );
}
