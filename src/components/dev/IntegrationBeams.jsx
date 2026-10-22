import { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import BrandLogo from '../BrandLogo';
import Crown from '../intro/Crown';

// The tools an agent works inside, with light flowing from each one into the
// agent at the center. Adapted from the "Animated Beam Integration" component
// on 21st.dev: the beam paths are measured from the real node positions (and
// re-measured on resize), but the light runs on CSS instead of an animation
// library. The beams follow AIAK's palette; product logos keep their colors.
// Reduced motion keeps the connecting lines and drops the moving light.
const LEFT = [
    { key: 'twilio', label: 'Twilio' },
    { key: 'calendar', label: 'Google Calendar' },
    { key: 'slack', label: 'Slack' },
];
const RIGHT = [
    { key: 'clickup', label: 'ClickUp' },
    { key: 'gmail', label: 'Gmail' },
    { key: 'stripe', label: 'Stripe' },
];
const CURVE = [-60, 0, 60];

const Node = forwardRef(function Node({ label, brand, side }, ref) {
    return (
        <div className="flex flex-col items-center gap-2" data-side={side}>
            <div ref={ref} className="relative z-10 grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-white/10 bg-[#15151A]/90 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-[border-color,scale] duration-300 hover:scale-105 hover:border-brand-accent/40">
                <BrandLogo name={brand} size={28} />
            </div>
            <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.14em] text-white/50 text-center max-w-[80px] sm:max-w-none leading-tight">{label}</span>
        </div>
    );
});

function Beam({ containerRef, fromRef, toRef, curvature, delay, from, to }) {
    const id = useId().replace(/:/g, '');
    const [geo, setGeo] = useState(null);

    const measure = useCallback(() => {
        const c = containerRef.current?.getBoundingClientRect();
        const a = fromRef.current?.getBoundingClientRect();
        const b = toRef.current?.getBoundingClientRect();
        if (!c || !a || !b) return;
        const sx = a.left - c.left + a.width / 2;
        const sy = a.top - c.top + a.height / 2;
        const ex = b.left - c.left + b.width / 2;
        const ey = b.top - c.top + b.height / 2;
        const cx = (sx + ex) / 2;
        const cy = (sy + ey) / 2 - curvature;
        setGeo({ w: c.width, h: c.height, d: `M ${sx},${sy} Q ${cx},${cy} ${ex},${ey}`, sx, sy, ex, ey });
    }, [containerRef, fromRef, toRef, curvature]);

    useEffect(() => {
        // Measured on the next frame, once the nodes have their final layout.
        const raf = requestAnimationFrame(measure);
        const ro = new ResizeObserver(measure);
        if (containerRef.current) ro.observe(containerRef.current);
        document.fonts?.ready.then(measure);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [measure, containerRef]);

    if (!geo) return null;
    return (
        <svg className="pointer-events-none absolute inset-0 z-0" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} fill="none" aria-hidden="true">
            <defs>
                <linearGradient id={`beam${id}`} gradientUnits="userSpaceOnUse" x1={geo.sx} y1={geo.sy} x2={geo.ex} y2={geo.ey}>
                    <stop offset="0%" stopColor={from} stopOpacity="0" />
                    <stop offset="25%" stopColor={from} stopOpacity="0.85" />
                    <stop offset="65%" stopColor={to} stopOpacity="1" />
                    <stop offset="100%" stopColor={to} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={geo.d} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeLinecap="round" />
            <path
                d={geo.d}
                pathLength="200"
                className="beam-light"
                stroke={`url(#beam${id})`}
                strokeWidth="2.6"
                strokeLinecap="round"
                style={{ animationDelay: `${delay}s`, filter: `drop-shadow(0 0 4px ${to})` }}
            />
        </svg>
    );
}

export default function IntegrationBeams() {
    const containerRef = useRef(null);
    const hubRef = useRef(null);
    const leftRefs = [useRef(null), useRef(null), useRef(null)];
    const rightRefs = [useRef(null), useRef(null), useRef(null)];

    return (
        <div ref={containerRef} className="relative w-full max-w-3xl mx-auto h-[360px] sm:h-[420px] flex items-center justify-center">
            <div className="relative z-10 w-full h-full max-h-[320px] flex items-center justify-between px-1 sm:px-10">
                <div className="flex flex-col justify-between h-full">
                    {LEFT.map((n, i) => <Node key={n.key} ref={leftRefs[i]} side="left" label={n.label} brand={n.key} />)}
                </div>

                <div className="flex flex-col items-center gap-3">
                    <div ref={hubRef} className="relative z-10 grid place-items-center w-20 h-20 sm:w-24 sm:h-24 rounded-[1.75rem] border border-brand-accent/45 bg-gradient-to-b from-[#1C1810] to-[#0F1220] shadow-[0_0_60px_rgba(201,168,76,0.25)] ring-8 ring-brand-accent/[0.05]">
                        <span aria-hidden="true" className="core-ring absolute inset-0 rounded-[1.75rem] border border-brand-accent/50" />
                        <Crown className="w-11 sm:w-12" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-accent/90">Your agent</span>
                </div>

                <div className="flex flex-col justify-between h-full">
                    {RIGHT.map((n, i) => <Node key={n.key} ref={rightRefs[i]} side="right" label={n.label} brand={n.key} />)}
                </div>
            </div>

            {LEFT.map((n, i) => (
                <Beam key={n.key} containerRef={containerRef} fromRef={leftRefs[i]} toRef={hubRef} curvature={CURVE[i]} delay={i * 0.6} from="#C9A84C" to="#F1DC9B" />
            ))}
            {RIGHT.map((n, i) => (
                <Beam key={n.key} containerRef={containerRef} fromRef={rightRefs[i]} toRef={hubRef} curvature={CURVE[i]} delay={0.3 + i * 0.6} from="#5B7BD5" to="#8EA5EE" />
            ))}
        </div>
    );
}
