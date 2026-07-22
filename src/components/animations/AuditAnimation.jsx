import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Phase 01 — Discovery & Mapping
// A scan beam sweeps across a constellation of nodes; each lights gold as the
// beam passes, then thin connectors draw the network. One clear, looping idea.
const NODES = [
    { id: 'n0', x: 34, y: 104 },
    { id: 'n1', x: 58, y: 52 },
    { id: 'n2', x: 96, y: 92 },
    { id: 'n3', x: 122, y: 44 },
    { id: 'n4', x: 150, y: 104 },
    { id: 'n5', x: 176, y: 62 },
];
const LINES = [
    ['n0', 'n1'], ['n1', 'n2'], ['n1', 'n3'], ['n2', 'n3'],
    ['n2', 'n4'], ['n3', 'n5'], ['n4', 'n5'],
];
const byId = Object.fromEntries(NODES.map(n => [n.id, n]));

export default function AuditAnimation({ className = 'w-full h-full' }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
            const sweep = 2.4;

            tl.set('.a-dot', { attr: { r: 2.6 }, fill: '#3a3a46' });
            tl.set('.a-halo', { opacity: 0, attr: { r: 4 } });
            tl.set('.a-line', { opacity: 0 });
            tl.set('.a-beam', { attr: { x: -14 }, opacity: 0 });

            // Beam sweep
            tl.to('.a-beam', { opacity: 1, duration: 0.35 }, 0);
            tl.to('.a-beam', { attr: { x: 214 }, duration: sweep, ease: 'none' }, 0);

            // Nodes light in x-order, timed to the beam position
            NODES.slice().sort((a, b) => a.x - b.x).forEach(n => {
                const at = (n.x / 200) * sweep + 0.25;
                tl.to(`#${n.id}-dot`, { fill: '#C9A84C', attr: { r: 3.6 }, duration: 0.3, ease: 'power2.out' }, at);
                tl.to(`#${n.id}-halo`, { opacity: 0.35, attr: { r: 9 }, duration: 0.5, ease: 'power2.out' }, at);
            });

            // Connectors draw once endpoints are lit
            tl.to('.a-line', { opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out' }, sweep * 0.7);
            tl.to('.a-beam', { opacity: 0, duration: 0.4 }, sweep + 0.1);

            // Hold, then dissolve back to start
            tl.to({}, { duration: 1.1 });
            tl.to('.a-line', { opacity: 0, duration: 0.5, ease: 'power2.in' });
            tl.to('.a-halo', { opacity: 0, attr: { r: 4 }, duration: 0.4 }, '<');
            tl.to('.a-dot', { fill: '#3a3a46', attr: { r: 2.6 }, duration: 0.4 }, '<');
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={`relative overflow-hidden rounded-2xl bg-[#0D0D12]/50 border border-white/5 ${className}`}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(120% 90% at 50% 45%, rgba(201,168,76,0.06), transparent 60%)' }} />
            <div className="absolute top-5 left-5 z-10 text-brand-accent/90 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase">Mapping Operations</div>

            <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 150" className="w-[86%] max-w-[280px]" fill="none">
                    {/* Connectors */}
                    {LINES.map(([a, b], i) => (
                        <line key={i} className="a-line" x1={byId[a].x} y1={byId[a].y} x2={byId[b].x} y2={byId[b].y}
                            stroke="rgba(201,168,76,0.45)" strokeWidth="1" strokeLinecap="round" />
                    ))}
                    {/* Nodes: halo + dot */}
                    {NODES.map(n => (
                        <g key={n.id}>
                            <circle id={`${n.id}-halo`} className="a-halo" cx={n.x} cy={n.y} r="4" fill="rgba(201,168,76,0.35)" />
                            <circle id={`${n.id}-dot`} className="a-dot" cx={n.x} cy={n.y} r="2.6" fill="#3a3a46" />
                        </g>
                    ))}
                    {/* Scan beam */}
                    <g className="a-beam">
                        <rect x="-6" y="0" width="12" height="150" fill="url(#a-beamGrad)" />
                        <line x1="0" y1="0" x2="0" y2="150" stroke="rgba(201,168,76,0.9)" strokeWidth="1" />
                    </g>
                    <defs>
                        <linearGradient id="a-beamGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0" stopColor="rgba(201,168,76,0)" />
                            <stop offset="0.5" stopColor="rgba(201,168,76,0.28)" />
                            <stop offset="1" stopColor="rgba(201,168,76,0)" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}
