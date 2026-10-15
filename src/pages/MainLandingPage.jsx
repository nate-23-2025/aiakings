import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import SEOHead from '../components/SEOHead';
import AnswerEngine from '../components/features/AnswerEngine';
import CallCatcher from '../components/features/CallCatcher';
import ReviewLoop from '../components/features/ReviewLoop';
import WhatYouGet from '../components/sections/WhatYouGet';
import heroVideo from '../components/animations/go_to_market.mp4';

const FITS = [
    'You do the work locally, in one city or metro',
    'One more job a week is worth real money to you',
    'Customers find you by searching, not only by referral',
    'Owner operated, or close enough that decisions get made fast',
];

const DOORS = [
    { to: '/developer', q: 'No website?', a: 'I build you one.', who: 'Nate the Dev' },
    { to: '/marketer', q: 'Have a website?', a: 'I get it found.', who: 'Nate the Marketer' },
];

// The three halves of the loop, in the order a customer moves through them.
const STAGES = [
    {
        n: '1',
        title: 'Get found',
        body: 'Your site, your pages, and your Google profile built so Google and AI can actually read you and have a reason to name you. Written for how people ask now, not how they typed a decade ago.',
        Visual: AnswerEngine,
        tab: { to: '/marketer', label: 'Nate the Marketer' },
    },
    {
        n: '2',
        title: 'Answer everything',
        body: 'Getting found is worth nothing if the phone rings while you are under a truck. Every call picked up, every question answered, every job put on the calendar, nights and weekends included.',
        Visual: CallCatcher,
        tab: { to: '/developer', label: 'Nate the Dev' },
    },
    {
        n: '3',
        title: 'Get the review',
        body: 'The job ends and the ask goes out. Every customer, same ask, no filtering and no incentives. Those reviews are what make the next person pick you, and what holds the ranking that got them there.',
        Visual: ReviewLoop,
        tab: { to: '/marketer', label: 'Nate the Marketer' },
    },
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
    const stepsRef = useRef(null);
    const gapRef = useRef(null);
    const loopRef = useRef(null);
    const ctaRef = useRef(null);
    const videoRef = useRef(null);
    const { openCalModal } = useCalModal();

    // The 5MB hero video never touches a phone. Desktop gets it after the page
    // has already painted, and only if the visitor has not asked to save data
    // or reduce motion.
    const [showVideo, setShowVideo] = useState(false);
    useEffect(() => {
        const bigScreen = window.matchMedia('(min-width: 768px)').matches;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const saveData = navigator.connection?.saveData === true;
        if (!bigScreen || reducedMotion || saveData) return;

        const load = () => setShowVideo(true);
        const idle = window.requestIdleCallback
            ? window.requestIdleCallback(load, { timeout: 3000 })
            : setTimeout(load, 1200);
        return () => {
            if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
            else clearTimeout(idle);
        };
    }, []);

    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) return;
        vid.muted = true;
        vid.play().catch(() => {});
    }, [showVideo]);

    // Scroll animations only, and only below the fold. The hero is plain markup
    // that paints with the document, so nothing a visitor needs is behind a
    // timeline or a JS bundle.
    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return;

        const ctxs = [
            gsap.context(() => {
                gsap.from('.gap-line', {
                    y: 30, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out',
                    scrollTrigger: { trigger: gapRef.current, start: 'top 75%' },
                });
            }, gapRef),
            gsap.context(() => {
                gsap.from('.step-card', {
                    y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: { trigger: stepsRef.current, start: 'top 75%' },
                });
            }, stepsRef),
            gsap.context(() => {
                gsap.from('.loop-line', {
                    y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
                    scrollTrigger: { trigger: loopRef.current, start: 'top 75%' },
                });
            }, loopRef),
            gsap.context(() => {
                gsap.from('.main-cta-text', {
                    y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' },
                });
            }, ctaRef),
        ];
        return () => ctxs.forEach((c) => c.revert());
    }, []);

    return (
        <div className="bg-brand-primary min-h-screen text-brand-background overflow-x-hidden">
            <SEOHead
                title="AIA Kings | Websites and AI SEO for Local Service Businesses"
                description="No website? I build one, live in days. Have a website? I get it found on Google and in AI answers. Every call answered and every job ending with a review request. Local service businesses, Houston, Texas."
                canonical="https://aiautomationkings.com/"
                jsonLd={HOME_JSONLD}
            />

            {/* 1. HERO. Everything a visitor needs is here, above the fold, no delay */}
            <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-28 pb-16 md:pt-32 px-5 sm:px-6 md:px-8 overflow-hidden">

                {/* Background. Video is desktop-only and deferred; the gradient stands alone. */}
                <div
                    className="absolute inset-0"
                    style={{ maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%)' }}
                >
                    {showVideo && (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="none"
                                className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
                                src={heroVideo}
                            />
                            <div className="absolute inset-0 bg-brand-primary/40" />
                        </>
                    )}
                </div>

                {/* Aurora glow. Pure CSS, visible immediately, no JS reveal. */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="aurora-blob aurora-blob-1 absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full"
                         style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)', top: '-10%', right: '-5%' }} />
                    <div className="aurora-blob aurora-blob-2 absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full"
                         style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, rgba(100,80,30,0.05) 40%, transparent 70%)', bottom: '5%', left: '-10%' }} />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center">

                    {/* Who this is for */}
                    <p className="text-brand-accent uppercase tracking-[0.2em] font-mono text-[10px] sm:text-xs mb-4 md:mb-6">
                        For local service businesses
                    </p>

                    {/* What I do */}
                    <h1 className="text-[2rem] leading-[1.1] sm:text-4xl md:text-6xl font-sans font-medium tracking-tight text-white mb-3 md:mb-5">
                        Get Found. Answer Everything. Get The Review.
                    </h1>

                    <p className="drama-text text-brand-accent text-3xl sm:text-4xl md:text-6xl leading-[1] mb-5 md:mb-8">
                        Then do it again.
                    </p>

                    <p className="text-white/70 text-base sm:text-lg md:text-xl font-light max-w-2xl mb-8 md:mb-10 leading-relaxed">
                        People stopped scrolling search results. They ask, and something answers with two or three names. I make your business one of them, make sure every call gets picked up, and end every job with a review request.
                    </p>

                    {/* The two doors. The answer to "do you have a website" decides which one. */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl mb-6 text-left">
                        {DOORS.map((door) => (
                            <Link
                                key={door.to}
                                to={door.to}
                                className="group bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-brand-accent/40 rounded-2xl px-5 py-4 transition-colors"
                            >
                                <span className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">{door.q}</span>
                                <span className="flex items-center justify-between gap-3 text-white text-base sm:text-lg font-medium">
                                    {door.a}
                                    <ArrowRight className="w-4 h-4 text-brand-accent shrink-0 transition-transform group-hover:translate-x-1" />
                                </span>
                                <span className="block text-brand-accent/80 text-xs mt-1">{door.who}</span>
                            </Link>
                        ))}
                    </div>

                    <button
                        onClick={openCalModal}
                        className="group relative overflow-hidden bg-brand-accent text-brand-primary px-10 py-4 rounded-[2rem] font-semibold text-base sm:text-lg tracking-wide transition-transform active:scale-[0.97] sm:hover:scale-[1.03] duration-300 shadow-[0_0_30px_rgba(201,168,76,0.25)] min-h-[52px] w-full sm:w-auto"
                    >
                        <span className="relative z-10">Book a Call</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                    </button>

                    <p className="text-white/40 text-xs sm:text-sm mt-4">
                        15 minutes. I will look your business up the way a customer would and tell you what comes back.
                    </p>
                </div>
            </section>

            {/* 2. THE GAP. Why the old playbook stopped working */}
            <section ref={gapRef} className="py-20 sm:py-28 md:py-36 px-5 sm:px-6 md:px-8 bg-[#0A0A0E]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="gap-line text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-light text-white leading-tight mb-8 md:mb-10">
                        There is no <span className="drama-text text-brand-accent">page two</span> anymore.
                    </h2>
                    <p className="gap-line text-lg sm:text-xl md:text-2xl text-white/50 font-light leading-relaxed mb-6">
                        Somebody needs a detailer, a plumber, a roofer. They do not open a map and compare twelve pins. They ask, and they get a short list read back to them.
                    </p>
                    <p className="gap-line text-lg sm:text-xl md:text-2xl text-white/50 font-light leading-relaxed mb-10">
                        If your name is not on that list, the customer never learns you exist. You did not lose to a better operator. You lost to one that got mentioned.
                    </p>
                    <p className="gap-line text-xl sm:text-2xl md:text-3xl text-white font-light leading-relaxed">
                        That is the part most owners have not caught up to yet, and it is the part I work on first.
                    </p>
                </div>
            </section>

            {/* 3. THE LOOP, stage by stage */}
            <section ref={stepsRef} className="py-20 sm:py-28 md:py-36 px-5 sm:px-6 md:px-8 max-w-7xl mx-auto">
                <div className="mb-12 sm:mb-16">
                    <h3 className="text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3 sm:mb-4">How it runs</h3>
                    <h4 className="text-3xl sm:text-4xl md:text-5xl font-sans font-light max-w-2xl text-white leading-tight">
                        Three pieces. They only work together.
                    </h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {STAGES.map((stage) => (
                        <div key={stage.n} className="step-card flex flex-col gap-6">
                            <stage.Visual />
                            <div>
                                <h5 className="font-semibold text-xl mb-2 text-white">{stage.n}. {stage.title}</h5>
                                <p className="text-white/50 text-sm leading-relaxed mb-3">{stage.body}</p>
                                <Link to={stage.tab.to} className="text-brand-accent hover:opacity-80 transition-opacity text-sm font-medium">
                                    {stage.tab.label} &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. WHY IT IS ONE SYSTEM. The actual differentiator */}
            <section ref={loopRef} className="py-20 sm:py-28 md:py-36 px-5 sm:px-6 md:px-8 bg-[#0A0A0E]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="loop-line text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-light text-white leading-tight mb-8 md:mb-10">
                        Most owners buy these <span className="drama-text text-brand-accent">from three different people.</span>
                    </h2>
                    <p className="loop-line text-lg sm:text-xl text-white/50 font-light leading-relaxed mb-6">
                        One person for the website, another for the listings, a call service for the phone, and a review app nobody remembers to turn on.
                    </p>
                    <p className="loop-line text-lg sm:text-xl text-white/50 font-light leading-relaxed mb-10">
                        Each one looks fine on an invoice, and none of them talk to each other.
                    </p>

                    <div className="loop-line flex flex-col gap-4 border-l-2 border-brand-accent/30 pl-6 mb-10">
                        <p className="text-white/80 text-lg sm:text-xl font-light">Getting found is what makes the phone ring.</p>
                        <p className="text-white/80 text-lg sm:text-xl font-light">Answering it is what turns the ring into a job.</p>
                        <p className="text-white/80 text-lg sm:text-xl font-light">The job is what earns the review.</p>
                        <p className="text-brand-accent text-lg sm:text-xl font-light">The reviews are what keep you getting found.</p>
                    </div>

                    <p className="loop-line text-xl sm:text-2xl md:text-3xl text-white font-light leading-relaxed">
                        Run all three and each one feeds the next. Pull one out and the other two go quiet.
                    </p>
                </div>
            </section>

            {/* 5. WHAT YOU GET */}
            <WhatYouGet />

            {/* 6. WHO IT IS FOR. Keeps bad-fit calls off the calendar */}
            <section className="py-20 sm:py-28 md:py-36 px-5 sm:px-6 md:px-8">
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3 sm:mb-4">Who this is for</h3>
                    <h4 className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-10">
                        This works if you have <span className="drama-text text-brand-accent">four things.</span>
                    </h4>
                    <ul className="flex flex-col gap-5">
                        {FITS.map((fit) => (
                            <li key={fit} className="flex items-start gap-4">
                                <Check className="w-5 h-5 text-brand-accent shrink-0 mt-1" strokeWidth={2.5} />
                                <span className="text-white/70 text-base sm:text-lg md:text-xl font-light">{fit}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-white/40 text-sm sm:text-base mt-10 leading-relaxed">
                        If that is not you, say so on the call and I will tell you straight. I would rather lose fifteen minutes than sell you something that will not work.
                    </p>
                </div>
            </section>

            {/* 7. FINAL CTA */}
            <section ref={ctaRef} className="py-20 sm:py-28 md:py-36 px-5 sm:px-6 md:px-8 flex justify-center text-center">
                <div className="max-w-3xl flex flex-col items-center w-full">
                    <h2 className="main-cta-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans tracking-tight mb-6 text-white leading-tight">
                        Someone asked this week. Something answered.
                    </h2>
                    <p className="main-cta-text drama-text text-brand-accent text-3xl sm:text-4xl md:text-5xl leading-[1.1] mb-8">
                        It should have said your name.
                    </p>
                    <p className="main-cta-text text-base sm:text-lg md:text-xl text-white/50 font-light mb-10 max-w-xl">
                        Book fifteen minutes. I will look your business up the way your customers do and show you exactly what comes back.
                    </p>
                    <button
                        onClick={openCalModal}
                        className="main-cta-text group relative overflow-hidden bg-brand-accent text-brand-primary px-10 py-4 sm:py-5 rounded-[2.5rem] text-base sm:text-lg font-semibold tracking-wide transition-transform active:scale-[0.97] sm:hover:scale-[1.03] duration-300 shadow-[0_0_40px_rgba(201,168,76,0.3)] min-h-[52px] w-full sm:w-auto"
                    >
                        <span className="relative z-10">Book a Call</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                    </button>
                    <a href="mailto:nate@aiautomationkings.com" className="main-cta-text text-white/40 hover:text-white/70 text-sm mt-5 transition-colors data-text">
                        or email nate@aiautomationkings.com
                    </a>
                </div>
            </section>
        </div>
    );
}
