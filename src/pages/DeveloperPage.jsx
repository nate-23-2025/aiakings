import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, Plus, Lock } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import { useReveal } from '../hooks/useReveal';
import { prefersReducedMotion } from '../lib/motion';
import { PANEL, WRAP, H2, H3, EYEBROW, LEDE } from '../lib/ui';
import SEOHead from '../components/SEOHead';
import CTAButton from '../components/motion/CTAButton';
import HeroGlow from '../components/motion/HeroGlow';
import NateVideo from '../components/motion/NateVideo';
import CallSteps from '../components/sections/CallSteps';
import { PanelHead, Rows } from '../components/sections/PanelParts';
import AgentDetail from '../components/dev/AgentDetail';
import AgentPipeline from '../components/dev/AgentPipeline';
import AgentBento from '../components/dev/AgentBento';
import BuildTimeline from '../components/dev/BuildTimeline';
import IntegrationBeams from '../components/dev/IntegrationBeams';
import NumberTicker from '../components/motion/NumberTicker';
import BeamRing from '../components/motion/BeamRing';
import FaqAccordion from '../components/sections/FaqAccordion';
import { DEV_FITS } from '../data/agents';

// Also used inside the HQ popup, so it loads as its own small chunk.
const HQVisual = lazy(() => import('../components/features/HQVisual'));

// Nate the Dev: AI agents and AI operating systems, for teams ready for
// systems and for clients whose site, reviews, and rankings already run.
// Websites, AI SEO, and reviews live on the Marketer page.
// Plain words, no promises: what an agent is, what it can do, how it gets
// built safely, what has actually been built, and the research with sources,
// including the part where a lot of agent projects fail.
// Background and sources: Sales/ai-agents/research.md
const AGENT_PARTS = [
    {
        title: 'A model that can think a task through',
        body: 'The same kind of AI behind ChatGPT and Claude, given a job to do instead of a chat window.',
    },
    {
        title: 'Tools it is allowed to use',
        body: 'Your phone line, calendar, customer records, inbox, and documents. Only the ones the job needs.',
    },
    {
        title: 'Rules for when to stop and ask',
        body: 'It handles the routine on its own. Anything that touches money or a customer relationship waits for a person.',
    },
];

const AGENT_STEPS = [
    {
        title: 'Pick one job and map it',
        body: 'What the agent does, what it can touch, and exactly when it hands off to a person. Small first, proven, then bigger.',
    },
    {
        title: 'Connect it to your tools',
        body: 'Your phone, calendar, customer records, inbox, and the software you already pay for. Connecting things is the part I specialize in.',
    },
    {
        title: 'Make the predictable parts predictable',
        body: 'Anything that should happen the same way every time gets written as plain code, so the AI only makes the calls that actually need judgment.',
    },
    {
        title: 'Fence it in',
        body: 'It gets only the access the job needs. Anything risky waits for your OK, and every action is logged so you can see what it did and why.',
    },
    {
        title: 'Check it twice, test it first',
        body: 'A second review on everything, and a full test run before it touches a real customer.',
    },
    {
        title: 'Keep it running',
        body: 'When something needs changing, you text me and you hear back from me.',
    },
];

// What can be said about each, and no more. Every line traces back to the
// agent's own playbook or build notes. HealthCo is confidential: role only,
// and the popup says so plainly. Each row opens a breakdown (AgentDetail).
const AGENT_PROOF = [
    {
        name: 'HealthCo',
        role: 'Lead developer',
        body: 'Building their AI agent architecture.',
        summary: 'Client work stays with the client.',
        confidential: true,
        note: 'I am the lead developer building HealthCo’s AI agent architecture. What it does and how it works belong to them, so the details stay private.',
    },
    {
        name: 'Allen AI',
        role: 'Co-founder and CTO',
        body: 'Custom AI built for law firms.',
        summary: 'Two builds: the system the whole business runs on, from first inquiry to referral, and a phone receptionist built for law firms.',
        visual: 'allen',
        sections: [
            {
                heading: 'The system the business runs on',
                items: [
                    'New inquiries get read, sorted by priority, logged, and answered with a confirmation within seconds',
                    'After a discovery call, the transcript becomes a full scope, timeline, and proposal ready to review, work that used to take hours',
                    'One click sends every contract in a single signing session',
                    'The moment the contracts are signed, the deposit invoice goes out on its own',
                    'A paid deposit sends the welcome packet, sets up the client’s folders, and records the payment in the books',
                    'Build updates, the final invoice, monthly check-ins, and the referral ask all go out on time without anyone having to remember them',
                ],
            },
            {
                heading: 'A phone receptionist for law firms',
                items: [
                    'Answers every call, day or night, with real care for people calling in a hard moment',
                    'Works out what kind of legal matter it is and whether the firm handles it',
                    'Checks whether the caller already has an attorney before booking',
                    'Books the free consultation into the firm’s calendar, only at times the calendar actually has open',
                    'Never gives legal advice and never predicts how a case will turn out',
                ],
            },
        ],
        highlight: 'About 7.5 hours of admin off every new client, by my count.',
        built: 'Built with Claude Code. Connected to Stripe, DocuSign, QuickBooks, ClickUp, Google Drive, Gmail, Typeform, and Cal.com.',
    },
    {
        name: 'Phone agents',
        role: 'Voice',
        body: 'Agents that pick up, answer questions, and book the job.',
        summary: 'Agents that answer the phone like someone who works there, and know when to hand off.',
        visual: 'phone',
        sections: [
            {
                heading: 'What they do',
                items: [
                    'Pick up every call, after hours and when every line is busy',
                    'Answer the usual questions from the business’s own information: services, hours, and booking rules',
                    'Qualify the caller and book the job straight into the business’s calendar',
                    'Text the owner what happened right after the call',
                    'Make calls too, like appointment confirmations and follow-ups',
                ],
            },
            {
                heading: 'The rules they follow',
                items: [
                    'Never say a price, a time, or an opening the calendar did not confirm on that call',
                    'Always offer the caller a way to reach a person',
                    'Say what they are. They never pretend to be human',
                    'Get tested with real calls, start to finish, before going live on a real number',
                ],
            },
        ],
        built: 'Built on ElevenLabs and Twilio.',
    },
    {
        name: 'Solomon',
        role: 'My research agent',
        body: 'Pulls sourced stats on any topic and writes the report.',
        summary: 'Give it a topic and it comes back with facts I can stand behind, each one with its source.',
        visual: 'solomon',
        sections: [
            {
                heading: 'What it does',
                items: [
                    'Researches any topic across the web: how big it is, where it stands today, what is changing, and real business results',
                    'Adds a Houston and Texas angle when it matters',
                    'Pulls out the handful of most quotable facts, each with its source',
                    'Suggests angles worth writing or talking about',
                    'Files every report so past research is easy to find again',
                ],
            },
        ],
        built: 'Built on Perplexity.',
    },
    {
        name: 'Daniel',
        role: 'My SEO audit agent',
        body: 'Checks a business site against what Google and AI need, worst problems first, and writes the owner a report.',
        summary: 'It looks at a business the way Google and AI do, and tells the owner what is costing them calls.',
        visual: 'daniel',
        sections: [
            {
                heading: 'What it does',
                items: [
                    'Reads up to 15 pages of a business’s public site',
                    'Checks it against six levers for getting found by Google and by AI',
                    'Catches what owners never see: pages an AI tool reads as nearly blank, broken links, and a phone number that does not match the Google listing',
                    'Ranks every problem worst first',
                    'Writes the owner a plain-English report with proof: phone screenshots, the broken page, and what an AI assistant actually sees',
                    'Runs again every month for clients, so progress is measured against day one',
                ],
            },
        ],
    },
    {
        name: 'AIAK HQ',
        role: 'My AI operating system',
        body: 'The system I run my own business on. Agents that research and audit, working from one shared set of playbooks.',
        summary: 'The system I run my own business on.',
        visual: 'hq',
        sections: [
            {
                heading: 'How it is built',
                items: [
                    'Playbooks: written instructions for each job, so every agent knows what to do and when',
                    'Scripts: plain code for anything that has to happen the same way every time',
                    'Agents in the middle that read the playbook, run the right scripts, and make the judgment calls',
                ],
            },
            {
                heading: 'What it does for me',
                items: [
                    'Researches topics and pulls sourced stats (Solomon)',
                    'Audits prospect websites and writes the owner a report (Daniel)',
                    'Builds the SEO scorecard I leave behind after a call',
                    'Holds one set of rules for my voice and my claims, so nothing goes out that I would not say',
                    'Checks every task I start against whether it actually makes money, and tells me when it does not',
                    'When something breaks, it fixes the script, tests it, and writes down what it learned, so the next run is better',
                ],
            },
        ],
        built: 'Built with Claude Code and Codex.',
    },
];

// Topic stats with the source named, never a promise about results.
const AGENT_FACTS = [
    {
        stat: '1 in 5',
        label: 'US businesses use AI to make their product or deliver their service. It is still early.',
        source: 'Census Bureau, 2026',
        href: 'https://www.census.gov/library/stories/2026/05/ai-use-businesses.html',
    },
    {
        stat: '7x',
        label: 'Firms that answered a lead within an hour were nearly seven times as likely to qualify it as firms that waited even an hour longer.',
        source: 'Harvard Business Review, 2011',
        href: 'https://scholarsarchive.byu.edu/facpub/9711',
    },
    {
        stat: '40%+',
        label: 'of agentic AI projects are expected to be canceled by the end of 2027, over cost, unclear value, or weak risk controls. That is why I start small.',
        source: 'Gartner, 2025',
        href: 'https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027',
    },
];

const FAQ = [
    {
        q: "What is an AI agent, in plain words?",
        a: "Software that can take a job from start to finish on its own. It reads what came in, decides what to do, uses the tools it has been given, like your calendar or your customer records, and either finishes the job or stops and asks a person. Think of it as a new hire that works from your playbook.",
    },
    {
        q: "How is an agent different from a chatbot?",
        a: "A chatbot answers questions. An agent does the work: it books the appointment, updates the record, sends the follow-up. A lot of tools calling themselves agents are chatbots with a new label, so ask what it actually does, not what it is called.",
    },
    {
        q: "Can an AI agent make a mess of things?",
        a: "It can if it is built carelessly, which is why every agent I build is fenced in. It only gets the access its job needs, anything that touches money or a customer waits for a person to approve, and every action is logged. I start with one job, prove it works, and only then give it more.",
    },
    {
        q: "Do I have to replace the software I already use?",
        a: "Usually not. Agents work inside the tools you already run, like your phone system, calendar, and customer records. Connecting those is the part I specialize in.",
    },
    {
        q: "What does it cost?",
        a: "It depends on the job, how many tools it connects to, and how much it handles on its own. Pricing gets scoped on the call once I know what the work looks like.",
    },
    {
        q: "What happens when something needs changing?",
        a: "You text me and you hear back from me. Not a ticket number and a week of silence.",
    },
];

// The booking steps, in this page's terms. The default steps talk about
// looking up a local business, which is the Marketer side.
const CALL_STEPS = [
    { n: '1', title: 'Pick a time', body: 'Whatever works for you. Booking takes about a minute.' },
    { n: '2', title: 'Tell me what eats your week', body: 'The jobs your team repeats, the tools you use, and where things fall through.' },
    { n: '3', title: 'Get a straight answer', body: 'Whether an agent can do it, and what it would take. If it cannot, I will tell you.' },
];

const PAGE_JSONLD = [
    {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'AI Agents and AI Operating Systems',
        serviceType: 'AI agent development',
        provider: {
            '@type': 'ProfessionalService',
            name: 'AI Automation Kings',
            url: 'https://aiautomationkings.com',
        },
        areaServed: { '@type': 'Country', name: 'US' },
        description:
            'Custom AI agents and multi-agent systems that answer calls, follow up on leads, keep records current, handle paperwork, and run back-office work inside the tools a business already uses, with human approval on anything risky.',
    },
    {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
        })),
    },
];

export default function DeveloperPage() {
    const rootRef = useRef(null);
    const { openCalModal } = useCalModal();
    const [openAgent, setOpenAgent] = useState(null);
    const { hash } = useLocation();
    useReveal(rootRef);

    // Arriving with a section in the address (the home page used to link to
    // #agents): jump once the page has rendered.
    useEffect(() => {
        if (!hash) return;
        const id = setTimeout(() => {
            document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' });
        }, 120);
        return () => clearTimeout(id);
    }, [hash]);

    const jumpTo = (id) => (e) => {
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    };

    return (
        <div ref={rootRef} className="min-h-screen text-brand-background overflow-x-clip">
            <SEOHead
                title="AI Agents and AI Operating Systems | AIA Kings"
                description="I build AI agents and AI operating systems that answer calls, follow up, keep records straight, and run the back office inside the tools you already use, with your OK on anything risky. Houston, Texas."
                canonical="https://aiautomationkings.com/developer"
                jsonLd={PAGE_JSONLD}
            />

            {/* HERO. Two facts where a personal page would put follower counts. */}
            <section id="agents" className="relative pt-32 pb-14 sm:pt-40 sm:pb-20 px-5 sm:px-6 md:px-8 overflow-hidden">
                {/* Me at the monitors, faint, behind everything, looping. It starts
                    once the page is idle so the headline paints first, and there is
                    no still image competing with it. Off for data saver and
                    reduced motion. */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 z-0 pointer-events-none opacity-30"
                    style={{ maskImage: 'radial-gradient(ellipse 60% 70% at 72% 45%, black 25%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 70% at 72% 45%, black 25%, transparent 75%)' }}
                >
                    <NateVideo clips={['nate-command-physical', 'nate-dive-physical']} className="absolute inset-0" objectPosition="60% 40%" idleStart poster={false} />
                    <div className="absolute inset-0 bg-brand-primary/35" />
                </div>
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="aurora-blob aurora-blob-1 absolute w-[500px] h-[500px] rounded-full"
                         style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)', top: '-20%', right: '-10%' }} />
                    <div className="aurora-blob aurora-blob-2 absolute w-[460px] h-[460px] rounded-full"
                         style={{ background: 'radial-gradient(circle, rgba(91,123,213,0.14) 0%, rgba(91,123,213,0.04) 45%, transparent 70%)', bottom: '-25%', left: '-12%' }} />
                </div>
                <HeroGlow />

                <div className="relative z-10 max-w-6xl mx-auto">
                    <div className="max-w-3xl">
                        <ul className="focus-in flex gap-10 sm:gap-14 mb-7 sm:mb-9">
                            <li>
                                <span className="block text-3xl sm:text-4xl font-semibold tracking-tight text-white">One job</span>
                                <span className="block text-xs text-white/45 mt-1">to start, proven before it grows</span>
                            </li>
                            <li>
                                <span className="block text-3xl sm:text-4xl font-semibold tracking-tight text-white">Your <span className="text-brand-accent">OK</span></span>
                                <span className="block text-xs text-white/45 mt-1">on anything risky</span>
                            </li>
                        </ul>
                        <h1 className="focus-in text-[2.4rem] leading-[1.04] sm:text-6xl lg:text-[4.25rem] font-sans font-medium tracking-tight text-white mb-6" style={{ '--d': '0.06s' }}>
                            AI agents that do the work. <span className="gold-gradient-text again-sweep drama-text">And the system that runs them.</span>
                        </h1>
                        <p className="focus-in text-white/60 text-base sm:text-lg md:text-xl font-light max-w-2xl mb-9 leading-relaxed" style={{ '--d': '0.14s' }}>
                            I build AI agents and AI operating systems that answer, follow up, keep your records straight, and run the back office, inside the tools you already use. Every one starts with a single job and waits for your OK on anything risky.
                        </p>
                        <div className="focus-in flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7" style={{ '--d': '0.22s' }}>
                            <CTAButton size="md" glint onClick={openCalModal} className="w-full sm:w-auto">
                                Talk to Me About an Agent
                            </CTAButton>
                            <a href="#built" onClick={jumpTo('built')} className="link-underline self-center sm:self-auto text-white/70 hover:text-white text-sm">
                                See agents I have built <span className="bob">&darr;</span>
                            </a>
                        </div>
                        <Link to="/marketer" className="focus-in group mt-8 inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 hover:text-brand-accent transition-colors" style={{ '--d': '0.3s' }}>
                            Need a website or more customers first? Nate the Marketer
                            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                        </Link>
                    </div>
                </div>
            </section>

            <section className={WRAP}>
                <div className={PANEL}>
                    <PanelHead
                        as="h2"
                        size={H2}
                        title={<>What an agent <span className="drama-text text-brand-accent">actually is.</span></>}
                        lede="Not a chatbot. A chatbot answers questions. An agent finishes the job, and every one I build has the same three parts."
                    />
                    <div data-reveal="scale" className="mb-10 sm:mb-14">
                        <AgentPipeline />
                    </div>
                    <Rows items={AGENT_PARTS} />
                </div>
            </section>

            <section className={WRAP}>
                <div className={PANEL}>
                    <PanelHead
                        title={<>What agents can do <span className="drama-text text-brand-accent">for a business.</span></>}
                        lede="The jobs that eat your day, handled at any hour, inside the tools you already run."
                    />
                    <AgentBento />
                </div>
            </section>

            {/* AI OPERATING SYSTEMS. A full-width band over clips of me at the
                command center, with the layers diagram beside the copy. */}
            <section className="relative my-4 sm:my-6 overflow-hidden">
                <div aria-hidden="true" className="absolute inset-0">
                    <NateVideo clips={['nate-command', 'nate-command-dive']} className="absolute inset-0" objectPosition="50% 40%" stillOnPhones />
                    <div className="absolute inset-0 bg-[#0D0D12]/40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D12] via-[#0D0D12]/70 to-[#0D0D12]/10" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0D0D12 0%, transparent 18%), linear-gradient(to top, #0D0D12 0%, transparent 18%)' }} />
                </div>
                <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 md:px-8 py-20 sm:py-28 lg:py-32 grid lg:grid-cols-[minmax(0,1fr)_420px] gap-12 lg:gap-14 items-center">
                    <div>
                        <p data-reveal className={`${EYEBROW} mb-5`}>AI operating systems</p>
                        <h3 data-reveal="lines" className={`${H3} mb-6`}>
                            Several agents. <span className="drama-text text-brand-accent">One system.</span>
                        </h3>
                        <p data-reveal className="text-white/70 text-base sm:text-lg font-light leading-relaxed mb-5">
                            An AI operating system is a team of agents working from the same memory and the same rules. Each one owns a job, they hand work to each other, and you oversee all of it.
                        </p>
                        <p data-reveal className="text-white/70 text-base sm:text-lg font-light leading-relaxed">
                            I run my own business this way. Written playbooks say what to do, tested code does the predictable parts, and agents make the calls in between.
                        </p>
                    </div>
                    <div data-reveal="scale">
                        <Suspense fallback={<div className="h-[560px] rounded-[1.5rem] border border-white/[0.08] bg-[#0F0F14]" />}>
                            <HQVisual />
                        </Suspense>
                    </div>
                </div>
            </section>

            <section className={WRAP}>
                <div className={PANEL}>
                    <PanelHead
                        title={<>How I build <span className="drama-text text-brand-accent">them.</span></>}
                        lede="Small first, proven, then bigger."
                    />
                    <BuildTimeline items={AGENT_STEPS} />
                    <p data-reveal className="mt-8 text-white/30 text-xs italic">Built with Claude Code and Codex.</p>
                </div>
            </section>

            {/* CONNECTED. The tools an agent works inside, with light flowing in. */}
            <section className={WRAP}>
                <div className={PANEL}>
                    <PanelHead
                        title={<>Connected to the tools <span className="drama-text text-brand-accent">you already run.</span></>}
                        lede="No new software to learn. Your agent works inside your phone, calendar, customer records, inbox, and payments. Connecting things is the part I specialize in."
                    />
                    <div data-reveal="scale">
                        <IntegrationBeams />
                    </div>
                    <p data-reveal className="mt-6 text-center text-white/35 text-sm">And the other software you already pay for.</p>
                </div>
            </section>

            <section id="built" className={`scroll-mt-24 ${WRAP}`}>
                <div className={`relative ${PANEL}`}>
                    <BeamRing />
                    <PanelHead
                        title={<>Agents I <span className="drama-text text-brand-accent">have built.</span></>}
                        lede="Some for clients, some I run my own business on."
                    />
                    {/* Each row opens a breakdown of what that agent does. */}
                    <ul data-reveal-group className="grid md:grid-cols-2 md:gap-x-14 border-t border-white/[0.07]">
                        {AGENT_PROOF.map((agent) => (
                            <li key={agent.name} className="border-b border-white/[0.07]">
                                <button
                                    type="button"
                                    onClick={() => setOpenAgent(agent)}
                                    aria-haspopup="dialog"
                                    className="group w-full text-left grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_auto] gap-4 sm:gap-6 py-5 sm:py-6 px-1 rounded-lg transition-colors hover:bg-white/[0.02] focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-accent/60"
                                >
                                    <span>
                                        <span className="block text-white font-medium transition-colors group-hover:text-brand-accent">{agent.name}</span>
                                        <span className="block font-mono text-[9px] uppercase tracking-widest text-brand-accent mt-1.5">{agent.role}</span>
                                    </span>
                                    <span className="text-white/50 text-sm sm:text-base leading-relaxed">{agent.body}</span>
                                    <span className={`self-start grid place-items-center w-8 h-8 rounded-full border border-white/15 text-white/50 transition-[color,border-color,background-color,rotate] duration-300 group-hover:border-brand-accent/60 group-hover:text-brand-accent group-hover:bg-brand-accent/10 ${agent.confidential ? '' : 'group-hover:rotate-90'}`}>
                                        {agent.confidential ? <Lock size={13} /> : <Plus size={15} />}
                                        <span className="sr-only">{agent.confidential ? `About ${agent.name}` : `See what ${agent.name} does`}</span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <p data-reveal className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">Tap any of them for the breakdown</p>
                </div>
            </section>

            <section className={WRAP}>
                <div className={PANEL}>
                    <PanelHead
                        title={<>The honest <span className="drama-text text-brand-accent">numbers.</span></>}
                        lede="Agents are early, they are powerful, and plenty of projects fail. Here is what the research says."
                    />
                    <ul data-reveal-group className="border-t border-white/[0.07]">
                        {AGENT_FACTS.map(({ stat, label, source, href }) => (
                            <li key={stat} className="grid grid-cols-1 md:grid-cols-[9rem_minmax(0,1fr)_auto] gap-x-8 gap-y-2 md:items-baseline border-b border-white/[0.07] py-6 sm:py-7">
                                <NumberTicker value={stat} className="text-4xl sm:text-5xl font-light text-white tracking-tight leading-none" />
                                <span className="text-white/70 text-base leading-relaxed">{label}</span>
                                <a href={href} target="_blank" rel="noopener" className="link-underline justify-self-start font-mono text-[10px] uppercase tracking-widest text-white/35 hover:text-white/60">
                                    {source} &#8599;
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* WHO THIS IS FOR */}
            <section className={WRAP}>
                <div className={PANEL}>
                    <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-8 lg:gap-16">
                        <div>
                            <p data-reveal className={`${EYEBROW} mb-5`}>Who this is for</p>
                            <h2 data-reveal="lines" className={H3}>
                                This works if <span className="drama-text text-brand-accent">you have a system to run.</span>
                            </h2>
                        </div>
                        <div>
                            <ul data-reveal-group data-inview className="flex flex-col gap-4 border-t border-white/[0.07] pt-6">
                                {DEV_FITS.map((fit, i) => (
                                    <li key={fit} className="flex items-start gap-4">
                                        <Check className="draw w-5 h-5 text-brand-accent shrink-0 mt-0.5" strokeWidth={2.5} style={{ '--d': `${0.3 + i * 0.1}s` }} />
                                        <span className="text-white/75 text-base sm:text-lg font-light leading-relaxed">{fit}</span>
                                    </li>
                                ))}
                            </ul>
                            <p data-reveal className="mt-7 text-white/45 text-sm sm:text-base leading-relaxed">
                                Need more customers first?{' '}
                                <Link to="/marketer" className="link-underline text-white/70 hover:text-white">Start with the marketing side.</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ, on the page and in the schema */}
            <section className={WRAP}>
                <div className={PANEL}>
                    <div className="grid lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] gap-8 lg:gap-16">
                        <h2 data-reveal="lines" className={`${H2} lg:sticky lg:top-28 self-start`}>
                            Straight answers.
                        </h2>
                        <FaqAccordion items={FAQ} />
                    </div>
                </div>
            </section>

            {/* CLOSE. Big line, one ask, a way to email, and a sign-off. */}
            <section className="py-20 sm:py-28 md:py-36 px-5 sm:px-6 md:px-8 text-center">
                <div className="max-w-4xl mx-auto flex flex-col items-center w-full">
                    <h2 data-reveal="lines" className="text-4xl sm:text-5xl md:text-7xl font-sans font-medium tracking-tight text-white leading-[1.02] mb-6">
                        Have a job you want <span className="drama-text text-brand-accent">off your plate?</span>
                    </h2>
                    <p data-reveal className="text-base sm:text-lg text-white/50 font-light mb-10 max-w-xl">
                        Tell me what eats your week. I will tell you straight whether an agent can do it, and what it would take.
                    </p>
                    <CallSteps className="mb-10 max-w-3xl" steps={CALL_STEPS} />
                    <div data-reveal className="w-full sm:w-auto">
                        <CTAButton size="xl" halo glint onClick={openCalModal} className="w-full sm:w-auto">
                            Book a 15-Minute Call
                        </CTAButton>
                    </div>
                    <p data-reveal className="mt-6 text-white/40 text-sm">
                        Or email <a href="mailto:nate@aiautomationkings.com" className="link-underline text-white/65 hover:text-white">nate@aiautomationkings.com</a>
                    </p>
                    <p data-reveal aria-hidden="true" className="drama-text text-brand-accent text-5xl sm:text-6xl mt-12">
                        Nate
                    </p>
                </div>
            </section>

            {openAgent && (
                <AgentDetail agent={openAgent} onClose={() => setOpenAgent(null)} onBook={openCalModal} />
            )}
        </div>
    );
}
