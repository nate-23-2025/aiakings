import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function WebsiteConvertAnimation({ className = "w-full h-full" }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            // INITIAL SETUP
            gsap.set('.wc-page-content', { y: 0 });
            gsap.set('.wc-cursor', { opacity: 0, x: 20, y: 10 });
            gsap.set('.wc-click-ring', { scale: 0, opacity: 0 });
            gsap.set('.wc-lead-row', { opacity: 0, x: -10 });
            gsap.set('.wc-counter', { textContent: '0%' });
            gsap.set('.wc-bar-fill', { scaleX: 0 });
            gsap.set('.wc-cta-btn', { backgroundColor: 'rgba(201,168,76,0.8)' });

            // STAGE 1 — Page loads in (0s - 0.8s)
            tl.fromTo('.wc-browser', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 0)
              .fromTo('.wc-hero-block', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: 'power2.out' }, 0.3);

            // STAGE 2 — Visitor cursor appears and drifts down (0.8s - 1.8s)
            tl.to('.wc-cursor', { opacity: 1, duration: 0.2 }, 0.8)
              .to('.wc-cursor', { x: 50, y: 30, duration: 0.5, ease: 'power1.inOut' }, 1.0)
              .to('.wc-page-content', { y: -20, duration: 0.6, ease: 'power1.inOut' }, 1.0)
              .to('.wc-cursor', { x: 35, y: 52, duration: 0.4, ease: 'power2.inOut' }, 1.5);

            // STAGE 3 — Cursor moves to CTA and clicks (1.8s - 2.6s)
            tl.to('.wc-cursor', { x: 30, y: 60, duration: 0.3, ease: 'power2.inOut' }, 1.9)
              .to('.wc-cursor', { scale: 0.8, duration: 0.08 }, 2.2)
              .to('.wc-cursor', { scale: 1, duration: 0.08 }, 2.28)
              .fromTo('.wc-click-ring',
                  { scale: 0, opacity: 0.8 },
                  { scale: 2.5, opacity: 0, duration: 0.5, ease: 'power2.out' }, 2.2)
              .to('.wc-cta-btn', { backgroundColor: '#C9A84C', boxShadow: '0 0 12px rgba(201,168,76,0.6)', duration: 0.15 }, 2.2)
              .to('.wc-cta-btn', { boxShadow: '0 0 0px rgba(201,168,76,0)', duration: 0.3 }, 2.4);

            // STAGE 4 — Lead captured, rows fill in (2.6s - 3.8s)
            tl.to('.wc-cursor', { opacity: 0, duration: 0.2 }, 2.6)
              .to('.wc-lead-row', { opacity: 1, x: 0, duration: 0.25, stagger: 0.15, ease: 'power2.out' }, 2.7)
              .to('.wc-bar-fill', { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 2.9)
              .to('.wc-counter', { textContent: '94%', duration: 0.5, snap: { textContent: 1 },
                  onUpdate: function() {
                      const el = containerRef.current?.querySelector('.wc-counter');
                      if (el) el.textContent = el.textContent + '%';
                  }
              }, 2.9);

            // STAGE 5 — Hold
            tl.to({}, { duration: 1.8 });

            // RESET
            tl.to('.wc-anim-root', { opacity: 0, duration: 0.4 })
              .set('.wc-page-content', { y: 0 })
              .set('.wc-cursor', { opacity: 0, x: 20, y: 10, scale: 1 })
              .set('.wc-click-ring', { scale: 0, opacity: 0 })
              .set('.wc-lead-row', { opacity: 0, x: -10 })
              .set('.wc-counter', { textContent: '0%' })
              .set('.wc-bar-fill', { scaleX: 0 })
              .set('.wc-cta-btn', { backgroundColor: 'rgba(201,168,76,0.8)', boxShadow: 'none' })
              .set('.wc-hero-block', { opacity: 0, y: 8 })
              .to('.wc-anim-root', { opacity: 1, duration: 0.4 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={`relative overflow-hidden rounded-2xl bg-[#0D0D12]/50 border border-white/5 flex items-center justify-center ${className}`}>
            <div className="wc-anim-root relative w-full h-full flex items-center justify-center p-4">

                {/* Mini Browser Frame */}
                <div className="wc-browser relative w-[140px] h-[100px] bg-[#0A0A0E] rounded-lg border border-white/10 overflow-hidden opacity-0" style={{ fontSize: '4px' }}>
                    {/* Browser top bar */}
                    <div className="flex items-center gap-[3px] px-2 py-[3px] bg-white/[0.03] border-b border-white/5">
                        <div className="w-[4px] h-[4px] rounded-full bg-red-400/60" />
                        <div className="w-[4px] h-[4px] rounded-full bg-yellow-400/60" />
                        <div className="w-[4px] h-[4px] rounded-full bg-green-400/60" />
                        <div className="ml-2 flex-1 h-[5px] rounded bg-white/5" />
                    </div>

                    {/* Page content that scrolls */}
                    <div className="wc-page-content px-2 pt-2 pb-4">
                        {/* Hero blocks */}
                        <div className="wc-hero-block w-[60%] h-[4px] rounded-sm bg-white/20 mb-[3px] opacity-0" />
                        <div className="wc-hero-block w-[80%] h-[6px] rounded-sm bg-brand-accent/30 mb-[4px] opacity-0" />
                        <div className="wc-hero-block w-[50%] h-[3px] rounded-sm bg-white/10 mb-[6px] opacity-0" />

                        {/* Feature blocks */}
                        <div className="flex gap-[3px] mb-[4px]">
                            <div className="wc-hero-block flex-1 h-[10px] rounded-sm bg-white/[0.04] border border-white/5 opacity-0" />
                            <div className="wc-hero-block flex-1 h-[10px] rounded-sm bg-white/[0.04] border border-white/5 opacity-0" />
                            <div className="wc-hero-block flex-1 h-[10px] rounded-sm bg-white/[0.04] border border-white/5 opacity-0" />
                        </div>

                        {/* CTA Button */}
                        <div className="flex justify-center mt-[4px] relative">
                            <div className="wc-cta-btn w-[40px] h-[8px] rounded-full relative" style={{ backgroundColor: 'rgba(201,168,76,0.8)' }}>
                                <div className="wc-click-ring absolute inset-0 rounded-full border border-brand-accent" />
                            </div>
                        </div>

                        {/* More content below fold */}
                        <div className="mt-[6px] space-y-[2px]">
                            <div className="w-[70%] h-[3px] rounded-sm bg-white/5" />
                            <div className="w-[90%] h-[3px] rounded-sm bg-white/5" />
                            <div className="w-[50%] h-[3px] rounded-sm bg-white/5" />
                        </div>
                    </div>
                </div>

                {/* Cursor */}
                <div className="wc-cursor absolute pointer-events-none opacity-0" style={{ top: '30%', left: '30%' }}>
                    <svg width="10" height="14" viewBox="0 0 12 18" fill="none">
                        <path d="M1 1L1 13L4.5 9.5L8 16L10 15L6.5 8.5L11 8L1 1Z" fill="white" stroke="white" strokeWidth="0.5" />
                    </svg>
                </div>

                {/* Conversion panel — right side */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-[6px]">
                    {/* Lead captured rows */}
                    {['Lead Captured', 'Form Sent', 'Deal Closed'].map((label, i) => (
                        <div key={i} className={`wc-lead-row flex items-center gap-1 opacity-0`}>
                            <div className="w-[5px] h-[5px] rounded-full bg-brand-accent/80" />
                            <span className="font-mono text-[6px] text-white/50 whitespace-nowrap">{label}</span>
                        </div>
                    ))}

                    {/* Conversion bar */}
                    <div className="mt-1">
                        <div className="w-[50px] h-[4px] rounded-full bg-white/5 overflow-hidden">
                            <div className="wc-bar-fill h-full bg-brand-accent rounded-full origin-left" style={{ transform: 'scaleX(0)' }} />
                        </div>
                        <span className="wc-counter font-mono text-[7px] text-brand-accent font-bold mt-[2px] block">0%</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
