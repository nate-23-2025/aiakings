import { useLayoutEffect, useRef } from 'react';
import { Check, PhoneIncoming, CalendarCheck, ShieldCheck, MessageSquare, BookOpen } from 'lucide-react';
import { useTicks } from '../../hooks/useTicks';

// The phone agent breakdown, drawn: one call start to finish, then the text
// that lands on the owner's phone. It follows the phone agent rules: it says
// what it is, answers from the business's own information, only offers a
// time the calendar confirmed, and tells the owner right after. Illustration.
const CALL = [
    { at: 1, who: 'agent', text: 'Thanks for calling. I’m the virtual assistant for Your Business. How can I help?', badge: 'Says it’s AI' },
    { at: 2, who: 'caller', text: 'Do you do ceramic coating? Could you come out Saturday?' },
    { at: 3, who: 'agent', text: 'We do, right in your driveway. Let me check Saturday for you.', info: true },
    { at: 4, who: 'tool', text: 'Checked the calendar. Saturday 10 AM is open' },
    { at: 5, who: 'agent', text: 'I have Saturday at 10. Want me to book it?' },
    { at: 6, who: 'caller', text: 'Yes, book it.' },
    { at: 7, who: 'tool', text: 'Booked into your calendar', ok: true },
];
const TEXT_AT = 8;
const TOTAL = 12;

const RULES = ['Only confirmed times', 'A person on request', 'Says it’s AI', 'Tested before live'];

export default function PhoneVisual() {
    const t = useTicks(TOTAL, 1150, TOTAL - 1);
    const boxRef = useRef(null);
    const innerRef = useRef(null);
    const shown = CALL.filter((m) => t >= m.at);
    const texted = t >= TEXT_AT;
    const status = t === 0 ? 'Ringing' : t >= 7 ? 'Booked' : 'On the call';

    // Keep the newest line in view by sliding the log up, like a chat.
    useLayoutEffect(() => {
        const box = boxRef.current;
        const inner = innerRef.current;
        if (!box || !inner) return;
        inner.style.transform = `translateY(${-Math.max(0, inner.scrollHeight - box.clientHeight)}px)`;
    }, [shown.length]);

    const enter = 'animate-[bubble-pop_0.45s_cubic-bezier(0.2,1.2,0.35,1)_both]';

    return (
        <div className="rounded-[1.5rem] border border-white/[0.08] bg-[#0F0F14] p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-white/70 text-[13px] font-medium">
                    <span className="relative grid place-items-center">
                        {t === 0 && <span className="absolute inset-[-6px] rounded-full border border-brand-accent/60 animate-ping" />}
                        <PhoneIncoming size={14} className="text-brand-accent" />
                    </span>
                    Incoming call
                </span>
                <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest transition-colors duration-500 ${
                    t >= 7 ? 'bg-emerald-400/10 text-emerald-400/90' : 'bg-brand-accent/15 text-brand-accent'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${t >= 7 ? 'bg-emerald-400' : 'bg-brand-accent animate-pulse'}`} />
                    {status}
                </span>
            </div>

            <div
                ref={boxRef}
                className="relative h-[262px] overflow-hidden"
                style={{ maskImage: 'linear-gradient(180deg, transparent, #000 16%)', WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 16%)' }}
            >
                <div ref={innerRef} className="absolute inset-x-0 top-0 flex flex-col gap-2 pt-10 transition-transform duration-500 ease-out">
                    {shown.map((m) => {
                        if (m.who === 'tool') {
                            return (
                                <div key={m.at} className={`self-center flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-widest ${enter} ${
                                    m.ok ? 'bg-emerald-400/10 text-emerald-400/90' : 'bg-white/[0.05] text-white/45'
                                }`}>
                                    {m.ok ? <Check size={10} strokeWidth={3} /> : <CalendarCheck size={10} />}
                                    {m.text}
                                </div>
                            );
                        }
                        const agent = m.who === 'agent';
                        return (
                            <div key={m.at} className={`max-w-[86%] ${agent ? 'self-start' : 'self-end'} ${enter}`}>
                                <p className={`font-mono text-[8px] uppercase tracking-widest mb-1 ${agent ? 'text-brand-accent/80' : 'text-white/30 text-right'}`}>
                                    {agent ? 'Phone agent' : 'Caller'}
                                </p>
                                <div className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug ${
                                    agent ? 'rounded-bl-md bg-[#1F1F28] text-white/85' : 'rounded-br-md bg-brand-accent/15 text-white/80'
                                }`}>
                                    {m.text}
                                </div>
                                {m.badge && (
                                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-brand-accent/40 px-2 py-[2px] font-mono text-[8px] uppercase tracking-widest text-brand-accent">
                                        <ShieldCheck size={9} /> {m.badge}
                                    </span>
                                )}
                                {m.info && (
                                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-[2px] font-mono text-[8px] uppercase tracking-widest text-white/45">
                                        <BookOpen size={9} /> From the business&apos;s own info
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* The owner's phone. The text lands right after the call. */}
            <div className="mt-4 rounded-[1.4rem] border-[3px] border-[#2A2A35] bg-gradient-to-b from-[#1A1A22] to-[#121218] px-4 pt-3 pb-4">
                <div className="flex items-center justify-between font-mono text-[9px] text-white/35 mb-3">
                    <span>Owner&apos;s phone</span>
                    <span className="w-10 h-1 rounded-full bg-white/15" />
                </div>
                <div className="relative h-[86px]">
                    <p className={`absolute inset-0 grid place-items-center text-[11px] text-white/20 transition-opacity duration-300 ${texted ? 'opacity-0' : 'opacity-100'}`}>
                        No new messages
                    </p>
                    <div
                        className="absolute inset-x-0 top-0 rounded-2xl bg-white/[0.07] border border-white/[0.08] p-3 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1.2)]"
                        style={{ opacity: texted ? 1 : 0, translate: texted ? '0 0' : '0 -14px' }}
                    >
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="grid place-items-center w-5 h-5 rounded-md bg-emerald-500/80">
                                <MessageSquare size={11} className="text-white" />
                            </span>
                            <span className="text-[11px] font-semibold text-white/80">Your business line</span>
                            <span className="ml-auto font-mono text-[9px] text-white/30">now</span>
                        </div>
                        <p className="text-[12px] leading-snug text-white/75">
                            New booking: Saturday 10 AM, ceramic coating. Caller asked if you come to them.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
                {RULES.map((r) => (
                    <span key={r} className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-white/45">
                        <ShieldCheck size={10} className="text-brand-accent/70" /> {r}
                    </span>
                ))}
            </div>
            <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-widest text-white/25">Illustration of one call</p>
        </div>
    );
}
