import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDown } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import { useReveal } from '../hooks/useReveal';
import { playOrWaitForTap, prefersReducedMotion } from '../lib/motion';
import SEOHead from '../components/SEOHead';
import CTAButton from '../components/motion/CTAButton';
import BeamRing from '../components/motion/BeamRing';
import HeroGlow from '../components/motion/HeroGlow';
import HomeDoors from '../components/sections/HomeDoors';
import CinemaJourney from '../components/sections/CinemaJourney';
import MyBuilds from '../components/sections/MyBuilds';
import MeetNate from '../components/sections/MeetNate';
import CallSteps from '../components/sections/CallSteps';
import heroVideo from '../components/animations/go_to_market.mp4';
import heroVideoPhone from '../components/animations/go_to_market-phone.mp4';

// The home page, kept simple: a hero that speaks to both sides, two doors
// with a guide for each (HomeDoors), who builds it (MeetNate), live builds as
// proof, and one last ask.

// The hero's two cards. Each one jumps to the doors with its door chosen.
const ROUTES = [
    { door: 'marketing', q: 'Need more customers?', a: 'Website, reviews, AI SEO', who: 'Nate the Marketer' },
    { door: 'dev', q: 'Need more hours in the day?', a: 'AI agents and AI systems', who: 'Nate the Dev' },
];

const HOME_JSONLD = [
    {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What is answer engine optimization (AEO)?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Answer engine optimization is the work of making a business readable and citable by the tools people now ask instead of scrolling search results, like ChatGPT, Google AI Overviews, and Perplexity. Instead of chasing a keyword ranking, it structures a site, its pages, and its business profile so an engine answering "who should I call for this near me" has clear, current, verifiable information about the business and a reason to name it.',
                },
            },
            {
                '@type': 'Question',
                name: 'How is AEO different from SEO?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Traditional SEO competes for a position in a list of links a person then clicks through. AEO competes to be named inside an answer that gets read back, where there is no page two and usually only two or three businesses mentioned. The technical foundations overlap, but AEO puts far more weight on question-shaped content, structured data an engine can parse, consistency across every place the business is listed, and a live review profile.',
                },
            },
            {
                '@type': 'Question',
                name: 'Why do reviews matter for getting found by AI?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Reviews are one of the few public, constantly refreshed signals about a local business that an answer engine can actually verify. A profile that stopped collecting reviews reads as stale. Ending every finished job with the same review request, asked of every customer without filtering or incentives, keeps that signal current, which is why review collection belongs in the same system as the ranking work rather than in a separate tool.',
                },
            },
            {
                '@type': 'Question',
                name: 'What kind of businesses does AI Automation Kings work with?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Local service businesses that do the work in one city or metro, where a job is worth enough that one more a week matters, and where customers find them by searching rather than only by referral. Typically owner operated. Examples include mobile detailing, plumbing, roofing, lawn and landscaping, and similar trades.',
                },
            },
        ],
    },
];

export default function MainLandingPage() {
    const rootRef = useRef(null);
    const heroRef = useRef(null);
    const videoRef = useRef(null);
    const { openCalModal } = useCalModal();
    const [door, setDoor] = useState(null);

    useReveal(rootRef);

    // The hero video loads once the page has painted, so it never holds up the
    // headline, and never for a visitor who asked to save data or reduce
    // motion. Phones get their own cut: tall, a fraction of the size, and it
    // plays forward then back so the loop never jumps. It stays invisible
    // until it is actually playing, so a phone that will not autoplay shows
    // the plain gradient until the first tap.
    const [heroSrc, setHeroSrc] = useState(null);
    const [heroPlaying, setHeroPlaying] = useState(false);
    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const saveData = navigator.connection?.saveData === true;
        if (reducedMotion || saveData) return;

        const src = window.matchMedia('(min-width: 768px)').matches ? heroVideo : heroVideoPhone;
        const load = () => setHeroSrc(src);
        const idle = window.requestIdleCallback
            ? window.requestIdleCallback(load, { timeout: 3000 })
            : setTimeout(load, 1200);
        return () => {
            if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
            else clearTimeout(idle);
        };
    }, []);

    // Plays while the hero is on screen, pauses once it is scrolled past.
    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) return;
        vid.muted = true;
        let stop = () => {};
        const io = new IntersectionObserver(([entry]) => {
            stop();
            if (entry.isIntersecting) stop = playOrWaitForTap(vid);
            else vid.pause();
        });
        io.observe(heroRef.current);
        return () => {
            io.disconnect();
            stop();
        };
    }, [heroSrc]);

    // The hero paints with the document and its entrance is CSS, so nothing a
    // visitor needs waits on a timeline. What runs here only starts once they
    // scroll: on desktop the hero drifts back as the page moves past it, with
    // the background slower than the words for a little depth.
    useEffect(() => {
        const mm = gsap.matchMedia();
        mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
            const st = { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true };
            gsap.to('[data-hero-content]', { y: 120, opacity: 0.15, scale: 0.97, ease: 'none', scrollTrigger: st });
            gsap.to('[data-hero-bg]', { y: 180, ease: 'none', scrollTrigger: st });
        });
        return () => mm.revert();
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    };

    const openDoor = (which) => (e) => {
        e.preventDefault();
        setDoor(which);
        // Scroll once the chosen guide has rendered, so the target is final.
        requestAnimationFrame(() => requestAnimationFrame(() => scrollTo('doors')));
    };

    const scrollToBuilds = (e) => {
        if (!document.getElementById('builds')) return;
        e.preventDefault();
        scrollTo('builds');
    };

    return (
        <div ref={rootRef} className="seams min-h-screen text-brand-background overflow-x-hidden">
            <SEOHead
                title="AIA Kings | Websites, AI SEO, and AI Agents"
                description="For local service businesses, I build the website, reviews, and AI SEO that get you found and called. For teams ready for more, I build AI agents and AI systems that take the busywork off your plate. Houston, Texas."
                canonical="https://aiautomationkings.com/"
                jsonLd={HOME_JSONLD}
            />

            {/* 1. HERO. Everything a visitor needs is here, above the fold, no delay */}
            <section ref={heroRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-28 pb-16 md:pt-32 px-5 sm:px-6 md:px-8 overflow-hidden">

                {/* Background. The video is deferred; the gradient stands alone until it plays. */}
                <div
                    data-hero-bg
                    className="absolute inset-0"
                    style={{ maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%)' }}
                >
                    {heroSrc && (
                        <>
                            <video
                                ref={videoRef}
                                loop
                                muted
                                playsInline
                                preload="auto"
                                aria-hidden="true"
                                onPlaying={() => setHeroPlaying(true)}
                                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${heroPlaying ? 'opacity-45 md:opacity-30' : 'opacity-0'}`}
                                src={heroSrc}
                            />
                            <div className="absolute inset-0 bg-brand-primary/40" />
                        </>
                    )}
                </div>

                {/* Aurora glow. Pure CSS, visible immediately, no JS reveal. */}
                <div data-hero-bg className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="aurora-blob aurora-blob-1 absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full"
                         style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)', top: '-10%', right: '-5%' }} />
                    <div className="aurora-blob aurora-blob-2 absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full"
                         style={{ background: 'radial-gradient(circle, rgba(91,123,213,0.15) 0%, rgba(91,123,213,0.05) 40%, transparent 70%)', bottom: '5%', left: '-10%' }} />
                </div>

                {/* Cursor light, desktop only */}
                <HeroGlow />

                {/* Entrance is a CSS focus pull. Opacity never starts at zero, so
                    the text counts as painted on the very first frame. */}
                <div data-hero-content className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center">

                    {/* Who this is for */}
                    <p className="focus-in text-brand-accent uppercase tracking-[0.2em] font-mono text-[10px] sm:text-xs mb-4 md:mb-6">
                        Websites, AI SEO, and AI agents
                    </p>

                    {/* What I do, for both sides. Each phrase lights up in turn: the first
                        two are the local owner, the third is the team that wants hours back. */}
                    <h1 className="focus-in text-[2rem] leading-[1.1] sm:text-4xl md:text-6xl font-sans font-medium tracking-tight text-white mb-3 md:mb-5" style={{ '--d': '0.06s' }}>
                        <span className="loop-phrase whitespace-nowrap" style={{ '--i': 0 }}>Get Found.</span>{' '}
                        <span className="loop-phrase whitespace-nowrap" style={{ '--i': 1 }}>Get Booked.</span>{' '}
                        <span className="loop-phrase whitespace-nowrap" style={{ '--i': 2 }}>Get Your Time Back.</span>
                    </h1>

                    <p className="focus-in drama-text text-brand-accent text-3xl sm:text-4xl md:text-6xl leading-[1] mb-5 md:mb-8" style={{ '--d': '0.14s' }}>
                        <span className="gold-gradient-text again-sweep">Then let it run.</span>
                    </p>

                    {/* Not on a phone, where the headline and the button carry the hero. */}
                    <p className="focus-in hidden sm:block text-white/70 text-lg md:text-xl font-light max-w-2xl mb-8 md:mb-10 leading-relaxed" style={{ '--d': '0.22s' }}>
                        For local service businesses, I build the website, the reviews, and the AI SEO that get you found and called. For teams ready for more, I build AI agents that take the busywork off your plate.
                    </p>

                    {/* Two ways in. Each card scrolls to the doors below with that door
                        chosen. Not on a phone: the doors are the next thing they scroll to. */}
                    <div className="focus-in hidden sm:grid grid-cols-2 gap-4 w-full max-w-2xl mb-6 text-left" style={{ '--d': '0.3s' }}>
                        {ROUTES.map((r) => (
                            <a
                                key={r.door}
                                href="#doors"
                                onClick={openDoor(r.door)}
                                data-spotlight
                                className="group relative bg-[#0E0E12]/55 hover:bg-[#0E0E12]/45 backdrop-blur-md border border-white/10 hover:border-brand-accent/40 rounded-2xl px-5 py-4 transition-colors"
                            >
                                <span className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">{r.q}</span>
                                <span className="flex items-center justify-between gap-3 text-white text-base sm:text-lg font-medium">
                                    {r.a}
                                    <ArrowDown className="w-4 h-4 text-brand-accent shrink-0 transition-transform group-hover:translate-y-0.5" />
                                </span>
                                <span className="block text-brand-accent/80 text-xs mt-1">{r.who}</span>
                            </a>
                        ))}
                    </div>

                    <div className="focus-in w-full sm:w-auto" style={{ '--d': '0.38s' }}>
                        <CTAButton onClick={openCalModal} glint className="w-full sm:w-auto">
                            Book a 15-Minute Call
                        </CTAButton>
                    </div>

                    <p className="focus-in text-white/40 text-xs sm:text-sm mt-4" style={{ '--d': '0.44s' }}>
                        Fifteen minutes. If I cannot help, I will tell you straight.
                    </p>

                    {/* Proof before the scroll. Owners trust what they can click. */}
                    <a href="#builds" onClick={scrollToBuilds} className="focus-in mt-6 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-sm text-white/50 hover:text-white transition-colors" style={{ '--d': '0.5s' }}>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent">Recent builds</span>
                        <span>Father &amp; Son&apos;s Detailing</span>
                        <span className="text-white/20">/</span>
                        <span>HealthCo Center</span>
                        <span className="text-white/20">/</span>
                        <span>Rapunzel Salon</span>
                        <span className="bob text-brand-accent">&darr;</span>
                    </a>
                </div>
            </section>

            {/* 2. THE TWO DOORS, each with its guide and who it is for */}
            <HomeDoors door={door} setDoor={setDoor} />
            <CinemaJourney home />

            {/* 3. WHO BUILDS THIS. The person behind both doors */}
            <MeetNate />

            {/* 4. PROOF. Real sites, live */}
            <MyBuilds />

            {/* 5. FINAL CTA */}
            <section className="py-20 sm:py-28 md:py-36 px-5 sm:px-6 md:px-8 flex justify-center text-center bg-[#0A0A0E]/60">
                <div className="relative max-w-4xl w-full flex flex-col items-center rounded-[2.5rem] border border-white/[0.06] bg-[#111116]/70 px-5 py-14 sm:px-12 sm:py-16">
                    <BeamRing />
                    <h2 data-reveal="lines" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans tracking-tight mb-6 text-white leading-tight">
                        Someone asked this week. Something answered.
                    </h2>
                    <p data-reveal className="drama-text text-brand-accent text-3xl sm:text-4xl md:text-5xl leading-[1.1] mb-8">
                        It should have said your name.
                    </p>
                    <CallSteps className="mb-10" />
                    <div data-reveal className="w-full sm:w-auto">
                        <CTAButton onClick={openCalModal} size="xl" halo glint className="w-full sm:w-auto">
                            Book a 15-Minute Call
                        </CTAButton>
                    </div>
                    <a data-reveal href="mailto:nate@aiautomationkings.com" className="link-underline text-white/40 hover:text-white/70 text-sm mt-4 py-2 data-text">
                        or email nate@aiautomationkings.com
                    </a>
                </div>
            </section>
        </div>
    );
}
