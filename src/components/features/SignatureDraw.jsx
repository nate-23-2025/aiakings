import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../../lib/motion';
import { SIGNATURE_PATH, SIGNATURE_VIEWBOX, SIGNATURE_BASELINE } from './signaturePath';

// True pen-writing signature. The path is stroked (no fill) and revealed by
// animating stroke-dashoffset, like a pen tracing the name. `draw` true writes
// it on; false retraces it back off. pathLength="1" normalizes the math so no
// runtime measuring is needed (and no first-frame flash). Brought back from
// the July site; the path is a stacked "Nathan / Mamo" in Pinyon Script.
export default function SignatureDraw({ draw = false, className = '', strokeWidth = 22, drawDuration = 4.4, eraseDuration = 3.0 }) {
    const pathRef = useRef(null);

    useEffect(() => {
        const p = pathRef.current;
        if (!p) return;
        const from = parseFloat(p.style.strokeDashoffset || '1');
        const target = draw ? 0 : 1;
        // Reduced motion: no pen stroke, the signature is simply there.
        if (prefersReducedMotion()) {
            p.style.strokeDashoffset = target;
            return;
        }
        const obj = { o: from };
        const tw = gsap.to(obj, {
            o: target,
            duration: draw ? drawDuration : eraseDuration,
            ease: draw ? 'sine.inOut' : 'power2.in',
            onUpdate: () => { p.style.strokeDashoffset = obj.o; },
        });
        return () => tw.kill();
    }, [draw, drawDuration, eraseDuration]);

    return (
        <svg viewBox={SIGNATURE_VIEWBOX} className={className} fill="none" aria-hidden="true">
            <path
                ref={pathRef}
                d={SIGNATURE_PATH}
                transform={`matrix(1 0 0 -1 0 ${SIGNATURE_BASELINE})`}
                fill="none"
                stroke="rgba(201, 168, 76, 0.9)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength="1"
                style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
        </svg>
    );
}
