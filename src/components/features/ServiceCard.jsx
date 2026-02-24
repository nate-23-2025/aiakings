import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';

/*  Six reusable micro-animation patterns — each is a tiny 3-beat
    before → process → after visual that triggers on scroll.          */

function ChaosToOrder({ active }) {
    const ref = useRef(null);
    useEffect(() => {
        if (!active) return;
        const ctx = gsap.context(() => {
            const items = ref.current.querySelectorAll('.mco-item');
            gsap.set(items, { opacity: 0, scale: 0.6, rotation: () => gsap.utils.random(-30, 30) });
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
            // Appear scattered
            tl.to(items, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.5)' })
              // Organize
              .to(items, { rotation: 0, x: 0, y: (i) => i * 14, duration: 0.6, stagger: 0.06, ease: 'power3.inOut' }, 1)
              // Glow gold
              .to(items, { borderColor: 'rgba(201,168,76,0.4)', duration: 0.3 }, 1.6)
              // Hold
              .to({}, { duration: 1.2 })
              // Reset
              .to(items, { opacity: 0, duration: 0.3 })
              .set(items, { rotation: () => gsap.utils.random(-30, 30), x: () => gsap.utils.random(-8, 8), y: () => gsap.utils.random(-6, 6), borderColor: 'rgba(255,255,255,0.08)' });
        }, ref);
        return () => ctx.revert();
    }, [active]);

    return (
        <div ref={ref} className="relative h-full w-full flex items-center justify-center">
            {[0, 1, 2, 3].map(i => (
                <div key={i} className="mco-item absolute w-10 h-3 rounded bg-white/[0.04] border border-white/[0.08]"
                     style={{ top: `${20 + i * 8}%`, left: `${25 + (i % 2) * 20}%` }} />
            ))}
        </div>
    );
}

function MissingToComplete({ active }) {
    const ref = useRef(null);
    useEffect(() => {
        if (!active) return;
        const ctx = gsap.context(() => {
            const checks = ref.current.querySelectorAll('.mmc-check');
            const gaps = ref.current.querySelectorAll('.mmc-gap');
            gsap.set(checks, { scale: 0, opacity: 0 });
            gsap.set(gaps, { backgroundColor: 'rgba(239,68,68,0.15)' });
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
            tl.to(checks, { scale: 1, opacity: 1, duration: 0.3, stagger: 0.25, ease: 'back.out(2)' }, 0.4)
              .to(gaps, { backgroundColor: 'rgba(52,211,153,0.15)', duration: 0.3, stagger: 0.25 }, 0.4)
              .to({}, { duration: 1.2 })
              .to(checks, { opacity: 0, scale: 0, duration: 0.2 })
              .to(gaps, { backgroundColor: 'rgba(239,68,68,0.15)', duration: 0.2 });
        }, ref);
        return () => ctx.revert();
    }, [active]);

    return (
        <div ref={ref} className="relative h-full w-full flex flex-col items-start justify-center gap-2 px-4">
            {[0, 1, 2].map(i => (
                <div key={i} className="flex items-center gap-2 w-full">
                    <div className="mmc-gap w-3 h-3 rounded-sm" />
                    <div className="mmc-check text-emerald-400 text-[10px] font-bold">&#10003;</div>
                    <div className="h-1.5 flex-1 rounded-full bg-white/[0.06]" />
                </div>
            ))}
        </div>
    );
}

function ManualToAutomated({ active }) {
    const ref = useRef(null);
    useEffect(() => {
        if (!active) return;
        const ctx = gsap.context(() => {
            const hand = ref.current.querySelector('.mma-hand');
            const pipe = ref.current.querySelectorAll('.mma-pipe');
            const dot = ref.current.querySelectorAll('.mma-dot');
            gsap.set(hand, { opacity: 1 });
            gsap.set(pipe, { scaleX: 0 });
            gsap.set(dot, { opacity: 0, x: -10 });
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
            // Hand typing fades out
            tl.to(hand, { opacity: 0, duration: 0.4 }, 0.6)
              // Pipeline draws
              .to(pipe, { scaleX: 1, duration: 0.5, stagger: 0.15, ease: 'power2.out' }, 0.8)
              // Data dots flow
              .to(dot, { opacity: 1, x: 0, duration: 0.3, stagger: 0.12, ease: 'power2.out' }, 1.2)
              .to(dot, { x: 20, opacity: 0, duration: 0.4, stagger: 0.12 }, 1.8)
              .to({}, { duration: 1 })
              .set(hand, { opacity: 1 })
              .set(pipe, { scaleX: 0 })
              .set(dot, { opacity: 0, x: -10 });
        }, ref);
        return () => ctx.revert();
    }, [active]);

    return (
        <div ref={ref} className="relative h-full w-full flex items-center justify-center">
            <span className="mma-hand absolute text-[11px] text-white/30 font-mono">typing...</span>
            <div className="flex items-center gap-1 absolute">
                <div className="mma-pipe w-6 h-[2px] bg-brand-accent/40 origin-left rounded" />
                <div className="mma-dot w-1.5 h-1.5 rounded-full bg-brand-accent" />
                <div className="mma-pipe w-6 h-[2px] bg-brand-accent/40 origin-left rounded" />
                <div className="mma-dot w-1.5 h-1.5 rounded-full bg-brand-accent" />
                <div className="mma-pipe w-6 h-[2px] bg-emerald-400/40 origin-left rounded" />
            </div>
        </div>
    );
}

function PendingToResolved({ active }) {
    const ref = useRef(null);
    useEffect(() => {
        if (!active) return;
        const ctx = gsap.context(() => {
            const dots = ref.current.querySelectorAll('.mpr-dot');
            gsap.set(dots, { backgroundColor: 'rgba(239,68,68,0.6)' });
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
            tl.to(dots, { backgroundColor: 'rgba(52,211,153,0.8)', duration: 0.4, stagger: 0.3, ease: 'power2.out' }, 0.5)
              .to(dots, { scale: 1.4, duration: 0.2, stagger: 0.3, yoyo: true, repeat: 1 }, 0.5)
              .to({}, { duration: 1.2 })
              .to(dots, { backgroundColor: 'rgba(239,68,68,0.6)', scale: 1, duration: 0.3 });
        }, ref);
        return () => ctx.revert();
    }, [active]);

    return (
        <div ref={ref} className="relative h-full w-full flex items-center justify-center gap-3">
            {[0, 1, 2].map(i => (
                <div key={i} className="flex items-center gap-1.5">
                    <div className="mpr-dot w-2 h-2 rounded-full" />
                    <div className="h-1 w-6 rounded-full bg-white/[0.06]" />
                </div>
            ))}
        </div>
    );
}

function DisconnectedToConnected({ active }) {
    const ref = useRef(null);
    useEffect(() => {
        if (!active) return;
        const ctx = gsap.context(() => {
            const nodes = ref.current.querySelectorAll('.mdc-node');
            const lines = ref.current.querySelectorAll('.mdc-line');
            gsap.set(lines, { opacity: 0, scaleX: 0 });
            gsap.set(nodes, { borderColor: 'rgba(255,255,255,0.08)' });
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
            tl.to(lines, { opacity: 1, scaleX: 1, duration: 0.4, stagger: 0.2, ease: 'power2.out' }, 0.4)
              .to(nodes, { borderColor: 'rgba(201,168,76,0.3)', duration: 0.3, stagger: 0.15 }, 0.8)
              .to({}, { duration: 1.2 })
              .to(lines, { opacity: 0, scaleX: 0, duration: 0.3 })
              .to(nodes, { borderColor: 'rgba(255,255,255,0.08)', duration: 0.2 });
        }, ref);
        return () => ctx.revert();
    }, [active]);

    return (
        <div ref={ref} className="relative h-full w-full flex items-center justify-center">
            <div className="mdc-node absolute w-3 h-3 rounded-full border bg-white/[0.03]" style={{ top: '25%', left: '30%' }} />
            <div className="mdc-line absolute h-[1.5px] w-8 bg-brand-accent/40 origin-left" style={{ top: '38%', left: '38%', transform: 'rotate(25deg)' }} />
            <div className="mdc-node absolute w-3 h-3 rounded-full border bg-white/[0.03]" style={{ top: '25%', right: '30%' }} />
            <div className="mdc-line absolute h-[1.5px] w-8 bg-brand-accent/40 origin-left" style={{ top: '38%', right: '38%', transform: 'rotate(-25deg)' }} />
            <div className="mdc-node absolute w-4 h-4 rounded-full border bg-white/[0.03]" style={{ bottom: '25%', left: '50%', transform: 'translateX(-50%)' }} />
        </div>
    );
}

function UnknownToGuided({ active }) {
    const ref = useRef(null);
    useEffect(() => {
        if (!active) return;
        const ctx = gsap.context(() => {
            const q = ref.current.querySelector('.mug-q');
            const steps = ref.current.querySelectorAll('.mug-step');
            gsap.set(q, { opacity: 1 });
            gsap.set(steps, { opacity: 0, x: -8 });
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
            tl.to(q, { opacity: 0, scale: 0.5, duration: 0.3 }, 0.4)
              .to(steps, { opacity: 1, x: 0, duration: 0.3, stagger: 0.2, ease: 'power2.out' }, 0.7)
              .to({}, { duration: 1.2 })
              .to(steps, { opacity: 0, x: -8, duration: 0.2 })
              .set(q, { opacity: 1, scale: 1 });
        }, ref);
        return () => ctx.revert();
    }, [active]);

    return (
        <div ref={ref} className="relative h-full w-full flex items-center justify-center">
            <span className="mug-q absolute text-lg text-white/20 font-bold">?</span>
            <div className="absolute flex flex-col gap-1">
                {[1, 2, 3].map(i => (
                    <div key={i} className="mug-step flex items-center gap-1.5">
                        <span className="text-[8px] text-brand-accent/60 font-mono">{i}.</span>
                        <div className="h-1 w-8 rounded-full bg-brand-accent/20" />
                    </div>
                ))}
            </div>
        </div>
    );
}

const ANIMATION_MAP = {
    chaosToOrder: ChaosToOrder,
    missingToComplete: MissingToComplete,
    manualToAutomated: ManualToAutomated,
    pendingToResolved: PendingToResolved,
    disconnectedToConnected: DisconnectedToConnected,
    unknownToGuided: UnknownToGuided,
};

export default function ServiceCard({ service, index }) {
    const [expanded, setExpanded] = useState(false);
    const [animActive, setAnimActive] = useState(false);
    const cardRef = useRef(null);
    const contentRef = useRef(null);

    // Trigger micro-animation when card enters viewport
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setAnimActive(entry.isIntersecting),
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Animate expand/collapse
    useEffect(() => {
        if (!contentRef.current) return;
        if (expanded) {
            gsap.fromTo(contentRef.current,
                { height: 0, opacity: 0 },
                { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
        } else {
            gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
        }
    }, [expanded]);

    const AnimComponent = ANIMATION_MAP[service.animPattern];

    return (
        <div
            ref={cardRef}
            className="svc-card group bg-[#15151A] border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer hover:border-brand-accent/20 hover:-translate-y-[2px] transition-all duration-300"
            onClick={() => setExpanded(!expanded)}
        >
            {/* Top: Micro-animation + Icon */}
            <div className="flex items-stretch">
                <div className="w-16 h-16 shrink-0 relative overflow-hidden">
                    <AnimComponent active={animActive} />
                </div>
                <div className="flex-1 p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <service.icon size={16} className="text-brand-accent/60 shrink-0" />
                        <h3 className="text-sm font-semibold text-white truncate">{service.title}</h3>
                    </div>
                    <ChevronDown
                        size={14}
                        className={`text-white/30 shrink-0 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {/* Pain point + outcome (always visible) */}
            <div className="px-4 pb-3">
                <p className="text-[13px] text-white/40 leading-relaxed">{service.painPoint}</p>
                <p className="text-[12px] text-brand-accent/70 font-medium mt-1.5">{service.outcome}</p>
            </div>

            {/* Expandable detail: Today → Automation → AI */}
            <div ref={contentRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
                <div className="px-4 pb-4 pt-2 border-t border-white/[0.04] space-y-3">
                    <div>
                        <span className="text-[10px] uppercase tracking-wider text-red-400/60 font-semibold">Today</span>
                        <ul className="mt-1 space-y-0.5">
                            {service.today.map((item, i) => (
                                <li key={i} className="text-[11px] text-white/35 leading-relaxed flex items-start gap-1.5">
                                    <span className="text-red-400/40 mt-0.5 shrink-0">&#x2022;</span>{item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase tracking-wider text-brand-accent/60 font-semibold">Automated</span>
                        <ul className="mt-1 space-y-0.5">
                            {service.automation.map((item, i) => (
                                <li key={i} className="text-[11px] text-white/45 leading-relaxed flex items-start gap-1.5">
                                    <span className="text-brand-accent/40 mt-0.5 shrink-0">&#x2022;</span>{item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase tracking-wider text-emerald-400/60 font-semibold">AI Layer</span>
                        <ul className="mt-1 space-y-0.5">
                            {service.ai.map((item, i) => (
                                <li key={i} className="text-[11px] text-white/50 leading-relaxed flex items-start gap-1.5">
                                    <span className="text-emerald-400/40 mt-0.5 shrink-0">&#x2022;</span>{item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
