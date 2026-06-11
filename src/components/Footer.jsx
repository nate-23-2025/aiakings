import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.footer-content > *',
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out',
                    scrollTrigger: { trigger: footerRef.current, start: 'top 90%' }
                }
            );
        }, footerRef);
        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef} className="bg-brand-primary text-brand-background rounded-t-[4rem] px-8 py-20 mt-32 relative overflow-hidden">
            {/* Background texture matching the Midnight Luxe motif */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2600&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            <div className="footer-content max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                <div className="col-span-1 md:col-span-2">
                    <Link to="/" className="text-3xl font-bold tracking-tight mb-4 block">
                        AIA KINGS
                    </Link>
                    <p className="opacity-70 max-w-sm font-light">
                        Houston's #1 Go-To-Market and Agentic AI Solutions agency. I build AI systems that fill your pipeline and run your operations for qualified businesses.
                    </p>

                    <div className="mt-8 flex items-center gap-3 data-text text-sm opacity-80">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Systems Operational</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <span className="font-semibold text-brand-accent tracking-wide text-sm uppercase">Services</span>
                    <Link to="/go-to-market" className="opacity-70 hover:opacity-100 transition-opacity">Go-To-Market</Link>
                    <Link to="/agentic-ai" className="opacity-70 hover:opacity-100 transition-opacity">Agentic AI</Link>
                </div>

                <div className="flex flex-col gap-4">
                    <span className="font-semibold text-brand-accent tracking-wide text-sm uppercase">Resources</span>
                    <Link to="/blog" className="opacity-70 hover:opacity-100 transition-opacity">Blog</Link>
                    <a href="mailto:nate@aiautomationkings.com" className="opacity-70 hover:opacity-100 transition-opacity data-text">nate@aiautomationkings.com</a>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/10 text-center opacity-40 text-sm data-text">
                &copy; {new Date().getFullYear()} AIA Kings. All Rights Reserved.
            </div>
        </footer>
    );
}
