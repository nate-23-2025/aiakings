import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useCalModal } from '../context/CalModalContext';

const TABS = [
    { to: '/marketer', label: 'Nate the Marketer', short: 'Marketer' },
    { to: '/developer', label: 'Nate the Dev', short: 'Dev' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const navRef = useRef(null);
    const location = useLocation();
    const { openCalModal } = useCalModal();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.to(navRef.current, {
                backgroundColor: scrolled ? 'rgba(250, 248, 245, 0.6)' : 'transparent',
                backdropFilter: scrolled ? 'blur(16px)' : 'none',
                border: scrolled ? '1px solid rgba(42, 42, 53, 0.1)' : '1px solid transparent',
                color: scrolled ? 'var(--color-brand-primary)' : '#FAF8F5',
                duration: 0.4,
                ease: 'power2.inOut',
            });
        });
        return () => ctx.revert();
    }, [scrolled]);

    return (
        <nav
            ref={navRef}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-6 px-6 py-3 rounded-[3rem] w-auto md:w-[90%] max-w-5xl text-[#FAF8F5] transition-opacity duration-300 md:opacity-100 md:pointer-events-auto ${
                scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
        >
            <Link to="/" id="navbar-logo" className="text-xl drama-text tracking-tight whitespace-nowrap">
                AIA KINGS
            </Link>

            {/* The two sides of the business. Short labels on a phone so both
                tabs fit next to the logo. */}
            <div className="flex items-center gap-4 md:gap-8 font-medium text-xs sm:text-sm">
                {TABS.map(({ to, label, short }) => (
                    <Link
                        key={to}
                        to={to}
                        className={`hover:-translate-y-[1px] transition-transform whitespace-nowrap ${location.pathname.startsWith(to) ? 'opacity-100 text-brand-accent' : 'opacity-70'} hover:opacity-100`}
                    >
                        <span className="md:hidden">{short}</span>
                        <span className="hidden md:inline">{label}</span>
                    </Link>
                ))}
            </div>

            {/* Desktop only. On a phone the hero button and the sticky bottom bar
                already cover the action, and three gold buttons is noise. */}
            <button
                onClick={openCalModal}
                className="hidden md:block group relative overflow-hidden bg-[#C9A84C] text-[#0D0D12] px-6 py-2.5 rounded-[2rem] font-semibold text-sm transition-transform hover:scale-[1.03] active:scale-95 duration-300 min-h-[44px]"
            >
                <span className="relative z-10">Book a Call</span>
                <div className="absolute inset-0 bg-[#FAF8F5] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
            </button>
        </nav>
    );
}
