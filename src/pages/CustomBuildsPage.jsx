import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bot, Workflow, Boxes, Terminal, ArrowRight } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import SEOHead from '../components/SEOHead';
import ProtocolTimeline from '../components/sections/ProtocolTimeline';

gsap.registerPlugin(ScrollTrigger);

// The bespoke track. The three agents on the homepage are the turnkey product;
// this page is for everything more complex, built to spec with Claude Code.
const BUILDS = [
    { icon: Bot, t: 'Custom AI agents', d: 'Voice, chat, and back-office agents trained on your data, your processes, and the way your team actually talks. Not a template with your logo on it.' },
    { icon: Workflow, t: 'End-to-end automations', d: 'Intake, routing, follow-up, document handling, CRM, billing. The repetitive work that eats your week, running on its own in the background.' },
    { icon: Boxes, t: 'Systems that connect your stack', d: 'Your phone, calendar, CRM, and tools wired into one system that talks to itself, so nothing gets re-keyed and nothing falls through.' },
    { icon: Terminal, t: 'Built with Claude Code', d: 'Real engineering, not no-code duct tape. The same build environment I use as Lead CTO and co-founder of Allen AI, shipping custom AI for law firms.' },
];

function Glow({ className = '' }) {
    return <div aria-hidden className={`pointer-events-none absolute rounded-full blur-[110px] opacity-[0.08] bg-brand-accent ${className}`} />;
}

export default function CustomBuildsPage() {
    const rootRef = useRef(null);
    const heroRef = useRef(null);
    const buildsRef = useRef(null);
    const ctaRef = useRef(null);
    const { openCalModal } = useCalModal();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.cb-hero', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.15 });
            const reveal = (ref, sel) => gsap.fromTo(sel,
                { y: 44, opacity: 0, scale: 0.98 },
                { y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out',
                    scrollTrigger: { trigger: ref.current, start: 'top 78%' } });
            reveal(buildsRef, '.cb-build');
            reveal(ctaRef, '.cb-cta');
        }, rootRef);
        return () => ctx.revert();
    }, []);

    const cardHover = 'transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent/30 hover:shadow-[0_20px_50px_rgba(201,168,76,0.06)]';

    return (
        <div ref={rootRef} className="bg-brand-primary min-h-screen text-brand-background overflow-x-hidden">
            <SEOHead
                title="Custom AI Builds with Claude Code | AI Automation Kings"
                description="Bespoke AI systems built to spec, custom agents, end-to-end automations, and integrations built with Claude Code by Nate Mamo, Lead CTO and co-founder of Allen AI."
            />

            {/* HERO */}
            <section ref={heroRef} className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 px-6 md:px-8 overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 tech-grid opacity-50" />
                    <Glow className="w-[520px] h-[520px] -top-32 -right-24 opacity-[0.12]" />
                    <Glow className="w-[440px] h-[440px] top-1/3 -left-32" />
                </div>
                <div className="max-w-4xl mx-auto relative text-center">
                    <span className="cb-hero inline-block text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-5">Custom builds · By request</span>
                    <h1 className="cb-hero text-4xl sm:text-5xl lg:text-6xl font-sans font-light text-white leading-[1.05] tracking-tight mb-6">
                        When three agents isn't enough, <span className="drama-text text-brand-accent">I build the rest.</span>
                    </h1>
                    <p className="cb-hero text-white/60 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                        The three agents run most local businesses on autopilot. But some operations need more, deeper automations, custom agents, systems wired into your whole stack. That's a custom build, scoped to exactly how you work.
                    </p>
                    <div className="cb-hero flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <button onClick={openCalModal} className="inline-flex items-center gap-2 bg-brand-accent text-brand-primary font-semibold text-sm sm:text-base px-8 py-4 rounded-full hover:scale-[1.03] active:scale-[0.97] transition-transform duration-300 shadow-[0_0_40px_rgba(201,168,76,0.25)]">
                            Book a scoping call <ArrowRight className="w-4 h-4" />
                        </button>
                        <span className="text-white/35 text-sm">Every build starts with a conversation.</span>
                    </div>
                </div>
            </section>

            {/* WHAT I BUILD */}
            <section ref={buildsRef} className="py-16 sm:py-24 px-6 md:px-8 bg-[#0A0A0E]">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-12 sm:mb-16">
                        <span className="cb-build block text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3">What I build</span>
                        <h2 className="cb-build text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight max-w-2xl">
                            Custom systems that run themselves.
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {BUILDS.map((b) => (
                            <div key={b.t} className={`cb-build group bg-[#15151A] border border-white/5 rounded-2xl p-7 flex gap-5 ${cardHover}`}>
                                <div className="w-11 h-11 shrink-0 rounded-xl bg-brand-accent/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                    <b.icon className="w-5 h-5 text-brand-accent" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-lg mb-1.5">{b.t}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">{b.d}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS — 3-phase build/train/deploy */}
            <section id="protocol-timeline">
                <ProtocolTimeline />
            </section>

            {/* FINAL CTA */}
            <section ref={ctaRef} className="relative py-24 sm:py-32 md:py-40 px-6 md:px-8 flex justify-center text-center overflow-hidden">
                <Glow className="w-[600px] h-[600px] bottom-[-200px] left-1/2 -translate-x-1/2" />
                <div className="max-w-3xl flex flex-col items-center relative">
                    <h2 className="cb-cta text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans tracking-tight mb-6 sm:mb-8 text-white leading-[1.05]">
                        Have something specific in mind?
                    </h2>
                    <p className="cb-cta text-base sm:text-lg md:text-xl text-white/50 font-light mb-10 sm:mb-12 max-w-xl px-4">
                        Tell me what's slowing your business down. If it can be automated, I'll show you how, and build it to spec.
                    </p>
                    <div className="cb-cta">
                        <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-8 sm:px-10 py-4 sm:py-5 rounded-[2.5rem] text-base sm:text-lg font-semibold tracking-wide transition-transform active:scale-[0.97] sm:hover:scale-[1.03] duration-300 shadow-[0_0_40px_rgba(201,168,76,0.3)] min-h-[52px]">
                            <span className="relative z-10">Book a Scoping Call</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
