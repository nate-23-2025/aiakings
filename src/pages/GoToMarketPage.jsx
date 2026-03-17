import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crosshair, Sparkles, CalendarCheck, Shield } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import { useQualForm } from '../context/QualFormContext';
import LeadGenAnimation from '../components/animations/LeadGenAnimation';
import WorkflowAnimation from '../components/animations/WorkflowAnimation';
import ScannerGrid from '../components/animations/ScannerGrid';
import TelemetryTypewriter from '../components/features/TelemetryTypewriter';
import CursorProtocol from '../components/features/CursorProtocol';
import TestimonialsCarousel from '../components/sections/TestimonialsCarousel';

gsap.registerPlugin(ScrollTrigger);

const HOW_IT_WORKS = [
    {
        step: '01',
        title: 'Target',
        description: 'We identify your ideal B2B prospects using firmographic data, intent signals, and behavioral triggers. No guesswork — just qualified targets.',
        icon: Crosshair,
    },
    {
        step: '02',
        title: 'Personalize',
        description: 'AI generates hyper-personalized cold email sequences tailored to each prospect. Every message feels hand-written at scale.',
        icon: Sparkles,
    },
    {
        step: '03',
        title: 'Convert',
        description: 'Warm leads land directly on your calendar. Automated follow-ups nurture cold replies until they convert.',
        icon: CalendarCheck,
    },
];

const METRICS = [
    { value: '10K+', label: 'Emails / Month', suffix: '' },
    { value: '35%+', label: 'Open Rate', suffix: '' },
    { value: '15+', label: 'Meetings / Month', suffix: '' },
];

const FEATURES = [
    {
        title: 'Prospect Research & List Building',
        description: 'We build laser-targeted prospect lists using LinkedIn, Apollo, and custom scrapers. Every contact verified, enriched, and ready for outreach.',
        animation: 'leadgen',
    },
    {
        title: 'AI-Powered Email Copywriting',
        description: 'Custom-trained AI writes personalized cold emails that reference real prospect data — company news, tech stack, hiring signals, and more.',
        animation: 'typewriter',
    },
    {
        title: 'Automated Follow-Up Sequences',
        description: 'Multi-touch sequences that adapt based on prospect behavior. Opens, clicks, and replies all trigger different follow-up paths.',
        animation: 'scheduler',
    },
    {
        title: 'Deliverability & Domain Warming',
        description: 'We manage sender reputation, domain warming, SPF/DKIM/DMARC, and inbox placement so your emails actually arrive.',
        animation: 'scanner',
    },
];

export default function GoToMarketPage() {
    const heroRef = useRef(null);
    const howRef = useRef(null);
    const metricsRef = useRef(null);
    const featuresRef = useRef(null);
    const { openCalModal } = useCalModal();
    const { openQualForm } = useQualForm();

    useEffect(() => {
        let heroCtx = gsap.context(() => {
            gsap.fromTo('.gtm-hero-text',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
            );
            gsap.fromTo('.gtm-hero-cta',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
            );
        }, heroRef);

        let howCtx = gsap.context(() => {
            gsap.fromTo('.how-step',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out',
                    scrollTrigger: { trigger: howRef.current, start: 'top 75%' }
                }
            );
        }, howRef);

        let metricsCtx = gsap.context(() => {
            gsap.fromTo('.metric-card',
                { y: 40, opacity: 0, scale: 0.95 },
                {
                    y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)',
                    scrollTrigger: { trigger: metricsRef.current, start: 'top 80%' }
                }
            );
        }, metricsRef);

        let featCtx = gsap.context(() => {
            gsap.fromTo('.feat-card',
                { y: 60, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out',
                    scrollTrigger: { trigger: featuresRef.current, start: 'top 75%' }
                }
            );
        }, featuresRef);

        return () => {
            heroCtx.revert();
            howCtx.revert();
            metricsCtx.revert();
            featCtx.revert();
        };
    }, []);

    return (
        <div className="bg-brand-primary min-h-screen text-brand-background overflow-x-hidden">

            {/* 1. HERO */}
            <section ref={heroRef} className="relative h-[100dvh] flex flex-col justify-end pb-24 px-6 sm:px-8 md:px-16 overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=3540&auto=format&fit=crop')] bg-cover bg-center opacity-15 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/90 to-transparent" />

                <div className="relative z-10 max-w-5xl">
                    <div className="flex items-center gap-4 mb-4 opacity-0 gtm-hero-text">
                        <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                        <span className="text-brand-accent tracking-[0.2em] text-sm font-semibold uppercase">Go-To-Market Engine</span>
                    </div>
                    <div className="overflow-hidden mb-2">
                        <h1 className="gtm-hero-text text-3xl md:text-5xl lg:text-6xl font-sans font-medium tracking-tight text-white">
                            10,000 Personalized Emails. Zero Manual Effort.
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-12">
                        <h2 className="gtm-hero-text text-5xl md:text-7xl lg:text-[8rem] leading-[0.9] drama-text text-brand-accent py-2">
                            Every Month.
                        </h2>
                    </div>

                    <div className="gtm-hero-cta flex flex-col sm:flex-row gap-4">
                        <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-8 py-4 rounded-[2rem] font-semibold tracking-wide transition-transform hover:scale-[1.03] active:scale-[0.97] duration-300 shadow-[0_0_30px_rgba(201,168,76,0.25)] min-h-[48px]">
                            <span className="relative z-10">Book Call Now</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                        </button>
                        <button onClick={() => openQualForm('gtm-audit')} className="border border-white/20 text-white/80 hover:border-brand-accent/40 hover:text-white px-8 py-4 rounded-[2rem] font-medium tracking-wide transition-all active:scale-[0.97] duration-300 min-h-[48px]">
                            Get GTM Audit →
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. HOW IT WORKS */}
            <section ref={howRef} className="py-24 sm:py-32 md:py-40 px-6 md:px-8 max-w-7xl mx-auto">
                <div className="mb-16 md:mb-20">
                    <h3 className="text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3 sm:mb-4">How It Works</h3>
                    <h4 className="text-3xl sm:text-4xl md:text-5xl font-sans font-light max-w-2xl text-white leading-tight">
                        Three steps to a <span className="drama-text text-brand-accent">full pipeline.</span>
                    </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {HOW_IT_WORKS.map((step) => {
                        const IconComp = step.icon;
                        return (
                            <div key={step.step} className="how-step bg-[#15151A] border border-white/5 rounded-[2rem] p-8 sm:p-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-brand-accent font-mono text-sm">{step.step}</span>
                                    <div className="w-10 h-10 rounded-full border border-brand-accent/30 flex items-center justify-center">
                                        <IconComp className="w-5 h-5 text-brand-accent" />
                                    </div>
                                </div>
                                <h5 className="text-2xl font-semibold text-white mb-3">{step.title}</h5>
                                <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 3. KEY METRICS */}
            <section ref={metricsRef} className="py-20 sm:py-24 px-6 md:px-8 bg-[#0A0A0E]">
                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                    {METRICS.map((m) => (
                        <div key={m.label} className="metric-card text-center py-12 px-6 bg-[#15151A] border border-white/5 rounded-[2rem]">
                            <p className="text-5xl sm:text-6xl font-bold text-brand-accent mb-3 data-text">{m.value}</p>
                            <p className="text-white/50 text-sm uppercase tracking-wider">{m.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. FEATURE BREAKDOWN */}
            <section ref={featuresRef} className="py-24 sm:py-32 md:py-40 px-6 md:px-8 max-w-7xl mx-auto">
                <div className="mb-16 md:mb-20">
                    <h3 className="text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3 sm:mb-4">The Full Stack</h3>
                    <h4 className="text-3xl sm:text-4xl md:text-5xl font-sans font-light max-w-2xl text-white leading-tight">
                        Everything between <span className="drama-text text-brand-accent">first touch</span> and closed deal.
                    </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {FEATURES.map((feat) => (
                        <div key={feat.title} className="feat-card bg-[#15151A] border border-white/5 rounded-[2rem] p-8 sm:p-10 hover:-translate-y-1 transition-transform duration-500">
                            <div className="w-full h-48 mb-8 rounded-xl overflow-hidden bg-[#0D0D12]">
                                {feat.animation === 'leadgen' && <LeadGenAnimation />}
                                {feat.animation === 'typewriter' && <TelemetryTypewriter />}
                                {feat.animation === 'scheduler' && <CursorProtocol />}
                                {feat.animation === 'scanner' && <ScannerGrid className="w-full h-full" />}
                            </div>
                            <h5 className="text-xl font-semibold text-white mb-3">{feat.title}</h5>
                            <p className="text-white/50 text-sm leading-relaxed">{feat.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. CTA */}
            <section className="py-24 sm:py-32 md:py-40 px-6 md:px-8 flex justify-center text-center bg-[#0A0A0E]">
                <div className="max-w-3xl flex flex-col items-center">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans tracking-tight mb-6 sm:mb-8 text-white">
                        Ready to fill your <span className="drama-text text-brand-accent">pipeline?</span>
                    </h2>
                    <p className="text-base sm:text-lg text-white/50 font-light mb-10 max-w-xl">
                        Stop cold calling. Stop guessing. Let AI find, engage, and book your ideal customers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-10 py-5 rounded-[2.5rem] text-lg font-semibold tracking-wide transition-transform hover:scale-[1.03] active:scale-[0.97] duration-300 shadow-[0_0_40px_rgba(201,168,76,0.3)] min-h-[52px]">
                            <span className="relative z-10">Book Call Now</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                        </button>
                        <button onClick={() => openQualForm('gtm-audit')} className="border border-white/20 text-white/80 hover:border-brand-accent/40 hover:text-white px-10 py-5 rounded-[2.5rem] text-lg font-medium tracking-wide transition-all active:scale-[0.97] duration-300 min-h-[52px]">
                            Request Free Audit
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
