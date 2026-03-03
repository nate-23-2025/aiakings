import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TrendingUp, Users, Clock } from 'lucide-react';

export default function DashboardMockupAnimation({ className = "w-full h-full" }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            // INITIAL SETUP
            gsap.set('.dm-dashboard', { opacity: 0 });
            gsap.set('.dm-hero-card', { opacity: 0, y: 20 });
            gsap.set('.dm-secondary-card', { opacity: 0, y: 10 });
            gsap.set('.dm-revenue-number', { textContent: '0' });
            gsap.set('.dm-clients-number', { textContent: '0' });
            gsap.set('.dm-hours-number', { textContent: '0' });
            gsap.set('.dm-percentage', { opacity: 0, scale: 0.8 });
            gsap.set('.dm-sparkline', { strokeDashoffset: 200, strokeDasharray: 200 });
            gsap.set('.dm-growth-badge', { opacity: 0, x: -5 });

            // STAGE 1 — Dashboard container fades in (0s - 0.5s)
            tl.to('.dm-dashboard', { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0);

            // STAGE 2 — Hero card appears (0.5s - 1.0s)
            tl.to('.dm-hero-card', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'back.out(1.3)'
            }, 0.5);

            // STAGE 3 — Revenue number counts up (1.0s - 2.0s)
            tl.to('.dm-revenue-number', {
                textContent: '85',
                duration: 1.0,
                snap: { textContent: 1 },
                ease: 'power2.out'
            }, 1.0);

            // STAGE 4 — Sparkline draws in (1.5s - 2.5s)
            tl.to('.dm-sparkline', {
                strokeDashoffset: 0,
                duration: 1.0,
                ease: 'power1.inOut'
            }, 1.5);

            // STAGE 5 — Percentage badge pops in (2.0s - 2.4s)
            tl.to('.dm-percentage', {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: 'back.out(2)'
            }, 2.0);

            // STAGE 6 — Secondary cards appear (2.5s - 3.2s)
            tl.to('.dm-secondary-card', {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.15,
                ease: 'back.out(1.3)'
            }, 2.5);

            // STAGE 7 — Secondary numbers count up (3.0s - 3.8s)
            tl.to('.dm-clients-number', {
                textContent: '15',
                duration: 0.6,
                snap: { textContent: 1 },
                ease: 'power2.out'
            }, 3.0);

            tl.to('.dm-hours-number', {
                textContent: '40',
                duration: 0.6,
                snap: { textContent: 1 },
                ease: 'power2.out'
            }, 3.15);

            // STAGE 8 — Growth badges slide in (3.5s - 3.9s)
            tl.to('.dm-growth-badge', {
                opacity: 1,
                x: 0,
                duration: 0.3,
                stagger: 0.1,
                ease: 'power2.out'
            }, 3.5);

            // STAGE 9 — Hold (3.9s - 5.5s)
            tl.to({}, { duration: 1.6 });

            // RESET (5.5s - 6.0s)
            tl.to('.dm-dashboard', { opacity: 0, duration: 0.4 })
                .set('.dm-hero-card', { opacity: 0, y: 20 })
                .set('.dm-secondary-card', { opacity: 0, y: 10 })
                .set('.dm-revenue-number', { textContent: '0' })
                .set('.dm-clients-number', { textContent: '0' })
                .set('.dm-hours-number', { textContent: '0' })
                .set('.dm-percentage', { opacity: 0, scale: 0.8 })
                .set('.dm-sparkline', { strokeDashoffset: 200 })
                .set('.dm-growth-badge', { opacity: 0, x: -5 })
                .to('.dm-dashboard', { opacity: 1, duration: 0.1 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Sparkline path data (upward trending curve)
    const sparklinePath = "M 0 45 Q 15 40, 30 42 T 60 35 T 90 30 T 120 22 T 150 18";

    return (
        <div ref={containerRef} className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#0D0D12]/50 border border-white/5 flex items-center justify-center ${className}`}>
            <div className="dm-dashboard w-full h-full p-4 sm:p-5 md:p-6 flex flex-col gap-3 justify-center opacity-0">

                {/* HERO CARD - Revenue */}
                <div
                    className="dm-hero-card relative overflow-hidden rounded-2xl p-5 opacity-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(16,185,129,0.2) 100%)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)'
                    }}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <div className="text-[10px] uppercase tracking-widest text-white/40 font-medium mb-1">
                                Total Revenue
                            </div>
                            <div className="text-[9px] text-white/25">
                                This Month
                            </div>
                        </div>
                        <div className="dm-percentage opacity-0">
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                                <TrendingUp className="w-3 h-3 text-green-400" strokeWidth={2.5} />
                                <span className="text-[11px] font-semibold text-green-400">+24%</span>
                            </div>
                        </div>
                    </div>

                    {/* Large Number */}
                    <div className="mb-4">
                        <div className="flex items-baseline gap-1">
                            <span className="text-white/60 text-xl font-medium">$</span>
                            <span className="dm-revenue-number text-4xl font-bold text-white">0</span>
                            <span className="text-white/60 text-xl font-medium">K</span>
                        </div>
                    </div>

                    {/* Sparkline Chart */}
                    <svg
                        viewBox="0 0 150 50"
                        className="w-full h-14"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(201,168,76,0.6)" />
                                <stop offset="100%" stopColor="rgba(16,185,129,0.6)" />
                            </linearGradient>
                        </defs>
                        <path
                            className="dm-sparkline"
                            d={sparklinePath}
                            fill="none"
                            stroke="url(#sparklineGradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* SECONDARY CARDS - Grid */}
                <div className="grid grid-cols-2 gap-3">

                    {/* New Clients Card */}
                    <div
                        className="dm-secondary-card rounded-xl p-4 opacity-0"
                        style={{
                            background: 'rgba(26,26,34,0.6)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div className="flex items-center gap-1.5 mb-2">
                            <Users className="w-3 h-3 text-white/30" strokeWidth={2} />
                            <span className="text-[9px] uppercase tracking-widest text-white/40 font-medium">
                                New Clients
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="dm-clients-number text-2xl font-bold text-white">0</span>
                            <div className="dm-growth-badge opacity-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-green-500/15">
                                <TrendingUp className="w-2.5 h-2.5 text-green-400" strokeWidth={2.5} />
                                <span className="text-[10px] font-semibold text-green-400">+8%</span>
                            </div>
                        </div>
                    </div>

                    {/* Hours Saved Card */}
                    <div
                        className="dm-secondary-card rounded-xl p-4 opacity-0"
                        style={{
                            background: 'rgba(26,26,34,0.6)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div className="flex items-center gap-1.5 mb-2">
                            <Clock className="w-3 h-3 text-white/30" strokeWidth={2} />
                            <span className="text-[9px] uppercase tracking-widest text-white/40 font-medium">
                                Hours Saved
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="dm-hours-number text-2xl font-bold text-white">0</span>
                            <div className="dm-growth-badge opacity-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-green-500/15">
                                <TrendingUp className="w-2.5 h-2.5 text-green-400" strokeWidth={2.5} />
                                <span className="text-[10px] font-semibold text-green-400">+12%</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
