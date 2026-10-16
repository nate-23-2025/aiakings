import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { canHover, prefersReducedMotion } from '../../lib/motion';

// A soft gold light that trails the cursor around the hero. It moves by
// transform only, so following the mouse never repaints the section. Drop it
// inside any positioned section; it listens on its parent.
export default function HeroGlow({ size = 640 }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        const host = el?.parentElement;
        if (!el || !host || !canHover() || prefersReducedMotion()) return;

        const x = gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' });
        const y = gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' });

        const onMove = (e) => {
            const r = host.getBoundingClientRect();
            x(e.clientX - r.left - size / 2);
            y(e.clientY - r.top - size / 2);
            gsap.to(el, { autoAlpha: 1, duration: 0.6, overwrite: 'auto' });
        };
        const onLeave = () => gsap.to(el, { autoAlpha: 0, duration: 0.8 });

        host.addEventListener('pointermove', onMove, { passive: true });
        host.addEventListener('pointerleave', onLeave);
        return () => {
            host.removeEventListener('pointermove', onMove);
            host.removeEventListener('pointerleave', onLeave);
        };
    }, [size]);

    return (
        <div
            ref={ref}
            aria-hidden="true"
            className="absolute left-0 top-0 z-[1] pointer-events-none rounded-full opacity-0 invisible"
            style={{
                width: size,
                height: size,
                background: 'radial-gradient(circle, rgba(201,168,76,0.16) 0%, rgba(201,168,76,0.05) 35%, transparent 65%)',
            }}
        />
    );
}
