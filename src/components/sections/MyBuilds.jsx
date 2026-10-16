import { ArrowUpRight } from 'lucide-react';
import { useCalModal } from '../../context/CalModalContext';
import CTAButton from '../motion/CTAButton';
import { BUILDS } from '../../data/builds';

// Real client sites, live. Each card shows the desktop view in a browser frame
// with the phone view tucked over the corner, because most of their customers
// see the phone one. Screenshots live in public/work and lazy load. On a mouse
// the whole mockup leans toward the cursor, with the phone floating in front.
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

                <div data-reveal-group className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
                    {BUILDS.map((b) => (
                        <a
                            key={b.url}
                            href={b.url}
                            target="_blank"
                            rel="noopener"
                            className="group flex flex-col"
                        >
                            {/* Browser frame with the phone view over the corner */}
                            <div data-tilt className="relative mb-6 pr-6 pb-8 [transform-style:preserve-3d]">
                                <div className="rounded-xl overflow-hidden border border-white/10 bg-[#15151A] shadow-2xl transition-[translate,border-color] duration-500 group-hover:-translate-y-1 group-hover:border-brand-accent/30">
                                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]">
                                        <span className="w-2 h-2 rounded-full bg-white/15" />
                                        <span className="w-2 h-2 rounded-full bg-white/15" />
                                        <span className="w-2 h-2 rounded-full bg-white/15" />
                                        <span className="ml-2 flex-grow truncate rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] text-white/35">
                                            {b.domain}
                                        </span>
                                    </div>
                                    <img
                                        src={`/work/${b.img}.jpg`}
                                        alt={`${b.name} website, desktop view`}
                                        width="1200"
                                        height="750"
                                        loading="lazy"
                                        decoding="async"
                                        className="block w-full aspect-[16/10] object-cover object-top transition-[scale] duration-[1200ms] ease-out group-hover:scale-[1.04]"
                                    />
                                </div>
                                <div
                                    className="absolute right-0 bottom-0 w-[26%] rounded-[1rem] overflow-hidden border-[3px] border-[#2A2A35] bg-black shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-[translate] duration-500 group-hover:-translate-y-3"
                                    style={{ transform: 'translateZ(24px)' }}
                                >
                                    <img
                                        src={`/work/${b.img}-phone.jpg`}
                                        alt={`${b.name} website, phone view`}
                                        width="390"
                                        height="844"
                                        loading="lazy"
                                        decoding="async"
                                        className="block w-full aspect-[390/700] object-cover object-top"
                                    />
                                </div>
                            </div>

                            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">{b.where}</span>
                            <h3 className="flex items-center gap-2 text-white text-xl font-semibold mb-2 group-hover:text-brand-accent transition-colors">
                                {b.name}
                                <ArrowUpRight className="w-4 h-4 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </h3>
                            <p className="text-white/50 text-sm leading-relaxed">{b.line}</p>
                        </a>
                    ))}
                </div>

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
