import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { Inbox, Timer, CheckCheck, ShieldCheck } from 'lucide-react';
import { LiveLabel, Scanline } from './agentParts';

// NEVER WAIT — the speed-to-lead agent. Two beats in one centered stage (so
// nothing overflows): (A) new lead + stopwatch racing up, (B) "Replied in 3s"
// + the instant, compliant SMS that drives the booking.
export default function SpeedToLeadAnim() {
    const ref = useRef(null);
    const numRef = useRef(null);

    useLayoutEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const ctx = gsap.context(() => {
            gsap.set('.stl-a', { opacity: 0 });
            gsap.set('.stl-b', { opacity: 0 });

            if (reduce) {
                gsap.set('.stl-b', { opacity: 1 });
                if (numRef.current) numRef.current.textContent = '3.0s';
                return;
            }

            const counter = { v: 0 };
            const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power2.out' } });
            tl.set(counter, { v: 0 })
                .call(() => { if (numRef.current) numRef.current.textContent = '0.0s'; })
                // Beat A — lead in, stopwatch races 0 -> 3s
                .fromTo('.stl-a', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45 })
                .to(counter, {
                    v: 3, duration: 1.0, ease: 'power1.out',
                    onUpdate: () => { if (numRef.current) numRef.current.textContent = counter.v.toFixed(1) + 's'; },
                }, '+=0.2')
                .to('.stl-a', { opacity: 0, y: -8, duration: 0.4 }, '+=0.35')
                // Beat B — replied badge + reply bubble + book
                .fromTo('.stl-b', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45 })
                .fromTo('.stl-book', { scale: 0.9 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' }, '-=0.1')
                .to({}, { duration: 1.7 })
                .to('.stl-b', { opacity: 0, y: -8, duration: 0.4 });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={ref} className="bg-[#15151A] border border-white/5 rounded-[2rem] p-5 sm:p-8 h-[300px] sm:h-[340px] relative shadow-2xl overflow-hidden">
            <LiveLabel text="New Lead" right="live" />

            {/* centered stage */}
            <div className="absolute inset-x-5 sm:inset-x-8 top-1/2 -translate-y-1/2 h-44">
                {/* Beat A */}
                <div className="stl-a absolute inset-0 flex flex-col justify-center gap-3">
                    <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                            <Inbox className="w-4 h-4 text-white/70" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm text-white/80 leading-tight">Form submitted <span className="text-white/40">&mdash; Sarah M.</span></p>
                            <p className="text-[11px] text-white/35 font-mono">via website form</p>
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-2 self-start bg-white/[0.05] border border-white/10 rounded-full px-3 py-1.5">
                        <Timer className="w-3.5 h-3.5 text-brand-accent" />
                        <span ref={numRef} className="font-mono text-sm text-white/80 tabular-nums">0.0s</span>
                    </div>
                </div>

                {/* Beat B */}
                <div className="stl-b absolute inset-0 flex flex-col justify-center gap-2.5">
                    <div className="inline-flex items-center gap-1.5 self-start bg-brand-accent/12 border border-brand-accent/30 rounded-full px-3 py-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                        <span className="text-xs font-medium text-white">Replied in 3s</span>
                    </div>
                    <div className="self-end flex flex-col items-end gap-1 max-w-[92%]">
                        <div className="bg-brand-accent/15 border border-brand-accent/25 rounded-2xl rounded-br-md px-3.5 py-2.5">
                            <p className="text-[13px] leading-snug text-white/90">Hi Sarah, I can get you in tomorrow at 10. Want me to lock it in?</p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-white/35">
                            <CheckCheck className="w-3 h-3 text-emerald-400/70" /> Delivered
                            <span className="text-white/20">&middot;</span>
                            <ShieldCheck className="w-3 h-3 text-emerald-400/70" /> Opt&#8209;out honored
                        </span>
                    </div>
                    <button className="stl-book self-end inline-flex items-center gap-1.5 bg-brand-accent text-brand-primary text-xs font-semibold px-4 py-2 rounded-full">
                        Book now &rarr;
                    </button>
                </div>
            </div>

            <Scanline />
        </div>
    );
}
