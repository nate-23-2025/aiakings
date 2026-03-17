import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Headphones, Database, Workflow, Eye, Search, Cpu, Zap } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import { useQualForm } from '../context/QualFormContext';
import SupportAIAnimation from '../components/animations/SupportAIAnimation';
import BeforeAfterAnimation from '../components/animations/BeforeAfterAnimation';
import FulfillmentAnimation from '../components/animations/FulfillmentAnimation';
import WebsiteConvertAnimation from '../components/animations/WebsiteConvertAnimation';
import TestimonialsCarousel from '../components/sections/TestimonialsCarousel';

gsap.registerPlugin(ScrollTrigger);

const USE_CASES = [
    {
        title: 'Customer Support Agent',
        description: 'Handles inbound queries, qualifies leads, and books meetings 24/7. Custom-trained on your brand voice and FAQ knowledge base.',
        icon: Headphones,
        animation: 'support',
    },
    {
        title: 'Data Processing Agent',
        description: 'Extracts, transforms, and loads data across your entire stack. Replaces hours of manual copy-paste with instant, error-free processing.',
        icon: Database,
        animation: 'beforeafter',
    },
    {
        title: 'Workflow Orchestration Agent',
        description: 'Connects your CRM, invoicing, and fulfillment systems. If a human triggers it, an agent can automate it.',
        icon: Workflow,
        animation: 'fulfillment',
    },
    {
        title: 'Sales Intelligence Agent',
        description: 'Monitors website visitors, identifies high-intent prospects, and triggers personalized outreach before they leave.',
        icon: Eye,
        animation: 'website',
    },
];

const PHASES = [
    {
        step: '01',
        title: 'Discovery',
        description: 'We map your workflows, identify repetitive tasks, and pinpoint where autonomous agents will deliver the highest ROI.',
        icon: Search,
    },
    {
        step: '02',
        title: 'Build & Train',
        description: 'Custom agents are built and trained on your data, brand voice, and operational processes. No generic templates.',
        icon: Cpu,
    },
    {
        step: '03',
        title: 'Deploy & Monitor',
        description: 'Agents go live with real-time dashboards, guardrails, and human-in-the-loop escalation. We monitor and optimize continuously.',
        icon: Zap,
    },
];

export default function AgenticAIPage() {
    const heroRef = useRef(null);
    const useCasesRef = useRef(null);
    const phasesRef = useRef(null);
    const { openCalModal } = useCalModal();
    const { openQualForm } = useQualForm();

    useEffect(() => {
        let heroCtx = gsap.context(() => {
            gsap.fromTo('.ai-hero-text',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
            );
            gsap.fromTo('.ai-hero-cta',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
            );
        }, heroRef);

        let ucCtx = gsap.context(() => {
            gsap.fromTo('.uc-card',
                { y: 60, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: { trigger: useCasesRef.current, start: 'top 75%' }
                }
            );
        }, useCasesRef);

        let phaseCtx = gsap.context(() => {
            gsap.fromTo('.phase-card',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out',
                    scrollTrigger: { trigger: phasesRef.current, start: 'top 75%' }
                }
            );
        }, phasesRef);

        return () => {
            heroCtx.revert();
            ucCtx.revert();
            phaseCtx.revert();
        };
    }, []);

    return (
        <div className="bg-brand-primary min-h-screen text-brand-background overflow-x-hidden">

            {/* 1. HERO */}
            <section ref={heroRef} className="relative h-[100dvh] flex flex-col justify-end pb-24 px-6 sm:px-8 md:px-16 overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=3540&auto=format&fit=crop')] bg-cover bg-center opacity-15 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/90 to-transparent" />

                <div className="relative z-10 max-w-5xl">
                    <div className="flex items-center gap-4 mb-4 opacity-0 ai-hero-text">
                        <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                        <span className="text-brand-accent tracking-[0.2em] text-sm font-semibold uppercase">Agentic AI Solutions</span>
                    </div>
                    <div className="overflow-hidden mb-2">
                        <h1 className="ai-hero-text text-3xl md:text-5xl lg:text-6xl font-sans font-medium tracking-tight text-white">
                            Autonomous AI Agents That Run Your Operations
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-12">
                        <h2 className="ai-hero-text text-5xl md:text-7xl lg:text-[8rem] leading-[0.9] drama-text text-brand-accent py-2">
                            While You Sleep.
                        </h2>
                    </div>

                    <div className="ai-hero-cta flex flex-col sm:flex-row gap-4">
                        <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-8 py-4 rounded-[2rem] font-semibold tracking-wide transition-transform hover:scale-[1.03] active:scale-[0.97] duration-300 shadow-[0_0_30px_rgba(201,168,76,0.25)] min-h-[48px]">
                            <span className="relative z-10">Book Call Now</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                        </button>
                        <button onClick={() => openQualForm('ai-assessment')} className="border border-white/20 text-white/80 hover:border-brand-accent/40 hover:text-white px-8 py-4 rounded-[2rem] font-medium tracking-wide transition-all active:scale-[0.97] duration-300 min-h-[48px]">
                            Get AI Assessment →
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. USE CASES */}
            <section ref={useCasesRef} className="py-24 sm:py-32 md:py-40 px-6 md:px-8 max-w-7xl mx-auto">
                <div className="mb-16 md:mb-20">
                    <h3 className="text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3 sm:mb-4">Use Cases</h3>
                    <h4 className="text-3xl sm:text-4xl md:text-5xl font-sans font-light max-w-2xl text-white leading-tight">
                        Agents that work. <span className="drama-text text-brand-accent">Literally.</span>
                    </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {USE_CASES.map((uc) => {
                        const IconComp = uc.icon;
                        return (
                            <div key={uc.title} className="uc-card bg-[#15151A] border border-white/5 rounded-[2rem] p-8 sm:p-10 hover:-translate-y-1 transition-transform duration-500 group">
                                <div className="w-full h-48 mb-8 rounded-xl overflow-hidden bg-[#0D0D12]">
                                    {uc.animation === 'support' && <SupportAIAnimation />}
                                    {uc.animation === 'beforeafter' && <BeforeAfterAnimation />}
                                    {uc.animation === 'fulfillment' && <FulfillmentAnimation />}
                                    {uc.animation === 'website' && <WebsiteConvertAnimation />}
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full border border-brand-accent/30 flex items-center justify-center">
                                        <IconComp className="w-4 h-4 text-brand-accent" />
                                    </div>
                                    <h5 className="text-xl font-semibold text-white">{uc.title}</h5>
                                </div>
                                <p className="text-white/50 text-sm leading-relaxed">{uc.description}</p>
                                <div className="h-1 w-12 bg-white/10 group-hover:bg-brand-accent group-hover:w-full transition-all duration-500 mt-8" />
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 3. HOW AGENTS WORK */}
            <section ref={phasesRef} className="py-24 sm:py-32 px-6 md:px-8 bg-[#0A0A0E]">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 md:mb-20">
                        <h3 className="text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3 sm:mb-4">Implementation</h3>
                        <h4 className="text-3xl sm:text-4xl md:text-5xl font-sans font-light max-w-2xl text-white leading-tight">
                            From discovery to <span className="drama-text text-brand-accent">deployment</span> in weeks.
                        </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PHASES.map((phase) => {
                            const IconComp = phase.icon;
                            return (
                                <div key={phase.step} className="phase-card bg-[#15151A] border border-white/5 rounded-[2rem] p-8 sm:p-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-brand-accent font-mono text-sm">{phase.step}</span>
                                        <div className="w-10 h-10 rounded-full border border-brand-accent/30 flex items-center justify-center">
                                            <IconComp className="w-5 h-5 text-brand-accent" />
                                        </div>
                                    </div>
                                    <h5 className="text-2xl font-semibold text-white mb-3">{phase.title}</h5>
                                    <p className="text-white/50 text-sm leading-relaxed">{phase.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 5. CTA */}
            <section className="py-24 sm:py-32 md:py-40 px-6 md:px-8 flex justify-center text-center">
                <div className="max-w-3xl flex flex-col items-center">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans tracking-tight mb-6 sm:mb-8 text-white">
                        Stop hiring for tasks <span className="drama-text text-brand-accent">AI can handle.</span>
                    </h2>
                    <p className="text-base sm:text-lg text-white/50 font-light mb-10 max-w-xl">
                        Your next employee doesn't need a salary, benefits, or sleep. Let us build it.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-10 py-5 rounded-[2.5rem] text-lg font-semibold tracking-wide transition-transform hover:scale-[1.03] active:scale-[0.97] duration-300 shadow-[0_0_40px_rgba(201,168,76,0.3)] min-h-[52px]">
                            <span className="relative z-10">Book Call Now</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                        </button>
                        <button onClick={() => openQualForm('ai-assessment')} className="border border-white/20 text-white/80 hover:border-brand-accent/40 hover:text-white px-10 py-5 rounded-[2.5rem] text-lg font-medium tracking-wide transition-all active:scale-[0.97] duration-300 min-h-[52px]">
                            Request AI Assessment
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
