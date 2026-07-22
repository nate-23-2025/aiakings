import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Clock, Calendar, PhoneOutgoing, CheckCircle } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import SEOHead from '../components/SEOHead';
import { VERTICALS, DEFAULT_VERTICAL } from '../data/verticals';
import ExperienceAgent from '../components/local/ExperienceAgent';
import VoiceHeroCard from '../components/local/VoiceHeroCard';
import ActivityTicker from '../components/local/ActivityTicker';
import CallTimeline from '../components/local/CallTimeline';
import ImpactBand from '../components/local/ImpactBand';
import MissedCallCalculator from '../components/local/MissedCallCalculator';
import FaqAccordion from '../components/local/FaqAccordion';
import StickyCta from '../components/local/StickyCta';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
    { n: '01', t: 'I build & train it', d: 'Trained on your services, pricing, and how your team talks. No templates.' },
    { n: '02', t: 'Connect your calendar & line', d: 'It hooks into your booking system and phone number. You review it and go live.' },
    { n: '03', t: 'It runs 24/7', d: 'Answers, books, and follows up on every call — day, night, weekends, holidays.' },
];

const FEATURES = [
    { icon: Phone, t: 'Every call answered', d: 'Picks up in under a second, every time. No hold music, no voicemail, no missed leads.' },
    { icon: Calendar, t: 'Appointments booked', d: 'Checks real availability and books directly into your calendar, then texts a confirmation.' },
    { icon: PhoneOutgoing, t: 'Inbound & outbound', d: 'Answers incoming calls and calls back missed leads, confirms appointments, and follows up.' },
    { icon: Clock, t: 'After-hours coverage', d: "Nights, weekends, holidays. Your competitors lose leads at 7pm. You don't." },
];

// Ambient gold glow for section depth
function Glow({ className = '', variant = '' }) {
    return (
        <div aria-hidden className={`pointer-events-none absolute rounded-full blur-[100px] opacity-[0.07] bg-brand-accent ${variant} ${className}`} />
    );
}

export default function LocalBusinessPage() {
    const [vertical, setVertical] = useState(DEFAULT_VERTICAL);
    const { openCalModal } = useCalModal();

    const rootRef = useRef(null);
    const heroRef = useRef(null);
    const heroVisualRef = useRef(null);
    const calcRef = useRef(null);
    const stepsRef = useRef(null);
    const featRef = useRef(null);
    const faqRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero entrance
            gsap.fromTo('.lb-hero', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.15 });

            // Scroll reveals — rise + slight scale
            const reveal = (ref, sel) => gsap.fromTo(sel,
                { y: 44, opacity: 0, scale: 0.98 },
                { y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out',
                    scrollTrigger: { trigger: ref.current, start: 'top 78%' } });
            reveal(calcRef, '.lb-calc');
            reveal(stepsRef, '.lb-step');
            reveal(featRef, '.lb-feat');
            reveal(faqRef, '.lb-faq');
            reveal(ctaRef, '.lb-cta');

            // Heading underline wipes (batched across the page)
            ScrollTrigger.batch('.lb-underline', {
                start: 'top 88%',
                onEnter: (batch) => gsap.fromTo(batch, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'center', duration: 0.8, ease: 'power3.out', stagger: 0.1 }),
            });

            // Steps connector line draws as you scroll through the section
            gsap.fromTo('.lb-steps-line', { scaleX: 0 }, {
                scaleX: 1, transformOrigin: 'left', ease: 'none',
                scrollTrigger: { trigger: stepsRef.current, start: 'top 70%', end: 'bottom 70%', scrub: 0.6 },
            });

            // Subtle parallax on the hero call-sim card
            if (heroVisualRef.current) {
                gsap.to(heroVisualRef.current, {
                    y: -40, ease: 'none',
                    scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
                });
            }

            // Gentle scrub parallax on ambient glows for depth
            gsap.utils.toArray('.lb-glow-parallax').forEach((el) => {
                gsap.to(el, { yPercent: -30, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
            });
        }, rootRef);
        return () => ctx.revert();
    }, []);

    const cardHover = 'transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent/30 hover:shadow-[0_20px_50px_rgba(201,168,76,0.06)]';

    return (
        <div ref={rootRef} className="bg-brand-primary min-h-screen text-brand-background overflow-x-hidden">
            <SEOHead
                title="AI Receptionist for Local Businesses | AI Automation Kings"
                description="A 24/7 AI receptionist that answers every call in under a second, books appointments, and follows up. Built for med spas, dental, law firms, and Houston service businesses."
            />

            {/* HERO — experience the agent */}
            <section ref={heroRef} className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-6 md:px-8 overflow-hidden">
                {/* atmosphere: drifting aurora + faint tech grid + depth glows */}
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 tech-grid opacity-60" />
                    <div className="aurora-blob-1 absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full blur-[110px] opacity-[0.12] bg-brand-accent" />
                    <div className="aurora-blob-2 absolute top-1/3 -left-32 w-[440px] h-[440px] rounded-full blur-[120px] opacity-[0.09] bg-[#6E5AC8]" />
                    <div className="aurora-blob-3 absolute -bottom-40 right-1/4 w-[480px] h-[480px] rounded-full blur-[130px] opacity-[0.07] bg-brand-accent" />
                </div>
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center relative">
                    {/* Left: copy + selector + experience */}
                    <div>
                        <span className="lb-hero inline-block text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-4">AI Receptionist · Houston</span>
                        <h1 className="lb-hero text-4xl sm:text-5xl lg:text-6xl font-sans font-light text-white leading-[1.05] tracking-tight mb-5">
                            Never miss another call. <span className="drama-text text-brand-accent">Ever.</span>
                        </h1>
                        <p className="lb-hero text-white/55 text-base sm:text-lg leading-relaxed mb-6 max-w-xl">
                            An AI receptionist that answers in under a second, books the appointment, and follows up — 24/7. Built for med spas, and ready for dental, law, and any Houston service business.
                        </p>

                        <div className="lb-hero">
                            <p className="text-white/40 text-xs uppercase tracking-wider font-mono mb-2">Prefer a phone call?</p>
                            <ExperienceAgent onBook={openCalModal} />
                        </div>

                        <div className="lb-hero flex flex-wrap gap-x-5 gap-y-2 mt-6 text-white/40 text-xs">
                            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-brand-accent" /> Answers in &lt;1s</span>
                            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-brand-accent" /> Books into your calendar</span>
                            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-brand-accent" /> Works nights & weekends</span>
                        </div>
                    </div>

                    {/* Right: live in-browser voice demo (Bland-style) */}
                    <div ref={heroVisualRef} className="lb-hero">
                        <VoiceHeroCard vertical={vertical} onSelectVertical={setVertical} />
                    </div>
                </div>
            </section>

            {/* LIVE ACTIVITY TICKER */}
            <ActivityTicker />

            {/* ONE CALL, HANDLED END TO END — scroll-driven value-prop timeline */}
            <CallTimeline />

            {/* IMPACT — animated stats + persona cast */}
            <section className="py-16 sm:py-20 px-6 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <ImpactBand verticals={VERTICALS} selectedId={vertical.id} onSelect={setVertical} />
                </div>
            </section>

            {/* COST OF MISSED CALLS — calculator */}
            <section ref={calcRef} className="relative py-16 sm:py-24 px-6 md:px-8 bg-[#0A0A0E] overflow-hidden">
                <Glow className="lb-glow-parallax w-[420px] h-[420px] top-10 -left-40 float-slow-2" />
                <div className="max-w-5xl mx-auto relative">
                    <div className="lb-calc text-center mb-10 sm:mb-12">
                        <span className="text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3 block">The cost of voicemail</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight">
                            What are missed calls <span className="drama-text text-brand-accent">costing you?</span>
                        </h2>
                        <span className="lb-underline block h-[2px] w-16 bg-brand-accent/60 mx-auto mt-5" style={{ transform: 'scaleX(0)' }} />
                    </div>
                    <div className="lb-calc">
                        <MissedCallCalculator vertical={vertical} onBook={openCalModal} />
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section ref={stepsRef} className="py-16 sm:py-24 px-6 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="lb-step text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight">
                            Live in <span className="drama-text text-brand-accent">days,</span> not months.
                        </h2>
                        <span className="lb-underline block h-[2px] w-16 bg-brand-accent/60 mx-auto mt-5" style={{ transform: 'scaleX(0)' }} />
                    </div>
                    <div className="relative">
                        {/* Connector line (desktop) */}
                        <div className="hidden md:block absolute top-[46px] left-[16%] right-[16%] h-[2px] bg-white/8 rounded-full">
                            <div className="lb-steps-line h-full bg-brand-accent/50 rounded-full" style={{ transform: 'scaleX(0)' }} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
                            {STEPS.map((s) => (
                                <div key={s.n} className={`lb-step bg-[#15151A] border border-white/5 rounded-2xl p-7 ${cardHover}`}>
                                    <span className="relative z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent font-mono text-sm mb-4">{s.n}</span>
                                    <h3 className="text-white font-semibold text-lg mb-2">{s.t}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">{s.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT IT HANDLES */}
            <section ref={featRef} className="py-16 sm:py-24 px-6 md:px-8 bg-[#0A0A0E]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="lb-feat text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight">
                            What it <span className="drama-text text-brand-accent">handles.</span>
                        </h2>
                        <span className="lb-underline block h-[2px] w-16 bg-brand-accent/60 mx-auto mt-5" style={{ transform: 'scaleX(0)' }} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {FEATURES.map((f) => (
                            <div key={f.t} className={`lb-feat group bg-[#15151A] border border-white/5 rounded-2xl p-7 flex gap-5 ${cardHover}`}>
                                <div className="w-11 h-11 shrink-0 rounded-xl bg-brand-accent/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                    <f.icon className="w-5 h-5 text-brand-accent" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-lg mb-1.5">{f.t}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">{f.d}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section ref={faqRef} className="py-16 sm:py-24 px-6 md:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="lb-faq text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight">
                            Questions, <span className="drama-text text-brand-accent">answered.</span>
                        </h2>
                        <span className="lb-underline block h-[2px] w-16 bg-brand-accent/60 mx-auto mt-5" style={{ transform: 'scaleX(0)' }} />
                    </div>
                    <div className="lb-faq">
                        <FaqAccordion />
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section ref={ctaRef} className="relative py-24 sm:py-32 md:py-40 px-6 md:px-8 flex justify-center text-center overflow-hidden">
                <Glow className="lb-glow-parallax w-[600px] h-[600px] bottom-[-200px] left-1/2 -translate-x-1/2 float-slow" />
                <div className="max-w-3xl flex flex-col items-center relative">
                    <h2 className="lb-cta text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans tracking-tight mb-6 sm:mb-8 text-white leading-[1.05]">
                        Stop sending clients to <span className="drama-text text-brand-accent">voicemail.</span>
                    </h2>
                    <p className="lb-cta text-base sm:text-lg md:text-xl text-white/50 font-light mb-10 sm:mb-12 max-w-xl px-4">
                        Every missed call is a missed booking. Let's put an AI receptionist on your line and make sure that never happens again.
                    </p>
                    <div className="lb-cta">
                        <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-8 sm:px-10 py-4 sm:py-5 rounded-[2.5rem] text-base sm:text-lg font-semibold tracking-wide transition-transform active:scale-[0.97] sm:hover:scale-[1.03] duration-300 shadow-[0_0_40px_rgba(201,168,76,0.3)] min-h-[52px]">
                            <span className="relative z-10">Book a Call</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                        </button>
                    </div>
                </div>
            </section>

            <StickyCta onBook={openCalModal} />
        </div>
    );
}
