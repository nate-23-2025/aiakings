import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef(null);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = gsap.context(() => {
            gsap.from('.footer-content > *', {
                y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
                scrollTrigger: { trigger: footerRef.current, start: 'top 90%' },
            });
        }, footerRef);
        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef} className="bg-brand-primary text-brand-background rounded-t-[4rem] px-6 sm:px-8 py-16 sm:py-20 mt-24 relative overflow-hidden">
            {/* Local gradient wash. The old texture was a multi-megabyte image pulled
                off an external host on every single page load. */}
            <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)' }}
            />

            <div className="footer-content max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 relative z-10">
                <div className="col-span-1 md:col-span-2">
                    <Link to="/" className="text-3xl font-bold tracking-tight mb-4 block">
                        AIA KINGS
                    </Link>
                    <p className="opacity-70 max-w-sm font-light">
                        I get local service businesses found when customers ask, make sure every call that comes in gets answered, and end every job with a review request. Then it comes back around.
                    </p>
                    <a
                        href="mailto:nate@aiautomationkings.com"
                        className="mt-6 inline-block text-brand-accent hover:opacity-80 transition-opacity data-text"
                    >
                        nate@aiautomationkings.com
                    </a>
                    <p className="mt-4 opacity-50 text-sm">Houston, Texas.</p>
                </div>

                <div className="flex flex-col gap-4">
                    <span className="font-semibold text-brand-accent tracking-wide text-sm uppercase">What I do</span>
                    <Link to="/ai-seo" className="opacity-70 hover:opacity-100 transition-opacity">AI SEO &amp; Answer Engines</Link>
                    <Link to="/ai-seo" className="opacity-70 hover:opacity-100 transition-opacity">Websites</Link>
                </div>

                <div className="flex flex-col gap-4">
                    <span className="font-semibold text-brand-accent tracking-wide text-sm uppercase">Company</span>
                    <Link to="/blog" className="opacity-70 hover:opacity-100 transition-opacity">Blog</Link>
                    <a href="mailto:nate@aiautomationkings.com" className="opacity-70 hover:opacity-100 transition-opacity">Contact</a>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/10 text-center opacity-40 text-sm data-text">
                &copy; {new Date().getFullYear()} AIA Kings. All Rights Reserved.
            </div>
        </footer>
    );
}
