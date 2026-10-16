import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { X, ArrowUpRight, Mail } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import { lockScroll, unlockScroll } from '../lib/scrollLock';

// The phone menu: a full-screen overlay that opens as a circle growing from the
// menu button, with big staggered links. Escape or the close button shuts it,
// focus moves in and stays in while it is open, then goes back to the button,
// and the page behind stops scrolling. It closes on its own when the route
// changes (the page transition plays over it). Modeled on "Immersive Full
// Screen Navigation" on 21st.dev, built in CSS (.mm-* in index.css).
const LINKS = [
    { to: '/', label: 'Home', note: 'Two ways I work' },
    { to: '/marketer', label: 'Nate the Marketer', note: 'Website, reviews, AI SEO' },
    { to: '/developer', label: 'Nate the Dev', note: 'AI agents and AI systems' },
];

export default function MobileMenu({ open, onClose, returnFocusTo }) {
    const { pathname } = useLocation();
    const { openCalModal } = useCalModal();
    const panelRef = useRef(null);
    const pathAtOpen = useRef(pathname);

    // Close when the route changes underneath.
    useEffect(() => {
        if (open && pathname !== pathAtOpen.current) onClose();
        if (!open) pathAtOpen.current = pathname;
    }, [pathname, open, onClose]);

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
            <div className="mm-glow" aria-hidden="true" />
            <div className="relative flex items-center justify-between px-6 pt-8">
                <span className="drama-text text-xl text-[#FAF8F5]">AIA KINGS</span>
                <button type="button" onClick={onClose} aria-label="Close menu" className="grid place-items-center w-11 h-11 rounded-full border border-white/15 text-white/80">
                    <X size={18} />
                </button>
            </div>

            <nav className="relative flex-grow flex flex-col justify-center px-6 gap-2">
                {LINKS.map((l, i) => {
                    const active = l.to === '/' ? pathname === '/' : pathname.startsWith(l.to);
                    return (
                        <Link
                            key={l.to}
                            to={l.to}
                            onClick={onClose}
                            className="mm-item group flex items-end justify-between gap-4 border-b border-white/[0.08] py-4"
                            style={{ '--i': i }}
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

            <div className="relative px-6 pb-10 flex flex-col gap-3 mm-item" style={{ '--i': LINKS.length }}>
                <button type="button" onClick={book} className="cta-gold cta-glint relative isolate overflow-hidden w-full rounded-[2rem] bg-brand-accent text-brand-primary py-4 font-semibold text-base">
                    <span aria-hidden="true" className="cta-sheen" />
                    <span className="relative z-10">Book a 15-Minute Call</span>
                </button>
                <a href="mailto:nate@aiautomationkings.com" className="flex items-center justify-center gap-2 text-white/55 text-sm py-2">
                    <Mail size={14} /> nate@aiautomationkings.com
                </a>
            </div>
        </div>,
        document.body,
    );
}
