import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../lib/motion';
import { useInView } from '../../hooks/useInView';

// One agent working one job, as a live pipeline: a call comes in, the agent
// checks your records, works it out, and fans out to the calendar, a text, and
// your records, while a log underneath narrates each step. Adapted from the
// "AI Agent Pipeline" component on 21st.dev, rebuilt without an animation
// library (SVG motion paths and CSS), restyled to the brand, and stripped of
// the made-up throughput stats. Illustration only, no real data.
const LOG = [
    'New call: "Can you come out Saturday for a full detail?"',
    'Looking up the caller in your customer records',
    'Returning customer. Last visit was a ceramic coating',
    'Checking your calendar for Saturday openings',
    'Booked: Saturday 10 AM, and the calendar is updated',
    'Confirmation text sent to the customer',
    'Call summary saved to their record',
    'Done. Every step logged where you can see it',
    'Listening for the next call',
];

const PATHS = {
    a: 'M116,88 L158,88',
    b: 'M268,88 L306,88',
    c: 'M411,88 C425,88 435,50 448,50',
    d: 'M411,88 L448,88',
    e: 'M411,88 C425,88 435,126 448,126',
};

// [path, seconds per trip, start delay, radius, opacity]
const DOTS = [
    ['a', 1.05, 0, 2.5, 1], ['a', 1.05, 0.35, 1.8, 0.6], ['a', 1.05, 0.7, 1.3, 0.35],
    ['b', 0.9, 0.18, 2.5, 1], ['b', 0.9, 0.62, 1.8, 0.6],
    ['c', 1.3, 0.08, 2.2, 0.9], ['c', 1.3, 0.65, 1.5, 0.5],
    ['d', 1.15, 0.28, 2.2, 0.9], ['d', 1.15, 0.85, 1.5, 0.5],
    ['e', 1.4, 0.45, 2.2, 0.9], ['e', 1.4, 1.0, 1.5, 0.5],
];

const OUTPUTS = [
    { y: 35, label: 'Booked on calendar', color: '#34D399', pulse: false },
    { y: 73, label: 'Text sent', color: '#8EA5EE', pulse: true, delay: 0 },
    { y: 111, label: 'Record updated', color: '#8EA5EE', pulse: true, delay: 0.35 },
];

const isGold = (k) => k === 'a' || k === 'b';

function NodeLabel({ x, y, small, color = 'rgba(255,255,255,0.32)', children }) {
    return (
        <text
            x={x}
            y={y}
            textAnchor="middle"
            fontSize={small ? 8.5 : 12}
            fill={color}
            fontFamily={small ? 'JetBrains Mono, monospace' : 'Inter, sans-serif'}
            letterSpacing={small ? '1.2' : '0'}
        >
            {children}
        </text>
    );
}

export default function AgentPipeline() {
    const [reduced] = useState(prefersReducedMotion);
    const [i, setI] = useState(() => (prefersReducedMotion() ? 4 : 0));
    const [ref, inView] = useInView();

    useEffect(() => {
        if (reduced || !inView) return;
        const id = setInterval(() => setI((v) => (v + 1) % LOG.length), 2600);
        return () => clearInterval(id);
    }, [reduced, inView]);

    const live = !reduced && inView;

    return (
        <div ref={ref} data-spotlight className="relative w-full max-w-[720px] mx-auto rounded-2xl border border-white/[0.08] bg-[#0B0B0F] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-white/45">
                    <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${live ? 'animate-pulse' : ''}`} />
                    ONE AGENT AT WORK
                </span>
                <span className="font-mono text-[10px] tracking-[0.1em] text-white/25">Illustration</span>
            </div>

            <svg viewBox="0 0 586 172" className="block w-full" role="img" aria-label="A call comes in, the agent checks your records, then books the job, sends a text, and updates the record">
                <defs>
                    <linearGradient id="pl-agent" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#1C1810" />
                        <stop offset="1" stopColor="#0E1220" />
                    </linearGradient>
                </defs>

                {Object.entries(PATHS).map(([k, d]) => (
                    <path key={k} d={d} fill="none" stroke={isGold(k) ? 'rgba(201,168,76,0.32)' : 'rgba(91,123,213,0.32)'} strokeWidth="1.5" strokeDasharray="3 5" />
                ))}

                {live && DOTS.map(([k, dur, delay, r, op], n) => (
                    <circle key={n} r={r} fill={isGold(k) ? '#E1C46F' : '#8EA5EE'} opacity={op}>
                        <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={PATHS[k]} />
                    </circle>
                ))}

                <rect x="16" y="66" width="100" height="44" rx="8" fill="#15151A" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75" />
                <NodeLabel x={66} y={83} small>TRIGGER</NodeLabel>
                <NodeLabel x={66} y={100} color="rgba(255,255,255,0.88)">New call</NodeLabel>

                <rect x="158" y="66" width="110" height="44" rx="8" fill="#15151A" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75" />
                <NodeLabel x={213} y={83} small>LOOKUP</NodeLabel>
                <NodeLabel x={213} y={100} color="rgba(255,255,255,0.88)">Your records</NodeLabel>

                <rect x="306" y="53" width="105" height="70" rx="10" fill="url(#pl-agent)" stroke="#C9A84C" strokeWidth="1" />
                <rect x="318" y="53.5" width="80" height="1" rx="0.5" fill="rgba(241,220,155,0.6)" />
                <NodeLabel x={358} y={78} small color="rgba(225,196,111,0.9)">THE AGENT</NodeLabel>
                <text x="358" y="97" textAnchor="middle" fontSize="13" fill="#fff" fontFamily="Inter, sans-serif" fontWeight="500">Working</text>
                {[346, 358, 370].map((cx, n) => (
                    <circle key={cx} cx={cx} cy={112} r={2.6} fill="#E1C46F" className={live ? 'pl-pulse' : ''} style={{ animationDelay: `${n * 0.4}s` }} />
                ))}
                <NodeLabel x={358} y={142} small color="rgba(225,196,111,0.45)">YOUR RULES</NodeLabel>

                {OUTPUTS.map((o) => (
                    <g key={o.label}>
                        <rect x="448" y={o.y} width="124" height="30" rx="7" fill="#111116" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" />
                        <text x="503" y={o.y + 18.5} textAnchor="middle" fontSize="10.5" fill="rgba(255,255,255,0.72)" fontFamily="Inter, sans-serif">{o.label}</text>
                        <circle cx="561" cy={o.y + 8} r="3" fill={o.color} className={o.pulse && live ? 'pl-pulse' : ''} style={{ animationDelay: `${o.delay || 0}s` }} />
                    </g>
                ))}
            </svg>

            <div className="border-t border-white/[0.06] px-5 py-3 h-[54px] flex items-start gap-2">
                <span className="font-mono text-[13px] leading-[1.5] text-brand-accent/70 shrink-0">&rsaquo;</span>
                <p key={i} className="pl-log font-mono text-[11px] sm:text-[12px] leading-[1.55] text-white/60">{LOG[i]}</p>
            </div>

            {/* Honest labels where the original had invented stats */}
            <div className="border-t border-white/[0.06] px-5 py-3 grid grid-cols-3 gap-4">
                {[
                    ['Every step', 'logged'],
                    ['Anything risky', 'waits for you'],
                    ['Runs inside', 'your tools'],
                ].map(([a, b]) => (
                    <div key={a}>
                        <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/30 mb-1">{a}</p>
                        <p className="text-[13px] text-white/80">{b}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
