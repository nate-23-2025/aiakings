import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { User, Mail, CheckCircle2 } from 'lucide-react';

export default function WorkflowAnimation({ className = "w-full h-full" }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            // INITIAL SETUP
            gsap.set('.wf-container', { opacity: 0 });
            gsap.set('.wf-stage', { opacity: 0, scale: 0.8 });
            gsap.set('.wf-stage-1', { borderColor: 'rgba(255,255,255,0.2)' });
            gsap.set('.wf-stage-2', { borderColor: 'rgba(255,255,255,0.2)' });
            gsap.set('.wf-stage-3', { borderColor: 'rgba(255,255,255,0.2)' });
            gsap.set('.wf-icon-1', { color: 'rgba(255,255,255,0.4)' });
            gsap.set('.wf-icon-2', { color: 'rgba(255,255,255,0.4)' });
            gsap.set('.wf-icon-3', { color: 'rgba(255,255,255,0.4)' });
            gsap.set('.wf-flying-mail', { opacity: 0, x: 0 });

            // Setup SVG lines with strokeDasharray/offset for drawing animation
            const line1 = containerRef.current?.querySelector('.wf-line-1');
            const line2 = containerRef.current?.querySelector('.wf-line-2');
            if (line1 && line2) {
                const length1 = line1.getTotalLength();
                const length2 = line2.getTotalLength();
                gsap.set(line1, { strokeDasharray: length1, strokeDashoffset: length1 });
                gsap.set(line2, { strokeDasharray: length2, strokeDashoffset: length2 });
            }

            // STAGE 1 — Container fades in, all 3 icon containers appear as gray outlines (0s - 0.5s)
            tl.to('.wf-container', { opacity: 1, duration: 0.3 }, 0)
              .to('.wf-stage', {
                  opacity: 1,
                  scale: 1,
                  duration: 0.4,
                  stagger: 0.1,
                  ease: 'back.out(1.5)'
              }, 0.1);

            // STAGE 2 — Stage 1 (User) glows red (0.5s - 0.8s)
            tl.to('.wf-stage-1', {
                borderColor: 'rgba(248,113,113,0.8)',
                duration: 0.2,
                ease: 'power2.out'
            }, 0.5)
            .to('.wf-icon-1', {
                color: 'rgba(248,113,113,1)',
                duration: 0.2
            }, 0.5);

            // STAGE 3 — Line 1 draws from Stage 1 → Stage 2 (0.8s - 1.4s)
            if (line1) {
                tl.to(line1, {
                    strokeDashoffset: 0,
                    duration: 0.6,
                    ease: 'power2.inOut'
                }, 0.8);
            }

            // STAGE 4 — Mail icon flies from Stage 1 to Stage 2 along path (1.4s - 2.2s)
            tl.fromTo('.wf-flying-mail',
                { opacity: 0, x: 0, y: 0 },
                { opacity: 1, x: 70, y: 0, duration: 0.5, ease: 'power2.inOut' },
                1.4
            )
            .to('.wf-flying-mail', { opacity: 0, scale: 0.5, duration: 0.2 }, 1.9);

            // STAGE 5 — Stage 2 (Mail) pulses gold (2.2s - 2.5s)
            tl.to('.wf-stage-2', {
                borderColor: 'rgba(201,168,76,0.8)',
                duration: 0.2
            }, 2.2)
            .to('.wf-icon-2', {
                color: 'rgba(201,168,76,1)',
                duration: 0.2
            }, 2.2)
            .to('.wf-stage-2', {
                scale: 1.1,
                duration: 0.15,
                yoyo: true,
                repeat: 1
            }, 2.2);

            // STAGE 6 — Line 2 draws from Stage 2 → Stage 3 (2.5s - 3.2s)
            if (line2) {
                tl.to(line2, {
                    strokeDashoffset: 0,
                    duration: 0.7,
                    ease: 'power2.inOut'
                }, 2.5);
            }

            // STAGE 7 — Stage 3 (CheckCircle2) turns green + glow (3.2s - 3.8s)
            tl.to('.wf-stage-3', {
                borderColor: 'rgba(74,222,128,0.8)',
                boxShadow: '0 0 16px rgba(74,222,128,0.4)',
                duration: 0.3,
                ease: 'power2.out'
            }, 3.2)
            .to('.wf-icon-3', {
                color: 'rgba(74,222,128,1)',
                duration: 0.3
            }, 3.2)
            .to('.wf-stage-3', {
                scale: 1.15,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: 'back.out(2)'
            }, 3.3);

            // STAGE 8 — Hold (3.8s - 5.5s)
            tl.to({}, { duration: 1.7 });

            // RESET (5.5s - 6.0s)
            tl.to('.wf-container', { opacity: 0, duration: 0.4 })
              .set('.wf-stage', { opacity: 0, scale: 0.8 })
              .set('.wf-stage-1', { borderColor: 'rgba(255,255,255,0.2)' })
              .set('.wf-stage-2', { borderColor: 'rgba(255,255,255,0.2)', scale: 1 })
              .set('.wf-stage-3', { borderColor: 'rgba(255,255,255,0.2)', scale: 1, boxShadow: 'none' })
              .set('.wf-icon-1', { color: 'rgba(255,255,255,0.4)' })
              .set('.wf-icon-2', { color: 'rgba(255,255,255,0.4)' })
              .set('.wf-icon-3', { color: 'rgba(255,255,255,0.4)' })
              .set('.wf-flying-mail', { opacity: 0, x: 0, scale: 1 })
              .call(() => {
                  if (line1 && line2) {
                      gsap.set(line1, { strokeDashoffset: line1.getTotalLength() });
                      gsap.set(line2, { strokeDashoffset: line2.getTotalLength() });
                  }
              })
              .to('.wf-container', { opacity: 1, duration: 0.1 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const stages = [
        { id: 1, icon: User, label: 'Lead Captured' },
        { id: 2, icon: Mail, label: 'Email Sent' },
        { id: 3, icon: CheckCircle2, label: 'Client Signed' }
    ];

    return (
        <div ref={containerRef} className={`relative overflow-hidden rounded-2xl bg-[#0D0D12]/50 border border-white/5 p-5 sm:p-6 md:p-8 flex items-center justify-center ${className}`}>
            <div className="wf-container relative w-full flex items-center justify-between px-2 sm:px-4 opacity-0">

                {/* SVG connecting lines */}
                <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                    <path
                        className="wf-line-1"
                        d="M 80 50 L 150 50"
                        stroke="rgba(248,113,113,0.4)"
                        strokeWidth="2"
                        fill="none"
                    />
                    <path
                        className="wf-line-2"
                        d="M 220 50 L 290 50"
                        stroke="rgba(201,168,76,0.4)"
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>

                {/* Stage icons */}
                {stages.map((stage, index) => {
                    const IconComponent = stage.icon;
                    return (
                        <div key={stage.id} className="flex flex-col items-center gap-2 sm:gap-2.5 relative">
                            <div className={`wf-stage wf-stage-${stage.id} w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center opacity-0`}>
                                <IconComponent className={`wf-icon-${stage.id} w-4 h-4 sm:w-5 sm:h-5`} strokeWidth={2} />
                            </div>
                            <span className="font-mono text-[8px] sm:text-[9px] text-white/30 whitespace-nowrap text-center max-w-[60px] sm:max-w-none leading-tight">
                                {stage.label}
                            </span>
                        </div>
                    );
                })}

                {/* Flying mail icon (animates from stage 1 to stage 2) */}
                <div className="wf-flying-mail absolute left-[50px] top-[14px] text-brand-accent opacity-0">
                    <Mail size={12} strokeWidth={2.5} />
                </div>

            </div>
        </div>
    );
}
