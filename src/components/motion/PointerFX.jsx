import { useEffect } from 'react';
import gsap from 'gsap';
import { canHover, prefersReducedMotion } from '../../lib/motion';

// One pointer listener for the whole site instead of one per card.
//   data-spotlight  the card gets --mx/--my, and CSS draws the glow and lit edge
//   data-tilt       the element leans toward the cursor in 3D
// Mouse only, and nothing at all with reduced motion.
export default function PointerFX() {
    useEffect(() => {
        if (!canHover() || prefersReducedMotion()) return;

        let raf = 0;
        let last = null;
        let tilted = null;

        const untilt = (el) => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' });

        const apply = () => {
            raf = 0;
            if (!last) return;
            const { clientX: x, clientY: y, target } = last;
            const el = target instanceof Element ? target : null;

            const spot = el?.closest('[data-spotlight]');
            if (spot) {
                const r = spot.getBoundingClientRect();
                spot.style.setProperty('--mx', `${x - r.left}px`);
                spot.style.setProperty('--my', `${y - r.top}px`);
            }

            const tilt = el?.closest('[data-tilt]') || null;
            if (tilted && tilted !== tilt) untilt(tilted);
            tilted = tilt;
            if (tilt) {
                const r = tilt.getBoundingClientRect();
                const px = (x - r.left) / r.width - 0.5;
                const py = (y - r.top) / r.height - 0.5;
                gsap.to(tilt, { rotateY: px * 9, rotateX: -py * 7, transformPerspective: 1000, duration: 0.6, ease: 'power3.out' });
            }
        };

        const onMove = (e) => {
            last = e;
            if (!raf) raf = requestAnimationFrame(apply);
        };
        const onLeave = () => {
            if (tilted) untilt(tilted);
            tilted = null;
        };

        document.addEventListener('pointermove', onMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onLeave);
        return () => {
            cancelAnimationFrame(raf);
            document.removeEventListener('pointermove', onMove);
            document.documentElement.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    return null;
}
