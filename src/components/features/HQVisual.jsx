import { useState } from 'react';
import { ArrowUpRight, BookOpen, Check, FileCheck2, Play } from 'lucide-react';
import Crown from '../intro/Crown';
import BrandLogo from '../BrandLogo';
import { useInView } from '../../hooks/useInView';

// AIAK's real research/audit workflow, presented as an explorable system.
// 21st Radar Effect, Orbiting Circles, Pulse Beams, and Transition Panel.
const JOBS = [
    { name: 'Research', agent: 'Solomon', letter: 'S', tool: 'perplexity', title: 'A question becomes useful research.', body: 'Solomon researches the topic, keeps the sources, and organizes the findings into a report.', result: 'Sourced research, ready to review', rule: 'Keep a source beside every finding.' },
    { name: 'Website audit', agent: 'Daniel', letter: 'D', tool: 'google', title: 'A website becomes a clear next step.', body: 'Daniel checks the public site, ranks the problems, and prepares a plain-English report with evidence.', result: 'An owner report, ready to review', rule: 'Put the biggest problems first.' },
];
const LAYERS = [
    { name: 'Shared memory', body: 'The business context stays in one place, so the next job starts informed.' },
    { name: 'Clear playbooks', body: 'Written instructions give each agent a job, a standard, and a place to stop.' },
    { name: 'Tested code', body: 'The predictable work runs the same way every time. A repair gets tested before the lesson is saved.' },
];

export default function HQVisual() {
    const [ref, inView] = useInView('0px');
    const [job, setJob] = useState(0);
    const [layer, setLayer] = useState(0);
    const [finished, setFinished] = useState(false);
    const current = JOBS[job];
    return (
        <div ref={ref} className="hq-cinema cinema-surface" data-visible={inView}>
            <div className="cinema-topline"><span><i className="cinema-status" /> Inside AIAK HQ</span><span>My own system</span></div>
            <div className="cinema-switcher" role="group" aria-label="Choose a system workflow">
                {JOBS.map((j, i) => <button key={j.name} type="button" aria-pressed={job === i} onClick={() => { setJob(i); setFinished(false); }}>{j.name}<ArrowUpRight size={11} /></button>)}
            </div>
            <div className="hq-network">
                <div className="hq-network-orbit" aria-hidden="true" />
                <div className="hq-network-orbit orbit-two" aria-hidden="true" />
                <svg className="hq-paths" viewBox="0 0 400 220" aria-hidden="true"><path d="M68 110 Q140 30 200 110 T332 110" /><path d="M68 110 Q140 190 200 110 T332 110" /></svg>
                {JOBS.map((j, i) => <button type="button" key={j.agent} className={'hq-agent hq-agent-' + i + (job === i ? ' is-selected' : '')} aria-pressed={job === i} onClick={() => { setJob(i); setFinished(false); }}><span>{j.letter}</span><strong>{j.agent}</strong><small>{j.name}</small></button>)}
                <div className="hq-memory"><Crown className="w-10" /><span>One memory.</span><small>One set of rules.</small></div>
                <span className="hq-packet" aria-hidden="true" />
            </div>
            <div key={job} className="hq-work cinema-panel-enter">
                <div className="flex items-center gap-2 mb-3"><BrandLogo name={current.tool} size={19} /><span className="cinema-eyebrow">{current.agent} at work</span></div>
                <h4>{current.title}</h4><p>{current.body}</p>
                <div className="hq-rule"><BookOpen size={14} /><span>{current.rule}</span></div>
            </div>
            <div className="hq-layer-tabs" role="group" aria-label="Explore what connects the agents">{LAYERS.map((l, i) => <button key={l.name} type="button" aria-pressed={layer === i} onClick={() => setLayer(i)}>{l.name}</button>)}</div>
            <p key={layer} className="hq-layer-copy cinema-panel-enter">{LAYERS[layer].body}</p>
            <div className={'hq-result ' + (finished ? 'is-finished' : '')} aria-live="polite">
                {finished ? <><FileCheck2 size={21} /><span>{current.result}</span><Check size={16} /></> : <button type="button" onClick={() => setFinished(true)}><Play size={13} /> See the handoff <ArrowUpRight size={14} /></button>}
            </div>
            <p className="cinema-demo-note text-center pb-5">A simplified illustration of how I work.</p>
        </div>
    );
}
