import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Phase 02 — Build & Train
// A core is trained: data particles converge inward while a progress ring fills,
// finishing with a "trained" pulse. One clear, looping idea.
const R = 30;
const C = 2 * Math.PI * R;
const PARTICLES = [
    { x: 100, y: 16 },
    { x: 162, y: 48 },
    { x: 150, y: 118 },
    { x: 50, y: 118 },
    { x: 38, y: 48 },
];

export default function TrainingAnimation({ className = 'w-full h-full' }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });

            tl.set('.t-ring', { strokeDashoffset: C });
            tl.set('.t-core', { scale: 1, transformOrigin: '100px 75px' });
            tl.set('.t-glow', { opacity: 0.12, transformOrigin: '100px 75px' });
            tl.set('.t-trained', { opacity: 0, y: 6 });

            // Ring fills across the whole cycle
            tl.to('.t-ring', { strokeDashoffset: 0, duration: 3.2, ease: 'power1.inOut' }, 0);

            const wave = (start) => {
                PARTICLES.forEach((p, i) => {
                    const at = start + i * 0.11;
                    tl.fromTo(`#tp${i}`,
                        { attr: { cx: p.x, cy: p.y }, opacity: 0 },
                        { opacity: 1, duration: 0.2, ease: 'power2.out' }, at);
                    tl.to(`#tp${i}`, { attr: { cx: 100, cy: 75 }, opacity: 0, duration: 0.7, ease: 'power2.in' }, at + 0.15);
                    tl.to('.t-core', { scale: 1.07, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out' }, at + 0.8);
                });
            };
            wave(0.2);
            wave(1.7);

            // Trained pulse
            tl.to('.t-glow', { opacity: 0.45, scale: 1.15, duration: 0.4, ease: 'power2.out' }, 3.0);
            tl.to('.t-core', { scale: 1.12, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' }, 3.0);
            tl.to('.t-trained', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 3.2);

            // Hold + dissolve
            tl.to({}, { duration: 0.8 });
            tl.to('.t-trained', { opacity: 0, duration: 0.4, ease: 'power2.in' });
            tl.to('.t-glow', { opacity: 0.12, scale: 1, duration: 0.4 }, '<');
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={`relative overflow-hidden rounded-2xl bg-[#0D0D12]/50 border border-white/5 ${className}`}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(110% 90% at 50% 50%, rgba(201,168,76,0.07), transparent 60%)' }} />
            <div className="absolute top-5 left-5 z-10 text-brand-accent/90 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase">Training On Your Data</div>

            <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 150" className="w-[80%] max-w-[260px]" fill="none">
                    {/* Glow */}
                    <circle className="t-glow" cx="100" cy="75" r="28" fill="rgba(201,168,76,0.5)" />
                    {/* Track + progress ring */}
                    <circle cx="100" cy="75" r={R} stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                    <circle className="t-ring" cx="100" cy="75" r={R} stroke="#C9A84C" strokeWidth="2.5"
                        strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C} transform="rotate(-90 100 75)" />
                    {/* Converging particles */}
                    {PARTICLES.map((p, i) => (
                        <circle key={i} id={`tp${i}`} cx={p.x} cy={p.y} r="2.4" fill="#C9A84C" opacity="0" />
                    ))}
                    {/* Core chip */}
                    <g className="t-core">
                        <rect x="86" y="61" width="28" height="28" rx="7" fill="#15151A" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" />
                        <circle cx="94" cy="69" r="2" fill="#C9A84C" />
                        <circle cx="106" cy="69" r="2" fill="#C9A84C" />
                        <circle cx="94" cy="81" r="2" fill="#C9A84C" />
                        <circle cx="106" cy="81" r="2" fill="#C9A84C" />
                    </g>
                </svg>
            </div>

            <div className="t-trained absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-[9px] sm:text-[10px] px-3 py-1 rounded-full uppercase tracking-[0.15em]">
                Trained
            </div>
        </div>
    );
}
