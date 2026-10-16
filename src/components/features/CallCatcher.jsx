import { useEffect, useState } from 'react';
import { PhoneCall } from 'lucide-react';
import { prefersReducedMotion } from '../../lib/motion';
import { useInView } from '../../hooks/useInView';

// Stage two. The times a local owner physically cannot pick up are the times
// the phone rings most, so the log is deliberately set after hours.
const CALLS = [
    { time: '7:14 PM', label: 'New caller', state: 'Answered' },
    { time: '8:02 PM', label: 'Asked for a quote', state: 'Answered' },
    { time: '9:37 PM', label: 'Wants Saturday', state: 'Booked' },
    { time: '6:20 AM', label: 'Called back', state: 'Answered' },
];

// Two extra beats past the last call so the finished log holds on screen
// before the cycle restarts, and it restarts at one row rather than none.
const HOLD_BEATS = 2;

export default function CallCatcher() {
    const [reduced] = useState(prefersReducedMotion);
    const [step, setStep] = useState(() => (prefersReducedMotion() ? CALLS.length : 1));
    const [ref, inView] = useInView();

    useEffect(() => {
        if (reduced || !inView) return;
        const tick = setInterval(() => {
            setStep((n) => (n >= CALLS.length + HOLD_BEATS ? 1 : n + 1));
        }, 1300);
        return () => clearInterval(tick);
    }, [reduced, inView]);

    const visible = Math.min(step, CALLS.length);

    return (
        <div ref={ref} data-spotlight className="bg-[#15151A] border border-white/5 rounded-[2rem] p-6 sm:p-7 h-80 flex flex-col relative shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <PhoneCall size={13} className="text-brand-accent" />
                    <span className="text-[10px] uppercase tracking-widest text-brand-accent font-semibold">After hours</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] uppercase tracking-widest text-emerald-400/90 font-mono">Picked up</span>
                </div>
            </div>

            <div className="flex flex-col gap-2 flex-grow">
                {CALLS.map((call, i) => {
                    const shown = i < visible;
                    const booked = call.state === 'Booked';
                    return (
                        <div
                            key={call.time}
                            className="flex items-center gap-3 bg-[#1A1A22] border border-white/[0.07] rounded-xl px-3.5 py-2.5 transition-all duration-500"
                            style={{
                                opacity: shown ? 1 : 0.12,
                                transform: shown ? 'translateX(0)' : 'translateX(-10px)',
                            }}
                        >
                            <span className="font-mono text-[10px] text-white/35 w-14 shrink-0">{call.time}</span>
                            <span className="text-xs text-white/70 truncate flex-grow">{call.label}</span>
                            <span
                                className={`font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-md shrink-0 ${
                                    booked
                                        ? 'bg-brand-accent text-brand-primary font-semibold'
                                        : 'bg-emerald-400/10 text-emerald-400/90'
                                }`}
                            >
                                {call.state}
                            </span>
                        </div>
                    );
                })}
            </div>

            <p className="text-[10px] text-white/25 mt-4 leading-snug">
                Nothing went to voicemail.
            </p>
        </div>
    );
}
