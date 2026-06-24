import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingDown, Users, Clock, Brain, Phone, BarChart3, ArrowRight, ChevronDown, FileText, UserCheck, CalendarCheck } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import { useQualForm } from '../context/QualFormContext';
import WorkflowAnimation from '../components/animations/WorkflowAnimation';
import LeadGenAnimation from '../components/animations/LeadGenAnimation';
import AuditAnimation from '../components/animations/AuditAnimation';
import TrainingAnimation from '../components/animations/TrainingAnimation';
import DeploymentAnimation from '../components/animations/DeploymentAnimation';

gsap.registerPlugin(ScrollTrigger);

const CRISIS_STATS = [
    { value: '33%', label: 'Fewer accounting graduates since 2012', icon: TrendingDown },
    { value: '75%', label: 'Of CPAs have reached retirement age', icon: Users },
    { value: '90%', label: 'Of finance leaders can\'t find qualified staff', icon: Clock },
    { value: '5-10%', label: 'Annual rate increases just to manage capacity', icon: BarChart3 },
];

const SOLUTIONS = [
    {
        problem: 'Can\'t find staff for compliance work',
        solution: 'AI handles document collection, data entry, and reconciliation prep. Your team stays on advisory.',
        icon: FileText,
    },
    {
        problem: 'Turning away clients at capacity',
        solution: 'AI-powered client acquisition brings better-fit, higher-value clients to your calendar. No cold calling on your end.',
        icon: UserCheck,
    },
    {
        problem: 'Partners buried in admin',
        solution: 'AI receptionist handles intake calls, scheduling, and follow-ups 24/7. Your partners stay on billable work.',
        icon: Phone,
    },
    {
        problem: 'Want to shift to advisory but drowning in tax prep',
        solution: 'AI automates the compliance busywork so your people can focus on the advisory services that grow your firm.',
        icon: Brain,
    },
    {
        problem: 'Can\'t grow without hiring',
        solution: 'AI systems scale your firm\'s capacity without adding headcount. Do more with the team you already have.',
        icon: CalendarCheck,
    },
];

const HOW_IT_WORKS = [
    {
        step: '01',
        title: 'I Map Your Firm',
        description: 'I audit your current workflows, client acquisition process, and admin bottlenecks. I identify exactly where AI delivers the highest ROI for your specific firm.',
        Animation: AuditAnimation,
    },
    {
        step: '02',
        title: 'I Build Your System',
        description: 'Custom AI agents trained on your firm\'s voice, processes, and ideal client profile. No templates. Everything is built specifically for how your firm operates.',
        Animation: TrainingAnimation,
    },
    {
        step: '03',
        title: 'You Grow Without Hiring',
        description: 'Qualified leads land on your calendar. Admin tasks run automatically. Your team focuses on advisory and client relationships while AI handles the rest.',
        Animation: DeploymentAnimation,
    },
];

const TIERS = [
    {
        name: 'AI Client Acquisition',
        tag: 'Tier 1',
        description: 'Fill your pipeline with better-fit clients without lifting a finger.',
        features: [
            'AI-sourced prospects matched to your ideal client profile',
            'Email verification and company research on every lead',
            'AI-personalized cold email sequences',
            'Meetings booked directly on your calendar',
            'Monthly performance reporting',
        ],
    },
    {
        name: 'Acquisition + Firm Automations',
        tag: 'Tier 2',
        highlight: true,
        description: 'Everything in Tier 1, plus AI that runs your firm\'s daily operations.',
        features: [
            'Everything in Tier 1',
            'Automated client onboarding workflows',
            'Document collection and processing',
            'Follow-up sequences that run themselves',
            'CRM automation and pipeline management',
        ],
    },
    {
        name: 'Full AI Operations',
        tag: 'Tier 3',
        description: 'The complete system. Acquisition, operations, and an AI receptionist.',
        features: [
            'Everything in Tier 2',
            'AI receptionist for inbound calls 24/7',
            'Outbound follow-up calls and appointment confirmations',
            'Quarterly strategy sessions',
            'Priority support and optimization',
        ],
    },
];

const FAQS = [
    {
        q: 'Will AI replace my staff?',
        a: 'No. AI is an amplifier, not a replacement. The play is quality employees enabled with AI. That 10x\'s their productivity and impact. Your CPAs stay on client work. AI handles the admin around it.',
    },
    {
        q: 'How long until I see results?',
        a: 'Most firms see their first qualified meetings within the first few weeks of launch. The full system typically takes 30-60 days to build and optimize for your specific firm.',
    },
    {
        q: 'What if I\'m not technical?',
        a: 'You don\'t need to be. I build everything, train the AI on your processes, and hand you a system that runs. You show up to meetings and focus on your clients.',
    },
    {
        q: 'How is this different from other AI agencies?',
        a: 'Most AI agencies are generalists selling the same tools to everyone. I specialize in accounting and financial services. I know your workflows, your compliance requirements, your client lifecycle. I grew up around accounting. That\'s why I built this for firms like yours instead of trying to serve everyone.',
    },
    {
        q: 'I already get clients from referrals. Why do I need this?',
        a: 'Referrals are great but unpredictable. You can\'t scale on referrals alone, and you can\'t control when they come in. This adds a predictable second channel so you\'re never dependent on one source for growth.',
    },
];

export default function AccountingPage() {
    const heroRef = useRef(null);
    const crisisRef = useRef(null);
    const solutionsRef = useRef(null);
    const howRef = useRef(null);
    const tiersRef = useRef(null);
    const proofRef = useRef(null);
    const faqRef = useRef(null);
    const ctaRef = useRef(null);

    const { openCalModal } = useCalModal();
    const { openQualForm } = useQualForm();

    useEffect(() => {
        const heroCtx = gsap.context(() => {
            gsap.fromTo('.acct-hero-text',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
            );
            gsap.fromTo('.acct-hero-cta',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
            );
            gsap.fromTo('.acct-hero-benefits > div',
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power2.out', delay: 1.0 }
            );
        }, heroRef);

        const crisisCtx = gsap.context(() => {
            gsap.fromTo('.crisis-header',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: crisisRef.current, start: 'top 75%' } }
            );
            gsap.fromTo('.crisis-stat',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: crisisRef.current, start: 'top 70%' } }
            );
        }, crisisRef);

        const solCtx = gsap.context(() => {
            gsap.fromTo('.sol-header',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: solutionsRef.current, start: 'top 75%' } }
            );
            gsap.fromTo('.sol-card',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: solutionsRef.current, start: 'top 70%' } }
            );
        }, solutionsRef);

        const howCtx = gsap.context(() => {
            gsap.fromTo('.how-header',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: howRef.current, start: 'top 75%' } }
            );
            gsap.fromTo('.how-step',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.25, ease: 'power3.out', scrollTrigger: { trigger: howRef.current, start: 'top 70%' } }
            );
        }, howRef);

        const tiersCtx = gsap.context(() => {
            gsap.fromTo('.tier-header',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: tiersRef.current, start: 'top 75%' } }
            );
            gsap.fromTo('.tier-card',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: tiersRef.current, start: 'top 70%' } }
            );
        }, tiersRef);

        const proofCtx = gsap.context(() => {
            gsap.fromTo('.proof-header',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: proofRef.current, start: 'top 75%' } }
            );
            gsap.fromTo('.proof-card',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: proofRef.current, start: 'top 70%' } }
            );
        }, proofRef);

        const faqCtx = gsap.context(() => {
            gsap.fromTo('.faq-header',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: faqRef.current, start: 'top 75%' } }
            );
            gsap.fromTo('.faq-item',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: faqRef.current, start: 'top 70%' } }
            );
        }, faqRef);

        const ctaCtx = gsap.context(() => {
            gsap.fromTo('.acct-cta-text',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' } }
            );
            gsap.fromTo('.acct-cta-buttons',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ctaRef.current, start: 'top 75%' } }
            );
        }, ctaRef);

        return () => {
            heroCtx.revert();
            crisisCtx.revert();
            solCtx.revert();
            howCtx.revert();
            tiersCtx.revert();
            proofCtx.revert();
            faqCtx.revert();
            ctaCtx.revert();
        };
    }, []);

    return (
        <div className="bg-brand-primary min-h-screen text-brand-background overflow-x-hidden">

            {/* 1. HERO */}
            <section ref={heroRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 overflow-hidden">
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full opacity-40"
                         style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)', top: '-10%', right: '-5%' }} />
                    <div className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full opacity-40"
                         style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)', bottom: '5%', left: '-10%' }} />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center">
                    <p className="acct-hero-text text-brand-accent uppercase tracking-[0.2em] font-mono text-[10px] mb-4 md:mb-6">
                        AI for Accounting & Financial Services Firms
                    </p>

                    <h1 className="acct-hero-text text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-sans font-medium tracking-tight text-white mb-4 md:mb-6 leading-[1.1]">
                        Your Firm Can't Hire Its Way
                    </h1>
                    <h2 className="acct-hero-text text-4xl sm:text-5xl md:text-7xl lg:text-[9rem] leading-[0.9] drama-text text-brand-accent mb-6 md:mb-8">
                        Out of This.
                    </h2>

                    <p className="acct-hero-text text-white/60 text-base sm:text-lg md:text-xl max-w-2xl font-light leading-relaxed mb-8 md:mb-10 px-4">
                        Accounting graduates are down 33%. Your best people are burning out. I build the AI systems that let your firm grow without adding headcount.
                    </p>

                    <div className="acct-hero-benefits flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mb-8 md:mb-12">
                        {['Stop turning away clients', 'Free your team from admin', 'Better-fit clients on your calendar'].map((b) => (
                            <div key={b} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                                <span className="text-white/70 text-xs md:text-sm">{b}</span>
                            </div>
                        ))}
                    </div>

                    <div className="acct-hero-cta flex flex-col sm:flex-row gap-3 sm:gap-4 items-center mb-4">
                        <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-8 py-4 rounded-[2rem] font-semibold text-sm sm:text-base tracking-wide transition-transform active:scale-[0.97] sm:hover:scale-[1.03] duration-300 shadow-[0_0_30px_rgba(201,168,76,0.25)] min-h-[48px]">
                            <span className="relative z-10">Book a Call</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay" />
                        </button>
                        <button
                            onClick={() => {
                                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="border border-white/20 text-white/80 hover:border-brand-accent/40 hover:text-white px-8 py-4 rounded-[2rem] font-medium text-sm sm:text-base tracking-wide transition-all active:scale-[0.97] duration-300 min-h-[48px] flex items-center gap-2"
                        >
                            See How It Works <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. THE CRISIS */}
            <section ref={crisisRef} className="py-20 sm:py-24 md:py-32 px-6 md:px-8 bg-[#0A0A0E]">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 sm:mb-16 md:mb-20 max-w-3xl">
                        <span className="crisis-header block text-brand-accent uppercase tracking-[0.2em] font-mono text-xs mb-4">The Reality</span>
                        <h3 className="crisis-header text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-6">
                            The accounting profession is in <span className="drama-text text-brand-accent">crisis.</span>
                        </h3>
                        <p className="crisis-header text-white/50 text-base sm:text-lg leading-relaxed">
                            You're turning away good clients. Your staff is drowning in compliance work. You know AI is the answer but you don't know where to start.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CRISIS_STATS.map((stat) => (
                            <div key={stat.value} className="crisis-stat bg-[#15151A] border border-white/5 rounded-2xl p-6 sm:p-8">
                                <stat.icon className="w-5 h-5 text-brand-accent mb-4" />
                                <p className="text-3xl sm:text-4xl font-sans font-semibold text-white mb-2">{stat.value}</p>
                                <p className="text-white/40 text-sm leading-relaxed">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. SOLUTION MAPPING */}
            <section ref={solutionsRef} className="py-20 sm:py-24 md:py-32 px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 sm:mb-16 md:mb-20 max-w-3xl">
                        <span className="sol-header block text-brand-accent uppercase tracking-[0.2em] font-mono text-xs mb-4">Your Problems, Solved</span>
                        <h3 className="sol-header text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight">
                            Every firm problem maps to an <span className="drama-text text-brand-accent">AI solution.</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SOLUTIONS.map((s) => (
                            <div key={s.problem} className="sol-card bg-[#15151A] border border-white/5 hover:border-brand-accent/20 rounded-2xl p-6 sm:p-8 transition-all duration-500">
                                <s.icon className="w-5 h-5 text-brand-accent mb-4" />
                                <p className="text-white font-semibold text-base mb-3">{s.problem}</p>
                                <p className="text-white/40 text-sm leading-relaxed">{s.solution}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section ref={howRef} id="how-it-works" className="py-20 sm:py-24 md:py-32 px-6 md:px-8 bg-[#0A0A0E]">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 sm:mb-16 md:mb-20 max-w-3xl">
                        <span className="how-header block text-brand-accent uppercase tracking-[0.2em] font-mono text-xs mb-4">How It Works</span>
                        <h3 className="how-header text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight">
                            Three steps to a firm that <span className="drama-text text-brand-accent">scales.</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {HOW_IT_WORKS.map((step) => (
                            <div key={step.step} className="how-step flex flex-col gap-6">
                                <div className="w-full h-48 rounded-2xl overflow-hidden bg-[#15151A] border border-white/5">
                                    <step.Animation />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-brand-accent font-mono text-sm">{step.step}</span>
                                        <div className="h-px flex-1 bg-white/10" />
                                    </div>
                                    <h5 className="font-semibold text-xl mb-2 text-white">{step.title}</h5>
                                    <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. TIERS */}
            <section ref={tiersRef} className="py-20 sm:py-24 md:py-32 px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 sm:mb-16 md:mb-20 text-center max-w-3xl mx-auto">
                        <span className="tier-header block text-brand-accent uppercase tracking-[0.2em] font-mono text-xs mb-4">The AI Growth System</span>
                        <h3 className="tier-header text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight">
                            Better clients. Less admin. <span className="drama-text text-brand-accent">No new hires.</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {TIERS.map((tier) => (
                            <div key={tier.name} className={`tier-card flex flex-col rounded-2xl p-6 sm:p-8 transition-all duration-500 ${
                                tier.highlight
                                    ? 'bg-brand-accent/5 border-2 border-brand-accent/30 shadow-[0_0_40px_rgba(201,168,76,0.08)]'
                                    : 'bg-[#15151A] border border-white/5'
                            }`}>
                                <div className="mb-6">
                                    <span className="text-brand-accent font-mono text-xs uppercase tracking-[0.15em]">{tier.tag}</span>
                                    {tier.highlight && <span className="ml-3 text-[10px] uppercase tracking-[0.15em] text-brand-accent/70 font-mono">Most Popular</span>}
                                </div>
                                <h4 className="text-xl sm:text-2xl font-semibold text-white mb-3">{tier.name}</h4>
                                <p className="text-white/40 text-sm leading-relaxed mb-6">{tier.description}</p>
                                <ul className="flex flex-col gap-3 mb-8 flex-grow">
                                    {tier.features.map((f) => (
                                        <li key={f} className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 shrink-0" />
                                            <span className="text-white/60 text-sm">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={openCalModal}
                                    className={`group relative overflow-hidden w-full py-3.5 rounded-[2rem] font-semibold text-sm tracking-wide transition-transform active:scale-[0.97] sm:hover:scale-[1.02] duration-300 min-h-[44px] ${
                                        tier.highlight
                                            ? 'bg-brand-accent text-brand-primary shadow-[0_0_20px_rgba(201,168,76,0.2)]'
                                            : 'border border-white/15 text-white/70 hover:border-brand-accent/40 hover:text-white'
                                    }`}
                                >
                                    <span className="relative z-10">Book a Call</span>
                                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. SOCIAL PROOF / RESULTS */}
            <section ref={proofRef} className="py-20 sm:py-24 md:py-32 px-6 md:px-8 bg-[#0A0A0E]">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 sm:mb-16 md:mb-20 max-w-3xl">
                        <span className="proof-header block text-brand-accent uppercase tracking-[0.2em] font-mono text-xs mb-4">Results</span>
                        <h3 className="proof-header text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight">
                            What I've <span className="drama-text text-brand-accent">built.</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="proof-card bg-[#15151A] border border-white/5 rounded-2xl p-8 sm:p-10">
                            <span className="text-brand-accent font-mono text-xs uppercase tracking-[0.15em] block mb-6">Professional Services Firm</span>
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <p className="text-3xl font-semibold text-white mb-1">7.5 hrs</p>
                                    <p className="text-white/40 text-xs">Admin eliminated per client</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-semibold text-white mb-1">12 steps</p>
                                    <p className="text-white/40 text-xs">Client lifecycle fully automated</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-semibold text-white mb-1">11 APIs</p>
                                    <p className="text-white/40 text-xs">Integrated into one system</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-semibold text-white mb-1">6 figures</p>
                                    <p className="text-white/40 text-xs">Projected annual ROI</p>
                                </div>
                            </div>
                            <p className="text-white/50 text-sm leading-relaxed">
                                Built a complete business operating system for a consulting firm. Automated everything from lead intake to invoicing. Proposal turnaround went from days to same-day.
                            </p>
                        </div>

                        <div className="proof-card bg-[#15151A] border border-white/5 rounded-2xl p-8 sm:p-10">
                            <span className="text-brand-accent font-mono text-xs uppercase tracking-[0.15em] block mb-6">Local Service Business</span>
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <p className="text-3xl font-semibold text-white mb-1">5 min</p>
                                    <p className="text-white/40 text-xs">Daily operation (was all-manual)</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-semibold text-white mb-1">14</p>
                                    <p className="text-white/40 text-xs">Staff booking flows automated</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-semibold text-white mb-1">60 sec</p>
                                    <p className="text-white/40 text-xs">Missed call auto-response time</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-semibold text-white mb-1">6+ weeks</p>
                                    <p className="text-white/40 text-xs">System runs unattended</p>
                                </div>
                            </div>
                            <p className="text-white/50 text-sm leading-relaxed">
                                Built a full CRM and automation system for a 14-person team. Owner went from managing everything manually to a 5-minute daily routine. System designed to run completely unattended.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. FAQ */}
            <section ref={faqRef} className="py-20 sm:py-24 md:py-32 px-6 md:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-12 sm:mb-16 text-center">
                        <span className="faq-header block text-brand-accent uppercase tracking-[0.2em] font-mono text-xs mb-4">FAQ</span>
                        <h3 className="faq-header text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight">
                            Common <span className="drama-text text-brand-accent">questions.</span>
                        </h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        {FAQS.map((faq) => (
                            <details key={faq.q} className="faq-item group bg-[#15151A] border border-white/5 rounded-2xl overflow-hidden">
                                <summary className="flex items-center justify-between cursor-pointer px-6 sm:px-8 py-5 sm:py-6 text-white font-medium text-sm sm:text-base select-none">
                                    {faq.q}
                                    <ChevronDown className="w-4 h-4 text-white/40 transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4" />
                                </summary>
                                <div className="px-6 sm:px-8 pb-5 sm:pb-6">
                                    <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. FINAL CTA */}
            <section ref={ctaRef} className="py-24 sm:py-32 md:py-40 px-6 md:px-8 flex justify-center text-center bg-[#0A0A0E]">
                <div className="max-w-3xl flex flex-col items-center">
                    <h2 className="acct-cta-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans tracking-tight mb-6 sm:mb-8 text-white">
                        Every month you wait, you're losing clients you could have <span className="drama-text text-brand-accent">served.</span>
                    </h2>
                    <p className="acct-cta-text text-base sm:text-lg md:text-xl text-white/50 font-light mb-10 sm:mb-12 max-w-xl px-4">
                        The talent isn't coming back. The firms that thrive will be the ones that build AI into their operations now.
                    </p>
                    <div className="acct-cta-buttons flex flex-col sm:flex-row gap-4 items-center">
                        <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-8 sm:px-10 py-4 sm:py-5 rounded-[2.5rem] text-base sm:text-lg font-semibold tracking-wide transition-transform active:scale-[0.97] sm:hover:scale-[1.03] duration-300 shadow-[0_0_40px_rgba(201,168,76,0.3)] min-h-[52px]">
                            <span className="relative z-10">Book a Call</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay" />
                        </button>
                        <button onClick={() => openQualForm('gtm-audit')} className="border border-white/20 text-white/80 hover:border-brand-accent/40 hover:text-white px-8 sm:px-10 py-4 sm:py-5 rounded-[2.5rem] text-base sm:text-lg font-medium tracking-wide transition-all active:scale-[0.97] duration-300 min-h-[52px]">
                            Get a Free Firm Audit
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
