import { useEffect, useRef, useState } from 'react';
import { useCalModal } from '../../context/CalModalContext';
import CTAButton from '../motion/CTAButton';
import { Play } from 'lucide-react';
import SignatureDraw from '../features/SignatureDraw';
import { useInView } from '../../hooks/useInView';
import { prefersReducedMotion } from '../../lib/motion';

// Who builds this. The person behind both doors, right after the doors and
// before the proof: a real photo of me in a tall frame (a slow push-in keeps
// it alive), a few lines in my own voice, and my signature writing itself in.
// The photo is flipped from the original selfie so the sweater reads right.
// A smaller landscape video overlaps the portrait, taped off as coming soon. When
// the video exists, swap the taped box for a <video> with a poster.
// Scroll motion comes from the page's useReveal through the data attributes.

const TAPE = Array.from({ length: 8 }, () => 'Coming soon');

function CautionTape({ className, reverse = false, active = false }) {
    const row = (dupe) => (
        <span className="flex shrink-0" aria-hidden={dupe || undefined}>
            {TAPE.map((t, i) => (
                <span key={i} className="caution-word">{t}<span className="caution-dot">&bull;</span></span>
            ))}
        </span>
    );
    return (
        <div className={`caution-tape ${className}`}>
            <div
                className={`caution-track ${reverse ? 'caution-track-reverse' : ''}`}
                style={{ animationPlayState: active ? 'running' : 'paused' }}
            >
                {row(false)}
                {row(true)}
            </div>
        </div>
    );
}
export default function MeetNate() {
    const { openCalModal } = useCalModal();
    const sigRef = useRef(null);
    const [sign, setSign] = useState(prefersReducedMotion);
    const [mediaRef, mediaInView] = useInView('0px');

    // Sign once on screen; reduced motion shows the finished signature.
    useEffect(() => {
        if (prefersReducedMotion()) return;
        const el = sigRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setSign(true);
                io.disconnect();
            }
        }, { threshold: 0.6 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <section id="meet-nate" className="scroll-mt-24 py-20 sm:py-28 md:py-32 px-5 sm:px-6 md:px-8 bg-[#0A0A0E]/60">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-12 xl:gap-16 items-center">
                <div>
                    <span data-reveal className="block text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-4">
                        Who builds this
                    </span>
                    <h2 data-reveal="lines" className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-7">
                        One builder, <span className="drama-text text-brand-accent">start to finish.</span>
                    </h2>
                    <div className="flex flex-col gap-5 text-white/65 text-base sm:text-lg font-light leading-relaxed">
                        <p data-reveal>
                            I am Nate Mamo, and I am based in Houston. I build the websites, run the AI SEO, and set up the reviews for local service businesses. For teams ready for more, I build the AI agents and the systems that run them.
                        </p>
                        <p data-reveal>
                            I am also co-founder and CTO at Allen AI, building custom AI for law firms, and the lead developer on HealthCo&apos;s AI agent architecture. Same standard of work, brought to your business.
                        </p>
                        <p data-reveal className="text-white text-lg sm:text-xl">
                            When you call, you get me. Not an account manager, not a ticket number.
                        </p>
                    </div>
                    <div data-reveal className="mt-9">
                        <CTAButton size="md" onClick={openCalModal} className="w-full sm:w-auto">
                            Book a Call With Me
                        </CTAButton>
                    </div>
                </div>

                <div ref={sigRef} data-reveal="scale" className="nate-media mx-auto w-full max-w-[760px]">
                    {/* The portrait anchors the layered composition. */}
                    <div data-tilt className="nate-portrait">
                        <picture>
                            <source srcSet="/images/nate-mamo-900.webp" type="image/webp" />
                            <img
                                src="/images/nate-mamo-900.jpg"
                                alt="Nate Mamo, founder of AI Automation Kings"
                                width="900"
                                height="900"
                                loading="lazy"
                                decoding="async"
                                className="slow-zoom absolute inset-0 w-full h-full object-cover"
                                style={{ objectPosition: '50% 35%', animationPlayState: mediaInView ? 'running' : 'paused' }}
                            />
                        </picture>
                        <div aria-hidden="true" className="nate-portrait-shade" />
                        <div className="nate-portrait-caption">
                            <span aria-hidden="true" className="mb-3 block h-px w-6 bg-brand-accent/70" />
                            <p className="text-white font-medium text-sm sm:text-lg tracking-tight">Nate Mamo</p>
                            <p className="mt-1 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-brand-accent/90">Houston, Texas</p>
                        </div>
                    </div>

                    {/* The video floats across the portrait's lower right edge. */}
                    <div className="nate-video-stack">
                        <div
                            ref={mediaRef}
                            role="img"
                            aria-label="A video from Nate, coming soon"
                            className="nate-teaser"
                        >
                            <span aria-hidden="true" className="nate-teaser-label">
                                <span className="h-1 w-1 shrink-0 rounded-full bg-brand-accent" />
                                A minute from me
                            </span>
                            <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
                                <span className="grid place-items-center w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-brand-accent/30 bg-brand-accent/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-brand-accent/80 ml-0.5" strokeWidth={1.25} />
                                </span>
                            </div>
                            <CautionTape className="top-[39%] -rotate-[12deg]" active={mediaInView} />
                            <CautionTape className="top-[59%] rotate-[9deg]" reverse active={mediaInView} />
                        </div>

                        <div aria-hidden="true" className="nate-signature pointer-events-none">
                            <SignatureDraw draw={sign} strokeWidth={20} drawDuration={4.2} className="w-full h-auto" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
