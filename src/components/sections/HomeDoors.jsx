import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useCalModal } from '../../context/CalModalContext';
import CTAButton from '../motion/CTAButton';
import { DEV_FITS } from '../../data/agents';

// The two ways in, right under the hero. Two door cards act as tabs; the guide
// for the chosen door sits underneath: how it works, who it is for, proof, and
// the next click. Marketing is chosen by default because most visitors come
// from a cold call about a website or AI SEO. Both guides stay in the page for
// search engines; the inactive one is just hidden.
//
// The guides animate with CSS (they show and hide, so scroll-triggered reveals
// would measure a hidden panel wrong). Each visual loads in its own chunk, and
// the agent one only when that door is opened.
const SignalWeb = lazy(() => import('../features/SignalWeb'));
const AgentRun = lazy(() => import('../features/AgentRun'));

const DOORS = [
    {
        id: 'marketing',
        who: 'Nate the Marketer',
        audience: 'For local service businesses',
        title: 'Get found, get called, get picked.',
        includes: ['Website', 'Reviews', 'AI SEO'],
    },
    {
        id: 'dev',
        who: 'Nate the Dev',
        audience: 'For teams ready for systems',
        title: 'Software that runs the work.',
        includes: ['AI agents', 'AI operating systems'],
    },
];

const MARKETING_STEPS = [
    { title: 'Start where you are', body: 'No website? I build one, live in days. Have one? I find what Google and AI cannot read or trust, and fix it.' },
    { title: 'Get found', body: 'Every service you offer and every question you get asked becomes a page that answers it. Your listings match everywhere, and your Google profile stays alive.' },
    { title: 'Get called', body: 'Every call gets picked up, nights and weekends included, and the job goes on your calendar.' },
    { title: 'Get picked', body: 'Every finished job ends with the same review request to every customer. A monthly report tells you what moved.' },
];

const MARKETING_FITS = [
    'You do the work locally, in one city or metro',
    'One more job a week is worth real money to you',
    'Customers find you by searching, not only by referral',
    'Owner operated, or close enough that decisions get made fast',
];

const DEV_STEPS = [
    { title: 'Pick one job', body: 'What the agent does, what it can touch, and exactly when it hands off to a person.' },
    { title: 'Connect your tools', body: 'Your phone, calendar, customer records, inbox, and the software you already pay for. Connecting things is what I specialize in.' },
    { title: 'Fence it in', body: 'Only the access the job needs. Anything risky waits for your OK, every action is logged, and it is tested before it touches a customer.' },
    { title: 'Grow it into a system', body: 'Once one agent works, more join it, sharing the same memory and the same rules. That is an AI operating system.' },
];

const DEV_PROOF = [
    { name: 'HealthCo', role: 'Lead developer on their AI agent architecture' },
    { name: 'Allen AI', role: 'Co-founder and CTO, custom AI for law firms' },
    { name: 'My own business', role: 'Runs on an AI operating system I built' },
];

function Steps({ items }) {
    return (
        <ol className="border-t border-white/[0.07]">
            {items.map(({ title, body }, i) => (
                <li
                    key={title}
                    className="door-in grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b border-white/[0.07] py-5"
                    style={{ '--d': `${0.12 + i * 0.07}s` }}
                >
                    <span className="text-2xl font-light text-white/90 tabular-nums leading-none">
                        {String(i + 1).padStart(2, '0')}<span className="text-brand-accent">.</span>
                    </span>
                    <span>
                        <span className="block text-white font-semibold mb-1">{title}</span>
                        <span className="block text-white/50 text-sm sm:text-base leading-relaxed">{body}</span>
                    </span>
                </li>
            ))}
        </ol>
    );
}

function Fits({ items }) {
    return (
        <ul className="flex flex-col gap-3.5">
            {items.map((fit, i) => (
                <li key={fit} className="door-in flex items-start gap-3" style={{ '--d': `${0.3 + i * 0.06}s` }}>
                    <Check className="w-4 h-4 text-brand-accent shrink-0 mt-1" strokeWidth={2.5} />
                    <span className="text-white/75 text-sm sm:text-base leading-relaxed">{fit}</span>
                </li>
            ))}
        </ul>
    );
}

const LABEL = 'font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4';

export default function HomeDoors({ door, setDoor }) {
    const { openCalModal } = useCalModal();

    return (
        <section id="doors" className="scroll-mt-20 py-20 sm:py-28 md:py-32 px-5 sm:px-6 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 sm:mb-12">
                    <span data-reveal className="block text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-4">
                        Pick your door
                    </span>
                    <h2 data-reveal="lines" className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight">
                        Two ways I work <span className="drama-text text-brand-accent">with a business.</span>
                    </h2>
                </div>

                {/* The doors */}
                <div data-reveal-group role="tablist" aria-label="Two ways to work with me" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DOORS.map((d) => {
                        const on = door === d.id;
                        return (
                            <button
                                key={d.id}
                                type="button"
                                role="tab"
                                id={`door-${d.id}`}
                                aria-selected={on}
                                aria-controls={`guide-${d.id}`}
                                onClick={() => setDoor(d.id)}
                                data-spotlight
                                className={`group relative text-left rounded-[1.75rem] border p-6 sm:p-7 transition-[border-color,background-color,box-shadow] duration-300 ${
                                    on
                                        ? 'border-brand-accent/60 bg-[#17150F]/90 shadow-[0_0_50px_rgba(201,168,76,0.14)]'
                                        : 'border-white/10 bg-[#15151A]/80 hover:border-white/25'
                                }`}
                            >
                                <span className="flex items-center justify-between gap-4 mb-5">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-accent">{d.who}</span>
                                    <span className={`grid place-items-center w-6 h-6 rounded-full border transition-colors duration-300 ${on ? 'border-brand-accent bg-brand-accent' : 'border-white/25'}`}>
                                        {on && <Check size={12} strokeWidth={3.5} className="text-brand-primary" />}
                                    </span>
                                </span>
                                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">{d.audience}</span>
                                <span className="block text-2xl sm:text-3xl font-sans font-medium tracking-tight text-white leading-tight mb-5">{d.title}</span>
                                <span className="flex flex-wrap gap-1.5">
                                    {d.includes.map((x) => (
                                        <span key={x} className={`rounded-full border px-3 py-1 text-xs transition-colors duration-300 ${on ? 'border-brand-accent/40 text-white/85' : 'border-white/10 text-white/50'}`}>
                                            {x}
                                        </span>
                                    ))}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* The guide for the chosen door */}
                <div data-reveal className="mt-4 rounded-[2rem] sm:rounded-[2.5rem] border border-white/[0.06] bg-[#111116]/80 p-6 sm:p-10 lg:p-12">
                    <div id="guide-marketing" role="tabpanel" aria-labelledby="door-marketing" hidden={door !== 'marketing'}>
                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-10 lg:gap-14">
                            <div>
                                <p className={LABEL}>How it works</p>
                                <Steps items={MARKETING_STEPS} />
                                <p className={`${LABEL} mt-9`}>Who this is for</p>
                                <Fits items={MARKETING_FITS} />
                                <p className="door-in mt-5 text-white/40 text-sm leading-relaxed" style={{ '--d': '0.55s' }}>
                                    If that is not you, say so on the call and I will tell you straight.
                                </p>
                                <div className="door-in mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6" style={{ '--d': '0.6s' }}>
                                    <CTAButton size="md" onClick={openCalModal} className="w-full sm:w-auto">Book a 15-Minute Call</CTAButton>
                                    <Link to="/marketer" className="group link-underline self-center sm:self-auto text-white/70 hover:text-white text-sm">
                                        Explore Nate the Marketer <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="door-in lg:pt-8" style={{ '--d': '0.2s' }}>
                                <Suspense fallback={<div className="aspect-[10/9]" />}>
                                    <SignalWeb />
                                </Suspense>
                            </div>
                        </div>
                    </div>

                    <div id="guide-dev" role="tabpanel" aria-labelledby="door-dev" hidden={door !== 'dev'}>
                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-10 lg:gap-14">
                            <div>
                                <p className={LABEL}>How it works</p>
                                <Steps items={DEV_STEPS} />
                                <p className={`${LABEL} mt-9`}>Who this is for</p>
                                <Fits items={DEV_FITS} />
                                <p className="door-in mt-5 text-white/40 text-sm leading-relaxed" style={{ '--d': '0.6s' }}>
                                    Need more calls first?{' '}
                                    <button type="button" onClick={() => setDoor('marketing')} className="link-underline text-white/65 hover:text-white">
                                        Start with the marketing side.
                                    </button>
                                </p>
                                <div className="door-in mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6" style={{ '--d': '0.65s' }}>
                                    <CTAButton size="md" onClick={openCalModal} className="w-full sm:w-auto">Talk to Me About an Agent</CTAButton>
                                    <Link to="/developer" className="group link-underline self-center sm:self-auto text-white/70 hover:text-white text-sm">
                                        Explore Nate the Dev <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="door-in" style={{ '--d': '0.2s' }}>
                                {door === 'dev' && (
                                    <Suspense fallback={<div className="h-[520px] rounded-[2rem] border border-white/[0.08] bg-[#15151A]" />}>
                                        <AgentRun />
                                    </Suspense>
                                )}
                            </div>
                        </div>

                        <ul className="door-in mt-10 grid grid-cols-1 md:grid-cols-3 border-t border-white/[0.07]" style={{ '--d': '0.7s' }}>
                            {DEV_PROOF.map(({ name, role }) => (
                                <li key={name} className="flex flex-col gap-1.5 border-b md:border-b-0 border-white/[0.07] py-5 md:pr-6">
                                    <span className="text-white font-medium">{name}</span>
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent/90">{role}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
