import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, PhoneCall, Zap, Star, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);
import { useCalModal } from '../context/CalModalContext';
import { useQualForm } from '../context/QualFormContext';
import { DEFAULT_VERTICAL } from '../data/verticals';
import VoiceHeroCard from '../components/local/VoiceHeroCard';
import MissedCallCalculator from '../components/local/MissedCallCalculator';
import HeroToasts from '../components/local/HeroToasts';
import TestimonialsCarousel from '../components/sections/TestimonialsCarousel';
import FounderSection from '../components/sections/FounderSection';
import CallAgentAnim from '../components/features/CallAgentAnim';
import SpeedToLeadAnim from '../components/features/SpeedToLeadAnim';
import ReviewAgentAnim from '../components/features/ReviewAgentAnim';

// Headline — static lead, then a rotating accent that cycles the three agents.
const HEAD_LEAD = ['Talk', 'to', 'the', 'agent', 'that'];
const ACCENTS = [
    'answers your phone at 2am.',
    'replies to new leads in 3 seconds.',
    'turns every job into a 5-star review.',
];
// Fixed particle configs (no Math.random in render).
const PARTICLES = [
    { left: '10%', size: 3, dur: 9, delay: 0 },
    { left: '22%', size: 2, dur: 12, delay: 3 },
    { left: '38%', size: 2.5, dur: 10, delay: 1.5 },
    { left: '55%', size: 2, dur: 13, delay: 4 },
    { left: '70%', size: 3, dur: 11, delay: 2 },
    { left: '82%', size: 2, dur: 14, delay: 5 },
    { left: '92%', size: 2.5, dur: 10, delay: 1 },
];

const AGENTS = [
    {
        tag: 'Never miss',
        name: 'The call agent',
        Art: CallAgentAnim,
        icon: PhoneCall,
        desc: 'Answers every call 24/7, books the job on the spot, and texts back anyone who slips through. Nights, weekends, holidays. The calls you miss today stop going to voicemail.',
    },
    {
        tag: 'Never wait',
        name: 'The speed-to-lead agent',
        Art: SpeedToLeadAnim,
        icon: Zap,
        desc: 'The second someone fills out a form or messages you, the agent replies in seconds and drives them to book, while they are still paying attention instead of calling the next name on the list.',
    },
    {
        tag: 'Never miss',
        name: 'The review agent',
        Art: ReviewAgentAnim,
        icon: Star,
        desc: 'The moment an appointment wraps, it asks every customer for a review and sends them straight to Google, so your reviews and your rating climb without anyone on your team chasing them.',
    },
];

export default function MainLandingPage() {
    const heroRef = useRef(null);
    const problemRef = useRef(null);
    const featuresRef = useRef(null);
    const calcRef = useRef(null);
    const ctaRef = useRef(null);
    const phoneTiltRef = useRef(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [vertical, setVertical] = useState(DEFAULT_VERTICAL);
    const [accentIdx, setAccentIdx] = useState(0);
    const { openCalModal } = useCalModal();
    const { openQualForm } = useQualForm();

    useEffect(() => {
        // Hero entrance — word-by-word sweep, then supporting content
        const heroCtx = gsap.context(() => {
            gsap.fromTo('.hero-nav', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 });
            gsap.fromTo('.hero-word', { yPercent: 110 }, { yPercent: 0, duration: 0.45, stagger: 0.06, ease: 'power4.out', delay: 0.5 });
            gsap.fromTo('.hero-word',
                { backgroundSize: '0% 100%' },
                { backgroundSize: '100% 100%', duration: 0.3, stagger: 0.06, ease: 'power3.out', delay: 0.6,
                    onComplete: function () {
                        gsap.to('.hero-word', { backgroundSize: '0% 100%', duration: 0.3, stagger: 0.03, delay: 0.2, ease: 'power3.in' });
                    } });
            gsap.fromTo('.hero-fade', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power4.out', delay: 1.0 });
            gsap.fromTo('.hero-demo', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.6 });
        }, heroRef);

        const scrollCtx = gsap.context(() => {
            gsap.fromTo('.problem-line', { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.3, ease: 'power2.out',
                    scrollTrigger: { trigger: problemRef.current, start: 'top 75%' } });
            gsap.fromTo('.features-header', { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out',
                    scrollTrigger: { trigger: featuresRef.current, start: 'top 75%' } });
            gsap.fromTo('.features-card', { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
                    scrollTrigger: { trigger: featuresRef.current, start: 'top 70%' } });
            gsap.fromTo('.calc-reveal', { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out',
                    scrollTrigger: { trigger: calcRef.current, start: 'top 78%' } });
            gsap.fromTo('.main-cta-text', { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
                    scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' } });
            gsap.fromTo('.main-cta-buttons', { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: ctaRef.current, start: 'top 75%' } });
        });

        return () => { heroCtx.revert(); scrollCtx.revert(); };
    }, []);

    // Rotate the headline accent through the three agents
    useEffect(() => {
        const id = setInterval(() => setAccentIdx((i) => (i + 1) % ACCENTS.length), 3600);
        return () => clearInterval(id);
    }, []);
    useEffect(() => {
        gsap.fromTo('.hero-accent', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' });
    }, [accentIdx]);

    // Ambient life: phone tilt on mouse, breathing blobs, rising gold particles
    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;
        const hero = heroRef.current;
        const phone = phoneTiltRef.current;

        const lifeCtx = gsap.context(() => {
            gsap.to('.hero-blob', {
                scale: 1.18, xPercent: 5, yPercent: -5, duration: 7, ease: 'sine.inOut',
                repeat: -1, yoyo: true, stagger: { each: 1.8, from: 'random' },
            });
            gsap.utils.toArray('.hero-particle').forEach((p, i) => {
                const cfg = PARTICLES[i];
                gsap.timeline({ repeat: -1, delay: cfg.delay })
                    .set(p, { y: 0, opacity: 0 })
                    .to(p, { opacity: 0.55, duration: cfg.dur * 0.25 }, 0)
                    .to(p, { y: -300, duration: cfg.dur, ease: 'none' }, 0)
                    .to(p, { opacity: 0, duration: cfg.dur * 0.3 }, cfg.dur * 0.7);
            });
        }, heroRef);

        let onMove, onLeave;
        if (hero && phone) {
            onMove = (e) => {
                const r = hero.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                gsap.to(phone, { rotateY: x * 10, rotateX: -y * 8, duration: 0.6, ease: 'power2.out', transformPerspective: 1000 });
            };
            onLeave = () => gsap.to(phone, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' });
            hero.addEventListener('mousemove', onMove);
            hero.addEventListener('mouseleave', onLeave);
        }
        return () => {
            lifeCtx.revert();
            if (hero && onMove) { hero.removeEventListener('mousemove', onMove); hero.removeEventListener('mouseleave', onLeave); }
        };
    }, []);

    // "Money walking out the door" — cold glow breathing + split swipe on scroll
    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;
        const ctx = gsap.context(() => {
            gsap.to('.problem-glow-core', { scale: 1.22, opacity: 0.22, duration: 5.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
            gsap.to('.problem-top', { xPercent: -26, ease: 'none', scrollTrigger: { trigger: problemRef.current, start: 'top 65%', end: 'bottom top', scrub: 0.6 } });
            gsap.to('.problem-bottom', { xPercent: 18, ease: 'none', scrollTrigger: { trigger: problemRef.current, start: 'top 65%', end: 'bottom top', scrub: 0.6 } });
        }, problemRef);
        return () => ctx.revert();
    }, []);

    const wordStyle = {
        backgroundImage: 'linear-gradient(90deg, rgba(201,168,76,0.3), rgba(201,168,76,0.3))',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
    };

    return (
        <div className="bg-brand-primary min-h-screen text-brand-background overflow-x-hidden relative">

            {/* 1. HERO — interactive "talk to the agent" */}
            <section ref={heroRef} className="relative min-h-[100dvh] overflow-hidden px-4 sm:px-10 lg:px-12 py-4 sm:py-8">
                {/* atmosphere */}
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 tech-grid opacity-50" />
                    <div className="hero-blob absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full blur-[110px] opacity-[0.12] bg-brand-accent" />
                    <div className="hero-blob absolute top-1/3 -left-32 w-[440px] h-[440px] rounded-full blur-[120px] opacity-[0.08] bg-[#6E5AC8]" />
                    <div className="hero-blob absolute -bottom-40 right-1/4 w-[480px] h-[480px] rounded-full blur-[130px] opacity-[0.07] bg-brand-accent" />
                    {/* rising gold particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {PARTICLES.map((p, i) => (
                            <span key={i} className="hero-particle absolute bottom-16 rounded-full bg-brand-accent" style={{ left: p.left, width: p.size, height: p.size, opacity: 0 }} />
                        ))}
                    </div>
                </div>

                <div className="relative z-10 flex flex-col min-h-[calc(100dvh-2rem)]">
                    {/* Navigation */}
                    <nav className="hero-nav flex items-center justify-between gap-3">
                        <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 pl-4 pr-4 sm:pl-6 sm:pr-7 py-2.5 sm:py-3.5 flex items-center gap-5 lg:gap-8">
                            <Link to="/" className="flex items-center shrink-0">
                                <img src="/favicon.svg" alt="AIAK" className="w-5 h-5 sm:w-7 sm:h-7" />
                                <span className="ml-2 text-white text-base sm:text-xl tracking-wide font-light italic whitespace-nowrap" style={{ fontFamily: '"Playfair Display", serif' }}>AI Automation Kings</span>
                            </Link>
                            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">
                                <Link to="/custom" className="hover:text-white transition-colors duration-200">Custom Builds</Link>
                                <Link to="/blog" className="hover:text-white transition-colors duration-200">Blog</Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <button onClick={openCalModal} className="hidden sm:block bg-white text-gray-900 font-medium text-sm px-6 py-3 rounded-full hover:bg-brand-accent hover:text-brand-primary transition-colors duration-300 whitespace-nowrap">
                                Book a Call
                            </button>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 p-2.5 sm:p-3 text-white transition-colors hover:border-white/25"
                                aria-label="Toggle menu"
                                aria-expanded={mobileMenuOpen}
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                            </button>
                        </div>
                    </nav>

                    {/* Mobile dropdown */}
                    <div className={`md:hidden absolute top-[4.75rem] sm:top-[5.5rem] left-4 right-4 sm:left-10 sm:right-10 z-50 origin-top transition-all duration-300 ${
                        mobileMenuOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'
                    }`}>
                        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex flex-col gap-1 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                            <Link to="/custom" className="text-white/80 hover:text-white text-sm font-medium px-4 py-3 rounded-xl hover:bg-white/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>Custom Builds</Link>
                            <Link to="/blog" className="text-white/80 hover:text-white text-sm font-medium px-4 py-3 rounded-xl hover:bg-white/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
                            <button onClick={() => { setMobileMenuOpen(false); openCalModal(); }} className="bg-white text-gray-900 font-medium text-sm px-6 py-3 rounded-full w-full mt-2 hover:bg-brand-accent transition-colors">
                                Book a Call
                            </button>
                        </div>
                    </div>

                    {/* Hero body — copy left, live demo right */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center max-w-6xl w-full mx-auto py-10 sm:py-14">
                        <div>
                            <span className="hero-fade hero-legible text-brand-accent uppercase tracking-[0.2em] font-mono text-[11px] sm:text-xs mb-4 block">AI Agents for Houston Businesses</span>

                            <h1 className="hero-legible text-[2rem] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.5rem] leading-[1.08] tracking-tight mb-5" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400, fontStyle: 'italic' }}>
                                <span className="flex flex-wrap">
                                    {HEAD_LEAD.map((word, i) => (
                                        <span key={`l${i}`} className="inline-block overflow-hidden mr-[0.25em]">
                                            <span className="hero-word inline-block text-white" style={wordStyle}>{word}</span>
                                        </span>
                                    ))}
                                </span>
                                <span className="relative block mt-1 min-h-[2.4em] sm:min-h-[2.3em]">
                                    <span key={accentIdx} className="hero-accent block text-brand-accent font-semibold">{ACCENTS[accentIdx]}</span>
                                </span>
                            </h1>

                            <p className="hero-fade hero-legible text-white/75 text-base md:text-lg max-w-[500px] leading-relaxed mb-6">
                                Every call answered, every lead worked, every review won, while you run your business. Pick an industry on the right and talk to a live agent right now.
                            </p>

                            <div className="hero-fade flex flex-col sm:flex-row items-start gap-3 mb-6">
                                <button onClick={openCalModal} className="bg-brand-accent text-brand-primary font-semibold text-sm sm:text-base px-7 sm:px-8 py-3.5 sm:py-4 rounded-full hover:scale-[1.03] active:scale-[0.97] transition-transform duration-300 shadow-[0_0_40px_rgba(201,168,76,0.25)]">
                                    Book a Call
                                </button>
                                <button onClick={() => openQualForm('gtm-audit')} className="text-white/60 hover:text-white/90 text-sm font-medium py-3.5 sm:py-4 transition-colors duration-300">
                                    get your free revenue-leak audit &rarr;
                                </button>
                            </div>

                            <div className="hero-fade flex flex-wrap gap-x-5 gap-y-2 text-white/40 text-xs">
                                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-brand-accent" /> Answers in under a second</span>
                                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-brand-accent" /> Books into your calendar</span>
                                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-brand-accent" /> Works nights & weekends</span>
                            </div>
                        </div>

                        {/* Live in-browser voice demo (iPhone) */}
                        <div className="hero-demo relative w-full max-w-[440px] mx-auto lg:ml-auto [perspective:1200px]">
                            <div ref={phoneTiltRef} className="will-change-transform">
                                <VoiceHeroCard vertical={vertical} onSelectVertical={setVertical} />
                            </div>
                            <HeroToasts />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. PROBLEM / AGITATION */}
            <section ref={problemRef} className="py-24 sm:py-32 md:py-40 px-6 md:px-8 relative overflow-hidden bg-[#0A0A0E]">
                {/* cold warning glow */}
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="problem-glow-core absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[900px] h-[520px] rounded-full blur-[150px] opacity-[0.14]" style={{ background: 'radial-gradient(circle, rgba(190,45,45,0.55), transparent 70%)' }} />
                </div>
                <div className="max-w-5xl mx-auto relative z-10 flex flex-col gap-6 sm:gap-8">
                    <p className="problem-line problem-top text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/40 font-light leading-relaxed max-w-3xl will-change-transform">
                        The average local business misses one in four calls, answers new leads hours late, and never asks for the review.
                    </p>
                    <p className="problem-line problem-bottom text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6.5rem] leading-none text-white font-sans tracking-tight mt-4 sm:mt-6 md:mt-8 lg:mt-14 will-change-transform">
                        That's money you already earned, <span className="drama-text text-brand-accent">walking out the door.</span>
                    </p>
                </div>
            </section>

            {/* 3. THE THREE AGENTS */}
            <section ref={featuresRef} className="py-20 sm:py-24 md:py-32 px-6 md:px-8 max-w-7xl mx-auto">
                <div className="mb-12 sm:mb-16 md:mb-20">
                    <h3 className="features-header text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3 sm:mb-4">The three agents</h3>
                    <h4 className="features-header text-3xl sm:text-4xl md:text-5xl font-sans font-light max-w-2xl text-white leading-tight">Every call answered. Every lead worked. Every review won.</h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {AGENTS.map((a) => (
                        <div key={a.name} className="features-card flex flex-col gap-6">
                            <a.Art />
                            <div>
                                <div className="flex items-center gap-2.5 mb-2">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand-accent/10 border border-brand-accent/20">
                                        <a.icon className="w-4 h-4 text-brand-accent" />
                                    </span>
                                    <span className="text-brand-accent font-mono text-xs uppercase tracking-[0.18em]">{a.tag}</span>
                                </div>
                                <h5 className="font-semibold text-xl mb-2 text-white">{a.name}</h5>
                                <p className="text-white/50 text-sm leading-relaxed">{a.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. REVENUE-LEAK CALCULATOR */}
            <section ref={calcRef} className="relative py-16 sm:py-24 px-6 md:px-8 bg-[#0A0A0E] overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute w-[420px] h-[420px] top-10 -left-40 rounded-full blur-[100px] opacity-[0.06] bg-brand-accent" />
                <div className="max-w-5xl mx-auto relative">
                    <div className="calc-reveal text-center mb-10 sm:mb-12">
                        <span className="text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3 block">The cost of voicemail</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight">
                            What are missed calls <span className="drama-text text-brand-accent">costing you?</span>
                        </h2>
                    </div>
                    <div className="calc-reveal">
                        <MissedCallCalculator vertical={vertical} onBook={openCalModal} />
                    </div>
                </div>
            </section>

            {/* 5. PROOF */}
            <TestimonialsCarousel />

            {/* 6. MEET THE FOUNDER */}
            <FounderSection />

            {/* 7. FINAL CTA */}
            <section ref={ctaRef} className="py-24 sm:py-32 md:py-40 px-6 md:px-8 flex justify-center text-center">
                <div className="max-w-3xl flex flex-col items-center">
                    <h2 className="main-cta-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans tracking-tight mb-6 sm:mb-8 text-white">Your phone is ringing right now. <span className="drama-text text-brand-accent">Who's answering?</span></h2>
                    <p className="main-cta-text text-base sm:text-lg md:text-xl text-white/50 font-light mb-10 sm:mb-12 max-w-xl px-4">
                        Put three agents on your calls, your leads, and your reviews. You keep running the business. They make sure nothing slips.
                    </p>
                    <div className="main-cta-buttons flex flex-col sm:flex-row gap-4 items-center">
                        <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-8 sm:px-10 py-4 sm:py-5 rounded-[2.5rem] text-base sm:text-lg font-semibold tracking-wide transition-transform active:scale-[0.97] sm:hover:scale-[1.03] duration-300 shadow-[0_0_40px_rgba(201,168,76,0.3)] min-h-[52px]">
                            <span className="relative z-10">Book a Call</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                        </button>
                        <button onClick={() => openQualForm('gtm-audit')} className="border border-white/20 text-white/80 hover:border-brand-accent/40 hover:text-white px-8 sm:px-10 py-4 sm:py-5 rounded-[2.5rem] text-base sm:text-lg font-medium tracking-wide transition-all active:scale-[0.97] duration-300 min-h-[52px]">
                            Free Revenue-Leak Audit
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
