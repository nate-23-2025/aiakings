import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FileText, Cpu, UserCheck, MessageSquare } from 'lucide-react';

export default function TrainingAnimation({ className = "w-full h-full" }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            // INITIAL SETUP
            gsap.set('.stage-container', { x: '0%' });

            // Stage 1 initial state (Ingestion)
            gsap.set('.doc-icon', { y: 20, opacity: 0 });
            gsap.set('.data-stream', { scaleY: 0, opacity: 0 });
            gsap.set('.brain-node', { scale: 0.8, opacity: 0.5 });

            // Stage 2 initial state (Processing)
            gsap.set('.gear-icon', { rotation: 0, opacity: 0 });
            gsap.set('.compliance-check', { scale: 0, opacity: 0 });

            // Stage 3 initial state (Output)
            gsap.set('.agent-avatar', { scale: 0, opacity: 0 });
            gsap.set('.speech-bubble', { opacity: 0, x: -10, y: 10 });


            // ==========================================
            // STAGE 1: Data Ingestion (0s - 2s)
            // ==========================================
            tl.to('.doc-icon', { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' })
                .to('.data-stream', { scaleY: 1, opacity: 1, duration: 0.5, stagger: 0.1, transformOrigin: 'bottom' }, "-=0.2")
                .to('.brain-node', { scale: 1, opacity: 1, duration: 0.5, boxShadow: '0 0 20px rgba(201,168,76,0.4)', ease: 'power2.out' }, "-=0.3")
                .to({}, { duration: 1.5 }); // Hold

            // Transition to Stage 2
            tl.to('.stage-container', { x: '-33.333%', duration: 0.8, ease: 'power3.inOut' });

            // ==========================================
            // STAGE 2: Model Fine-Tuning (2.5s - 4.5s)
            // ==========================================
            tl.to('.brain-node-2', { scale: 1.2, duration: 0.5, ease: 'power2.inOut', yoyo: true, repeat: 3 })
                .to('.gear-icon', { opacity: 1, rotation: 180, duration: 1.5, ease: 'linear' }, "<")
                .to('.compliance-check', { scale: 1, opacity: 1, duration: 0.3, stagger: 0.2, ease: 'back.out(2)' }, "-=1")
                .to({}, { duration: 1.5 }); // Hold

            // Transition to Stage 3
            tl.to('.stage-container', { x: '-66.666%', duration: 0.8, ease: 'power3.inOut' });

            // ==========================================
            // STAGE 3: Autonomous Agent Ready (5s - 7s)
            // ==========================================
            tl.to('.brain-node-3', { scale: 0.8, x: -40, opacity: 0.5, duration: 0.6, ease: 'power3.inOut' })
                .to('.agent-avatar', { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }, "-=0.4")
                .to('.arc-line', { strokeDashoffset: 0, duration: 0.5 }, "-=0.4")
                .to('.speech-bubble', { opacity: 1, x: 0, y: 0, duration: 0.4, stagger: 0.2, ease: 'power2.out' })
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

                {/* STAGE 1: Ingestion */}
                <div className="w-1/3 h-full relative flex flex-col items-center justify-center p-8">
                    <div className="absolute top-6 left-6 text-brand-accent font-mono text-xs tracking-widest uppercase">Knowledge Base Ingestion</div>

                    <div className="relative w-64 h-48 flex flex-col items-center justify-between mt-8">
                        <div className="flex gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="doc-icon relative bg-[#1A1A22] border border-white/10 p-3 rounded-xl">
                                    <FileText size={20} className="text-white/60" />
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[2px] h-6 bg-brand-accent/50 data-stream" />
                                </div>
                            ))}
                        </div>

                        <div className="brain-node bg-[#1A1A22] border border-brand-accent/30 p-4 rounded-2xl mt-8 shadow-xl">
                            <Cpu size={32} className="text-brand-accent" />
                        </div>
                    </div>
                </div>

                {/* STAGE 2: Processing */}
                <div className="w-1/3 h-full relative flex flex-col items-center justify-center p-8">
                    <div className="absolute top-6 left-6 text-brand-accent font-mono text-xs tracking-widest uppercase">Guardrail Tuning</div>

                    <div className="relative w-64 h-48 flex items-center justify-center">
                        <div className="brain-node-2 relative z-10 bg-[#1A1A22] border border-brand-accent/50 p-6 rounded-3xl shadow-[0_0_30px_rgba(201,168,76,0.2)]">
                            <Cpu size={40} className="text-brand-accent" />
                            <div className="gear-icon absolute -right-3 -top-3 bg-[#0D0D12] rounded-full p-1 border border-white/10">
                                {/* Simplified gear using lucide or css */}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            </div>
                        </div>

                        {/* Compliance badges popping out */}
                        <div className="compliance-check absolute top-4 left-6 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9px] px-2 py-1 rounded-full uppercase tracking-wider">Tone Matched</div>
                        <div className="compliance-check absolute bottom-4 right-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9px] px-2 py-1 rounded-full uppercase tracking-wider">SEC Compliant</div>
                    </div>
                </div>

                {/* STAGE 3: Output */}
                <div className="w-1/3 h-full relative flex flex-col items-center justify-center p-8">
                    <div className="absolute top-6 left-6 text-brand-accent font-mono text-xs tracking-widest uppercase">Agent Ready</div>

                    <div className="relative w-72 h-48 flex items-center justify-center">
                        <div className="brain-node-3 absolute bg-[#1A1A22] border border-brand-accent/30 p-3 rounded-xl z-10 block">
                            <Cpu size={24} className="text-brand-accent" />
                        </div>

                        {/* Arc connecting LLM to Agent */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                            <path className="arc-line" d="M 100 96 Q 144 40 188 96" fill="transparent" stroke="rgba(201,168,76,0.3)" strokeWidth="2" strokeDasharray="100" strokeDashoffset="100" strokeLinecap="round" />
                        </svg>

                        <div className="agent-avatar absolute right-16 top-1/2 -translate-y-1/2 bg-brand-accent p-4 rounded-full shadow-[0_0_20px_rgba(201,168,76,0.3)] z-20 block">
                            <UserCheck size={32} className="text-[#0D0D12]" />
                        </div>

                        <div className="speech-bubble absolute right-2 top-8 bg-white/10 backdrop-blur-sm border border-white/20 p-2 rounded-lg text-xs text-white max-w-[100px]">
                            "Hello, I've analyzed your portfolio..."
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
