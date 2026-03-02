import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TrendingUp } from 'lucide-react';

export default function DashboardMockupAnimation({ className = "w-full h-full" }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            // INITIAL SETUP
            gsap.set('.dm-dashboard', { opacity: 0 });
            gsap.set('.dm-card', { opacity: 0, y: 10 });
            gsap.set('.dm-number', { textContent: '0' });
            gsap.set('.dm-arrow', { opacity: 0, x: -10 });
            gsap.set('.dm-card-1', { boxShadow: '0 0 0px rgba(201,168,76,0)' });

            // STAGE 1 — Dashboard container fades in (0s - 0.5s)
            tl.to('.dm-dashboard', { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0);

            // STAGE 2 — 3 KPI cards appear (0.5s - 1.2s)
            tl.to('.dm-card', {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.2,
                ease: 'back.out(1.5)'
            }, 0.5);

            // STAGE 3 — Numbers count from 0 → target (1.2s - 2.5s)
            // Client count: 0 → 15
            tl.to('.dm-number-1', {
                textContent: '15',
                duration: 0.8,
                snap: { textContent: 1 },
                ease: 'power2.out'
            }, 1.2);

            // Hours saved: 0 → 40
            tl.to('.dm-number-2', {
                textContent: '40',
                duration: 0.8,
                snap: { textContent: 1 },
                ease: 'power2.out'
            }, 1.35);

            // Revenue: 0 → 85 (K added via suffix in JSX)
            tl.to('.dm-number-3', {
                textContent: '85',
                duration: 0.8,
                snap: { textContent: 1 },
                ease: 'power2.out'
            }, 1.5);

            // STAGE 4 — Trend arrows slide in from left (2.5s - 3.0s)
            tl.to('.dm-arrow', {
                opacity: 1,
                x: 0,
                duration: 0.3,
                stagger: 0.1,
                ease: 'power2.out'
            }, 2.5);

            // STAGE 5 — Top card glows gold (3.0s - 3.5s)
            tl.to('.dm-card-1', {
                boxShadow: '0 0 20px rgba(201,168,76,0.4)',
                duration: 0.3,
                ease: 'power2.out'
            }, 3.0)
            .to('.dm-card-1', {
                boxShadow: '0 0 20px rgba(201,168,76,0.4)',
                duration: 0.2
            }, 3.3);

            // STAGE 6 — Hold (3.5s - 5.5s)
            tl.to({}, { duration: 2.0 });

            // RESET (5.5s - 6.0s)
            tl.to('.dm-dashboard', { opacity: 0, duration: 0.4 })
                .set('.dm-card', { opacity: 0, y: 10 })
                .set('.dm-number', { textContent: '0' })
                .set('.dm-arrow', { opacity: 0, x: -10 })
                .set('.dm-card-1', { boxShadow: '0 0 0px rgba(201,168,76,0)' })
                .to('.dm-dashboard', { opacity: 1, duration: 0.1 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const kpis = [
        { id: 1, label: 'New Clients', value: '0', suffix: '' },
        { id: 2, label: 'Hours Saved', value: '0', suffix: '/mo' },
        { id: 3, label: 'Revenue', value: '0', suffix: 'K' }
    ];

    return (
        <div ref={containerRef} className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#0D0D12]/50 border border-white/5 flex items-center justify-center ${className}`}>
            <div className="dm-dashboard w-full h-full p-3 sm:p-4 md:p-6 flex flex-col gap-2 sm:gap-3 md:gap-4 justify-center opacity-0">

                {kpis.map((kpi) => (
                    <div
                        key={kpi.id}
                        className={`dm-card dm-card-${kpi.id} bg-[#1A1A22] border border-white/10 rounded-lg p-3 sm:p-4 flex items-center justify-between opacity-0`}
                    >
                        <div className="flex flex-col gap-1 sm:gap-1.5">
                            <span className="font-mono text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest">
                                {kpi.label}
                            </span>
                            <div className="flex items-baseline gap-1 sm:gap-1.5">
                                <span className={`dm-number dm-number-${kpi.id} font-mono text-lg sm:text-xl md:text-2xl text-white font-bold`}>
                                    {kpi.value}
                                </span>
                                {kpi.suffix && (
                                    <span className="font-mono text-[10px] sm:text-xs text-white/50">{kpi.suffix}</span>
                                )}
                            </div>
                        </div>
                        <div className="dm-arrow opacity-0">
                            <TrendingUp className="text-green-400 w-5 h-5 sm:w-5 sm:h-5" strokeWidth={2.5} />
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}
