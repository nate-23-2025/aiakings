import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Check, ArrowRight } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import { useQualForm } from '../context/QualFormContext';
import DiagnosticShuffler from '../components/features/DiagnosticShuffler';
import TelemetryTypewriter from '../components/features/TelemetryTypewriter';
import CursorProtocol from '../components/features/CursorProtocol';
import ProtocolTimeline from '../components/sections/ProtocolTimeline';
import DashboardMockupAnimation from '../components/animations/DashboardMockupAnimation';
import LeadGenAnimation from '../components/animations/LeadGenAnimation';
import NeuralCore from '../components/animations/NeuralCore';
import TestimonialsCarousel from '../components/sections/TestimonialsCarousel';
import heroVideo from '../components/animations/go_to_market.mp4';

export default function MainLandingPage() {
    const heroRef = useRef(null);
    const videoRef = useRef(null);
    const philosophyRef = useRef(null);
    const servicesRef = useRef(null);
    const { openCalModal } = useCalModal();
    const { openQualForm } = useQualForm();

    // Force video playback on mobile
    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) return;

        const tryPlay = () => vid.play().catch(() => {});
        tryPlay();
        vid.addEventListener('loadeddata', tryPlay);

        // Last resort: play on first user interaction
        const onInteract = () => { tryPlay(); cleanup(); };
        const cleanup = () => {
            document.removeEventListener('touchstart', onInteract);
            document.removeEventListener('click', onInteract);
        };
        document.addEventListener('touchstart', onInteract, { once: true });
        document.addEventListener('click', onInteract, { once: true });

        return () => { vid.removeEventListener('loadeddata', tryPlay); cleanup(); };
    }, []);

    useEffect(() => {
        // Hero Entrance Animation — delayed to sync with preloader curtain open (~2s)
        let heroCtx = gsap.context(() => {
            // Aurora blobs fade in
            gsap.fromTo('.aurora-blob',
                { opacity: 0, scale: 0.6 },
                { opacity: 1, scale: 1, duration: 2.5, stagger: 0.3, ease: 'power2.out', delay: 1.6 }
            );
            // Text clip-path wipe reveal
            gsap.fromTo('.hero-text',
                { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
                { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.4, stagger: 0.25, ease: 'power4.out', delay: 2.0 }
            );
            // CTA rises up
            gsap.fromTo('.hero-cta',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 3.0 }
            );
            // Accent text glow pulse after reveal
            gsap.fromTo('.hero-accent-glow',
                { textShadow: '0 0 0px rgba(201,168,76,0)' },
                { textShadow: '0 0 60px rgba(201,168,76,0.3)', duration: 2, ease: 'power2.out', delay: 3.3 }
            );
            // Benefit bullets fade in + slide up
            gsap.fromTo('.hero-benefits > div',
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power2.out', delay: 2.8 }
            );
            // Visual proof container fades in
            gsap.fromTo('.visual-proof-animation',
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)', delay: 2.5 }
            );
        }, heroRef);

        // Hero Scroll Animation — fade out and parallax effect
        let heroScrollCtx = gsap.context(() => {
            gsap.to('.hero-content-wrapper', {
                opacity: 0,
                scale: 0.95,
                y: -50,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: '+=400',
                    scrub: 1,
                }
            });

            gsap.to('.hero-background', {
                y: 150,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: '+=600',
                    scrub: 1.5,
                }
            });
        }, heroRef);

        // Philosophy Scroll Animation
        let philCtx = gsap.context(() => {
            gsap.fromTo('.philosophy-line',
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, stagger: 0.3, ease: 'power2.out',
                    scrollTrigger: {
                        trigger: philosophyRef.current,
                        start: 'top 75%',
                    }
                }
            );
        }, philosophyRef);

        // Services Overview Animation
        let servCtx = gsap.context(() => {
            gsap.fromTo('.service-card',
                { y: 60, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: servicesRef.current,
                        start: 'top 75%',
                    }
                }
            );
        }, servicesRef);

        return () => {
            heroCtx.revert();
            heroScrollCtx.revert();
            philCtx.revert();
            servCtx.revert();
        };
    }, []);

    return (
        <div className="bg-brand-primary min-h-screen text-brand-background overflow-x-hidden">

            {/* 1. HERO SECTION */}
            <section ref={heroRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 overflow-hidden">

                {/* Video background with inward mask gradient */}
                <div
                    className="hero-background absolute inset-0 will-change-transform"
                    style={{ maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%)' }}
                >
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover opacity-20 sm:opacity-30"
                        src={heroVideo}
                    />
                    <div className="absolute inset-0 bg-brand-primary/40" />
                </div>

                {/* Aurora glow blobs */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="aurora-blob aurora-blob-1 absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full opacity-0"
                         style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)', top: '-10%', right: '-5%' }} />
                    <div className="aurora-blob aurora-blob-2 absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full opacity-0"
                         style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, rgba(100,80,30,0.05) 40%, transparent 70%)', bottom: '5%', left: '-10%' }} />
                    <div className="aurora-blob aurora-blob-3 absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full opacity-0"
                         style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)', top: '30%', left: '40%' }} />
                </div>

                {/* Hero content - centered */}
                <div className="hero-content-wrapper relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center will-change-transform">

                    {/* Micro-headline qualifier */}
                    <p className="hero-text text-brand-accent uppercase tracking-[0.2em] font-mono text-[10px] mb-4 md:mb-6">
                        Houston's #1 Go-To-Market & Agentic AI Agency
                    </p>

                    {/* Main headline */}
                    <h1 className="hero-text text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-sans font-medium tracking-tight text-white mb-4 md:mb-6 leading-[1.1]">
                        We Build the Systems That Fill Your Pipeline
                    </h1>

                    {/* Drama text */}
                    <h2 className="hero-text hero-accent-glow text-4xl sm:text-5xl md:text-7xl lg:text-[9rem] leading-[0.9] drama-text text-brand-accent mb-6 md:mb-10">
                        And Run Themselves.
                    </h2>

                    {/* Benefit bullets */}
                    <div className="hero-benefits flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mb-8 md:mb-12">
                        <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-accent shrink-0" strokeWidth={2.5} />
                            <span className="text-white/70 text-xs md:text-sm">AI-powered outbound 24/7</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-accent shrink-0" strokeWidth={2.5} />
                            <span className="text-white/70 text-xs md:text-sm">Autonomous agent operations</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-accent shrink-0" strokeWidth={2.5} />
                            <span className="text-white/70 text-xs md:text-sm">Zero manual prospecting</span>
                        </div>
                    </div>

                    {/* Dual CTA */}
                    <div className="hero-cta flex flex-col sm:flex-row gap-3 sm:gap-4 items-center mb-4">
                        <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-8 py-4 rounded-[2rem] font-semibold text-sm sm:text-base tracking-wide transition-transform active:scale-[0.97] sm:hover:scale-[1.03] duration-300 shadow-[0_0_30px_rgba(201,168,76,0.25)] min-h-[48px]">
                            <span className="relative z-10">Book Call Now</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                        </button>
                        <button
                            onClick={() => openQualForm('gtm-audit')}
                            className="border border-white/20 text-white/80 hover:border-brand-accent/40 hover:text-white px-8 py-4 rounded-[2rem] font-medium text-sm sm:text-base tracking-wide transition-all active:scale-[0.97] duration-300 min-h-[48px]"
                        >
                            Get Free Audit →
                        </button>
                    </div>

                    {/* Risk reversal */}
                    <p className="text-white/40 text-xs sm:text-sm">
                        No upfront cost. ROI guarantee or you don't pay.
                    </p>

                </div>
            </section>

            {/* 2. FEATURES - INTERACTIVE ARTIFACTS */}
            <section className="py-20 sm:py-24 md:py-32 px-6 md:px-8 max-w-7xl mx-auto">
                <div className="mb-12 sm:mb-16 md:mb-20">
                    <h3 className="text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3 sm:mb-4">Core Systems</h3>
                    <h4 className="text-3xl sm:text-4xl md:text-5xl font-sans font-light max-w-2xl text-white leading-tight">Two engines. One mission: fill your calendar with qualified leads.</h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-6">
                        <DiagnosticShuffler />
                        <div>
                            <h5 className="font-semibold text-xl mb-2 text-white">Go-To-Market Engine</h5>
                            <p className="text-white/50 text-sm leading-relaxed">AI-powered outbound targeting your ideal prospects with hyper-personalized cold email at scale.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <TelemetryTypewriter />
                        <div>
                            <h5 className="font-semibold text-xl mb-2 text-white">Agentic AI Workforce</h5>
                            <p className="text-white/50 text-sm leading-relaxed">Autonomous agents that handle support, data processing, and workflow orchestration without human intervention.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <CursorProtocol />
                        <div>
                            <h5 className="font-semibold text-xl mb-2 text-white">Automated Operations</h5>
                            <p className="text-white/50 text-sm leading-relaxed">From calendar orchestration to follow-up sequences. Let the code handle the administration.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. PHILOSOPHY */}
            <section ref={philosophyRef} className="py-24 sm:py-32 md:py-40 px-6 md:px-8 relative overflow-hidden bg-[#0A0A0E]">
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=3540&auto=format&fit=crop')] bg-cover bg-center opacity-10 grayscale mix-blend-multiply"
                />
                <div className="max-w-5xl mx-auto relative z-10 flex flex-col gap-6 sm:gap-8">
                    <div className="overflow-hidden">
                        <p className="philosophy-line text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/40 font-light leading-relaxed max-w-3xl">
                            Most agencies send spam and call it outreach.
                        </p>
                    </div>
                    <div className="overflow-hidden mt-4 sm:mt-6 md:mt-8 lg:mt-16">
                        <p className="philosophy-line text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[7rem] leading-none text-white font-sans tracking-tight">
                            We engineer <span className="drama-text text-brand-accent">intelligent</span> systems.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. PROTOCOL - HORIZONTAL TIMELINE */}
            <section id="protocol-timeline">
                <ProtocolTimeline />
            </section>

            {/* 5. SERVICES OVERVIEW — Two pillars linking to service pages */}
            <section ref={servicesRef} className="py-24 sm:py-32 md:py-40 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 sm:mb-16 md:mb-20 text-center">
                        <h3 className="text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3 sm:mb-4">What We Build</h3>
                        <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-light text-white leading-tight max-w-3xl mx-auto">
                            Two pillars. <span className="drama-text text-brand-accent">One outcome:</span> growth.
                        </h4>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* GTM Card */}
                        <Link to="/go-to-market" className="service-card group bg-[#15151A] border border-white/5 hover:border-brand-accent/20 rounded-[2rem] p-8 sm:p-10 transition-all duration-500 hover:-translate-y-2 shadow-xl">
                            <div className="w-full h-56 mb-8 rounded-2xl overflow-hidden bg-[#0D0D12]">
                                <LeadGenAnimation />
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-brand-accent uppercase tracking-[0.2em] font-mono text-[10px]">Service 01</span>
                            </div>
                            <h5 className="text-2xl sm:text-3xl font-semibold text-white mb-4">Go-To-Market Engine</h5>
                            <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-8">
                                AI-powered cold email, outbound prospecting, and full-funnel pipeline building. From ICP research to booked meetings — on autopilot.
                            </p>
                            <div className="flex items-center gap-2 text-brand-accent font-medium text-sm group-hover:gap-3 transition-all duration-300">
                                <span>Learn More</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>

                        {/* Agentic AI Card */}
                        <Link to="/agentic-ai" className="service-card group bg-[#15151A] border border-white/5 hover:border-brand-accent/20 rounded-[2rem] p-8 sm:p-10 transition-all duration-500 hover:-translate-y-2 shadow-xl">
                            <div className="w-full h-56 mb-8 rounded-2xl overflow-hidden bg-[#0D0D12] flex items-center justify-center">
                                <NeuralCore />
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-brand-accent uppercase tracking-[0.2em] font-mono text-[10px]">Service 02</span>
                            </div>
                            <h5 className="text-2xl sm:text-3xl font-semibold text-white mb-4">Agentic AI Solutions</h5>
                            <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-8">
                                Custom autonomous AI agents that run your support, process your data, orchestrate workflows, and handle operations — while you sleep.
                            </p>
                            <div className="flex items-center gap-2 text-brand-accent font-medium text-sm group-hover:gap-3 transition-all duration-300">
                                <span>Learn More</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 7. FINAL CTA */}
            <section className="py-24 sm:py-32 md:py-40 px-6 md:px-8 flex justify-center text-center">
                <div className="max-w-3xl flex flex-col items-center">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans tracking-tight mb-6 sm:mb-8 text-white">Your competitors are using AI. <span className="drama-text text-brand-accent">Are you?</span></h2>
                    <p className="text-base sm:text-lg md:text-xl text-white/50 font-light mb-10 sm:mb-12 max-w-xl px-4">
                        Stop prospecting manually. Stop hiring for tasks AI can handle. Let us build the system that scales your business.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-8 sm:px-10 py-4 sm:py-5 rounded-[2.5rem] text-base sm:text-lg font-semibold tracking-wide transition-transform active:scale-[0.97] sm:hover:scale-[1.03] duration-300 shadow-[0_0_40px_rgba(201,168,76,0.3)] min-h-[52px]">
                            <span className="relative z-10">Book Call Now</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                        </button>
                        <button onClick={() => openQualForm('gtm-audit')} className="border border-white/20 text-white/80 hover:border-brand-accent/40 hover:text-white px-8 sm:px-10 py-4 sm:py-5 rounded-[2.5rem] text-base sm:text-lg font-medium tracking-wide transition-all active:scale-[0.97] duration-300 min-h-[52px]">
                            Request Free Audit
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
