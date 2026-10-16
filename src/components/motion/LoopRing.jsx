// The loop from the copy next to it, drawn as a ring: found, call, job,
// review, and back to found. A comet goes around without stopping, and the
// stops light up as the reader scrolls down the chain beside it (active is the
// index of the line they have reached, -1 for none yet).
const C = 150;
const NODES = [
    { label: 'Found', x: C, y: 50, lx: C, ly: 32, anchor: 'middle' },
    { label: 'Call', x: 250, y: C, lx: 266, ly: C + 4, anchor: 'start' },
    { label: 'Job', x: C, y: 250, lx: C, ly: 278, anchor: 'middle' },
    { label: 'Review', x: 50, y: C, lx: 34, ly: C + 4, anchor: 'end' },
];

export default function LoopRing({ active = -1, className = '' }) {
    return (
        <svg
            viewBox="-40 0 380 300"
            className={className}
            role="img"
            aria-label="Getting found, the call, the job, and the review, each one feeding the next in a loop"
        >
            <defs>
                {/* The comet's dash starts at three o'clock and runs clockwise,
                    so the gradient fades from its tail to its head. */}
                <linearGradient id="loop-comet-grad" gradientUnits="userSpaceOnUse" x1="250" y1="150" x2="195" y2="239">
                    <stop offset="0" stopColor="#C9A84C" stopOpacity="0" />
                    <stop offset="1" stopColor="#F1DC9B" stopOpacity="1" />
                </linearGradient>
                <filter id="loop-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" />
                </filter>
            </defs>

            <circle cx={C} cy={C} r="100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />

            <g className="loop-comet">
                <circle cx={C} cy={C} r="100" fill="none" stroke="url(#loop-comet-grad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="110 518" />
                <circle cx="195.4" cy="239.1" r="6" fill="#C9A84C" opacity="0.6" filter="url(#loop-glow)" />
                <circle cx="195.4" cy="239.1" r="3" fill="#F7E9BE" />
            </g>

            {NODES.map((n, i) => {
                const lit = i <= active;
                const current = i === active;
                return (
                    <g key={n.label}>
                        {current && <circle className="loop-node-pulse" cx={n.x} cy={n.y} r="7" fill="none" stroke="#C9A84C" strokeWidth="1.5" />}
                        <circle
                            cx={n.x}
                            cy={n.y}
                            r="7"
                            fill={lit ? '#C9A84C' : '#15151A'}
                            stroke={lit ? '#F1DC9B' : 'rgba(255,255,255,0.25)'}
                            strokeWidth="1.5"
                            style={{ transition: 'fill 0.5s ease, stroke 0.5s ease' }}
                        />
                        <text
                            x={n.lx}
                            y={n.ly}
                            textAnchor={n.anchor}
                            className="font-mono uppercase"
                            style={{ fontSize: 10, letterSpacing: '0.18em', fill: lit ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)', transition: 'fill 0.5s ease' }}
                        >
                            {n.label}
                        </text>
                    </g>
                );
            })}

            <text x={C} y={C + 9} textAnchor="middle" className="drama-text" style={{ fontSize: 28, fill: '#C9A84C' }}>
                Again.
            </text>
        </svg>
    );
}
