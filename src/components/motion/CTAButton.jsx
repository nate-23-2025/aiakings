import { useRef } from 'react';
import gsap from 'gsap';
import { canHover, prefersReducedMotion } from '../../lib/motion';

// The one gold button, used everywhere a visitor is asked to book. A light
// sweep on hover, a slight pull toward the cursor on desktop, and optionally
// an idle glint (glint) or a breathing ring (halo) where it is the last ask on
// the page. The pull is a transform, so the hover and press feedback use the
// separate scale property and the two never fight.
const SIZES = {
    sm: 'px-6 py-2.5 text-sm rounded-[2rem] min-h-[44px]',
    md: 'px-9 py-4 text-base rounded-[2rem] min-h-[52px]',
    lg: 'px-10 py-4 text-base sm:text-lg rounded-[2rem] min-h-[52px]',
    xl: 'px-10 py-4 sm:py-5 text-base sm:text-lg rounded-[2.5rem] min-h-[52px]',
};

export default function CTAButton({ children, onClick, size = 'lg', glow = true, glint = false, halo = false, className = '' }) {
    const btnRef = useRef(null);
    const labelRef = useRef(null);
    const pull = useRef(null);

    const onPointerMove = (e) => {
        if (!canHover() || prefersReducedMotion()) return;
        if (!pull.current) {
            const opts = { duration: 0.6, ease: 'power3.out' };
            pull.current = {
                x: gsap.quickTo(btnRef.current, 'x', opts),
                y: gsap.quickTo(btnRef.current, 'y', opts),
                lx: gsap.quickTo(labelRef.current, 'x', opts),
                ly: gsap.quickTo(labelRef.current, 'y', opts),
            };
        }
        const r = btnRef.current.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        pull.current.x(dx * 0.16);
        pull.current.y(dy * 0.3);
        pull.current.lx(dx * 0.07);
        pull.current.ly(dy * 0.12);
    };

    const onPointerLeave = () => {
        if (!pull.current) return;
        pull.current.x(0);
        pull.current.y(0);
        pull.current.lx(0);
        pull.current.ly(0);
    };

    const shadow = glow
        ? 'shadow-[0_0_30px_rgba(201,168,76,0.25)] hover:shadow-[0_0_46px_rgba(201,168,76,0.45)]'
        : 'hover:shadow-[0_0_36px_rgba(201,168,76,0.35)]';

    return (
        <button
            ref={btnRef}
            onClick={onClick}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            className={`cta-gold group relative isolate overflow-hidden bg-brand-accent text-brand-primary font-semibold tracking-wide transition-[scale,box-shadow] duration-300 active:scale-[0.97] sm:hover:scale-[1.03] ${shadow} ${SIZES[size]} ${glint ? 'cta-glint' : ''} ${halo ? 'cta-halo' : ''} ${className}`}
        >
            <span aria-hidden="true" className="cta-sheen" />
            <span ref={labelRef} className="relative z-10 inline-block">{children}</span>
        </button>
    );
}
