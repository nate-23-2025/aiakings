import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCalModal } from '../context/CalModalContext';
import CTAButton from './motion/CTAButton';
import MobileMenu from './MobileMenu';

const TABS = [
    { to: '/marketer', label: 'Nate the Marketer' },
    { to: '/developer', label: 'Nate the Dev' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const location = useLocation();
    const { openCalModal } = useCalModal();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuBtnRef = useRef(null);
    const closeMenu = useCallback(() => setMenuOpen(false), []);

    // Dark glass once the page moves. Out of the way while reading down, back
    // the moment the visitor scrolls up looking for it. React bails out when
    // the values have not changed, so this only re-renders on a real flip.
    useEffect(() => {
        let lastY = window.scrollY;
        let raf = 0;
        const update = () => {
            raf = 0;
            const y = window.scrollY;
            setScrolled(y > 50);
            if (Math.abs(y - lastY) > 8) {
                setHidden(y > lastY && y > 160);
                lastY = y;
            }
        };
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return (
        <>
        <nav
            className={`nav-shell fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-6 pl-6 pr-6 md:pr-2 py-2 rounded-[3rem] w-auto md:w-[90%] max-w-5xl text-[#FAF8F5] border border-transparent ${
                scrolled ? 'is-scrolled' : ''
            } ${hidden ? 'is-hidden' : ''}`}
        >
            <Link to="/" id="navbar-logo" className="text-xl drama-text tracking-tight whitespace-nowrap py-2 transition-opacity hover:opacity-80">
                AIA KINGS
            </Link>

            {/* The two sides of the business. On a phone they live in the menu. */}
            <div className="hidden md:flex items-center gap-8 font-medium text-sm">
                {TABS.map(({ to, label }) => {
                    const active = location.pathname.startsWith(to);
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`nav-tab relative whitespace-nowrap transition-opacity duration-300 hover:opacity-100 ${active ? 'is-active opacity-100' : 'opacity-70'}`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>

            {/* Desktop only. On a phone the hero button and the sticky bottom bar
                already cover the action, and three gold buttons is noise. */}
            <CTAButton size="sm" glow={false} onClick={openCalModal} className="hidden md:block">
                Book a Call
            </CTAButton>

            {/* Phone only: opens the full-screen menu */}
            <button
                ref={menuBtnRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="md:hidden flex items-center gap-2.5 -mr-2 pl-3 pr-2 py-1.5 rounded-full text-[#FAF8F5]/85"
            >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Menu</span>
                <span className="mm-burger" aria-hidden="true"><span /><span /></span>
            </button>
        </nav>
        <MobileMenu open={menuOpen} onClose={closeMenu} returnFocusTo={menuBtnRef} />
        </>
    );
}
