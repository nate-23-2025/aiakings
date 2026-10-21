import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useReveal } from '../hooks/useReveal';
import { canHover, prefersReducedMotion } from '../lib/motion';

// The sign-off wordmark. With a mouse over it, the letters scatter a little,
// tilt, and drift as if floating, then fall back into line when the pointer
// leaves. From "Fancy Text Hover" (codegrid) on 21st.dev, rebuilt here with
// the site's GSAP. Touch screens and reduced motion get the still wordmark.
const WORD = 'AIA Kings';
const SCATTER = [
    { x: -15, y: 60, r: 8 }, { x: -30, y: 30, r: 4 }, { x: -20, y: 40, r: -6 }, null,
    { x: 0, y: 8, r: -8 }, { x: 0, y: -20, r: 5 }, { x: 0, y: 20, r: -3 }, { x: 0, y: -40, r: -5 }, { x: 0, y: 15, r: 10 },
];

function FancyWord() {
    const ref = useRef(null);

    useEffect(() => {
        const word = ref.current;
        if (!canHover() || prefersReducedMotion()) return;
        const letters = Array.from(word.querySelectorAll('.fw-letter'));
        const floats = letters.map((l) => l.firstElementChild);
        const enter = () => {
            letters.forEach((l, i) => {
                const t = SCATTER[i];
                if (!t) return;
                gsap.to(l, { xPercent: t.x, yPercent: t.y, rotation: t.r, duration: 0.3, ease: 'power3.inOut' });
                gsap.to(floats[i], { yPercent: -6, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: (i % 4) * 0.35 });
            });
        };
        const leave = () => {
            gsap.killTweensOf(floats);
            gsap.to(letters, { xPercent: 0, yPercent: 0, rotation: 0, duration: 0.4, ease: 'power3.inOut' });
            gsap.to(floats, { yPercent: 0, duration: 0.4, ease: 'power3.inOut' });
        };
        word.addEventListener('mouseenter', enter);
        word.addEventListener('mouseleave', leave);
        return () => {
            word.removeEventListener('mouseenter', enter);
            word.removeEventListener('mouseleave', leave);
            gsap.killTweensOf([...letters, ...floats]);
        };
    }, []);

    return (
        <span ref={ref} className="fw-word">
            {[...WORD].map((c, i) => (
                <span key={i} className="fw-letter">
                    <span className="fw-float"><span>{c === ' ' ? '\u00A0' : c}</span></span>
                </span>
            ))}
        </span>
    );
}

export default function Footer() {
    const footerRef = useRef(null);
    useReveal(footerRef);

    return (
        <footer ref={footerRef} className="bg-[#0A0A0E]/85 text-brand-background rounded-t-[4rem] border-t border-white/[0.06] px-6 sm:px-8 pt-16 sm:pt-20 pb-24 md:pb-0 relative overflow-hidden">
            {/* Local gradient wash. The old texture was a multi-megabyte image pulled
                off an external host on every single page load. */}
            <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)' }}
            />

            <div data-reveal-group className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 relative z-10">
                <div className="col-span-1 md:col-span-2">
                    <Link to="/" className="text-3xl font-bold tracking-tight mb-4 block">
                        AIA KINGS
                    </Link>
                    <p className="opacity-70 max-w-sm font-light">
                        I build websites for local service businesses, get them found when customers search and ask AI, make sure every call gets answered, and end every job with a review request. For teams ready for more, I build AI agents that do the work.
                    </p>
                    <a
                        href="mailto:nate@aiautomationkings.com"
                        className="link-underline mt-5 py-2 inline-block text-brand-accent hover:opacity-80 data-text"
                    >
                        nate@aiautomationkings.com
                    </a>
                    <p className="mt-4 opacity-50 text-sm">Houston, Texas.</p>
                </div>

                <div className="flex flex-col items-start gap-2">
                    <span className="font-semibold text-brand-accent tracking-wide text-sm uppercase">What I do</span>
                    <Link to="/marketer" className="link-underline py-1.5 opacity-70 hover:opacity-100">Nate the Marketer</Link>
                    <Link to="/developer" className="link-underline py-1.5 opacity-70 hover:opacity-100">Nate the Dev</Link>
                </div>

                <div className="flex flex-col items-start gap-2">
                    <span className="font-semibold text-brand-accent tracking-wide text-sm uppercase">Company</span>
                    <a href="mailto:nate@aiautomationkings.com" className="link-underline py-1.5 opacity-70 hover:opacity-100">Contact</a>
                </div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto mt-16 pt-8 border-t border-white/10 text-center opacity-40 text-sm data-text">
                &copy; {new Date().getFullYear()} AIA Kings. All Rights Reserved.
            </div>

            {/* The sign-off. A huge, faint wordmark that rises into place as the
                page runs out, and scatters under a mouse (FancyWord). Decoration
                only, hidden from screen readers. */}
            <div aria-hidden="true" className="relative mt-6 select-none pointer-events-none text-center">
                <span data-rise="90" className="drama-text inline-block -mb-[0.14em] text-[22vw] md:text-[16vw] leading-[0.9] whitespace-nowrap pr-[0.1em]">
                    <FancyWord />
                </span>
            </div>
        </footer>
    );
}
