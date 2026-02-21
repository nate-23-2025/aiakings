import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Network, Search, Lock, Unlock, Shield, Database, CheckCircle2 } from 'lucide-react';

export default function AuditAnimation({ className = "w-full h-full" }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            // INITIAL SETUP
            gsap.set('.stage-container', { x: '0%' });

            // Stage 1 initial state
            gsap.set(['.node-dot', '.node-line'], { opacity: 0, scale: 0 });
            gsap.set('.stage-1-label', { opacity: 0, y: 10 });

            // Stage 2 initial state
            gsap.set('.magnifying-glass', { x: -50, y: -50, opacity: 0 });
            gsap.set('.friction-label', { opacity: 0, scale: 0.8 });
            gsap.set('.amber-node', { backgroundColor: '#3f3f46' }); // Default color before flashing

            // Stage 3 initial state
            gsap.set('.padlock', { opacity: 0 });
            gsap.set('.bridge-line', { width: 0 });
            gsap.set('.crm-logo', { x: 50, opacity: 0 });
            gsap.set('.shield-icon', { opacity: 0, scale: 0 });
            gsap.set('.check-icon', { opacity: 0, scale: 0, y: -20 });


            // ==========================================
            // STAGE 1: Data Flow Mapping (0s - 2s)
            // ==========================================
            tl.to('.stage-1-label', { opacity: 1, y: 0, duration: 0.4 })
                .to('.node-dot', { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' })
                .to('.node-line', { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1 }, "-=0.2")
                .to({}, { duration: 1.5 }); // Hold

            // Transition to Stage 2
            tl.to('.stage-container', { x: '-33.333%', duration: 0.8, ease: 'power3.inOut' });

            // ==========================================
            // STAGE 2: Friction Identified (2.5s - 4.5s)
            // ==========================================
            tl.to('.amber-node', { backgroundColor: '#f59e0b', duration: 0.3, yoyo: true, repeat: 3 })
                .to('.magnifying-glass', { opacity: 1, x: 0, y: 0, duration: 0.6, ease: 'power2.out' }, "-=0.6")
                .to('.friction-label', { opacity: 1, scale: 1, duration: 0.4, stagger: 0.2, ease: 'back.out(1.5)' })
                .to({}, { duration: 1.5 }); // Hold

            // Transition to Stage 3
            tl.to('.stage-container', { x: '-66.666%', duration: 0.8, ease: 'power3.inOut' });

            // ==========================================
            // STAGE 3: Securely Integrated (5s - 7s)
            // ==========================================
            tl.to('.padlock', { opacity: 1, duration: 0.4 })
                // Simulate unlock by changing the icon slightly (using css classes or just a rotation/bounce)
                .to('.padlock-body', { y: 2, duration: 0.2, yoyo: true, repeat: 1 })
                .to('.crm-logo', { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' })
                .to('.bridge-line', { width: '100%', duration: 0.6, ease: 'power2.inOut' }, "-=0.4")
                .to('.shield-icon', { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' })
                .to('.check-icon', { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'bounce.out' })
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

                {/* STAGE 1 */}
                <div className="w-1/3 h-full relative flex flex-col items-center justify-center p-8">
                    <div className="stage-1-label absolute top-6 left-6 text-brand-accent font-mono text-xs tracking-widest uppercase">Data Flow Mapping</div>

                    {/* Abstract Network Graph */}
                    <div className="relative w-48 h-48">
                        <div className="node-dot absolute top-[10%] left-[50%] -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_white]" />
                        <div className="node-dot absolute top-[50%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/60 rounded-full" />
                        <div className="node-dot absolute top-[50%] right-[20%] translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/60 rounded-full" />
                        <div className="node-dot absolute bottom-[10%] left-[35%] -translate-x-1/2 w-4 h-4 bg-white/40 rounded-full" />
                        <div className="node-dot absolute bottom-[10%] right-[35%] translate-x-1/2 w-4 h-4 bg-white/40 rounded-full" />

                        {/* Connecting Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                            <line className="node-line origin-top" x1="50%" y1="10%" x2="20%" y2="50%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" style={{ transformOrigin: '50% 10%' }} />
                            <line className="node-line origin-top" x1="50%" y1="10%" x2="80%" y2="50%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" style={{ transformOrigin: '50% 10%' }} />
                            <line className="node-line origin-center" x1="20%" y1="50%" x2="35%" y2="90%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" style={{ transformOrigin: '20% 50%' }} />
                            <line className="node-line origin-center" x1="80%" y1="50%" x2="65%" y2="90%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" style={{ transformOrigin: '80% 50%' }} />
                            <line className="node-line origin-left" x1="20%" y1="50%" x2="80%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4" style={{ transformOrigin: '20% 50%' }} />
                        </svg>
                    </div>
                </div>

                {/* STAGE 2 */}
                <div className="w-1/3 h-full relative flex flex-col items-center justify-center p-8">
                    <div className="absolute top-6 left-6 text-brand-accent font-mono text-xs tracking-widest uppercase">Friction Identified</div>

                    <div className="relative w-64 h-48 flex items-center justify-center">
                        {/* Amber nodes */}
                        <div className="amber-node absolute left-12 top-16 w-6 h-6 rounded-full shadow-lg" />
                        <div className="amber-node absolute right-16 bottom-16 w-6 h-6 rounded-full shadow-lg" />

                        {/* Callouts */}
                        <div className="friction-label absolute left-0 top-6 bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] uppercase tracking-wider px-2 py-1 rounded">Drop-off</div>
                        <div className="friction-label absolute right-4 bottom-6 bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] uppercase tracking-wider px-2 py-1 rounded">Manual Entry</div>

                        {/* Magnifying Glass */}
                        <div className="magnifying-glass absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1A1A22] p-4 rounded-full border border-white/10 shadow-2xl z-10">
                            <Search size={32} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* STAGE 3 */}
                <div className="w-1/3 h-full relative flex flex-col items-center justify-center p-8">
                    <div className="absolute top-6 left-6 text-brand-accent font-mono text-xs tracking-widest uppercase">Securely Integrated</div>

                    <div className="relative w-full max-w-sm h-32 flex items-center justify-between">
                        {/* Extraction Side */}
                        <div className="padlock flex flex-col items-center gap-2 z-10 w-16">
                            <div className="bg-[#1A1A22] p-4 rounded-2xl border border-white/10 shadow-xl">
                                <Unlock size={24} className="text-white padlock-body" />
                            </div>
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">AIA Engine</span>
                        </div>

                        {/* Bridge */}
                        <div className="flex-grow flex items-center justify-center relative px-2">
                            <div className="h-1 bg-white/10 w-full rounded-full overflow-hidden">
                                <div className="bridge-line h-full bg-brand-accent w-0" />
                            </div>
                            <div className="shield-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0D0D12] rounded-full p-1 border border-brand-accent/30 z-20">
                                <Shield size={16} className="text-brand-accent fill-brand-accent/20" />
                            </div>
                            <div className="check-icon absolute -top-6 left-1/2 -translate-x-1/2 z-30">
                                <CheckCircle2 size={24} className="text-emerald-400 bg-[#0D0D12] rounded-full" />
                            </div>
                        </div>

                        {/* CRM Side */}
                        <div className="crm-logo flex flex-col items-center gap-2 z-10 w-16">
                            <div className="bg-brand-accent p-4 rounded-2xl shadow-[0_0_20px_rgba(201,168,76,0.2)]">
                                <Database size={24} className="text-[#0D0D12]" />
                            </div>
                            <span className="text-[10px] text-brand-accent uppercase tracking-widest">Client CRM</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
