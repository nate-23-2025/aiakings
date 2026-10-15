import { useEffect, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { prefersReducedMotion } from '../../lib/motion';

// Stage one of the loop. Somebody asks, and a short list of names comes back.
// The answer is deliberately mocked with "Your business" and two unnamed bars
// rather than invented company names, so nothing here reads as a real result.
const ASKS = [
    'best mobile detailer near me',
    'who can fix a water heater today',
    'top rated roofer in my area',
    'lawn service that comes out this week',
];

// One interval drives the whole card. Ticks rather than nested timeouts, so
// there is never a stray timer left behind between questions.
const TICK_MS = 45;
const HOLD_BEFORE_ANSWER = 8;
const HOLD_AFTER_ANSWER = 90;

const START = { i: 0, chars: 0, phase: 'typing', hold: 0 };
const SETTLED = { i: 0, chars: ASKS[0].length, phase: 'answered', hold: 0 };

function advance(s) {
    const ask = ASKS[s.i];
    if (s.phase === 'typing') {
        if (s.chars < ask.length) return { ...s, chars: s.chars + 1 };
        return { ...s, phase: 'pause', hold: 0 };
    }
    if (s.phase === 'pause') {
        if (s.hold < HOLD_BEFORE_ANSWER) return { ...s, hold: s.hold + 1 };
        return { ...s, phase: 'answered', hold: 0 };
    }
    if (s.hold < HOLD_AFTER_ANSWER) return { ...s, hold: s.hold + 1 };
    return { i: (s.i + 1) % ASKS.length, chars: 0, phase: 'typing', hold: 0 };
}

export default function AnswerEngine() {
    const [reduced] = useState(prefersReducedMotion);
    const [state, setState] = useState(() => (prefersReducedMotion() ? SETTLED : START));

    useEffect(() => {
        if (reduced) return;
        const id = setInterval(() => setState(advance), TICK_MS);
        return () => clearInterval(id);
    }, [reduced]);

    const typed = ASKS[state.i].slice(0, state.chars);
    const answered = state.phase === 'answered';

    return (
        <div className="bg-[#15151A] border border-white/5 rounded-[2rem] p-6 sm:p-7 h-80 flex flex-col relative shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-brand-accent font-semibold">The Ask</span>
            </div>

            {/* The question, typed the way a customer types it */}
            <div className="flex items-center gap-3 bg-[#1A1A22] border border-white/10 rounded-2xl px-4 py-3">
                <Search size={15} className="text-white/30 shrink-0" />
                <span className="font-mono text-[11px] sm:text-xs text-white/80 truncate">
                    {typed}
                    <span className="inline-block w-[2px] h-3 ml-[2px] bg-brand-accent align-middle animate-pulse" />
                </span>
            </div>

            {/* What comes back */}
            <div className="mt-5 flex-grow flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-white/25 mb-3">The answer</span>

                <div
                    className="flex items-center gap-3 bg-brand-accent/10 border border-brand-accent/30 rounded-xl px-4 py-3 transition-all duration-500"
                    style={{ opacity: answered ? 1 : 0, transform: answered ? 'translateY(0)' : 'translateY(8px)' }}
                >
                    <span className="grid place-items-center w-5 h-5 rounded-full bg-brand-accent shrink-0">
                        <Check size={12} strokeWidth={3} className="text-brand-primary" />
                    </span>
                    <span className="text-sm text-white font-medium">Your business</span>
                </div>

                {/* The other two results are always drawn. Only the named one
                    animates, so the card never sits empty mid-cycle. */}
                {[0, 1].map((i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 mt-2">
                        <span className="w-5 h-5 rounded-full border border-white/10 shrink-0" />
                        <span className="h-2 rounded-full bg-white/10" style={{ width: i === 0 ? '58%' : '44%' }} />
                    </div>
                ))}
            </div>
        </div>
    );
}
