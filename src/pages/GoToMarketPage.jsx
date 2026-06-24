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
        title: 'Research',
        description: 'I identify your ideal clients using firmographic data, hiring signals, and market triggers. Every prospect is verified and enriched before outreach begins.',
        icon: Crosshair,
    },
    {
        step: '02',
        title: 'Personalize',
        description: 'AI generates one-to-one cold email sequences referencing real data about each prospect. Every message sounds like it came from you.',
        icon: Sparkles,
    },
    {
        step: '03',
        title: 'Convert',
        description: 'Warm leads land on your calendar. Follow-up sequences handle the rest. You show up to meetings with prospects who already want to talk.',
        icon: CalendarCheck,
    },
];

const OUTCOMES = [
    { label: 'Qualified meetings on your calendar', detail: 'Not just leads. Actual conversations with prospects who match your ideal client profile.' },
    { label: 'Zero cold calling on your end', detail: 'AI handles outreach, personalization, and follow-ups. You show up to meetings.' },
    { label: 'System gets smarter over time', detail: 'Every campaign informs the next. Better targeting, better messaging, better results.' },
];

const FEATURES = [
    {
        title: 'Finding Your Ideal Clients',
        description: 'I build targeted prospect lists matched to your ideal client profile. Every contact verified, enriched with company data, and ready for outreach.',
        animation: 'leadgen',
    },
    {
        title: 'Emails That Sound Like You Wrote Them',
        description: 'AI writes personalized cold emails referencing real prospect data. Company news, hiring signals, recent moves. Every message feels one-to-one.',
        animation: 'typewriter',
    },
    {
        title: 'Follow-Ups That Run Themselves',
        description: 'Multi-touch sequences that adapt based on prospect behavior. Opens, clicks, and replies all trigger different follow-up paths automatically.',
        animation: 'scheduler',
    },
    {
        title: 'Emails That Actually Arrive',
        description: 'I manage sender reputation, domain health, and inbox placement so your emails land where they should. Not in spam.',
        animation: 'scanner',
    },
];

export default function GoToMarketPage() {
    const heroRef = useRef(null);
    const howRef = useRef(null);
    const metricsRef = useRef(null);
    const featuresRef = useRef(null);
    const ctaRef = useRef(null);
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

        // Hero scroll-out parallax (desktop only)
        let heroScrollCtx = gsap.context(() => {
            ScrollTrigger.matchMedia({
                '(min-width: 768px)': function() {
                    gsap.to('.gtm-hero-content', {
                        opacity: 0, y: -40,
                        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '+=350', scrub: 1 }
                    });
                    gsap.to('.gtm-hero-bg', {
                        y: 100,
                        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '+=500', scrub: 1.5 }
                    });
                }
            });
        }, heroRef);

        let howCtx = gsap.context(() => {
            gsap.fromTo('.gtm-section-header-how',
                { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
                {
                    clipPath: 'inset(0 0% 0 0)', opacity: 1,
                    duration: 1, stagger: 0.2, ease: 'power4.out',
                    scrollTrigger: { trigger: howRef.current, start: 'top 80%' }
                }
            );
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
            gsap.fromTo('.gtm-section-header-feat',
                { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
                {
                    clipPath: 'inset(0 0% 0 0)', opacity: 1,
                    duration: 1, stagger: 0.2, ease: 'power4.out',
                    scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' }
                }
            );
            gsap.fromTo('.feat-card',
                { y: 60, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out',
                    scrollTrigger: { trigger: featuresRef.current, start: 'top 75%' }
                }
            );
        }, featuresRef);

        // CTA Section Animation
        let ctaCtx = gsap.context(() => {
            gsap.fromTo('.gtm-cta-text',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
                    scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' }
                }
            );
            gsap.fromTo('.gtm-cta-buttons',
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: ctaRef.current, start: 'top 75%' }
                }
            );
        }, ctaRef);

        return () => {
            heroCtx.revert();
            heroScrollCtx.revert();
            howCtx.revert();
            metricsCtx.revert();
            featCtx.revert();
            ctaCtx.revert();
        };
    }, []);

    return (
        <div className="bg-brand-primary min-h-screen text-brand-background overflow-x-hidden">

            {/* 1. HERO */}
            <section ref={heroRef} className="relative h-[100dvh] flex flex-col justify-end pb-24 px-6 sm:px-8 md:px-16 overflow-hidden">
                <div
                    className="gtm-hero-bg absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=3540&auto=format&fit=crop')] bg-cover bg-center opacity-15 mix-blend-luminosity"
                />
                <div className="gtm-hero-bg absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/90 to-transparent" />

                <div className="gtm-hero-content relative z-10 max-w-5xl">
                    <div className="flex items-center gap-4 mb-4 opacity-0 gtm-hero-text">
                        <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                        <span className="text-brand-accent tracking-[0.2em] text-sm font-semibold uppercase">AI Lead Generation</span>
                    </div>
                    <div className="overflow-hidden mb-2">
                        <h1 className="gtm-hero-text text-3xl md:text-5xl lg:text-6xl font-sans font-medium tracking-tight text-white">
                            Qualified Meetings on Your Calendar.
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-12">
                        <h2 className="gtm-hero-text text-5xl md:text-7xl lg:text-[8rem] leading-[0.9] drama-text text-brand-accent py-2">
                            No Guesswork.
                        </h2>
                    </div>

                    <div className="gtm-hero-cta flex flex-col sm:flex-row gap-4">
                        <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-8 py-4 rounded-[2rem] font-semibold tracking-wide transition-transform hover:scale-[1.03] active:scale-[0.97] duration-300 shadow-[0_0_30px_rgba(201,168,76,0.25)] min-h-[48px]">
                            <span className="relative z-10">Book a Call</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                        </button>
                        <button onClick={() => openQualForm('gtm-audit')} className="border border-white/20 text-white/80 hover:border-brand-accent/40 hover:text-white px-8 py-4 rounded-[2rem] font-medium tracking-wide transition-all active:scale-[0.97] duration-300 min-h-[48px]">
                            Get a Free Audit →
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. HOW IT WORKS */}
            <section ref={howRef} className="py-24 sm:py-32 md:py-40 px-6 md:px-8 max-w-7xl mx-auto">
                <div className="mb-16 md:mb-20">
                    <h3 className="gtm-section-header-how text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3 sm:mb-4">How It Works</h3>
                    <h4 className="gtm-section-header-how text-3xl sm:text-4xl md:text-5xl font-sans font-light max-w-2xl text-white leading-tight">
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

            {/* 3. OUTCOMES */}
            <section ref={metricsRef} className="py-20 sm:py-24 px-6 md:px-8 bg-[#0A0A0E]">
                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                    {OUTCOMES.map((o) => (
                        <div key={o.label} className="metric-card py-10 px-8 bg-[#15151A] border border-white/5 rounded-[2rem]">
                            <p className="text-white font-semibold text-base mb-3">{o.label}</p>
                            <p className="text-white/40 text-sm leading-relaxed">{o.detail}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. FEATURE BREAKDOWN */}
            <section ref={featuresRef} className="py-24 sm:py-32 md:py-40 px-6 md:px-8 max-w-7xl mx-auto">
                <div className="mb-16 md:mb-20">
                    <h3 className="gtm-section-header-feat text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3 sm:mb-4">The Full Stack</h3>
                    <h4 className="gtm-section-header-feat text-3xl sm:text-4xl md:text-5xl font-sans font-light max-w-2xl text-white leading-tight">
                        Everything between <span className="drama-text text-brand-accent">first touch</span> and closed deal.
                    </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {FEATURES.map((feat) => (
                        <div key={feat.title} className="feat-card bg-[#15151A] border border-white/5 hover:border-brand-accent/20 rounded-[2rem] p-8 sm:p-10 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(201,168,76,0.08)] transition-all duration-500">
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

            {/* 5. TESTIMONIALS */}
            <TestimonialsCarousel />

            {/* 6. CTA */}
            <section ref={ctaRef} className="py-24 sm:py-32 md:py-40 px-6 md:px-8 flex justify-center text-center bg-[#0A0A0E]">
                <div className="max-w-3xl flex flex-col items-center">
                    <h2 className="gtm-cta-text text-4xl sm:text-5xl md:text-6xl font-sans tracking-tight mb-6 sm:mb-8 text-white">
                        Ready to fill your <span className="drama-text text-brand-accent">calendar?</span>
                    </h2>
                    <p className="gtm-cta-text text-base sm:text-lg text-white/50 font-light mb-10 max-w-xl">
                        Stop relying on referrals. Stop cold calling. I build the client acquisition system that puts qualified prospects on your calendar while you focus on your clients.
                    </p>
                    <div className="gtm-cta-buttons flex flex-col sm:flex-row gap-4 items-center">
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
