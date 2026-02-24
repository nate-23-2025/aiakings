import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCalModal } from '../context/CalModalContext';
import DiagnosticShuffler from '../components/features/DiagnosticShuffler';
import TelemetryTypewriter from '../components/features/TelemetryTypewriter';
import CursorProtocol from '../components/features/CursorProtocol';
import ProtocolTimeline from '../components/sections/ProtocolTimeline';
import ServicesShowcase from '../components/sections/ServicesShowcase';

export default function FinancePage() {
    const heroRef = useRef(null);
    const philosophyRef = useRef(null);
    const { openCalModal } = useCalModal();

    useEffect(() => {
        // Hero Entrance Animation — delayed to sync with preloader curtain open (~2s)
        let heroCtx = gsap.context(() => {
            // Aurora blobs fade in — starts as curtain begins splitting
            gsap.fromTo('.aurora-blob',
                { opacity: 0, scale: 0.6 },
                { opacity: 1, scale: 1, duration: 2.5, stagger: 0.3, ease: 'power2.out', delay: 1.6 }
            );
            // Text clip-path wipe reveal — starts as curtain clears
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

        return () => {
            heroCtx.revert();
            philCtx.revert();
        };
    }, []);

    return (
        <div className="bg-brand-primary min-h-screen text-brand-background overflow-x-hidden">

            {/* 1. HERO SECTION */}
            <section ref={heroRef} className="relative h-[100dvh] flex flex-col justify-end pb-24 px-8 md:px-16 overflow-hidden">
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=3540&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/90 to-brand-primary/60 z-0" />

                {/* Aurora glow blobs */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="aurora-blob aurora-blob-1 absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full opacity-0"
                         style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)', top: '-10%', right: '-5%' }} />
                    <div className="aurora-blob aurora-blob-2 absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full opacity-0"
                         style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, rgba(100,80,30,0.05) 40%, transparent 70%)', bottom: '5%', left: '-10%' }} />
                    <div className="aurora-blob aurora-blob-3 absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full opacity-0"
                         style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)', top: '30%', left: '40%' }} />
                </div>

                {/* Hero content */}
                <div className="relative z-10 max-w-5xl pointer-events-none">
                    <div className="mb-2 pointer-events-auto">
                        <h1 className="hero-text text-3xl md:text-5xl lg:text-6xl font-sans font-medium tracking-tight text-white">
                            Precision AI inside the
                        </h1>
                    </div>
                    <div className="mb-12 pointer-events-auto">
                        <h2 className="hero-text hero-accent-glow text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] drama-text text-brand-accent pr-4 py-2">
                            Financial Atelier.
                        </h2>
                    </div>

                    <div className="hero-cta flex flex-wrap gap-6 items-center pointer-events-auto">
                        <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-8 py-4 rounded-[2rem] font-semibold tracking-wide transition-transform hover:scale-[1.03] duration-300 shadow-[0_0_30px_rgba(201,168,76,0.25)]">
                            <span className="relative z-10">Book Call Now</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                        </button>
                        <span className="text-white/60 text-sm max-w-xs font-light">
                            Built exclusively for high-performing CPAs and modern accounting firms.
                        </span>
                    </div>
                </div>
            </section>

            {/* 2. FEATURES - INTERACTIVE ARTIFACTS */}
            <section className="py-32 px-8 max-w-7xl mx-auto">
                <div className="mb-20">
                    <h3 className="text-brand-accent uppercase tracking-[0.2em] font-mono text-sm mb-4">Core Infrastructure</h3>
                    <h4 className="text-4xl md:text-5xl font-sans font-light max-w-2xl text-white">Automating the tedious to elevate the advisory.</h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-6">
                        <DiagnosticShuffler />
                        <div>
                            <h5 className="font-semibold text-xl mb-2 text-white">AI Cold Email Expansion</h5>
                            <p className="text-white/50 text-sm leading-relaxed">Systematic outreach targeting high-net-worth individuals and corporate accounts using behavioral signals.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <TelemetryTypewriter />
                        <div>
                            <h5 className="font-semibold text-xl mb-2 text-white">Client Onboarding Agents</h5>
                            <p className="text-white/50 text-sm leading-relaxed">Autonomous parsing of W2s, 1099s, and financial statements directly into your secure ecosystem.</p>
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
            <section ref={philosophyRef} className="py-40 px-8 relative overflow-hidden bg-[#0A0A0E]">
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=3540&auto=format&fit=crop')] bg-cover bg-center opacity-10 grayscale mix-blend-multiply"
                />
                <div className="max-w-5xl mx-auto relative z-10 flex flex-col gap-8">
                    <div className="overflow-hidden">
                        <p className="philosophy-line text-2xl md:text-3xl text-white/40 font-light leading-relaxed max-w-3xl">
                            Most automation tools provide generic workflows that require endless configuration.
                        </p>
                    </div>
                    <div className="overflow-hidden mt-8 md:mt-16">
                        <p className="philosophy-line text-5xl md:text-7xl lg:text-[7rem] leading-none text-white font-sans tracking-tight">
                            We engineer <span className="drama-text text-brand-accent">bespoke</span> systems.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. PROTOCOL - HORIZONTAL TIMELINE */}
            <ProtocolTimeline />

            {/* 5. SERVICES SHOWCASE */}
            <ServicesShowcase />

            {/* 6. PRICING / CTA PORTAL */}
            <section className="py-40 px-8 flex justify-center text-center">
                <div className="max-w-3xl flex flex-col items-center">
                    <h2 className="text-5xl md:text-7xl font-sans tracking-tight mb-8 text-white">Step into the <span className="drama-text text-brand-accent">future.</span></h2>
                    <p className="text-xl text-white/50 font-light mb-12 max-w-xl">
                        Scale your accounting firm without increasing headcount. Let AI handle the generation and administration.
                    </p>
                    <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-10 py-5 rounded-[2.5rem] text-lg font-semibold tracking-wide transition-transform hover:scale-[1.03] duration-300 shadow-[0_0_40px_rgba(201,168,76,0.3)]">
                        <span className="relative z-10">Book Call Now</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                    </button>
                </div>
            </section>

        </div>
    );
}
