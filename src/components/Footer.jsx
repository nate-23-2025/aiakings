import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

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
                        className="link-underline mt-6 inline-block text-brand-accent hover:opacity-80 data-text"
                    >
                        nate@aiautomationkings.com
                    </a>
                    <p className="mt-4 opacity-50 text-sm">Houston, Texas.</p>
                </div>

                <div className="flex flex-col items-start gap-4">
                    <span className="font-semibold text-brand-accent tracking-wide text-sm uppercase">What I do</span>
                    <Link to="/marketer" className="link-underline opacity-70 hover:opacity-100">Nate the Marketer</Link>
                    <Link to="/developer" className="link-underline opacity-70 hover:opacity-100">Nate the Dev</Link>
                </div>

                <div className="flex flex-col items-start gap-4">
                    <span className="font-semibold text-brand-accent tracking-wide text-sm uppercase">Company</span>
                    <a href="mailto:nate@aiautomationkings.com" className="link-underline opacity-70 hover:opacity-100">Contact</a>
                </div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto mt-16 pt-8 border-t border-white/10 text-center opacity-40 text-sm data-text">
                &copy; {new Date().getFullYear()} AIA Kings. All Rights Reserved.
            </div>

            {/* The sign-off. A huge, faint wordmark that rises into place as the
                page runs out. Decoration only, hidden from screen readers. */}
            <div aria-hidden="true" className="relative mt-6 select-none pointer-events-none text-center">
                <span data-rise="90" className="drama-text inline-block -mb-[0.14em] text-[22vw] md:text-[16vw] leading-[0.9] whitespace-nowrap bg-gradient-to-b from-brand-accent/20 to-brand-accent/0 bg-clip-text text-transparent pr-[0.1em]">
                    AIA Kings
                </span>
            </div>
        </footer>
    );
}
