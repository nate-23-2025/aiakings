import { useEffect, useState } from 'react';
import { Play, RotateCcw, Check, ArrowUpRight, PhoneIncoming, Pause } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import Crown from '../intro/Crown';
import { useInView } from '../../hooks/useInView';
import { prefersReducedMotion } from '../../lib/motion';

// Adapted from 21st Orbiting Circles, Radar Effect, Transition Panel,
// AI Tool Approval, and Notification Stack. Sources: .21st/references.
// Local deterministic illustration. It never calls a real service.
const SCENARIOS = [
    {
        name: 'Book a job', role: 'Your booking agent', input: 'Can you come out Saturday for a full detail?',
        tools: ['twilio', 'calendar', 'gmail', 'clickup'],
        stages: [
            { title: 'The call comes in.', detail: 'A customer wants a Saturday appointment. The agent picks up and listens.', label: 'Listening' },
            { title: 'The pieces come together.', detail: 'It finds the returning customer and checks the calendar for a real opening.', label: 'Checking' },
            { title: 'Ready for your review.', detail: 'Saturday, 10 AM. The booking and confirmation are prepared for this example.', label: 'Your turn' },
            { title: 'The job is on the calendar.', detail: 'The customer gets a confirmation. Your records get the call summary.', label: 'Handled' },
        ],
        results: [['calendar', 'Appointment booked', 'Saturday · 10:00 AM'], ['gmail', 'Confirmation sent', 'The customer has the details'], ['clickup', 'Customer record updated', 'A clear record of the call']],
    },
    {
        name: 'Research', role: 'Solomon · Research', input: 'Find the facts behind this topic. Show me the sources.',
        tools: ['perplexity', 'google', 'drive', 'claude'],
        stages: [
            { title: 'A question worth answering.', detail: 'Solomon starts with a clear topic and what you need to learn.', label: 'Reading' },
            { title: 'Facts, with a paper trail.', detail: 'It researches the topic and keeps the source beside each finding.', label: 'Researching' },
            { title: 'You get the final say.', detail: 'The findings are ready to review before you use them in your own work.', label: 'Your turn' },
            { title: 'The research is ready.', detail: 'A focused report, the useful facts, and the sources to check them.', label: 'Filed' },
        ],
        results: [['perplexity', 'Sources collected', 'A source beside each finding'], ['drive', 'Research organized', 'Ready to find again'], ['claude', 'Report ready', 'Your review comes next']],
    },
    {
        name: 'Site audit', role: 'Daniel · Site audits', input: 'What is stopping this business from getting found and called?',
        tools: ['google', 'claude', 'drive', 'gmail'],
        stages: [
            { title: 'Look through a customer’s eyes.', detail: 'Daniel starts with the public website and what the business offers.', label: 'Reading' },
            { title: 'Find what gets in the way.', detail: 'It checks the site and puts the most serious problems first.', label: 'Checking' },
            { title: 'Proof before the report.', detail: 'You review the findings and the evidence before anything leaves your desk.', label: 'Your turn' },
            { title: 'A clear next step.', detail: 'The report connects each finding to getting found, called, and booked.', label: 'Ready' },
        ],
        results: [['google', 'Public site checked', 'What search and AI can read'], ['drive', 'Evidence organized', 'Findings you can verify'], ['gmail', 'Owner report prepared', 'A draft for you to review']],
    },
];

export default function AgentPipeline() {
    const [scenario, setScenario] = useState(0);
    const [step, setStep] = useState(-1);
    const [running, setRunning] = useState(false);
    const [draft, setDraft] = useState(false);
    const [ref, inView] = useInView('0px');
    const story = SCENARIOS[scenario];
    const current = story.stages[Math.max(step, 0)];

    useEffect(() => {
        if (!running || !inView || step >= 2) return;
        const timer = setTimeout(() => setStep(s => s + 1), prefersReducedMotion() ? 300 : 2200);
        return () => clearTimeout(timer);
    }, [running, inView, step]);

    const start = () => { setDraft(false); setStep(0); setRunning(true); };
    const choose = (index) => { setScenario(index); setStep(-1); setRunning(false); setDraft(false); };

    return (
        <div ref={ref} id="agent-demo" className="agent-cinema cinema-surface" data-visible={inView} data-playing={inView && running && step < 2}>
            <div className="cinema-topline">
                <span><i className="cinema-status" /> An agent, in motion</span>
                <span>Interactive demo</span>
            </div>
            <div className="cinema-switcher" role="group" aria-label="Choose an agent demo">
                {SCENARIOS.map((s, i) => <button key={s.name} type="button" aria-pressed={scenario === i} onClick={() => choose(i)}>{s.name}</button>)}
            </div>
            <div className="agent-stage">
                <div className="agent-constellation" aria-hidden="true">
                    <div className="agent-radar" /><div className="agent-orbit orbit-one" /><div className="agent-orbit orbit-two" />
                    <svg className="agent-beams" viewBox="0 0 800 340" preserveAspectRatio="none">
                        {['M140 82 Q260 82 400 170', 'M660 82 Q540 82 400 170', 'M140 258 Q260 258 400 170', 'M660 258 Q540 258 400 170'].map(d => <g key={d}><path d={d} /><path className="agent-beam-pulse" d={d} pathLength="1" /></g>)}
                    </svg>
                    {story.tools.map((name, i) => <span key={name} className={'agent-satellite satellite-' + i}><BrandLogo name={name} size={29} /></span>)}
                    <div className={'agent-core ' + (step === 3 ? 'is-complete' : '')}>
                        <div className="agent-core-halo" /><div className="agent-core-shell" />
                        {step === 3 ? <Check size={42} strokeWidth={1.2} /> : <Crown className="agent-core-crown" />}
                    </div>
                </div>
                <div className="agent-stage-caption">
                    <span className="cinema-eyebrow">{story.role}</span>
                    <span className="agent-state">{step === -1 ? 'Ready when you are' : current.label}</span>
                </div>
                {step === -1 && <div className="agent-incoming"><PhoneIncoming size={14} /><span>“{story.input}”</span></div>}
            </div>
            <div className="agent-story">
                <div key={scenario + '-' + step + '-' + draft} className="cinema-panel-enter" aria-live="polite">
                    <span className="cinema-eyebrow">{step === -1 ? 'See what happens next' : 'Scene ' + String(step + 1).padStart(2, '0') + ' / 04'}</span>
                    <h3>{draft ? 'Kept as a draft.' : step === -1 ? 'One request. The work, handled.' : current.title}</h3>
                    <p>{draft ? 'Nothing was sent. You decide when it is ready.' : step === -1 ? 'Choose a job above, then run the example. Follow the agent from the first request to the finished work.' : current.detail}</p>
                </div>
                {step === 3 && <div className="agent-deliveries">
                    {story.results.map(([brand, title, body], i) => <div key={title} className="agent-delivery" style={{ '--i': i }}><BrandLogo name={brand} size={22} /><span><strong>{title}</strong><small>{body}</small></span><Check size={14} /></div>)}
                </div>}
                <div className="agent-controls">
                    {step === 2 && !draft ? <>
                        <button className="cinema-button" type="button" onClick={() => { setStep(3); setRunning(false); }}><Check size={15} /> {scenario === 0 ? 'Confirm demo booking' : 'Finish the example'}</button>
                        <button className="cinema-text-button" type="button" onClick={() => { setDraft(true); setRunning(false); }}>Keep as a draft</button>
                    </> : step < 2 && step >= 0 ? <button className="cinema-button" type="button" onClick={() => setRunning(v => !v)}>{running ? <Pause size={14} /> : <Play size={14} />} {running ? 'Pause the scene' : 'Continue the scene'}</button>
                        : <button className="cinema-button" type="button" onClick={start}>{step === -1 ? <Play size={14} fill="currentColor" /> : <RotateCcw size={14} />}{step === -1 ? 'Run the demo' : 'Play again'}</button>}
                    <span className="cinema-demo-note">An illustration. No real calls or messages.</span>
                </div>
            </div>
            <div className="agent-filmstrip" role="group" aria-label="Explore the demo scenes">
                {['The request', 'The work', 'Your review', 'The result'].map((label, i) => <button key={label} type="button" aria-pressed={step === i} onClick={() => { setStep(i); setRunning(false); setDraft(false); }}><span>{String(i + 1).padStart(2, '0')}</span>{label}<ArrowUpRight size={12} /></button>)}
            </div>
        </div>
    );
}
