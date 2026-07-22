import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import { useQualForm } from '../context/QualFormContext';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [hideNav, setHideNav] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navRef = useRef(null);
    const location = useLocation();
    const isHome = location.pathname === '/';
    const { openCalModal } = useCalModal();
    const { openQualForm } = useQualForm();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu whenever the route changes
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const protocolSection = document.getElementById('protocol-timeline');
        if (!protocolSection) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setHideNav(entry.isIntersecting);
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        observer.observe(protocolSection);
        return () => observer.disconnect();
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

    if (isHome) return null;

    return (
        <nav
            ref={navRef}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 rounded-[3rem] w-[90%] max-w-5xl transition-all duration-500 text-[#FAF8F5] ${
                hideNav ? 'opacity-0 pointer-events-none translate-y-[-20px]' : 'opacity-100'
            }`}
        >
            <Link to="/" id="navbar-logo" className="text-xl drama-text tracking-tight">
                AIA KINGS
            </Link>

            <div className="hidden md:flex items-center gap-8 font-medium text-sm">
                <Link to="/" className={`hover:-translate-y-[1px] transition-transform ${location.pathname === '/' ? 'opacity-100' : 'opacity-70'} hover:opacity-100`}>
                    Home
                </Link>
                <Link to="/custom" className={`hover:-translate-y-[1px] transition-transform ${location.pathname === '/custom' ? 'opacity-100' : 'opacity-70'} hover:opacity-100`}>
                    Custom Builds
                </Link>
                <Link to="/blog" className={`hover:-translate-y-[1px] transition-transform ${location.pathname.startsWith('/blog') ? 'opacity-100' : 'opacity-70'} hover:opacity-100`}>
                    Blog
                </Link>
            </div>

            <div className="flex items-center gap-3">
                <button onClick={openQualForm} className="hidden sm:block border border-white/20 text-current px-5 py-2.5 rounded-[2rem] font-medium text-sm transition-all hover:border-[#C9A84C]/40 hover:scale-[1.03] active:scale-95 duration-300">
                    Free Audit
                </button>
                <button onClick={openCalModal} className="group relative overflow-hidden bg-[#C9A84C] text-[#0D0D12] px-5 py-2.5 sm:px-6 rounded-[2rem] font-medium text-sm transition-transform hover:scale-[1.03] active:scale-95 duration-300">
                    <span className="relative z-10">Book Call</span>
                    <div className="absolute inset-0 bg-[#FAF8F5] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                </button>
                {/* Mobile hamburger */}
                <button
                    onClick={() => setMenuOpen(v => !v)}
                    className="md:hidden text-current p-1.5"
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile dropdown menu */}
            <div
                className={`md:hidden absolute top-[calc(100%+0.75rem)] left-0 right-0 origin-top transition-all duration-300 ${
                    menuOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'
                }`}
            >
                <div className="bg-[#15151A]/95 backdrop-blur-xl rounded-[2rem] border border-white/10 p-5 flex flex-col gap-1 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                    <Link to="/" className={`px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${location.pathname === '/' ? 'bg-white/5 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                        Home
                    </Link>
                    <Link to="/custom" className={`px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${location.pathname === '/custom' ? 'bg-white/5 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                        Custom Builds
                    </Link>
                    <Link to="/blog" className={`px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${location.pathname.startsWith('/blog') ? 'bg-white/5 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                        Blog
                    </Link>
                    <button onClick={() => { setMenuOpen(false); openQualForm(); }} className="mt-2 border border-white/15 text-white px-4 py-3 rounded-2xl font-medium text-sm hover:border-brand-accent/40 transition-colors">
                        Free Audit
                    </button>
                </div>
            </div>
        </nav>
    );
}
