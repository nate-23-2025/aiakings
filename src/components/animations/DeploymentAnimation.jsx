import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Phase 03 — Deployment
// A live pipeline: qualified leads flow along the line into the calendar, which
// pulses on each booking. One clear, looping idea.
export default function DeploymentAnimation({ className = 'w-full h-full' }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Continuous flow shimmer along the pipe
            gsap.set('.d-flow', { strokeDashoffset: 0 });
            gsap.to('.d-flow', { strokeDashoffset: -16, duration: 0.9, ease: 'none', repeat: -1 });

            const tl = gsap.timeline({ repeat: -1 });
            const starts = [0, 1.0, 2.0];
            const cycle = 3.0;
            tl.to({}, { duration: cycle });

            starts.forEach((t, i) => {
                tl.fromTo(`#ld${i}`, { attr: { cx: 32 }, opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' }, t);
                tl.to(`#ld${i}`, { attr: { cx: 148 }, duration: 1.05, ease: 'power1.in' }, t + 0.1);
                tl.to(`#ld${i}`, { opacity: 0, duration: 0.2 }, t + 1.0);

                // Booking pulse on arrival
                tl.fromTo('.d-ring', { attr: { r: 13 }, opacity: 0.55 }, { attr: { r: 24 }, opacity: 0, duration: 0.6, ease: 'power2.out' }, t + 1.05);
                tl.to('.d-cal', { scale: 1.09, duration: 0.14, yoyo: true, repeat: 1, transformOrigin: '166px 75px', ease: 'power2.out' }, t + 1.05);
                tl.fromTo('.d-check', { opacity: 0, scale: 0.5, transformOrigin: '166px 76px' }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, t + 1.1);
                tl.to('.d-check', { opacity: 0, duration: 0.3, ease: 'power2.in' }, t + 1.75);
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={`relative overflow-hidden rounded-2xl bg-[#0D0D12]/50 border border-white/5 ${className}`}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(120% 90% at 70% 50%, rgba(201,168,76,0.06), transparent 60%)' }} />
            <div className="absolute top-5 left-5 z-10 text-brand-accent/90 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase">Leads → Calendar</div>

            {/* Live indicator */}
            <div className="absolute top-5 right-5 z-10 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400/80 font-mono text-[9px] sm:text-[10px] tracking-[0.15em] uppercase">Live</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 150" className="w-[88%] max-w-[290px]" fill="none">
                    {/* Pipe track */}
                    <line x1="30" y1="75" x2="150" y2="75" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
                    <line className="d-flow" x1="30" y1="75" x2="150" y2="75" stroke="rgba(201,168,76,0.35)" strokeWidth="2"
                        strokeLinecap="round" strokeDasharray="2 6" />

                    {/* Source */}
                    <circle cx="26" cy="75" r="6" fill="#15151A" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                    <circle cx="26" cy="75" r="2.2" fill="rgba(255,255,255,0.5)" />

                    {/* Flowing leads */}
                    {[0, 1, 2].map(i => (
                        <circle key={i} id={`ld${i}`} cx="32" cy="75" r="3.2" fill="#C9A84C" opacity="0" />
                    ))}

                    {/* Booking pulse ring */}
                    <circle className="d-ring" cx="166" cy="75" r="13" fill="none" stroke="rgba(201,168,76,0.6)" strokeWidth="1.5" opacity="0" />

                    {/* Calendar endpoint */}
                    <g className="d-cal">
                        <rect x="153" y="62" width="26" height="26" rx="6" fill="#15151A" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" />
                        <line x1="153" y1="69" x2="179" y2="69" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" />
                        <line x1="160" y1="60" x2="160" y2="65" stroke="rgba(201,168,76,0.6)" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="172" y1="60" x2="172" y2="65" stroke="rgba(201,168,76,0.6)" strokeWidth="1.5" strokeLinecap="round" />
                        <path className="d-check" d="M160 77 l4 4 l7 -8" stroke="#C9A84C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0" />
                    </g>
                </svg>
            </div>
        </div>
    );
}
