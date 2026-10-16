import { Check } from 'lucide-react';

// Five things around one core, each sending a pulse into it in turn. On the
// Marketer hero it is the five things the monthly work keeps in order feeding
// the business (what feeds it, never where it ranks, because nobody controls
// that). On the Dev page it is several agents sharing one business.
// Chip positions are percentages of a 400 x 360 box, the same box the SVG
// lines are drawn in, so the two layers always line up.
const POSITIONS = [
    { x: 50, y: 12 },
    { x: 84, y: 34 },
    { x: 73, y: 84 },
    { x: 27, y: 84 },
    { x: 16, y: 34 },
];
const MARKETER_LABELS = ['Answer pages', 'Readable site', 'New reviews', 'Live profile', 'Listings match'];
const CX = 200;
const CY = 180;

export default function SignalWeb({
    labels = MARKETER_LABELS,
    core = 'Your business',
    caption = 'What I keep in order, every month',
}) {
    const SIGNALS = labels.slice(0, POSITIONS.length).map((label, i) => ({ label, ...POSITIONS[i] }));
    return (
        <div className="w-full max-w-[460px] mx-auto">
            <div className="relative aspect-[10/9]">
                <svg viewBox="0 0 400 360" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 w-full h-full overflow-visible">
                    {SIGNALS.map((s, i) => {
                        const d = `M ${s.x * 4} ${s.y * 3.6} L ${CX} ${CY}`;
                        return (
                            <g key={s.label}>
                                <path d={d} stroke="rgba(201,168,76,0.22)" strokeWidth="1" strokeDasharray="3 5" />
                                <path
                                    d={d}
                                    pathLength="100"
                                    className="signal-pulse"
                                    stroke="#F1DC9B"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    style={{ '--i': i, filter: 'drop-shadow(0 0 4px rgba(201,168,76,0.9))' }}
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* The business everything feeds */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span aria-hidden="true" className="core-ring absolute inset-0 rounded-2xl border border-brand-accent/60" />
                    <div className="relative flex items-center gap-2.5 rounded-2xl border border-brand-accent/40 bg-[#1A1710] px-4 py-3 sm:px-5 sm:py-3.5 shadow-[0_0_50px_rgba(201,168,76,0.22)]">
                        <span className="grid place-items-center w-5 h-5 rounded-full bg-brand-accent shrink-0">
                            <Check size={12} strokeWidth={3} className="text-brand-primary" />
                        </span>
                        <span className="text-white text-sm sm:text-base font-medium whitespace-nowrap">{core}</span>
                    </div>
                </div>

                {SIGNALS.map((s, i) => (
                    <span
                        key={s.label}
                        className="signal-chip absolute whitespace-nowrap rounded-full border border-white/10 bg-[#15151A]/95 px-2.5 py-1.5 sm:px-3.5 sm:py-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                        style={{ left: `${s.x}%`, top: `${s.y}%`, '--i': i }}
                    >
                        {s.label}
                    </span>
                ))}
            </div>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-white/30">
                {caption}
            </p>
        </div>
    );
}
