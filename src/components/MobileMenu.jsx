import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowUpRight, Mail } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import { lockScroll, unlockScroll } from '../lib/scrollLock';
import { prefersReducedMotion } from '../lib/motion';
import { BUILDS } from '../data/builds';

// The phone menu: a full-screen panel that wipes down over the page like a
// curtain and, on close, keeps going out through the bottom. Behind the wipe
// the header drops in, the links rise one after another, and the live builds
// scale up. Escape or the close button shuts it, focus moves in and stays in
// while it is open, then goes back to the button, and the page behind stops
// scrolling. It closes on its own when the route changes (the page transition
// plays over it). From "Immersive Full Screen Navigation" (hyperiux) on
// 21st.dev, rebuilt with GSAP and the site's own styles (.mm-* in index.css).
const LINKS = [
    { to: '/', label: 'Home', note: 'Two ways I work' },
    { to: '/marketer', label: 'Nate the Marketer', note: 'Website, reviews, AI SEO' },
    { to: '/developer', label: 'Nate the Dev', note: 'AI agents and AI systems' },
];

// Before it opens the panel is clipped to a line along the top, and once it
// has closed, to a line along the bottom, so it always travels downward.
const CLIP_TOP = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)';
const CLIP_OPEN = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
const CLIP_BOTTOM = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)';

export default function MobileMenu({ open, onClose, returnFocusTo }) {
    const { pathname } = useLocation();
    const { openCalModal } = useCalModal();
    const panelRef = useRef(null);
    const contentRef = useRef(null);
    const tlRef = useRef(null);
    const wasOpen = useRef(false);
    const pathAtOpen = useRef(pathname);

    // The build thumbnails only download once someone opens the menu.
    const [opened, setOpened] = useState(false);
    if (open && !opened) setOpened(true);

    // Close when the route changes underneath.
    useEffect(() => {
        if (open && pathname !== pathAtOpen.current) onClose();
        if (!open) pathAtOpen.current = pathname;
    }, [pathname, open, onClose]);

    // The wipe, and everything that comes in behind it.
    useEffect(() => {
        const panel = panelRef.current;
        const content = contentRef.current;
        const q = gsap.utils.selector(panel);
        const reduced = prefersReducedMotion();
        const hide = () => gsap.set(panel, { visibility: 'hidden', clipPath: CLIP_TOP, opacity: 1 });
        tlRef.current?.kill();

        if (open) {
            wasOpen.current = true;
            gsap.set(content, { scale: 1, opacity: 1 });
            if (reduced) {
                gsap.set(q('[data-mm]'), { clearProps: 'transform,opacity' });
                gsap.set(panel, { visibility: 'visible', clipPath: CLIP_OPEN, opacity: 0 });
                tlRef.current = gsap.to(panel, { opacity: 1, duration: 0.2 });
                return;
            }
            tlRef.current = gsap.timeline()
                .set(panel, { visibility: 'visible', clipPath: CLIP_TOP, opacity: 1 })
                .set(q('[data-mm="head"]'), { y: -12, opacity: 0 })
                .set(q('[data-mm="link"]'), { y: 34, opacity: 0 })
                .set(q('[data-mm="shot"]'), { scale: 0.8, opacity: 0 })
                .set(q('[data-mm="foot"]'), { y: 14, opacity: 0 })
                .to(panel, { clipPath: CLIP_OPEN, duration: 0.9, ease: 'power4.inOut' })
                .to(q('[data-mm="head"]'), { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.5)
                .to(q('[data-mm="link"]'), { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.07 }, 0.5)
                .to(q('[data-mm="shot"]'), { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.05 }, 0.65)
                .to(q('[data-mm="foot"]'), { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.06 }, 0.75);
            return;
        }

        // Closed on first render: nothing to animate.
        if (!wasOpen.current) {
            hide();
            return;
        }
        wasOpen.current = false;
        if (reduced) {
            tlRef.current = gsap.to(panel, { opacity: 0, duration: 0.2, onComplete: hide });
            return;
        }
        tlRef.current = gsap.timeline({ onComplete: hide })
            .to(content, { scale: 0.92, opacity: 0.4, duration: 0.6, ease: 'power2.in' })
            .to(panel, { clipPath: CLIP_BOTTOM, duration: 0.8, ease: 'power4.inOut' }, 0);
    }, [open]);

    useEffect(() => () => tlRef.current?.kill(), []);

    useEffect(() => {
        if (!open) return;
        lockScroll('mobile-menu');
        const panel = panelRef.current;
        const focusables = () => Array.from(panel.querySelectorAll('a[href], button'));
        const first = setTimeout(() => focusables()[0]?.focus({ preventScroll: true }), 50);
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key !== 'Tab') return;
            const items = focusables();
            const i = items.indexOf(document.activeElement);
            if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
            else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
        };
        window.addEventListener('keydown', onKey);
        const back = returnFocusTo?.current;
        return () => {
            clearTimeout(first);
            window.removeEventListener('keydown', onKey);
            unlockScroll('mobile-menu');
            back?.focus?.({ preventScroll: true });
        };
    }, [open, onClose, returnFocusTo]);

    const book = () => {
        onClose();
        setTimeout(openCalModal, 250);
    };

    return createPortal(
        <div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            aria-hidden={!open}
            inert={!open || undefined}
            className={`mm md:hidden ${open ? 'is-open' : ''}`}
        >
            <div ref={contentRef} className="mm-content">
                <div className="mm-glow" aria-hidden="true" />

                <div data-mm="head" className="relative flex items-center justify-between px-6 pt-8">
                    <span className="drama-text text-xl text-[#FAF8F5]">AIA KINGS</span>
                    <button type="button" onClick={onClose} aria-label="Close menu" className="grid place-items-center w-11 h-11 rounded-full border border-white/15 text-white/80">
                        <span className="mm-x" aria-hidden="true"><span /><span /></span>
                    </button>
                </div>

                <nav className="relative flex-grow flex flex-col justify-center px-6 py-6 gap-1">
                    {LINKS.map((l) => {
                        const active = l.to === '/' ? pathname === '/' : pathname.startsWith(l.to);
                        return (
                            <Link
                                key={l.to}
                                to={l.to}
                                onClick={onClose}
                                data-mm="link"
                                className="flex items-end justify-between gap-4 border-b border-white/[0.08] py-3.5"
                            >
                                <span>
                                    <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 mb-1">{l.note}</span>
                                    <span className={`block drama-text text-[2.35rem] leading-none ${active ? 'text-brand-accent' : 'text-white'}`}>{l.label}</span>
                                </span>
                                <ArrowUpRight className="w-5 h-5 mb-1 text-brand-accent/80 shrink-0" />
                            </Link>
                        );
                    })}
                </nav>

                {/* Proof in the menu too: the live sites, one tap away */}
                <div className="relative px-6 pb-6">
                    <p data-mm="foot" className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3">Live builds</p>
                    <div className="grid grid-cols-3 gap-2.5">
                        {opened && BUILDS.map((b) => (
                            <a key={b.url} href={b.url} target="_blank" rel="noopener" data-mm="shot" className="mm-shot">
                                <img src={`/work/thumbs/${b.img}.webp`} alt={`${b.name} website`} width="360" height="225" decoding="async" />
                                <span className="mt-1.5 flex items-center gap-1 text-[11px] text-white/60">
                                    {b.short}
                                    <ArrowUpRight size={10} className="text-brand-accent/80" />
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="relative px-6 pb-10 flex flex-col gap-4">
                    <button data-mm="foot" type="button" onClick={book} className="cta-gold cta-glint relative isolate overflow-hidden w-full rounded-[2rem] bg-brand-accent text-brand-primary py-4 font-semibold text-base">
                        <span aria-hidden="true" className="cta-sheen" />
                        <span className="relative z-10">Book a 15-Minute Call</span>
                    </button>
                    <div data-mm="foot" className="flex items-center justify-between gap-3 text-sm text-white/50">
                        <a href="mailto:nate@aiautomationkings.com" className="flex items-center gap-2 py-1">
                            <Mail size={14} /> nate@aiautomationkings.com
                        </a>
                        <span className="text-white/35 whitespace-nowrap">Houston, Texas</span>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
