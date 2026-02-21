import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { User, Filter, CalendarCheck, Calendar } from 'lucide-react';

export default function DeploymentAnimation({ className = "w-full h-full" }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            // INITIAL SETUP
            gsap.set('.stage-container', { x: '0%' });

            // Stage 1 initial state (Idle)
            gsap.set('.system-status', { opacity: 0 });
            gsap.set('.pulse-ring', { scale: 0.8, opacity: 0 });

            // Stage 2 initial state (Filter traffic)
            gsap.set('.lead-icon', { x: -80, opacity: 0 });
            gsap.set('.filter-node', { backgroundColor: '#1A1A22', borderColor: 'rgba(255,255,255,0.1)' });
            gsap.set('.rejected-lead', { y: 0, opacity: 1, display: 'block' });
            gsap.set('.accepted-lead', { x: 0, opacity: 1, display: 'block' });

            // Stage 3 initial state (Calendar sync)
            gsap.set('.sync-beam', { scaleX: 0 });
            gsap.set('.calendar-icon', { scale: 0.8, opacity: 0.5 });
            gsap.set('.booked-badge', { scale: 0, opacity: 0 });


            // ==========================================
            // STAGE 1: System Live (0s - 2s)
            // ==========================================
            tl.to('.system-status', { opacity: 1, duration: 0.4 })
                .to('.pulse-ring', { scale: 1.5, opacity: 0, duration: 1.5, repeat: 1, ease: 'sine.out' })
                .to({}, { duration: 0.5 }); // Hold

            // Transition to Stage 2
            tl.to('.stage-container', { x: '-33.333%', duration: 0.8, ease: 'power3.inOut' });

            // ==========================================
            // STAGE 2: Filtering Leads (2.5s - 4.5s)
            // ==========================================
            tl.to('.lead-icon', { x: -20, opacity: 1, duration: 0.6, stagger: 0.2, ease: 'power2.out' })
                .to('.filter-node', { borderColor: 'rgba(201,168,76,0.6)', duration: 0.2, yoyo: true, repeat: 3 }, "-=0.2")
                // One gets rejected (falls down)
                .to('.rejected-lead', { y: 40, opacity: 0, duration: 0.4, ease: 'power2.in' })
                // One gets accepted (moves past filter)
                .to('.accepted-lead', { x: 30, scale: 1.2, duration: 0.5, ease: 'back.out(1.5)' }, "-=0.2")
                .to({}, { duration: 1 }); // Hold

            // Transition to Stage 3
            tl.to('.stage-container', { x: '-66.666%', duration: 0.8, ease: 'power3.inOut' });

            // ==========================================
            // STAGE 3: Calendar Booked (5s - 7s)
            // ==========================================
            tl.to('.accepted-lead', { x: 100, opacity: 0, duration: 0.5 }) // Moves offscreen/into calendar
                .to('.sync-beam', { scaleX: 1, duration: 0.4, transformOrigin: 'left' }, "-=0.3")
                .to('.calendar-icon', { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' })
                .to('.booked-badge', { scale: 1, opacity: 1, duration: 0.4, ease: 'bounce.out' })
                .to('.calendar-ring', { scale: 1.3, opacity: 0, duration: 0.8, ease: 'power2.out' })
                .to({}, { duration: 1.5 }); // Hold

            // Reset transition
            tl.to('.stage-container', { opacity: 0, duration: 0.4 })
                .set('.stage-container', { x: '0%' })
                .to('.stage-container', { opacity: 1, duration: 0.4 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={`relative overflow-hidden rounded-2xl bg-[#0D0D12]/50 border border-white/5 ${className}`}>
            {/* 300% wide container for horizontal sliding */}
            <div className="stage-container flex w-[300%] h-full">

                {/* STAGE 1: Live */}
                <div className="w-1/3 h-full relative flex flex-col items-center justify-center p-8">
                    <div className="absolute top-6 left-6 text-brand-accent font-mono text-xs tracking-widest uppercase">System Online</div>

                    <div className="relative flex items-center justify-center w-32 h-32 mt-8">
                        <div className="pulse-ring absolute inset-0 border-2 border-brand-accent/50 rounded-full" />
                        <div className="bg-[#1A1A22] border border-brand-accent/40 p-4 rounded-full shadow-[0_0_20px_rgba(201,168,76,0.3)] z-10">
                            <User className="text-brand-accent" size={32} />
                        </div>
                        <div className="system-status absolute -bottom-8 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-[10px] px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                            Awaiting Traffic
                        </div>
                    </div>
                </div>

                {/* STAGE 2: Filtering */}
                <div className="w-1/3 h-full relative flex flex-col items-center justify-center p-8">
                    <div className="absolute top-6 left-6 text-brand-accent font-mono text-xs tracking-widest uppercase">Lead Qualification</div>

                    <div className="relative w-72 h-48 flex items-center justify-center overflow-hidden">

                        {/* Incoming traffic */}
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
                            <div className="lead-icon accepted-lead bg-white/10 p-2 rounded-full border border-white/20">
                                <User size={16} className="text-white/60" />
                            </div>
                            <div className="lead-icon rejected-lead bg-white/10 p-2 rounded-full border border-white/20">
                                <User size={16} className="text-white/60" />
                            </div>
                        </div>

                        {/* Filter Node */}
                        <div className="filter-node absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#1A1A22] border-2 border-white/10 p-3 rounded-xl z-20 transition-colors">
                            <Filter size={24} className="text-brand-accent" />
                        </div>

                    </div>
                </div>

                {/* STAGE 3: Booked */}
                <div className="w-1/3 h-full relative flex flex-col items-center justify-center p-8">
                    <div className="absolute top-6 left-6 text-brand-accent font-mono text-xs tracking-widest uppercase">Pipeline Sync</div>

                    <div className="relative w-64 h-32 flex items-center justify-end mt-4">
                        {/* Fake lead sliding in from left (simulated by syncing beam) */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent to-brand-accent/80 sync-beam origin-left z-0" />

                        {/* Calendar Node */}
                        <div className="relative z-10 w-20 h-20">
                            <div className="calendar-ring absolute inset-0 border border-emerald-400/50 rounded-2xl" />
                            <div className="calendar-icon w-full h-full bg-[#1A1A22] border border-white/10 rounded-2xl flex items-center justify-center shadow-xl">
                                <Calendar size={32} className="text-white" />
                            </div>

                            <div className="booked-badge absolute -bottom-3 -right-3 bg-emerald-500 border border-emerald-400 p-1.5 rounded-full shadow-lg">
                                <CalendarCheck size={16} className="text-[#0D0D12]" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
