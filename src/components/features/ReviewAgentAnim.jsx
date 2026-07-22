import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { Star, Check, Clock } from 'lucide-react';
import { LiveLabel, Scanline } from './agentParts';

// MORE REVIEWS, ON AUTOPILOT — the review agent. Two beats in one centered stage:
// (ask) request -> 5 stars fill -> posted to Google, rating ticks up; (every job)
// it asks EVERY customer automatically, right after their appointment. No gating,
// no sentiment filtering — every customer gets the same Google review request.
export default function ReviewAgentAnim() {
    const ref = useRef(null);

    useLayoutEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const ctx = gsap.context(() => {
            gsap.set('.ra-auto', { opacity: 0 });
            gsap.set(['.ra-req', '.ra-google'], { opacity: 0, y: 10 });
            gsap.set('.ra-plus', { scale: 0 });
            gsap.set('.ra-star', { color: 'rgba(255,255,255,0.15)' });

            if (reduce) {
                gsap.set(['.ra-req', '.ra-google'], { opacity: 1, y: 0 });
                gsap.set(['.ra-plus'], { scale: 1 });
                gsap.set('.ra-star', { color: 'var(--color-brand-accent)' });
                return;
            }

            const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power2.out' } });
            tl.set('.ra-ask', { opacity: 1 })
                .set(['.ra-req', '.ra-google'], { opacity: 0, y: 10 })
                .set('.ra-plus', { scale: 0 })
                .set('.ra-star', { color: 'rgba(255,255,255,0.15)', scale: 1 })
                .set('.ra-auto', { opacity: 0 })
                .set('.ra-job', { opacity: 0, y: 10 })
                // ask beat — request, stars fill, posted to Google
                .fromTo('.ra-req', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 })
                .to('.ra-star', { color: 'var(--color-brand-accent)', scale: 1.15, duration: 0.22, stagger: 0.12 }, '+=0.25')
                .to('.ra-star', { scale: 1, duration: 0.2, stagger: 0.12 }, '<0.1')
                .fromTo('.ra-google', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, '+=0.1')
                .to('.ra-plus', { scale: 1, duration: 0.3, ease: 'back.out(2)' }, '<0.15')
                .to({}, { duration: 1.4 })
                // every-job beat — asks every customer automatically (ask fades first, no overlap)
                .to('.ra-ask', { opacity: 0, duration: 0.4 })
                .fromTo('.ra-auto', { opacity: 0 }, { opacity: 1, duration: 0.35 })
                .to('.ra-job', { opacity: 1, y: 0, duration: 0.4, stagger: 0.28 })
                .to({}, { duration: 1.5 })
                .to('.ra-auto', { opacity: 0, duration: 0.4 });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={ref} className="bg-[#15151A] border border-white/5 rounded-[2rem] p-5 sm:p-8 h-[300px] sm:h-[340px] relative shadow-2xl overflow-hidden">
            <LiveLabel text="Reviews" right="live" />

            {/* centered stage — ask and every-job occupy the same space, cross-faded */}
            <div className="absolute inset-x-5 sm:inset-x-8 top-1/2 -translate-y-1/2 h-40">
                {/* Ask beat */}
                <div className="ra-ask absolute inset-0 flex flex-col justify-center">
                    <div className="ra-req inline-flex items-center gap-2 self-start bg-white/[0.05] border border-white/10 rounded-2xl rounded-bl-md px-3.5 py-2.5 mb-4">
                        <span className="text-[13px] text-white/80">Thanks for coming in! Mind leaving a quick review?</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="ra-star w-6 h-6" fill="currentColor" strokeWidth={1} style={{ color: 'rgba(255,255,255,0.15)' }} />
                        ))}
                    </div>
                    <div className="ra-google flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 bg-brand-accent/12 border border-brand-accent/30 rounded-full px-3.5 py-1.5">
                            <Check className="w-4 h-4 text-brand-accent" />
                            <span className="text-sm font-medium text-white">Posted to Google</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-white/45">
                            4.9 <Star className="w-3 h-3 text-brand-accent" fill="currentColor" strokeWidth={0} /> 129
                            <span className="ra-plus inline-block text-emerald-400 font-semibold">+1</span>
                        </span>
                    </div>
                </div>

                {/* Every-job beat — asks every customer, automatically */}
                <div className="ra-auto absolute inset-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3.5 text-[11px] font-mono uppercase tracking-wider text-white/40">
                        <Clock className="w-3.5 h-3.5 text-brand-accent" />
                        After every appointment
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {[
                            { s: 'Facial', n: 'Jordan R.' },
                            { s: 'New patient', n: 'Marcus T.' },
                            { s: 'Consultation', n: 'Alicia B.' },
                        ].map((j) => (
                            <div key={j.n} className="ra-job flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-accent/15 border border-brand-accent/30 shrink-0">
                                    <Check className="w-3 h-3 text-brand-accent" />
                                </span>
                                <span className="text-[13px] text-white/80">{j.s} &middot; <span className="text-white/45">{j.n}</span></span>
                                <span className="ml-auto text-[11px] font-mono text-white/45">review requested</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Scanline />
        </div>
    );
}
