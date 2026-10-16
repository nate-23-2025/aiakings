import { Search, Check, Loader2, FileText, Archive } from 'lucide-react';
import { useTicks } from '../../hooks/useTicks';

// Solomon's breakdown, drawn: a topic goes in, splits into the six searches
// from its playbook (market, today, trends, results, compared, Houston), the
// sources pour back down, and it settles into a report of quotable facts,
// each with its source, plus angles worth using, then gets filed.
// The report lines are placeholders on purpose: no invented stats.
const TOPIC = 'AI agents for small business';
const QUERIES = ['Market size', 'Where it stands', 'What is changing', 'Business results', 'Compared', 'Houston angle'];

// One tick is 100ms.
const TYPE_END = 18;                 // topic finished typing
const Q_START = 22;                  // first search starts
const Q_GAP = 5;                     // next search starts this many ticks later
const Q_RUN = 7;                     // each search takes this long
const POUR = Q_START + Q_GAP * 5 + Q_RUN;  // all searches done, sources pour down
const ROW_START = POUR + 8;          // report rows begin
const ROW_GAP = 4;
const ROWS = 5;                      // 3 facts + 2 angles
const FILED = ROW_START + ROW_GAP * ROWS + 2;
const TOTAL = FILED + 28;

export default function SolomonVisual() {
    const t = useTicks(TOTAL, 100, TOTAL - 1);
    const chars = Math.min(TOPIC.length, Math.floor((t / TYPE_END) * TOPIC.length));
    const pouring = t >= POUR && t < ROW_START + 6;
    const row = (i) => t >= ROW_START + i * ROW_GAP;
    const filed = t >= FILED;

    return (
        <div className="rounded-[1.5rem] border border-white/[0.08] bg-[#0F0F14] p-4 sm:p-5">
            {/* The topic */}
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/35 mb-2">Topic</p>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1A1A22] px-4 py-3">
                <Search size={14} className="text-white/35 shrink-0" />
                <span className="font-mono text-[12px] text-white/85 truncate">
                    {TOPIC.slice(0, chars)}
                    <span className={`inline-block w-[2px] h-3 ml-[2px] align-middle bg-brand-accent ${t < Q_START ? 'animate-pulse' : 'opacity-0'}`} />
                </span>
            </div>

            {/* Six searches, one after another */}
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/35 mt-4 mb-2">Six searches</p>
            <ul className="grid grid-cols-2 gap-2">
                {QUERIES.map((q, i) => {
                    const start = Q_START + i * Q_GAP;
                    const running = t >= start && t < start + Q_RUN;
                    const done = t >= start + Q_RUN;
                    return (
                        <li
                            key={q}
                            className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors duration-300 ${
                                running ? 'border-brand-accent/60 bg-brand-accent/10' : done ? 'border-white/[0.08] bg-white/[0.03]' : 'border-white/[0.05]'
                            }`}
                        >
                            <span className="grid place-items-center w-4 h-4 shrink-0">
                                {done ? <Check size={12} strokeWidth={3} className="text-brand-accent" />
                                    : running ? <Loader2 size={12} className="text-brand-accent animate-spin" />
                                        : <span className="w-1.5 h-1.5 rounded-full bg-white/15" />}
                            </span>
                            <span className={`text-[12px] truncate transition-colors duration-300 ${running || done ? 'text-white/80' : 'text-white/30'}`}>{q}</span>
                        </li>
                    );
                })}
            </ul>

            {/* Sources pouring down into the report */}
            <div aria-hidden="true" className="relative h-10 my-1 flex justify-center">
                <span className="absolute top-1 bottom-1 w-px bg-white/10" />
                {[0, 1, 2].map((d) => (
                    <span
                        key={d}
                        className="absolute w-1.5 h-1.5 rounded-full bg-[#F1DC9B] shadow-[0_0_8px_rgba(201,168,76,0.9)]"
                        style={{
                            top: 0,
                            opacity: pouring ? 1 : 0,
                            animation: pouring ? `pour 0.9s linear ${d * 0.3}s infinite` : 'none',
                        }}
                    />
                ))}
            </div>

            {/* The report */}
            <div className={`rounded-2xl border px-4 py-4 transition-colors duration-500 ${filed ? 'border-emerald-400/30' : 'border-white/[0.08]'} bg-[#15151A]`}>
                <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-2 text-white/80 text-[13px] font-medium">
                        <FileText size={14} className="text-brand-accent" /> Report
                    </span>
                    <span
                        className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-emerald-400/90 transition-[opacity,scale] duration-400"
                        style={{ opacity: filed ? 1 : 0, scale: filed ? '1' : '0.7' }}
                    >
                        <Archive size={10} /> Filed
                    </span>
                </div>

                <p className="font-mono text-[9px] uppercase tracking-widest text-white/35 mb-2">Most quotable facts</p>
                <ul className="flex flex-col gap-2 mb-3">
                    {[78, 64, 71].map((w, i) => (
                        <li key={w} className="flex items-center gap-2 transition-opacity duration-400" style={{ opacity: row(i) ? 1 : 0.12 }}>
                            <span className="h-2 rounded-full bg-white/50" style={{ width: `${w}%` }} />
                            <span className="ml-auto shrink-0 rounded-full border border-brand-accent/40 px-1.5 py-[1px] font-mono text-[8px] uppercase tracking-wider text-brand-accent">Source</span>
                        </li>
                    ))}
                </ul>
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/35 mb-2">Angles worth using</p>
                <ul className="flex flex-col gap-2">
                    {[88, 57].map((w, i) => (
                        <li key={w} className="h-2 rounded-full bg-brand-accent/40 transition-opacity duration-400" style={{ width: `${w}%`, opacity: row(3 + i) ? 1 : 0.12 }} />
                    ))}
                </ul>
            </div>
            <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-widest text-white/25">Illustration of one research run</p>
        </div>
    );
}
