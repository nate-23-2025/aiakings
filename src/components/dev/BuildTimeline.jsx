import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../lib/motion';

gsap.registerPlugin(ScrollTrigger);

// The build steps as a timeline: a gold line draws down as the reader scrolls,
// and each step lights up as the line reaches it. Modeled on the "Scroll
// animated timeline" component on 21st.dev, built on the site's own scroll
// engine. Reduced motion shows the finished line with every step lit.
export default function BuildTimeline({ items }) {
    const rootRef = useRef(null);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const steps = Array.from(root.querySelectorAll('.tl-step'));
        if (prefersReducedMotion()) {
            steps.forEach((s) => s.classList.add('is-lit'));
            root.querySelector('.tl-fill').style.transform = 'scaleY(1)';
            return;
        }
        const ctx = gsap.context(() => {
            gsap.fromTo('.tl-fill', { scaleY: 0 }, {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: { trigger: root, start: 'top 65%', end: 'bottom 60%', scrub: 0.5 },
            });
            steps.forEach((step) => {
                ScrollTrigger.create({
                    trigger: step,
                    start: 'top 62%',
                    toggleClass: { targets: step, className: 'is-lit' },
                    end: 'max',
                });
            });
        }, root);
        return () => ctx.revert();
    }, []);

    return (
        <ol ref={rootRef} className="relative">
            <span aria-hidden="true" className="absolute left-[19px] sm:left-[23px] top-2 bottom-2 w-px bg-white/10" />
            <span aria-hidden="true" className="tl-fill absolute left-[19px] sm:left-[23px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-brand-accent via-[#F1DC9B] to-brand-sapphire-light shadow-[0_0_12px_rgba(201,168,76,0.6)]" />
            {items.map(({ title, body }, i) => (
                <li key={title} className="tl-step relative grid grid-cols-[40px_minmax(0,1fr)] sm:grid-cols-[48px_minmax(0,1fr)] gap-4 sm:gap-6 pb-8 last:pb-0">
                    <span className="tl-node relative z-10 grid place-items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/15 bg-[#0D0D12] font-mono text-xs text-white/45">
                        {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="tl-card rounded-2xl border border-white/[0.07] bg-[#15151A] px-5 py-4 sm:px-6 sm:py-5">
                        <h4 className="text-white text-lg sm:text-xl font-semibold">{title}</h4>
                        <p className="mt-2 text-white/50 text-sm sm:text-base leading-relaxed">{body}</p>
                    </div>
                </li>
            ))}
        </ol>
    );
}
