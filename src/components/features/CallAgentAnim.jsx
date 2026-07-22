import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { PhoneCall, Check, MessageSquare, ShieldCheck } from 'lucide-react';
import { LiveLabel, Scanline } from './agentParts';

// NEVER MISS — the call agent. Loops: incoming call (after hours) -> AI answers
// (live waveform) -> job booked -> proof a missed call got an auto text-back.
// Every beat lives in one centered stage so nothing overlaps or jumps.
const BARS = 16;

export default function CallAgentAnim() {
    const ref = useRef(null);

    useLayoutEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const ctx = gsap.context(() => {
            gsap.set(['.ca-incoming', '.ca-answer', '.ca-booked'], { opacity: 0 });
            gsap.set('.ca-text', { opacity: 0, y: 8 });

            if (reduce) {
                gsap.set(['.ca-booked', '.ca-text'], { opacity: 1, y: 0 });
                gsap.set('.ca-bar', { scaleY: 0.5 });
                return;
            }

            gsap.to('.ca-bar', {
                scaleY: () => 0.25 + Math.random() * 0.75,
                duration: 0.42, ease: 'sine.inOut', repeat: -1, yoyo: true, repeatRefresh: true,
                stagger: { each: 0.06, from: 'random' },
            });

            const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power2.out' } });
            tl.fromTo('.ca-incoming', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 })
                .to('.ca-incoming', { opacity: 0, duration: 0.35 }, '+=1.3')
                .fromTo('.ca-answer', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 })
                .to('.ca-answer', { opacity: 0, duration: 0.35 }, '+=1.6')
                .fromTo('.ca-booked', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 })
                .fromTo('.ca-text', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
                .to({}, { duration: 1.6 })
                .to(['.ca-booked', '.ca-text'], { opacity: 0, duration: 0.4 });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={ref} className="bg-[#15151A] border border-white/5 rounded-[2rem] p-5 sm:p-8 h-[300px] sm:h-[340px] relative shadow-2xl overflow-hidden">
            <LiveLabel text="24/7 Line" right="11:47 PM" />

            {/* centered stage — beats crossfade in place, never overlap or jump */}
            <div className="absolute inset-x-5 sm:inset-x-8 top-1/2 -translate-y-1/2 h-24">
                <div className="ca-incoming absolute inset-0 flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center shrink-0">
                        <PhoneCall className="w-5 h-5 text-brand-accent" />
                        <span className="absolute inset-0 rounded-xl border border-brand-accent/40 animate-ping" style={{ animationDuration: '1.4s' }} />
                    </div>
                    <div>
                        <p className="text-white/85 text-sm font-medium">Incoming call</p>
                        <p className="text-white/40 text-xs font-mono">+1 (713) 555&#8209;0148 &middot; Houston</p>
                    </div>
                </div>

                <div className="ca-answer absolute inset-0 flex flex-col justify-center">
                    <div className="flex items-end justify-center gap-[3px] h-12 mb-2">
                        {Array.from({ length: BARS }).map((_, i) => (
                            <span key={i} className="ca-bar w-[3px] flex-1 max-w-[6px] origin-bottom rounded-full bg-gradient-to-t from-brand-accent/40 to-brand-accent" style={{ transform: 'scaleY(0.3)' }} />
                        ))}
                    </div>
                    <p className="text-center text-white/50 text-xs font-mono">AI answering, booking the job</p>
                </div>

                <div className="ca-booked absolute inset-0 flex items-center justify-center">
                    <div className="inline-flex items-center gap-2 bg-brand-accent/12 border border-brand-accent/30 rounded-full px-4 py-2">
                        <Check className="w-4 h-4 text-brand-accent" />
                        <span className="text-white text-sm font-medium">Booked, Thu 2:00 PM</span>
                    </div>
                </div>
            </div>

            {/* Missed-call text-back proof + compliance */}
            <div className="ca-text absolute bottom-4 sm:bottom-6 inset-x-5 sm:inset-x-8 flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-2 min-w-0">
                    <MessageSquare className="w-3.5 h-3.5 text-brand-accent/70 shrink-0" />
                    <span className="text-white/45 font-mono truncate">Missed 9:42 PM &rarr; text sent &#10003;</span>
                </span>
                <span className="inline-flex items-center gap-1 text-white/35 font-mono shrink-0">
                    <ShieldCheck className="w-3 h-3 text-emerald-400/70" /> TCPA
                </span>
            </div>

            <Scanline />
        </div>
    );
}
