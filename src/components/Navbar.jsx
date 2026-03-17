import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useCalModal } from '../context/CalModalContext';
import { useQualForm } from '../context/QualFormContext';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [hideNav, setHideNav] = useState(false);
    const navRef = useRef(null);
    const location = useLocation();
    const { openCalModal } = useCalModal();
    const { openQualForm } = useQualForm();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    return (
        <nav
            ref={navRef}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 rounded-[3rem] w-[90%] max-w-5xl transition-all duration-500 text-[#FAF8F5] ${
                hideNav ? 'opacity-0 pointer-events-none translate-y-[-20px]' : 'opacity-100'
            }`}
        >
            <Link to="/" id="navbar-logo" className="text-xl font-bold tracking-tight">
                AIA KINGS
            </Link>

            <div className="hidden md:flex items-center gap-8 font-medium text-sm">
                <Link to="/go-to-market" className={`hover:-translate-y-[1px] transition-transform ${location.pathname === '/go-to-market' ? 'opacity-100' : 'opacity-70'} hover:opacity-100`}>
                    Go-To-Market
                </Link>
                <Link to="/agentic-ai" className={`hover:-translate-y-[1px] transition-transform ${location.pathname === '/agentic-ai' ? 'opacity-100' : 'opacity-70'} hover:opacity-100`}>
                    Agentic AI
                </Link>
                {/* <Link to="/blog" className={`hover:-translate-y-[1px] transition-transform ${location.pathname.startsWith('/blog') ? 'opacity-100' : 'opacity-70'} hover:opacity-100`}>
                    Blog
                </Link> */}
            </div>

            <div className="flex items-center gap-3">
                <button onClick={openQualForm} className="hidden sm:block border border-white/20 text-current px-5 py-2.5 rounded-[2rem] font-medium text-sm transition-all hover:border-[#C9A84C]/40 hover:scale-[1.03] active:scale-95 duration-300">
                    Free Audit
                </button>
                <button onClick={openCalModal} className="group relative overflow-hidden bg-[#C9A84C] text-[#0D0D12] px-6 py-2.5 rounded-[2rem] font-medium text-sm transition-transform hover:scale-[1.03] active:scale-95 duration-300">
                    <span className="relative z-10">Book Call Now</span>
                    <div className="absolute inset-0 bg-[#FAF8F5] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                </button>
            </div>
        </nav>
    );
}
