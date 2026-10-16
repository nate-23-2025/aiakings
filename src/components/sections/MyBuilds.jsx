import { ArrowUpRight } from 'lucide-react';
import { useCalModal } from '../../context/CalModalContext';
import CTAButton from '../motion/CTAButton';
import { BUILDS } from '../../data/builds';
import BuildsGallery from './BuildsGallery';

// Real client sites, live: every screen in one fanned 3D stack (BuildsGallery),
// then each build as a plain link with what it is. Screenshots live in
// public/work and lazy load.
// Scroll motion comes from the page's useReveal through the data attributes.


export default function MyBuilds({ className = '' }) {
    const { openCalModal } = useCalModal();

    return (
        <section id="builds" className={`scroll-mt-24 py-20 sm:py-28 md:py-36 px-5 sm:px-6 md:px-8 ${className}`}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 sm:mb-16">
                    <span data-reveal className="block text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3 sm:mb-4">
                        My builds
                    </span>
                    <h2 data-reveal="lines" className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight max-w-2xl">
                        Live right now. <span className="drama-text text-brand-accent">Go click around.</span>
                    </h2>
                </div>

                <BuildsGallery />

                {/* The same builds as plain links, with what each one is */}
                <ul data-reveal-group className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {BUILDS.map((b) => (
                        <li key={b.url}>
                            <a href={b.url} target="_blank" rel="noopener" className="group block rounded-2xl border border-white/[0.07] bg-[#15151A]/80 px-5 py-4 transition-colors hover:border-brand-accent/35">
                                <span className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1.5">{b.where}</span>
                                <span className="flex items-center gap-2 text-white font-semibold group-hover:text-brand-accent transition-colors">
                                    {b.name}
                                    <ArrowUpRight className="w-4 h-4 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                                <span className="block mt-1.5 text-white/50 text-sm leading-relaxed">{b.line}</span>
                            </a>
                        </li>
                    ))}
                </ul>

                <p data-reveal className="mt-14 sm:mt-16 text-center text-xl sm:text-2xl md:text-3xl font-light text-white">
                    And <span className="drama-text text-brand-accent">many more.</span>
                </p>

                {/* Right after the proof is when a visitor is most sold, so the
                    ask sits here instead of waiting for the bottom of the page. */}
                <div data-reveal className="mt-10 flex flex-col items-center text-center">
                    <CTAButton onClick={openCalModal} className="w-full sm:w-auto">
                        Want One Like These? Book a Call
                    </CTAButton>
                </div>
            </div>
        </section>
    );
}
