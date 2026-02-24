import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Network, Search, Zap } from 'lucide-react';
import AuditAnimation from '../animations/AuditAnimation';
import TrainingAnimation from '../animations/TrainingAnimation';
import DeploymentAnimation from '../animations/DeploymentAnimation';

const PHASES = [
    {
        number: '01',
        title: 'Audit & Extraction',
        description: 'We map your current data flows, identify friction points in your client acquisition, and securely connect to your existing CRM infrastructure.',
        Animation: AuditAnimation,
        icon: Network,
    },
    {
        number: '02',
        title: 'Agent Training',
        description: "Your custom LLMs are trained strictly on your firm's tone, regulatory requirements, and historical successful engagements.",
        Animation: TrainingAnimation,
        icon: Search,
    },
    {
        number: '03',
        title: 'Deployment',
        description: 'The system goes live. Operations execute quietly in the background while warm, qualified leads are directed to your calendar.',
        Animation: DeploymentAnimation,
        icon: Zap,
    },
];

export default function ProtocolTimeline() {
    const sectionRef = useRef(null);
    const mobileTrackRef = useRef(null);
    const [activePhase, setActivePhase] = useState(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // ========== DESKTOP ANIMATIONS ==========

            // Scrub-driven progress line
            const masterTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.tl-desktop',
                    start: 'top 30%',
                    end: 'bottom 70%',
                    scrub: 0.8,
                },
            });

            masterTl.fromTo(
                '.tl-progress',
                { width: '0%' },
                { width: '100%', ease: 'none', duration: 3 }
            );

            // Phase indicator dots light up at thirds
            gsap.utils.toArray('.tl-dot').forEach((dot, i) => {
                const num = dot.querySelector('.tl-number');
                masterTl.to(
                    dot,
                    {
                        backgroundColor: '#C9A84C',
                        boxShadow: '0 0 20px rgba(201,168,76,0.4)',
                        duration: 0.3,
                    },
                    i * 1
                );
                if (num) {
                    masterTl.to(num, { color: '#0D0D12', duration: 0.3 }, i * 1);
                }
            });

            // Animation cards reveal with stagger
            gsap.fromTo(
                '.tl-anim-card',
                { y: 60, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.tl-anim-row',
                        start: 'top 75%',
                    },
                }
            );

            // Text content reveals
            gsap.fromTo(
                '.tl-text-card',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.tl-content-row',
                        start: 'top 80%',
                    },
                }
            );

            // ========== MOBILE ANIMATIONS ==========

            // Pin section and slide phases horizontally
            if (mobileTrackRef.current) {
                const mobileCards = mobileTrackRef.current;
                const totalScroll = mobileCards.scrollWidth - window.innerWidth;

                gsap.to(mobileCards, {
                    x: -totalScroll,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.tl-mobile',
                        start: 'top top',
                        end: () => `+=${totalScroll}`,
                        pin: true,
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                });

                // Mobile progress bar
                gsap.fromTo(
                    '.tl-mobile-progress',
                    { width: '0%' },
                    {
                        width: '100%',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '.tl-mobile',
                            start: 'top top',
                            end: () => `+=${totalScroll}`,
                            scrub: 0.6,
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handlePhaseClick = (index) => {
        if (activePhase === index) {
            setActivePhase(null);
            gsap.to('.tl-anim-card', {
                scale: 1,
                opacity: 1,
                filter: 'blur(0px)',
                duration: 0.4,
                ease: 'power2.out',
            });
            gsap.to('.tl-text-card', {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out',
            });
            return;
        }

        setActivePhase(index);

        gsap.utils.toArray('.tl-anim-card').forEach((card, i) => {
            gsap.to(card, {
                scale: i === index ? 1.03 : 0.95,
                opacity: i === index ? 1 : 0.3,
                filter: i === index ? 'blur(0px)' : 'blur(4px)',
                duration: 0.5,
                ease: 'power2.out',
            });
        });

        gsap.utils.toArray('.tl-text-card').forEach((card, i) => {
            gsap.to(card, {
                opacity: i === index ? 1 : 0.2,
                y: i === index ? -5 : 0,
                duration: 0.4,
                ease: 'power2.out',
            });
        });
    };

    return (
        <section ref={sectionRef} className="py-40 px-8 bg-[#0D0D12] overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="mb-20">
                    <h3 className="text-brand-accent uppercase tracking-[0.2em] font-mono text-sm mb-4">
                        Implementation Protocol
                    </h3>
                    <h4 className="text-4xl md:text-5xl font-sans font-light max-w-3xl text-white">
                        Three phases.{' '}
                        <span className="drama-text text-brand-accent">Zero</span>{' '}
                        guesswork.
                    </h4>
                </div>

                {/* ========== DESKTOP LAYOUT ========== */}
                <div className="hidden lg:block tl-desktop">
                    {/* Animation Row */}
                    <div className="grid grid-cols-3 gap-12 tl-anim-row">
                        {PHASES.map((phase, i) => (
                            <div key={phase.number} className="tl-anim-card opacity-0">
                                <div
                                    className={`h-[280px] rounded-2xl overflow-hidden border ${
                                        i === 0
                                            ? 'bg-[#15151A] border-white/5'
                                            : i === 1
                                              ? 'bg-[#18181E] border-brand-accent/20'
                                              : 'bg-[#1A1A22] border-brand-accent/40 shadow-[0_0_30px_rgba(201,168,76,0.1)]'
                                    }`}
                                >
                                    <phase.Animation />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Timeline Track */}
                    <div className="relative flex items-center justify-between py-12 mx-6">
                        {/* Background track */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/10 rounded-full" />
                        {/* Animated progress fill */}
                        <div
                            className="tl-progress absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-brand-accent rounded-full"
                            style={{ width: '0%' }}
                        />

                        {/* Phase indicators */}
                        {PHASES.map((phase, i) => (
                            <div
                                key={phase.number}
                                className="relative z-10 flex flex-col items-center cursor-pointer group"
                                onClick={() => handlePhaseClick(i)}
                            >
                                <div className="tl-dot relative w-12 h-12 rounded-full border-2 border-white/10 bg-[#15151A] flex items-center justify-center transition-all duration-500 group-hover:border-brand-accent/50">
                                    <span className="tl-number data-text text-sm text-white/40 group-hover:text-brand-accent transition-colors duration-300">
                                        {phase.number}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content Row */}
                    <div className="grid grid-cols-3 gap-12 mt-2 tl-content-row">
                        {PHASES.map((phase, i) => (
                            <div key={phase.number} className="tl-text-card opacity-0">
                                <div className="flex items-center gap-3 mb-4">
                                    <phase.icon
                                        size={18}
                                        className="text-brand-accent/60"
                                    />
                                    <span className="data-text text-brand-accent/60 text-xs tracking-widest uppercase">
                                        Phase {phase.number}
                                    </span>
                                </div>
                                <h5
                                    className={`text-2xl font-medium mb-4 ${
                                        i === 2
                                            ? 'drama-text text-brand-accent tracking-wide'
                                            : 'text-white'
                                    }`}
                                >
                                    {phase.title}
                                </h5>
                                <p className="text-white/50 text-base leading-relaxed">
                                    {phase.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ========== MOBILE LAYOUT ========== */}
                <div className="lg:hidden tl-mobile overflow-hidden">
                    {/* Progress bar */}
                    <div className="relative h-[2px] bg-white/10 rounded-full mb-8">
                        <div
                            className="tl-mobile-progress absolute left-0 top-0 h-full bg-brand-accent rounded-full"
                            style={{ width: '0%' }}
                        />
                    </div>

                    {/* Horizontal sliding track */}
                    <div
                        ref={mobileTrackRef}
                        className="flex gap-6"
                        style={{ width: `${PHASES.length * 100}vw` }}
                    >
                        {PHASES.map((phase, i) => (
                            <div
                                key={phase.number}
                                className="flex-shrink-0 px-4"
                                style={{ width: 'calc(100vw - 4rem)' }}
                            >
                                <div
                                    className={`rounded-3xl p-8 border h-full ${
                                        i === 0
                                            ? 'bg-[#15151A] border-white/5'
                                            : i === 1
                                              ? 'bg-[#18181E] border-brand-accent/20'
                                              : 'bg-[#1A1A22] border-brand-accent/40'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <phase.icon
                                            size={16}
                                            className="text-brand-accent/60"
                                        />
                                        <span className="data-text text-brand-accent text-xs tracking-widest uppercase">
                                            Phase {phase.number}
                                        </span>
                                    </div>

                                    <h5
                                        className={`text-xl font-medium mb-4 ${
                                            i === 2
                                                ? 'drama-text text-brand-accent'
                                                : 'text-white'
                                        }`}
                                    >
                                        {phase.title}
                                    </h5>

                                    {/* Embedded animation */}
                                    <div className="h-[220px] rounded-xl overflow-hidden border border-white/5 mb-6">
                                        <phase.Animation />
                                    </div>

                                    <p className="text-white/50 text-sm leading-relaxed">
                                        {phase.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
