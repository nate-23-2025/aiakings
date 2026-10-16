import { Check, FileText, AlertTriangle } from 'lucide-react';
import { useTicks } from '../../hooks/useTicks';

// Daniel's breakdown, drawn: a scan line reads down a business's site, the
// problems it finds pop up as pins (the kinds from its playbook: a page AI
// reads as nearly blank, a phone number that does not match Google, a broken
// link), the six levers get checked, the problems sort worst first, and the
// owner report comes out. Illustration of one audit, no real business.
const LEVERS = ['Profile', 'Consistency', 'On-page', 'Structured data', 'Reviews', 'Answers'];

// Pins sit where the scan line finds them (top, as a share of the mini site).
const FINDINGS = [
    { id: 'link', label: 'Broken link', top: 9, left: 58, rank: 3, sev: 'amber' },
    { id: 'blank', label: 'Nearly blank to AI', top: 34, left: 8, rank: 1, sev: 'red' },
    { id: 'phone', label: 'Phone does not match Google', top: 60, left: 30, rank: 2, sev: 'red' },
];

// One tick is 100ms.
const SCAN_END = 30;
const LEVER_START = 32;
const LEVER_GAP = 3;
const RANK_START = LEVER_START + LEVER_GAP * 6 + 3;
const RANK_GAP = 5;
const REPORT = RANK_START + RANK_GAP * 3 + 2;
const TOTAL = REPORT + 30;

const SEV = {
    red: 'bg-red-400/15 text-red-300 border-red-400/40',
    amber: 'bg-amber-300/10 text-amber-200 border-amber-300/40',
};

export default function DanielVisual() {
    const t = useTicks(TOTAL, 100, TOTAL - 1);
    const scan = Math.min(1, t / SCAN_END);
    const scanning = t < SCAN_END;
    const found = (f) => scan * 100 >= f.top + 4;
    const ranked = [...FINDINGS].sort((a, b) => a.rank - b.rank);
    const report = t >= REPORT;

    return (
        <div className="rounded-[1.5rem] border border-white/[0.08] bg-[#0F0F14] p-4 sm:p-5">
            {/* The business's site, being read */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#15151A]">
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]">
                    <span className="w-2 h-2 rounded-full bg-white/15" />
                    <span className="w-2 h-2 rounded-full bg-white/15" />
                    <span className="w-2 h-2 rounded-full bg-white/15" />
                    <span className="ml-2 flex-grow truncate rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] text-white/35">theirbusiness.com</span>
                    <span className={`font-mono text-[8px] uppercase tracking-widest ${scanning ? 'text-brand-accent' : 'text-white/35'}`}>
                        {scanning ? 'Reading' : 'Read'}
                    </span>
                </div>
                <div className="relative h-[190px] px-4 py-3">
                    {/* Skeleton page */}
                    <div className="flex items-center justify-between">
                        <span className="w-14 h-2.5 rounded bg-white/25" />
                        <span className="flex gap-2">
                            <span className="w-8 h-1.5 rounded-full bg-white/15" />
                            <span className="w-8 h-1.5 rounded-full bg-white/15" />
                            <span className="w-8 h-1.5 rounded-full bg-white/15" />
                        </span>
                    </div>
                    <div className="mt-6 flex flex-col gap-2">
                        <span className="h-3 w-[70%] rounded-full bg-white/[0.08] border border-dashed border-white/15" />
                        <span className="h-3 w-[48%] rounded-full bg-white/[0.08] border border-dashed border-white/15" />
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-accent/80 px-2.5 py-1 font-mono text-[8px] font-semibold text-brand-primary">Call (713) 555-0100</span>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                        {[0, 1, 2].map((i) => <span key={i} className="h-7 rounded-md bg-white/[0.04] border border-white/[0.06]" />)}
                    </div>

                    {/* The scan line */}
                    <span
                        aria-hidden="true"
                        className="absolute inset-x-0 h-px bg-[#F1DC9B] shadow-[0_0_16px_3px_rgba(201,168,76,0.55)] transition-opacity duration-300"
                        style={{ top: `${scan * 100}%`, opacity: scanning ? 1 : 0 }}
                    />

                    {/* What it found */}
                    {FINDINGS.map((f) => (
                        <span
                            key={f.id}
                            className={`absolute flex items-center gap-1 rounded-full border px-2 py-[3px] font-mono text-[8px] uppercase tracking-wider whitespace-nowrap transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.2,1.4,0.4,1)] ${SEV[f.sev]}`}
                            style={{ top: `${f.top}%`, left: `${f.left}%`, opacity: found(f) ? 1 : 0, scale: found(f) ? '1' : '0.6' }}
                        >
                            <AlertTriangle size={9} /> {f.label}
                        </span>
                    ))}
                </div>
            </div>

            {/* The six levers */}
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/35 mt-4 mb-2">Six levers checked</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {LEVERS.map((l, i) => {
                    const done = t >= LEVER_START + i * LEVER_GAP;
                    return (
                        <li key={l} className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 transition-colors duration-300 ${done ? 'border-white/[0.1] bg-white/[0.03]' : 'border-white/[0.05]'}`}>
                            <span className={`grid place-items-center w-3.5 h-3.5 rounded-full shrink-0 transition-colors duration-300 ${done ? 'bg-brand-accent' : 'bg-white/10'}`}>
                                {done && <Check size={8} strokeWidth={4} className="text-brand-primary" />}
                            </span>
                            <span className={`text-[11px] truncate transition-colors duration-300 ${done ? 'text-white/75' : 'text-white/30'}`}>{l}</span>
                        </li>
                    );
                })}
            </ul>

            {/* Worst first */}
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/35 mt-4 mb-2">Worst first</p>
            <ol className="flex flex-col gap-1.5">
                {ranked.map((f, i) => {
                    const on = t >= RANK_START + i * RANK_GAP;
                    return (
                        <li
                            key={f.id}
                            className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#15151A] px-3 py-2 transition-[opacity,translate] duration-400"
                            style={{ opacity: on ? 1 : 0.12, translate: on ? '0 0' : '-8px 0' }}
                        >
                            <span className="font-mono text-[11px] text-brand-accent w-4">{i + 1}</span>
                            <span className="text-[12px] text-white/80 flex-grow">{f.label}</span>
                            <span className={`rounded-full border px-1.5 py-[1px] font-mono text-[8px] uppercase tracking-wider ${SEV[f.sev]}`}>
                                {f.sev === 'red' ? 'Costing calls' : 'Fix soon'}
                            </span>
                        </li>
                    );
                })}
            </ol>

            {/* The owner report */}
            <div
                className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] px-3 py-2.5 transition-[opacity,translate] duration-500"
                style={{ opacity: report ? 1 : 0, translate: report ? '0 0' : '0 8px' }}
            >
                <FileText size={15} className="text-emerald-400/90 shrink-0" />
                <span className="text-[12px] text-white/80 flex-grow">Owner report ready: the top three, in plain English, with proof</span>
                <Check size={13} strokeWidth={3} className="text-emerald-400/90 shrink-0" />
            </div>
            <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-widest text-white/25">Illustration of one audit</p>
        </div>
    );
}
