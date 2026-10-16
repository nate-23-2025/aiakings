import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, PhoneIncoming, CalendarCheck, ShieldCheck } from 'lucide-react';
import { prefersReducedMotion } from '../../lib/motion';

// The Allen AI breakdown, drawn. Two builds behind one toggle:
//   System: a client's whole journey as a track. A gold marker walks it stage
//   by stage, and each stage shows the tool behind it and whether it runs on
//   its own or waits for one click. Stages and modes follow the build notes
//   (allen_ai_build_breakdown.md); every payment syncs to the books.
//   Receptionist: one call playing out, per the receptionist's own rules:
//   care first, check for an existing attorney, no predictions, only open
//   times, booked only when the calendar confirms. Illustration, not a recording.
// Only mounted while the popup is open, so nothing runs in the background.

const STAGES = [
    { name: 'Inquiry', what: 'Read, sorted by priority, logged, and answered with a confirmation', tool: 'Typeform', mode: 'auto' },
    { name: 'Discovery call', what: 'Booked, and the tracker updates itself', tool: 'Cal.com', mode: 'auto' },
    { name: 'Scope', what: 'The call transcript becomes a full scope, timeline, and proposal', tool: 'Claude', mode: 'review' },
    { name: 'Contracts', what: 'Every contract out in a single signing session', tool: 'DocuSign', mode: 'click' },
    { name: 'Deposit', what: 'The invoice goes out the moment they sign', tool: 'Stripe', mode: 'auto' },
    { name: 'Welcome', what: 'Welcome packet, client folders, and the payment in the books', tool: 'Drive, QuickBooks', mode: 'auto' },
    { name: 'Build', what: 'The client hears at every milestone', tool: 'ClickUp', mode: 'click' },
    { name: 'Final invoice', what: 'Sent the moment the build is marked done', tool: 'Stripe', mode: 'auto' },
    { name: 'Check-ins', what: 'A monthly note to every retainer client', tool: 'Gmail', mode: 'auto' },
    { name: 'Referral', what: 'The referral ask goes out at the right moment', tool: 'Gmail', mode: 'click' },
];

const MODE = {
    auto: { label: 'Runs on its own', short: 'Auto' },
    click: { label: 'One click', short: 'One click' },
    review: { label: 'Reviewed, then sent', short: 'Review' },
};

const CALL = [
    { who: 'caller', text: 'I got rear-ended tonight and my back is killing me. I don’t know what to do.' },
    { who: 'agent', text: 'I’m so sorry that happened. You called the right place. Let’s get you some help.' },
    { who: 'agent', text: 'Do you already have an attorney for this?' },
    { who: 'caller', text: 'No, not yet.' },
    { who: 'caller', text: 'What do you think my case is worth?' },
    { who: 'agent', text: 'That’s exactly what an attorney can walk you through at your free consultation.', guard: 'No predictions' },
    { who: 'tool', text: 'Checked the calendar. 3 open times' },
    { who: 'agent', text: 'I have tomorrow at 10 or at 2. Which works better?' },
    { who: 'caller', text: 'Ten, please.' },
    { who: 'tool', text: 'Name, phone, and email collected' },
    { who: 'tool', text: 'Booked. Confirmation emailed', ok: true },
];

function Toggle({ view, setView }) {
    const options = [
        { id: 'system', label: 'Business system' },
        { id: 'call', label: 'Phone receptionist' },
    ];
    return (
        <div role="group" aria-label="Which build to show" className="relative grid grid-cols-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
            <span
                aria-hidden="true"
                className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-brand-accent transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{ transform: view === 'call' ? 'translateX(100%)' : 'none' }}
            />
            {options.map((o) => (
                <button
                    key={o.id}
                    type="button"
                    aria-pressed={view === o.id}
                    onClick={() => setView(o.id)}
                    className={`relative z-10 rounded-full px-3 py-2 text-xs sm:text-[13px] font-semibold transition-colors duration-300 ${
                        view === o.id ? 'text-brand-primary' : 'text-white/55 hover:text-white/80'
                    }`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

function SystemTrack() {
    const n = STAGES.length;
    const [reduced] = useState(prefersReducedMotion);
    // active: index of the stage being worked; n means finished, held for a beat
    const [active, setActive] = useState(() => (prefersReducedMotion() ? n : 0));

    useEffect(() => {
        if (reduced) return;
        const id = setInterval(() => setActive((a) => (a >= n + 2 ? 0 : a + 1)), 1100);
        return () => clearInterval(id);
    }, [reduced, n]);

    const at = Math.min(active, n);
    const current = at < n ? STAGES[at] : null;
    const fill = n > 1 ? Math.min(at, n - 1) / (n - 1) : 1;

    return (
        <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 font-mono text-[9px] uppercase tracking-widest text-white/40">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-accent" /> Runs on its own</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full border border-brand-sapphire-light" /> One click or a review</span>
            </div>

            <ol className="relative">
                {/* The track and how far along it the client is. Dots sit at 7px from the left. */}
                <span aria-hidden="true" className="absolute left-[7px] top-3 bottom-3 w-px bg-white/10" />
                <span
                    aria-hidden="true"
                    className="absolute left-[7px] top-3 bottom-3 w-px origin-top bg-gradient-to-b from-brand-accent to-[#F1DC9B] shadow-[0_0_10px_rgba(201,168,76,0.6)] transition-transform duration-700 ease-out"
                    style={{ transform: `scaleY(${fill})` }}
                />
                {STAGES.map((s, i) => {
                    const done = i < at;
                    const now = i === at;
                    const auto = s.mode === 'auto';
                    return (
                        <li key={s.name} className="relative flex items-center gap-3 py-[5px] pl-0">
                            <span className="relative z-10 grid place-items-center w-[15px] h-[15px] shrink-0">
                                {now && <span className="absolute inset-[-5px] rounded-full border border-brand-accent/70 animate-ping" />}
                                <span
                                    className={`w-[11px] h-[11px] rounded-full transition-all duration-500 ${
                                        auto
                                            ? (done || now ? 'bg-brand-accent' : 'bg-white/15')
                                            : (done || now ? 'border-2 border-brand-sapphire-light bg-brand-primary' : 'border-2 border-white/15 bg-brand-primary')
                                    } ${now ? 'scale-125 shadow-[0_0_14px_rgba(201,168,76,0.8)]' : ''}`}
                                />
                            </span>
                            <span
                                className={`flex-grow min-w-0 flex items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 transition-colors duration-500 ${
                                    now ? 'bg-brand-accent/10' : ''
                                }`}
                            >
                                <span className={`text-[13px] font-medium truncate transition-colors duration-500 ${now ? 'text-white' : done ? 'text-white/75' : 'text-white/30'}`}>
                                    {s.name}
                                </span>
                                <span className="flex items-center gap-2 shrink-0">
                                    <span className={`font-mono text-[9px] uppercase tracking-wider transition-colors duration-500 ${now || done ? 'text-white/45' : 'text-white/20'}`}>
                                        {s.tool}
                                    </span>
                                    <span
                                        className={`rounded-full px-1.5 py-[2px] font-mono text-[8px] uppercase tracking-wider transition-colors duration-500 ${
                                            now || done
                                                ? (auto ? 'bg-brand-accent/15 text-brand-accent' : 'border border-brand-sapphire/60 text-brand-sapphire-light')
                                                : 'border border-white/10 text-white/20'
                                        }`}
                                    >
                                        {MODE[s.mode].short}
                                    </span>
                                </span>
                            </span>
                        </li>
                    );
                })}
            </ol>

            {/* What the stage being worked actually does */}
            <div className="mt-4 min-h-[68px] rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3" aria-live="off">
                {current ? (
                    <>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-brand-accent mb-1">
                            Step {at + 1} of {n} &middot; {MODE[current.mode].label}
                        </p>
                        <p className="text-white/75 text-[13px] leading-snug">{current.what}</p>
                    </>
                ) : (
                    <>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-emerald-400/90 mb-1">Client journey complete</p>
                        <p className="text-white/75 text-[13px] leading-snug">From first inquiry to the referral ask, with nobody having to remember a step.</p>
                    </>
                )}
            </div>
        </div>
    );
}

function CallLog() {
    const n = CALL.length;
    const [reduced] = useState(prefersReducedMotion);
    const [shown, setShown] = useState(() => (prefersReducedMotion() ? n : 0));
    const boxRef = useRef(null);
    const innerRef = useRef(null);

    useEffect(() => {
        if (reduced) return;
        const id = setInterval(() => setShown((s) => (s >= n + 3 ? 0 : s + 1)), 1250);
        return () => clearInterval(id);
    }, [reduced, n]);

    // Keep the newest line in view by sliding the whole log up, like a chat.
    useLayoutEffect(() => {
        const box = boxRef.current;
        const inner = innerRef.current;
        if (!box || !inner) return;
        const overflow = Math.max(0, inner.scrollHeight - box.clientHeight);
        inner.style.transform = `translateY(${-overflow}px)`;
    }, [shown]);

    const visible = Math.min(shown, n);
    const booked = visible >= n;
    const status = booked ? 'Booked' : visible === 0 ? 'Ringing' : 'On the call';

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-white/70 text-[13px] font-medium">
                    <PhoneIncoming size={14} className="text-brand-accent" />
                    Incoming call, after hours
                </span>
                <span
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest transition-colors duration-500 ${
                        booked ? 'bg-emerald-400/10 text-emerald-400/90' : 'bg-brand-accent/15 text-brand-accent'
                    }`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${booked ? 'bg-emerald-400' : 'bg-brand-accent'} ${booked ? '' : 'animate-pulse'}`} />
                    {status}
                </span>
            </div>

            <div
                ref={boxRef}
                className="relative h-[430px] sm:h-[459px] overflow-hidden"
                style={{ maskImage: 'linear-gradient(180deg, transparent, #000 14%)', WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 14%)' }}
            >
                <div ref={innerRef} className="absolute inset-x-0 top-0 flex flex-col gap-2 pt-10 transition-transform duration-500 ease-out">
                    {CALL.slice(0, visible).map((m, i) => {
                        const enter = 'animate-[bubble-pop_0.45s_cubic-bezier(0.2,1.2,0.35,1)_both]';
                        if (m.who === 'tool') {
                            return (
                                <div key={i} className={`self-center flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-widest ${enter} ${
                                    m.ok ? 'bg-emerald-400/10 text-emerald-400/90' : 'bg-white/[0.05] text-white/45'
                                }`}>
                                    {m.ok ? <Check size={10} strokeWidth={3} /> : <CalendarCheck size={10} />}
                                    {m.text}
                                </div>
                            );
                        }
                        const agent = m.who === 'agent';
                        return (
                            <div key={i} className={`max-w-[85%] ${agent ? 'self-start' : 'self-end'} ${enter}`}>
                                <p className={`font-mono text-[8px] uppercase tracking-widest mb-1 ${agent ? 'text-brand-accent/80' : 'text-white/30 text-right'}`}>
                                    {agent ? 'Receptionist' : 'Caller'}
                                </p>
                                <div className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug ${
                                    agent ? 'rounded-bl-md bg-[#1F1F28] text-white/85' : 'rounded-br-md bg-brand-accent/15 text-white/80'
                                }`}>
                                    {m.text}
                                </div>
                                {m.guard && (
                                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-brand-accent/40 px-2 py-[2px] font-mono text-[8px] uppercase tracking-widest text-brand-accent">
                                        <ShieldCheck size={9} /> {m.guard}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* The rules it holds to on every call */}
            <div className="mt-3 flex flex-wrap gap-1.5">
                {['No legal advice', 'Only open times', 'Answers 24/7'].map((r) => (
                    <span key={r} className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-white/45">
                        <ShieldCheck size={10} className="text-brand-accent/70" /> {r}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function AllenVisual() {
    const [view, setView] = useState('system');
    return (
        <div className="rounded-[1.5rem] border border-white/[0.08] bg-[#0F0F14] p-4 sm:p-5">
            <Toggle view={view} setView={setView} />
            <div className="mt-5">
                {view === 'system' ? <SystemTrack key="system" /> : <CallLog key="call" />}
            </div>
            <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-widest text-white/25">
                {view === 'system' ? 'The real flow, stage by stage' : 'Illustration of one call'}
            </p>
        </div>
    );
}
