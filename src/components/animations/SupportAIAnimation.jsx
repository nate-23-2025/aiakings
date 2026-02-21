import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MessageSquare, Phone, Mail, Cpu, Check, Moon } from 'lucide-react';

export default function SupportAIAnimation({ className = "w-full h-full" }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            // INITIAL SETUP
            gsap.set('.sa-notification', { x: -40, opacity: 0, scale: 0.8 });
            gsap.set('.sa-line-path', { strokeDasharray: 100, strokeDashoffset: 100 });
            gsap.set('.sa-check', { scale: 0, opacity: 0 });
            gsap.set('.sa-pulse', { scale: 0.8, opacity: 0 });

            // STAGE 1 - Inbound flood (0s - 1.5s)
            tl.to('.sa-notif-1', { x: 0, opacity: 1, scale: 1, rotation: -2, duration: 0.5, ease: 'back.out(1.5)' }, 0)
                .to('.sa-notif-2', { x: 0, opacity: 1, scale: 1, rotation: 3, duration: 0.5, ease: 'back.out(1.5)' }, 0.3)
                .to('.sa-notif-3', { x: 0, opacity: 1, scale: 1, rotation: -1, duration: 0.5, ease: 'back.out(1.5)' }, 0.6)
                .to({}, { duration: 0.4 }); // Hold

            // STAGE 2 - AI processing (1.5s - 3.5s)
            [1, 2, 3].forEach((id, i) => {
                const startTime = 1.5 + (i * 0.4);

                // Dim notification and draw line
                tl.to(`.sa-notif-${id}`, { opacity: 0.3, duration: 0.3 }, startTime)
                    .to(`.sa-line-${id}`, { strokeDashoffset: 0, duration: 0.3, ease: 'power1.inOut' }, startTime);

                // AI Pulse
                tl.to('.sa-pulse', {
                    scale: 1.5,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }, startTime + 0.2);
                tl.set('.sa-pulse', { scale: 0.8, opacity: 0.5 }, startTime + 0.8); // Reset pulse

                // Node bump
                tl.to('.sa-ai-node', { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1 }, startTime + 0.2);

                // Book Calendar
                tl.to(`.sa-check-${id}`, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }, startTime + 0.3)
                    .to(`.sa-cal-${id}`, { borderColor: 'rgba(201,168,76,0.5)', backgroundColor: 'rgba(201,168,76,0.1)', duration: 0.2 }, startTime + 0.3);
            });

            // STAGE 3 - Hold
            tl.to({}, { duration: 1.5 });

            // RESET
            tl.to('.sa-container', { opacity: 0, duration: 0.4 })
                .set('.sa-notification', { x: -40, opacity: 0, scale: 0.8, rotation: 0 })
                .set('.sa-line-path', { strokeDashoffset: 100 })
                .set('.sa-check', { scale: 0, opacity: 0 })
                .set('.sa-cal-slot', { borderColor: 'rgba(255,255,255,0.1)', backgroundColor: '#1A1A22' })
                .set('.sa-pulse', { scale: 0.8, opacity: 0 })
                .to('.sa-container', { opacity: 1, duration: 0.4 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={`relative overflow-hidden rounded-2xl bg-[#0D0D12]/50 border border-white/5 flex items-center justify-center p-6 ${className}`}>
            <div className="sa-container relative w-full h-full flex items-center justify-between max-w-[300px]">

                {/* Time Badge */}
                <div className="absolute top-0 right-0 bg-[#1A1A22] border border-white/10 rounded-full px-2 py-1 flex items-center gap-1.5 shadow-lg z-20">
                    <Moon size={10} className="text-brand-accent/80" />
                    <span className="font-mono text-[9px] text-white/40 tracking-wider">03:47 AM</span>
                </div>

                {/* Left: Inbound Notifications */}
                <div className="flex flex-col gap-3 relative z-10">
                    <div className="sa-notification sa-notif-1 bg-[#1A1A22] border border-white/10 rounded-lg p-2 shadow-lg">
                        <MessageSquare size={16} className="text-white/70" />
                    </div>
                    <div className="sa-notification sa-notif-2 bg-[#1A1A22] border border-white/10 rounded-lg p-2 shadow-lg -ml-2">
                        <Phone size={16} className="text-white/70" />
                    </div>
                    <div className="sa-notification sa-notif-3 bg-[#1A1A22] border border-white/10 rounded-lg p-2 shadow-lg">
                        <Mail size={16} className="text-white/70" />
                    </div>
                </div>

                {/* SVG Connecting Lines (Absolute behind) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ preserveAspectRatio: 'none' }}>
                    {/* Hardcoded approximate paths from left column to center node */}
                    <path className="sa-line-path sa-line-1" d="M 40 30 C 80 30, 100 65, 150 65" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeDasharray="100" strokeDashoffset="100" opacity="0.4" />
                    <path className="sa-line-path sa-line-2" d="M 35 65 L 150 65" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeDasharray="100" strokeDashoffset="100" opacity="0.4" />
                    <path className="sa-line-path sa-line-3" d="M 40 100 C 80 100, 100 65, 150 65" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeDasharray="100" strokeDashoffset="100" opacity="0.4" />
                </svg>

                {/* Center: AI Node */}
                <div className="relative flex items-center justify-center z-10 shrink-0">
                    <div className="sa-pulse absolute w-16 h-16 rounded-full border border-brand-accent/50 bg-brand-accent/10"></div>
                    <div className="sa-ai-node w-12 h-12 rounded-full bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.3)] backdrop-blur-sm">
                        <Cpu size={24} className="text-brand-accent" />
                    </div>
                </div>

                {/* Right: Calendar Grid */}
                <div className="grid grid-cols-2 gap-2 relative z-10">
                    {[1, 2, 3].map((id) => (
                        <div key={id} className={`sa-cal-slot sa-cal-${id} w-6 h-6 rounded-md bg-[#1A1A22] border border-white/10 flex items-center justify-center transition-colors duration-300`}>
                            <div className={`sa-check sa-check-${id}`}>
                                <Check size={14} strokeWidth={3} className="text-brand-accent drop-shadow-[0_0_5px_rgba(201,168,76,0.8)]" />
                            </div>
                        </div>
                    ))}
                    {/* Empty decorative slots */}
                    <div className="w-6 h-6 rounded-md bg-[#1A1A22] border border-white/5"></div>
                    <div className="w-6 h-6 rounded-md bg-[#1A1A22] border border-white/5"></div>
                    <div className="w-6 h-6 rounded-md bg-[#1A1A22] border border-white/5"></div>
                </div>

            </div>
        </div>
    );
}
