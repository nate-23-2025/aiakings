import { useEffect, useState } from 'react';
import { Phone, CalendarDays, UserRound, FileText, Hand, MessageSquare, Check } from 'lucide-react';
import { prefersReducedMotion } from '../../lib/motion';
import { useInView } from '../../hooks/useInView';

// One agent run, start to finish: a call comes in, the agent checks the
// calendar and the customer records, drafts the quote, then stops and waits
// for the owner's OK before it books anything. The pause is the point: it
// shows the guardrail, not just the speed. Illustration only, no real data.
const STEPS = [
    { Icon: Phone, tool: 'Phone', text: 'New call. Wants a quote for Saturday' },
    { Icon: CalendarDays, tool: 'Calendar', text: 'Checked the calendar. Saturday morning is open' },
    { Icon: UserRound, tool: 'Records', text: 'Found them in your records. Returning customer' },
    { Icon: FileText, tool: 'Price list', text: 'Drafted the quote from your price list' },
    { Icon: Hand, tool: 'You', text: 'Waiting on your OK', checkpoint: true },
    { Icon: MessageSquare, tool: 'Texts', text: 'Approved. Booked and confirmed by text' },
];
const TOOLS = ['Phone', 'Calendar', 'Records', 'Price list', 'Texts'];

const LAST = 11;     // ticks per cycle
const APPROVE = 7;   // the tick the owner says yes
const DONE = 8;      // the tick the booking goes out
const TICK_MS = 1000;

function visibleCount(s) {
    if (s <= 5) return s;
    return s < DONE ? 5 : 6;
}

export default function AgentRun() {
    const [reduced] = useState(prefersReducedMotion);
    const [step, setStep] = useState(() => (prefersReducedMotion() ? 10 : 0));
    const [ref, inView] = useInView();

    useEffect(() => {
        if (reduced || !inView) return;
        const id = setInterval(() => setStep((s) => (s >= LAST ? 0 : s + 1)), TICK_MS);
        return () => clearInterval(id);
    }, [reduced, inView]);

    const shown = visibleCount(step);
    const waiting = step >= 5 && step < APPROVE;
    const approved = step >= APPROVE;
    const done = step >= DONE;
    const activeTool = shown > 0 ? STEPS[shown - 1].tool : null;

    const status = done
        ? { label: 'Done', cls: 'bg-emerald-400/10 text-emerald-400/90', dot: 'bg-emerald-400' }
        : waiting
            ? { label: 'Waiting on you', cls: 'bg-brand-accent/15 text-brand-accent', dot: 'bg-brand-accent' }
            : { label: 'Working', cls: 'bg-white/[0.06] text-white/60', dot: 'bg-white/60' };

    return (
        <div ref={ref} className="w-full max-w-[460px] mx-auto">
            <div data-spotlight className="relative rounded-[2rem] border border-white/[0.08] bg-[#15151A] p-5 sm:p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)] overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-accent">One agent, one job</span>
                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest transition-colors duration-500 ${status.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${status.dot}`} />
                        {status.label}
                    </span>
                </div>

                {/* The tools it is allowed to touch. The one in use lights up. */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {TOOLS.map((t) => {
                        const on = t === activeTool;
                        return (
                            <span
                                key={t}
                                className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest transition-colors duration-500 ${
                                    on ? 'border-brand-accent/70 text-brand-accent bg-brand-accent/10' : 'border-white/10 text-white/35'
                                }`}
                            >
                                {t}
                            </span>
                        );
                    })}
                </div>

                <ol className="flex flex-col gap-2 min-h-[300px]">
                    {STEPS.map((item, i) => {
                        const { Icon, tool, text, checkpoint } = item;
                        const on = i < shown;
                        const style = {
                            opacity: on ? 1 : 0,
                            transform: on ? 'none' : 'translateY(8px)',
                            transition: 'opacity 0.45s ease, transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.4s ease, background-color 0.4s ease',
                        };
                        if (checkpoint) {
                            return (
                                <li
                                    key={text}
                                    style={style}
                                    className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 ${
                                        approved ? 'border-white/[0.07] bg-[#1A1A22]' : 'border-brand-accent/50 bg-brand-accent/[0.08]'
                                    }`}
                                >
                                    <span className="grid place-items-center w-7 h-7 rounded-full bg-brand-accent/15 shrink-0">
                                        <Icon size={13} className="text-brand-accent" />
                                    </span>
                                    <span className="text-xs text-white/80 flex-grow">{approved ? 'You said yes' : text}</span>
                                    <span
                                        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all duration-300 ${
                                            approved ? 'bg-emerald-400/15 text-emerald-400' : 'bg-brand-accent text-brand-primary'
                                        } ${waiting ? 'animate-pulse' : ''}`}
                                    >
                                        {approved ? <><Check size={10} strokeWidth={3} /> Approved</> : 'Approve'}
                                    </span>
                                </li>
                            );
                        }
                        return (
                            <li key={text} style={style} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#1A1A22] px-3.5 py-2.5">
                                <span className="grid place-items-center w-7 h-7 rounded-full bg-white/[0.05] shrink-0">
                                    <Icon size={13} className="text-white/60" />
                                </span>
                                <span className="text-xs text-white/75 flex-grow">{text}</span>
                                <span className="font-mono text-[9px] uppercase tracking-wider text-white/30 shrink-0">{tool}</span>
                            </li>
                        );
                    })}
                </ol>

                <p className="mt-4 pt-4 border-t border-white/[0.06] text-[10px] text-white/30 leading-snug">
                    Every step logged. Anything risky waits for you.
                </p>
            </div>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-white/25">Illustration of one job, start to finish</p>
        </div>
    );
}
