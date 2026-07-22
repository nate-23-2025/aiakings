import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// The legible payoff the dive hands off to: the visitor's scattered software stack
// (QuickBooks, Salesforce, Calendly, Gmail, ...) flowing into one central AI hub that
// produces the unified result. Real, crisp UI on a physical-screen frame, warm-graded.
const TOOLS = [
    { name: 'QuickBooks', color: '#2CA01C' },
    { name: 'Xero', color: '#13B5EA' },
    { name: 'Salesforce', color: '#00A1E0' },
    { name: 'HubSpot', color: '#FF7A59' },
    { name: 'Calendly', color: '#4361FF' },
    { name: 'Gmail', color: '#EA4335' },
    { name: 'Sheets', color: '#0F9D58' },
    { name: 'Slack', color: '#E01E5A' },
];
const RESULTS = ['Meeting booked', 'Documents collected', 'Follow-up sent', 'Records reconciled'];

// Ring positions (percent of container), 8 tools evenly around the hub at 50,50
const RX = 40, RY = 41;
const POS = TOOLS.map((_, i) => {
    const a = (-90 + i * (360 / TOOLS.length)) * (Math.PI / 180);
    return { x: 50 + RX * Math.cos(a), y: 50 + RY * Math.sin(a) };
});

export default function HeroConsolidationDashboard({ className = '' }) {
    const rootRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Faint spokes always breathe
            gsap.to('.cd-spoke', { opacity: 0.5, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.1 });

            const tl = gsap.timeline({ repeat: -1 });
            tl.set('.cd-tile', { opacity: 0.5 });
            tl.set('.cd-hub', { scale: 1, transformOrigin: 'center' });

            // Data packets travel each spoke inward, tiles light as they fire
            POS.forEach((p, i) => {
                const at = i * 0.22;
                tl.to(`#cd-tile-${i}`, { opacity: 1, duration: 0.3, ease: 'power2.out' }, at);
                tl.fromTo(`#cd-packet-${i}`,
                    { attr: { cx: p.x, cy: p.y }, opacity: 0 },
                    { opacity: 1, duration: 0.15 }, at);
                tl.to(`#cd-packet-${i}`, { attr: { cx: 50, cy: 50 }, opacity: 0, duration: 0.6, ease: 'power1.in' }, at + 0.1);
                tl.to('.cd-hub', { scale: 1.06, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' }, at + 0.6);
            });

            // Result ticker cycles
            RESULTS.forEach((_, i) => {
                tl.to('.cd-result-item', { yPercent: -100 * i, duration: 0.4, ease: 'power2.inOut' }, `>-0.1`);
                tl.to({}, { duration: 0.7 });
            });
            tl.to('.cd-result-item', { yPercent: 0, duration: 0.4, ease: 'power2.inOut' });
            tl.to('.cd-tile', { opacity: 0.5, duration: 0.4 });
            tl.to({}, { duration: 0.3 });
        }, rootRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={rootRef} className={`relative overflow-hidden ${className}`}
            style={{ background: 'radial-gradient(120% 90% at 50% 45%, #1a140a 0%, #0b0906 55%, #060504 100%)' }}>
            {/* Physical-screen feel: warm edge glow + faint scanlines + top sheen */}
            <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 120px 20px rgba(201,168,76,0.10), inset 0 0 0 1px rgba(201,168,76,0.06)' }} />
            <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ background: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)' }} />

            {/* Header */}
            <div className="absolute top-5 left-6 right-6 z-20 flex items-center justify-between">
                <span className="text-brand-accent/90 font-mono text-[10px] sm:text-xs tracking-[0.22em] uppercase">Consolidated by AI</span>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400/80 font-mono text-[9px] tracking-[0.15em] uppercase">Live</span>
                </div>
            </div>

            {/* Spokes + packets (SVG, aligned to the same % space as the tiles) */}
            <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                {POS.map((p, i) => (
                    <line key={i} className="cd-spoke" x1={p.x} y1={p.y} x2="50" y2="50"
                        stroke="rgba(201,168,76,0.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.22" />
                ))}
                {POS.map((_, i) => (
                    <circle key={i} id={`cd-packet-${i}`} r="3.2" fill="#F0D080" opacity="0" vectorEffect="non-scaling-stroke" />
                ))}
            </svg>

            {/* Central AI hub */}
            <div className="cd-hub absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative w-[22%] min-w-[86px] aspect-square rounded-2xl flex flex-col items-center justify-center"
                    style={{ background: 'radial-gradient(circle at 50% 40%, rgba(201,168,76,0.35), rgba(201,168,76,0.08) 70%)', border: '1px solid rgba(201,168,76,0.5)', boxShadow: '0 0 40px rgba(201,168,76,0.35)' }}>
                    <span className="text-brand-accent font-semibold text-lg sm:text-2xl leading-none">AI</span>
                    <span className="text-white/60 text-[8px] sm:text-[9px] tracking-[0.12em] uppercase mt-1">Hub</span>
                </div>
            </div>

            {/* Tool tiles around the ring */}
            {TOOLS.map((t, i) => (
                <div key={t.name} id={`cd-tile-${i}`} className="cd-tile absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${POS[i].x}%`, top: `${POS[i].y}%` }}>
                    <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/10 rounded-lg px-2.5 py-1.5 backdrop-blur-sm whitespace-nowrap">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: t.color, boxShadow: `0 0 8px ${t.color}` }} />
                        <span className="text-white/85 text-[10px] sm:text-xs font-medium">{t.name}</span>
                    </div>
                </div>
            ))}

            {/* Unified result ticker */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 h-6 overflow-hidden">
                <div className="flex flex-col items-center">
                    {RESULTS.map((r) => (
                        <div key={r} className="cd-result-item h-6 flex items-center gap-2 whitespace-nowrap">
                            <span className="text-brand-accent">&#10003;</span>
                            <span className="text-white/80 text-xs sm:text-sm">{r}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
