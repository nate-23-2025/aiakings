import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Mail } from 'lucide-react';

export default function LeadGenAnimation({ className = "w-full h-full" }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            // INITIAL SETUP
            gsap.set('.lg-radar-dot', { scale: 0, opacity: 0 });
            gsap.set('.lg-mail', { scale: 0, opacity: 0, x: 0, y: 0 });
            gsap.set('.lg-counter', { textContent: "0" });
            gsap.set('.lg-label', { opacity: 0 });

            // Continuous sweep (outside timeline)
            gsap.to('.lg-sweep', {
                rotation: 360,
                duration: 3,
                repeat: -1,
                ease: 'none',
                transformOrigin: 'bottom center'
            });

            // Target Definitions (x, y offsets from center)
            const targets = [
                { id: 1, x: -40, y: -30, label: "B2B" },
                { id: 2, x: 50, y: -10, label: "LOCAL" },
                { id: 3, x: -20, y: 40, label: "OWNER" },
                { id: 4, x: 30, y: 30, label: "SEARCH" }
            ];

            // STAGE 1 - Scan (0s - 2s)
            tl.to('.lg-radar-dot', {
                scale: 1,
                opacity: 0.6,
                duration: 0.4,
                stagger: 0.2,
                ease: 'back.out(2)'
            }, 0.5)
                .to('.lg-label', {
                    opacity: 1,
                    duration: 0.3,
                    stagger: 0.2
                }, 0.6)
                .to({}, { duration: 0.5 }); // Hold

            // STAGE 2 - Deploy (2s - 3.5s)
            targets.forEach((target, i) => {
                const startTime = 2 + (i * 0.15);

                // Fly mail out
                tl.fromTo(`.lg-mail-${target.id}`,
                    { scale: 0, opacity: 0, x: 0, y: 0 },
                    { scale: 1, opacity: 1, x: target.x, y: target.y, duration: 0.4, ease: 'power2.out' },
                    startTime
                );

                // Capture hit
                tl.to(`.lg-mail-${target.id}`, { opacity: 0, scale: 0.5, duration: 0.2 }, startTime + 0.3)
                    .to(`.lg-dot-${target.id}`, {
                        backgroundColor: '#C9A84C',
                        boxShadow: '0 0 10px rgba(201,168,76,0.6)',
                        opacity: 1,
                        scale: 1.3,
                        duration: 0.2,
                        yoyo: true,
                        repeat: 1
                    }, startTime + 0.3);

                // Increment Counter (using SnapPlugin logic via onStart/onUpdate or simpler approach)
                tl.to('.lg-counter', {
                    innerHTML: `+${i + 1}`,
                    duration: 0.1,
                    snap: { innerHTML: 1 }
                }, startTime + 0.3);
            });

            // STAGE 3 - Hold
            tl.to({}, { duration: 1.5 });

            // RESET
            tl.to('.lg-container', { opacity: 0, duration: 0.4 })
                .set('.lg-radar-dot', { scale: 0, opacity: 0, backgroundColor: 'rgba(255,255,255,0.4)', boxShadow: 'none' })
                .set('.lg-mail', { scale: 0, opacity: 0, x: 0, y: 0 })
                .set('.lg-counter', { innerHTML: "0" })
                .set('.lg-label', { opacity: 0 })
                .to('.lg-container', { opacity: 1, duration: 0.4 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Helper data for rendering
    const targets = [
        { id: 1, top: '25%', left: '20%', label: "B2B" },
        { id: 2, top: '35%', left: '80%', label: "LOCAL" },
        { id: 3, top: '80%', left: '35%', label: "OWNER" },
        { id: 4, top: '70%', left: '70%', label: "SEARCH" }
    ];

    return (
        <div ref={containerRef} className={`relative overflow-hidden rounded-2xl bg-[#0D0D12]/50 border border-white/5 flex items-center justify-center ${className}`}>
            <div className="lg-container relative w-full h-full flex items-center justify-center">

                {/* Radar Circle */}
                <div className="absolute w-[160px] h-[160px] rounded-full border border-white/10 flex items-center justify-center">
                    {/* Inner rings for detail */}
                    <div className="absolute w-[100px] h-[100px] rounded-full border border-white/5"></div>
                    <div className="absolute w-[40px] h-[40px] rounded-full border border-white/5"></div>

                    {/* Sweep Arm Container (centered) */}
                    <div className="absolute w-[160px] h-[160px]">
                        <div className="lg-sweep absolute left-1/2 bottom-1/2 w-[2px] h-[80px] bg-brand-accent/60 origin-bottom flex items-end justify-center">
                            {/* Gradient Cone */}
                            <div className="absolute top-0 right-0 w-[40px] h-full bg-gradient-to-r from-brand-accent/10 to-transparent origin-bottom-left -rotate-12 transform -translate-x-full rounded-tl-full blur-sm"></div>
                        </div>
                    </div>
                </div>

                {/* Target Dots & Labels */}
                <div className="absolute w-[160px] h-[160px]">
                    {targets.map(t => (
                        <div key={t.id} className="absolute flex items-center gap-1" style={{ top: t.top, left: t.left, transform: 'translate(-50%, -50%)' }}>
                            <div className={`lg-radar-dot lg-dot-${t.id} w-2 h-2 rounded-full bg-white/40 shrink-0 relative z-10`}></div>
                            <span className="lg-label font-mono text-[8px] text-white/40">{t.label}</span>
                        </div>
                    ))}
                </div>

                {/* Flying Envelopes */}
                <div className="absolute flex items-center justify-center w-[160px] h-[160px]">
                    {targets.map(t => (
                        <div key={`mail-${t.id}`} className={`lg-mail lg-mail-${t.id} absolute text-brand-accent`}>
                            <Mail size={12} strokeWidth={2.5} />
                        </div>
                    ))}
                </div>

                {/* Center Transmitter */}
                <div className="absolute w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(201,168,76,0.5)] z-20 pulse-ring"></div>

                {/* Lead Counter Badge */}
                <div className="absolute bottom-4 right-4 bg-brand-accent/10 border border-brand-accent/30 rounded px-2 py-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span>
                    <span className="lg-counter font-mono text-xs text-brand-accent tracking-widest font-bold">0</span>
                </div>
            </div>
        </div>
    );
}
