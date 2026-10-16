import { ArrowDown, Check, Loader2, X, CircleDollarSign } from 'lucide-react';
import { useTicks } from '../../hooks/useTicks';

// The HQ breakdown, drawn: how my own system runs. A task comes in, passes
// the money check, the right playbook says what to do, the right agent makes
// the calls, a script does the predictable work, and the result comes out.
// The second task shows the part that makes it get better: a script breaks,
// and the system fixes it, tests it, and writes the lesson into the playbook.
// Simplified, but every name here is a real part of the workspace.
const PLAYBOOKS = ['Research', 'SEO audit', 'Scorecard', 'Sales'];
const AGENTS = ['Solomon', 'Daniel'];
const SCRIPTS = ['Research script', 'Audit script', 'Scorecard script'];
const LOOP = ['Broke', 'Fixed', 'Tested', 'Playbook updated'];

const RUNS = [
    { task: 'Research a topic for a page', playbook: 'Research', agent: 'Solomon', script: 'Research script', result: 'Report filed', breaks: false },
    { task: 'Audit a prospect’s website', playbook: 'SEO audit', agent: 'Daniel', script: 'Audit script', result: 'Owner report ready', breaks: true },
];

// One tick is 100ms. A clean run is 60 ticks; a run that breaks is 92.
const CLEAN = 60;
const BROKEN = 92;
const TOTAL = CLEAN + BROKEN;

function Layer({ name, job, items, active, done, state }) {
    return (
        <div className={`rounded-xl border px-3 py-2.5 transition-colors duration-300 ${active ? 'border-brand-accent/50 bg-brand-accent/[0.06]' : 'border-white/[0.07] bg-[#15151A]'}`}>
            <div className="flex items-baseline justify-between mb-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-brand-accent">{name}</span>
                <span className="text-[10px] text-white/35">{job}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {items.map((it) => {
                    const on = it === active;
                    const wasOn = it === done;
                    const broke = on && state === 'broke';
                    const running = on && state === 'running';
                    return (
                        <span
                            key={it}
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-[11px] transition-colors duration-300 ${
                                broke ? 'border-red-400/50 bg-red-400/10 text-red-300'
                                    : on ? 'border-brand-accent/70 bg-brand-accent/15 text-white'
                                        : wasOn ? 'border-white/15 text-white/70'
                                            : 'border-white/[0.07] text-white/35'
                            }`}
                        >
                            {running && <Loader2 size={10} className="animate-spin text-brand-accent" />}
                            {broke && <X size={10} strokeWidth={3} />}
                            {wasOn && !on && <Check size={10} strokeWidth={3} className="text-brand-accent" />}
                            {it}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

export default function HQVisual() {
    const t = useTicks(TOTAL, 100, CLEAN - 1);
    const run = t < CLEAN ? RUNS[0] : RUNS[1];
    const l = t < CLEAN ? t : t - CLEAN;

    const taskIn = l >= 1;
    const checked = l >= 6;
    const atPlaybook = l >= 12;
    const atAgent = l >= 20;
    const atScript = l >= 28;
    const broke = run.breaks && l >= 38 && l < 62;
    const loopStep = run.breaks ? (l >= 56 ? 3 : l >= 50 ? 2 : l >= 44 ? 1 : l >= 38 ? 0 : -1) : -1;
    const scriptDone = run.breaks ? l >= 62 : l >= 38;
    const resultOut = run.breaks ? l >= 70 : l >= 40;

    // Which layer is working right now, and which ones already did their part.
    const stage = scriptDone ? 'done' : atScript ? 'script' : atAgent ? 'agent' : atPlaybook ? 'playbook' : 'in';
    const scriptState = broke ? 'broke' : stage === 'script' ? 'running' : null;

    // A short dim at the start of each run hides the swap from one task to the next.
    const restarting = l < 3 && t !== CLEAN - 1;

    return (
        <div className="rounded-[1.5rem] border border-white/[0.08] bg-[#0F0F14] p-4 sm:p-5">
          <div className="transition-opacity duration-300" style={{ opacity: restarting ? 0.25 : 1 }}>
            {/* The task, and the check every task has to pass */}
            <div
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#1A1A22] px-3 py-2.5 transition-opacity duration-300"
                style={{ opacity: taskIn ? 1 : 0.15 }}
            >
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/35 shrink-0">Task</span>
                <span className="text-[12px] text-white/85 truncate">{run.task}</span>
            </div>
            <div
                className="mt-2 flex items-center gap-2 px-1 transition-opacity duration-300"
                style={{ opacity: checked ? 1 : 0.15 }}
            >
                <CircleDollarSign size={13} className="text-brand-accent shrink-0" />
                <span className="text-[11px] text-white/55 flex-grow">Money check: does it make money or help a paying client?</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-[2px] font-mono text-[8px] uppercase tracking-wider text-emerald-400/90 shrink-0">
                    <Check size={9} strokeWidth={3} /> Yes
                </span>
            </div>

            <div className="my-2 flex justify-center"><ArrowDown size={13} className="text-white/20" /></div>

            {/* The three layers */}
            <div className="flex flex-col gap-2">
                <Layer
                    name="Playbooks"
                    job="What to do"
                    items={PLAYBOOKS}
                    active={stage === 'playbook' ? run.playbook : null}
                    done={['agent', 'script', 'done'].includes(stage) ? run.playbook : null}
                />
                <Layer
                    name="Agents"
                    job="Making the calls"
                    items={AGENTS}
                    active={stage === 'agent' ? run.agent : null}
                    done={['script', 'done'].includes(stage) ? run.agent : null}
                />
                <Layer
                    name="Scripts"
                    job="Same way every time"
                    items={SCRIPTS}
                    active={stage === 'script' ? run.script : null}
                    done={stage === 'done' ? run.script : null}
                    state={scriptState}
                />
            </div>

            {/* When something breaks */}
            <div className={`mt-3 rounded-xl border px-3 py-2.5 transition-colors duration-300 ${loopStep >= 0 ? 'border-red-400/30 bg-red-400/[0.04]' : 'border-white/[0.06]'}`}>
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/35 mb-2">When something breaks</p>
                <ol className="grid grid-cols-4 gap-1">
                    {LOOP.map((s, i) => {
                        const on = loopStep >= i;
                        const now = loopStep === i;
                        return (
                            <li key={s} className="flex flex-col items-center gap-1.5 text-center">
                                <span className={`grid place-items-center w-5 h-5 rounded-full transition-all duration-300 ${
                                    !on ? 'bg-white/[0.06]' : i === 0 ? 'bg-red-400/80' : 'bg-brand-accent'
                                } ${now ? 'scale-125 shadow-[0_0_12px_rgba(201,168,76,0.7)]' : ''}`}>
                                    {on && (i === 0 ? <X size={10} strokeWidth={3} className="text-brand-primary" /> : <Check size={10} strokeWidth={3} className="text-brand-primary" />)}
                                </span>
                                <span className={`text-[10px] leading-tight transition-colors duration-300 ${on ? 'text-white/75' : 'text-white/30'}`}>{s}</span>
                            </li>
                        );
                    })}
                </ol>
            </div>

            <div className="my-2 flex justify-center"><ArrowDown size={13} className="text-white/20" /></div>

            {/* What comes out */}
            <div
                className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] px-3 py-2.5 transition-[opacity,translate] duration-400"
                style={{ opacity: resultOut ? 1 : 0.12, translate: resultOut ? '0 0' : '0 6px' }}
            >
                <Check size={13} strokeWidth={3} className="text-emerald-400/90 shrink-0" />
                <span className="text-[12px] text-white/85">{run.result}</span>
            </div>
          </div>
            <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-widest text-white/25">How my own system runs, simplified</p>
        </div>
    );
}
