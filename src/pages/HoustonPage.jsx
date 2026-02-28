import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCalModal } from '../context/CalModalContext';
import LeadGenAnimation from '../components/animations/LeadGenAnimation';
import SupportAIAnimation from '../components/animations/SupportAIAnimation';
import FulfillmentAnimation from '../components/animations/FulfillmentAnimation';

gsap.registerPlugin(ScrollTrigger);

export default function HoustonPage() {
    const heroRef = useRef(null);
    const { openCalModal } = useCalModal();

    useEffect(() => {
        let heroCtx = gsap.context(() => {
            gsap.fromTo('.hero-text',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
            );
            gsap.fromTo('.hero-cta',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
            );
        }, heroRef);

        return () => heroCtx.revert();
    }, []);

    return (
        <div className="bg-brand-primary min-h-screen text-brand-background overflow-x-hidden">

            {/* 1. HERO SECTION */}
            <section ref={heroRef} className="relative h-[100dvh] flex flex-col justify-end pb-24 px-8 md:px-16 overflow-hidden">
                {/* Houston/Urban specific background */}
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542861592-7cbdb43c1ee1?q=80&w=3540&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/90 to-transparent" />

                <div className="relative z-10 max-w-5xl">
                    <div className="flex items-center gap-4 mb-4 opacity-0 hero-text">
                        <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                        <span className="text-brand-accent tracking-[0.2em] text-sm font-semibold uppercase">Houston Division</span>
                    </div>
                    <div className="overflow-hidden mb-2">
                        <h1 className="hero-text text-3xl md:text-5xl lg:text-6xl font-sans font-medium tracking-tight text-white">
                            Scaling Houston's Local Economy with
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-12">
                        <h2 className="hero-text text-5xl md:text-7xl lg:text-[8rem] leading-[0.9] drama-text text-brand-accent py-2">
                            Next-Gen AI.
                        </h2>
                    </div>

                    <div className="hero-cta">
                        <button onClick={openCalModal} className="group relative overflow-hidden bg-[#FAF8F5] text-brand-primary px-8 py-4 rounded-[2rem] font-semibold tracking-wide transition-transform hover:scale-[1.03] duration-300">
                            <span className="relative z-10 flex items-center gap-2">Book Call Now</span>
                            <div className="absolute inset-0 bg-brand-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"></div>
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. LOCAL FEATURES */}
            <section className="py-32 px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Static translation of features for the local page to maintain speed but keep aesthetic */}
                    <div className="bg-[#15151A] border border-white/5 rounded-[2rem] p-10 hover:-translate-y-2 transition-transform duration-500 shadow-xl group flex flex-col">
                        <div className="w-full h-64 mb-8 shrink-0">
                            <LeadGenAnimation />
                        </div>
                        <h4 className="text-2xl font-semibold mb-4 text-brand-accent">Lead Generation Engine</h4>
                        <p className="text-white/60 leading-relaxed mb-8 flex-grow">
                            We locate homeowners, local B2B targets, and high-intent local searchers. Cold email outreach running 24/7 without manual effort.
                        </p>
                        <div className="h-1 w-12 bg-white/10 group-hover:bg-brand-accent group-hover:w-full transition-all duration-500 mt-auto" />
                    </div>

                    <div className="bg-[#18181E] border border-brand-accent/20 rounded-[2rem] p-10 hover:-translate-y-2 transition-transform duration-500 shadow-xl group relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl group-hover:bg-brand-accent/10 transition-colors" />
                        <div className="w-full h-64 mb-8 shrink-0 relative z-10">
                            <SupportAIAnimation />
                        </div>
                        <h4 className="text-2xl font-semibold mb-4 text-white relative z-10">Customer Support AI</h4>
                        <p className="text-white/60 leading-relaxed mb-8 relative z-10 flex-grow">
                            Never miss a booking. Custom voice and text agents handle queries, schedule appointments, and qualify leads while you sleep.
                        </p>
                        <div className="h-1 w-12 bg-white/10 group-hover:bg-brand-accent group-hover:w-full transition-all duration-500 mt-auto relative z-10" />
                    </div>

                    <div className="bg-[#1A1A22] border border-brand-accent/40 rounded-[2rem] p-10 hover:-translate-y-2 transition-transform duration-500 shadow-xl group flex flex-col">
                        <div className="w-full h-64 mb-8 shrink-0">
                            <FulfillmentAnimation />
                        </div>
                        <h4 className="text-2xl font-semibold mb-4 text-white">Operational Fulfillment</h4>
                        <p className="text-white/60 leading-relaxed mb-8 flex-grow">
                            Zapier/Make automations tying your CRM, invoicing, and fulfillment together. If it's repetitive, it should be automated.
                        </p>
                        <div className="h-1 w-12 bg-white/10 group-hover:bg-brand-accent group-hover:w-full transition-all duration-500 mt-auto" />
                    </div>

                    <div className="bg-[#15151A] border border-white/5 rounded-[2rem] p-10 hover:-translate-y-2 transition-transform duration-500 shadow-xl group flex flex-col md:col-span-2 lg:col-span-3">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center">
                                <svg className="w-5 h-5 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                                </svg>
                            </div>
                            <h4 className="text-2xl font-semibold text-brand-accent">High-Converting Websites</h4>
                        </div>
                        <p className="text-white/60 leading-relaxed mb-6 max-w-2xl">
                            Your website shouldn't just look good — it should close. We build fast, mobile-first sites engineered to convert visitors into paying customers. No templates, no page builders. Custom-coded for speed, SEO, and results.
                        </p>
                        <div className="h-1 w-12 bg-white/10 group-hover:bg-brand-accent group-hover:w-full transition-all duration-500 mt-auto" />
                    </div>

                </div>
            </section>

            {/* 3. CTA */}
            <section className="py-32 px-8 flex justify-center text-center bg-[#0D0D12]">
                <div className="max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-sans tracking-tight mb-8 text-white">Your Houston competitors are adopting AI. <br /><span className="drama-text text-brand-accent">Are you?</span></h2>
                    <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-10 py-5 rounded-[2.5rem] text-lg font-semibold tracking-wide transition-transform hover:scale-[1.03] duration-300">
                        <span className="relative z-10">Book Call Now</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                    </button>
                </div>
            </section>

        </div>
    );
}
