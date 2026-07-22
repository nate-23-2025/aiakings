import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { Check, Zap, Star } from 'lucide-react';

// Floating live-activity toasts that pop in and drift near the phone — motion +
// social proof for the three agents (booked call, fast lead reply, new review).
const TOASTS = [
    { icon: Check, tint: 'text-emerald-400', fill: false, title: 'Call booked', sub: 'Katy, TX · 2:00 PM', pos: 'top-8 -left-6' },
    { icon: Zap, tint: 'text-brand-accent', fill: false, title: 'Lead replied in 3s', sub: 'Website form', pos: 'top-1/2 -translate-y-1/2 -left-14' },
    { icon: Star, tint: 'text-brand-accent', fill: true, title: 'New 5-star review', sub: 'Posted to Google', pos: 'bottom-16 -left-4' },
];

export default function HeroToasts() {
    const ref = useRef(null);

    useLayoutEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray('.hero-toast');
            gsap.set(items, { opacity: 0, y: 16, scale: 0.95 });
            if (reduce) return;
            items.forEach((el, i) => {
                gsap.timeline({ repeat: -1, delay: i * 1.9 })
                    .to(el, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' })
                    .to(el, { y: -8, duration: 2.2, ease: 'sine.inOut' }, '<')
                    .to(el, { opacity: 0, y: -18, duration: 0.45, ease: 'power2.in' }, '+=0.3')
                    .to({}, { duration: 3.4 });
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={ref} aria-hidden className="hidden lg:block pointer-events-none absolute inset-0 z-30">
            {TOASTS.map((t, i) => (
                <div key={i} className={`hero-toast absolute ${t.pos} flex items-center gap-2.5 bg-[#15151A]/90 backdrop-blur-md border border-white/10 rounded-2xl px-3.5 py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.55)]`}>
                    <span className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                        <t.icon className={`w-4 h-4 ${t.tint}`} fill={t.fill ? 'currentColor' : 'none'} strokeWidth={t.fill ? 1 : 2} />
                    </span>
                    <div className="leading-tight">
                        <p className="text-white/90 text-sm font-medium whitespace-nowrap">{t.title}</p>
                        <p className="text-white/40 text-[11px] font-mono whitespace-nowrap">{t.sub}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
