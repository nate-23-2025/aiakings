import { createElement, useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowRight, BookOpen, Brain, Check, CheckCheck, ChevronRight, CircleHelp, Command, Database, FileText, Library, LockKeyhole, Mail, MessageSquare, Mic, Network, Pause, Play, Plus, RotateCcw, Search, ShieldCheck, Sparkles, Users, Workflow, X } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { useCalModal } from '../../context/CalModalContext';
import { useInView } from '../../hooks/useInView';
import { CROWN_FAQ, PILLARS, ROLES, SCENARIOS, SOURCES, STEPS, TOOLS } from './crown-data';
import CouncilRail from './CouncilRail';
import KnowledgeFolder from './KnowledgeFolder';
import './crown.css';
import WorkStory, { BuildStory } from './WorkStory';
import MyWorkspace from './MyWorkspace';
import PartnerProof from '../partnership/PartnerProof';
import { getIndustry, getIndustryScenario } from './industry-data';

const ICONS = { command: Command, users: Users, library: Library, book: BookOpen, network: Network, workflow: Workflow, shield: ShieldCheck, mic: Mic, file: FileText, mail: Mail, search: Search };
function Symbol({ name, ...props }) { const Icon = ICONS[name] || Sparkles; return <Icon size={18} strokeWidth={1.6} aria-hidden="true" {...props} />; }
function ToolIcon({ id, size = 24 }) { const tool = TOOLS.find(t => t.id === id); return tool?.logo || ['clio', 'outlook', 'docusign', 'quickbooks', 'excel', 'simplepractice'].includes(id) ? <BrandLogo name={tool?.logo || id} size={size} /> : <Database size={size} strokeWidth={1.5} aria-hidden="true" />; }
function Badge({ children, tone = '' }) { return <span className={`cr-badge ${tone}`}>{children}</span>; }
function SmallHead({ number, children, right }) { return <div className="cr-smallhead"><span><b>{number}</b>{children}</span>{right}</div>; }

// Native dialog provides focus containment and Escape. All content is local,
// illustrative data. No connected account or external action is used here.
function CrownDialog({ modal, onClose, scenario, draft, setDraft, onApprove, phase }) {
    const ref = useRef(null);
    useEffect(() => {
        const dialog = ref.current;
        const trigger = document.activeElement;
        const oldOverflow = document.body.style.overflow;
        dialog.showModal();
        document.body.style.overflow = 'hidden';
        return () => { dialog.close(); document.body.style.overflow = oldOverflow; if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true }); };
    }, []);
    const source = modal.type === 'source' ? (scenario.sourceRecords || SOURCES).find(s => s.id === modal.id) : null;
    const title = source?.title || (modal.type === 'tasks' ? 'Next-step checklist' : scenario.draftTitle);
    return createPortal(<dialog ref={ref} className="cr-dialog" aria-labelledby="cr-dialog-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="cr-dialog-inner">
            <div className="cr-dialog-top"><Badge>Illustrative example</Badge><button type="button" className="cr-icon-btn" onClick={onClose} aria-label="Close example"><X size={20} /></button></div>
            <h3 id="cr-dialog-title">{title}</h3>
            {source ? <><p className="cr-muted">{source.type} · {source.date}</p><p className="cr-source-content">{source.content}</p><div className="cr-source-connection"><Network size={19} /><div><b>How this informs the work</b><p>{source.connection}</p></div></div></> : modal.type === 'tasks' ? <><p className="cr-muted">Prepared from the example request. Owners and dates still need confirmation.</p><ul className="cr-task-list">{scenario.tasks.map((t, i) => <li key={t}><span>{String(i + 1).padStart(2, '0')}</span><div>{t}<small>Owner to confirm · Awaiting review</small></div></li>)}</ul></> : <><label className="cr-field-label" htmlFor="cr-example-draft">Edit the example draft</label><textarea id="cr-example-draft" value={draft} onChange={e => setDraft(e.target.value)} rows={9} /><p className="cr-muted">Changes need a fresh review. This example never sends or saves anything to an account.</p><div className="cr-dialog-actions"><button type="button" className="cr-button" onClick={() => { onApprove(); onClose(); }} disabled={!draft.trim()}><Check size={16} />{phase === 5 ? 'Confirm reviewed draft' : 'Approve in example'}</button><button type="button" className="cr-text-btn" onClick={onClose}>Keep editing later</button></div></>}
        </div>
    </dialog>, document.body);
}

function Conversation({ scenario, phase, openDraft, compact = false }) {
    const messages = [
        { who: 'You', icon: Command, text: scenario.request },
        { who: 'Business knowledge', icon: Library, text: `Relevant information found: ${scenario.context.toLowerCase()}. Sources stay attached to the work.` },
        { who: 'Your instructions', icon: BookOpen, text: 'Use plain language. Flag missing information. Prepare the work for a person to review.' },
        { who: scenario.agent, icon: Users, text: scenario.result + '. The draft and next-step checklist are ready to inspect.' },
        { who: 'Approval check', icon: ShieldCheck, text: 'Ready for your review. The example is paused here until you approve the draft.' },
        { who: 'Workflow', icon: CheckCheck, text: 'Review recorded in this example. The approved work is ready for the agreed handoff.' },
    ];
    const visible = compact ? messages.slice(0, Math.max(1, Math.min(phase + 1, 3))) : messages.slice(0, phase + 1);
    return <div className={`cr-conversation ${compact ? 'is-compact' : ''}`} role="log" aria-label="Example conversation" aria-live="polite" aria-relevant="additions text">{visible.map(({ who, icon, text }, i) => <div className={`cr-message ${i === 0 ? 'from-you' : ''}`} key={who}>
        <span className="cr-avatar">{createElement(icon, { size: 15, strokeWidth: 1.6, 'aria-hidden': true })}</span><div><span className="cr-message-who">{who}<small>{i === 0 ? 'Your request' : 'Example'}</small></span><p>{text}</p>{i === 3 && <button type="button" className="cr-inline-file" onClick={openDraft}><FileText size={15} />{scenario.output}<ArrowRight size={14} /></button>}</div>
    </div>)}</div>;
}

function Workboard({ scenario, phase, openDraft, openTasks }) {
    return <div className="cr-workboard">{[
        { title: 'In progress', active: phase > 0 && phase < 3, text: phase === 0 ? 'Waiting for your direction' : 'Find context and apply the playbook', icon: Search },
        { title: 'For your review', active: phase >= 3 && phase < 5, text: scenario.output, icon: FileText, action: openDraft },
        { title: 'Ready for handoff', active: phase === 5, text: 'Reviewed draft + next steps', icon: CheckCheck, action: openTasks },
    ].map(({ title, active, text, icon, action }, i) => <div key={title} className={`cr-board-column ${active ? 'is-active' : ''}`}><div className="cr-board-label"><span className="cr-dot" />{title}<span>{active ? '1' : '0'}</span></div><div className={`cr-board-card ${!active ? 'is-empty' : ''}`}>{createElement(icon, { size: 19, 'aria-hidden': true })}<p>{active ? text : 'No work at this stage'}</p>{active && <><small>{i === 1 ? 'Your approval required' : i === 2 ? 'Reviewed in example' : scenario.agent}</small>{action && <button type="button" onClick={action}>{i === 1 ? 'Open draft' : 'View next steps'}<ArrowRight size={14} /></button>}</>}</div></div>)}</div>;
}

function PillarDemo({ pillar, scenario, phase, openDraft, openTasks, openSource }) {
    const [view, setView] = useState('conversation');
    const [roleId, setRoleId] = useState('coordinator');
    const [sourceId, setSourceId] = useState('call');
    const [playbook, setPlaybook] = useState('followup');
    const [toolId, setToolId] = useState('gmail');
    const [connections, setConnections] = useState(['gmail', 'drive', 'calendar', 'slack']);
    const [routing, setRouting] = useState(false);
    const [fallback, setFallback] = useState(false);
    const role = ROLES.find(r => r.id === roleId);
    const sources = scenario.sourceRecords || SOURCES;
    const source = sources.find(s => s.id === sourceId);
    const tool = TOOLS.find(t => t.id === toolId);
    if (pillar === 'throne') return <div className="cr-demo-window"><div className="cr-window-bar"><div className="cr-window-dots" /><span>YOUR COMMAND CENTER</span><Badge>Example</Badge></div><div className="cr-workspace-top"><span><Brain size={17} /> My business</span><div className="cr-segment" aria-label="Command center view"><button type="button" aria-pressed={view === 'conversation'} onClick={() => setView('conversation')}><MessageSquare size={14} />Conversation</button><button type="button" aria-pressed={view === 'board'} onClick={() => setView('board')}><Workflow size={14} />Workboard</button></div></div>{view === 'conversation' ? <Conversation scenario={scenario} phase={Math.max(phase, 2)} openDraft={openDraft} compact /> : <Workboard scenario={scenario} phase={Math.max(phase, 3)} openDraft={openDraft} openTasks={openTasks} />}<div className="cr-command-prompt"><span>What needs your attention today?</span><ArrowRight size={17} /></div></div>;
    if (pillar === 'council') return <div className="cr-council"><CouncilRail selected={roleId} onSelect={setRoleId} /><div className="cr-role-detail" key={role.id}><span className="cr-kicker">A DEFINED ROLE</span><h5>{role.name}</h5><p>{role.body}</p><div className="cr-tool-chips">{role.tools.map(id => <span key={id}><ToolIcon id={id} size={19} />{TOOLS.find(t => t.id === id).name}</span>)}</div><div className="cr-example-assignment"><span>Example assignment</span>{role.task}</div></div></div>;
    if (pillar === 'archives') return <div className="cr-archives"><KnowledgeFolder sources={sources} logo={getIndustry(scenario.industryId).tools[0].id} selected={sourceId} onSelect={setSourceId} onOpenSource={openSource} /><div className="cr-source-preview" key={source.id}><Badge><span className="cr-dot" /> Source attached</Badge><h5>{source.title}</h5><p>{source.summary}</p><div className="cr-context-link"><span>INFORMS</span><ArrowDown size={15} /><span>{scenario.output}</span></div><button type="button" className="cr-text-btn" onClick={() => openSource(source.id)}>Read the source<ArrowRight size={15} /></button></div></div>;
    if (pillar === 'charter') return <div className="cr-charter"><div className="cr-segment">{[['followup', 'Client follow-up'], ['handoff', 'Team handoff']].map(([id, label]) => <button key={id} type="button" aria-pressed={playbook === id} onClick={() => setPlaybook(id)}>{label}</button>)}</div><div className="cr-playbook" key={playbook}><span className="cr-kicker">BUSINESS PLAYBOOK / {playbook === 'followup' ? '01' : '02'}</span><h5>{playbook === 'followup' ? 'Carry the conversation forward.' : 'Make the next step clear.'}</h5>{(playbook === 'followup' ? ['Read the latest call notes and project brief.', 'Use the customer’s request and my communication standards.', 'Flag missing dates, prices, and scope.', 'Bring the draft back to me before sending.'] : ['Record the decision and its original source.', 'Turn the decision into a practical task list.', 'Flag missing owners and due dates.', 'Ask the responsible person to review the handoff.']).map((text, i) => <div className="cr-rule" key={text}><span>{String(i + 1).padStart(2, '0')}</span><p>{text}</p>{i === 3 ? <LockKeyhole size={16} /> : <Check size={16} />}</div>)}<div className="cr-playbook-footer"><BookOpen size={15} />Your instructions travel with the work.</div></div></div>;
    if (pillar === 'roads') return <div className="cr-roads"><div className="cr-tools-grid">{TOOLS.map(t => <button type="button" key={t.id} aria-pressed={toolId === t.id} onClick={() => setToolId(t.id)}><span className="cr-logo-tile"><ToolIcon id={t.id} size={27} /></span><span>{t.name}</span><span className={`cr-connection ${connections.includes(t.id) ? 'is-connected' : ''}`}>{connections.includes(t.id) ? <Check size={12} /> : <Plus size={12} />}</span></button>)}</div><div className="cr-tool-detail"><div><ToolIcon id={tool.id} size={25} /><h5>{tool.name}</h5><Badge>{connections.includes(tool.id) ? 'In example' : 'Available to add'}</Badge></div><b>{tool.job}</b><p>{tool.access}</p><button type="button" className="cr-text-btn" onClick={() => setConnections(prev => prev.includes(tool.id) ? prev.filter(id => id !== tool.id) : [...prev, tool.id])}>{connections.includes(tool.id) ? 'Remove from example' : 'Add to example'}{connections.includes(tool.id) ? <X size={14} /> : <Plus size={14} />}</button><small>Demonstration only. No account is connected.</small></div></div>;
    if (pillar === 'steward') return <div className="cr-steward"><div className="cr-segment"><button type="button" aria-pressed={!routing} onClick={() => setRouting(false)}>Workflows</button><button type="button" aria-pressed={routing} onClick={() => setRouting(true)}>AI routing</button></div>{routing ? <div className="cr-routing"><span className="cr-kicker">MATCH THE MODEL TO THE WORK</span><div className="cr-model-route"><div><FileText size={19} /><b>Routine preparation</b><small>Sort and format the notes</small></div><ArrowRight size={18} /><div><Sparkles size={19} /><b>Fast model</b><small>Defined, repeatable work</small></div></div><div className="cr-model-route"><div><Search size={19} /><b>Complex judgment</b><small>Compare the evidence</small></div><ArrowRight size={18} /><div><BrandLogo name="claude" size={22} /><b>{fallback ? 'Approved fallback' : 'Reasoning model'}</b><small>{fallback ? 'Primary route unavailable' : 'Deeper review when needed'}</small></div></div><button type="button" className="cr-text-btn" onClick={() => setFallback(!fallback)}>{fallback ? 'Restore primary route' : 'Try a busy primary route'}<RotateCcw size={14} /></button><p className="cr-muted">Model choices, provider access, and fallback rules are agreed and tested for your build.</p></div> : <div className="cr-schedules">{[{ time: 'After a call', title: 'Prepare the follow-up', body: 'Find the notes → apply the playbook → request review', icon: Mic }, { time: 'Each morning', title: 'Bring me the priorities', body: 'Review open work → flag decisions → prepare a brief', icon: Command }, { time: 'When a file arrives', title: 'Prepare the handoff', body: 'Read the document → flag gaps → organize next steps', icon: FileText }].map(({ time, title, body, icon }) => <div className="cr-schedule" key={time}><span className="cr-schedule-icon">{createElement(icon, { size: 18, 'aria-hidden': true })}</span><div><small>{time}</small><b>{title}</b><p>{body}</p></div><ChevronRight size={16} /></div>)}</div>}</div>;
    return <div className="cr-guard"><div className="cr-guard-policy"><ShieldCheck size={27} /><div><h5>Preparation can move. Decisions stay with you.</h5><p>Read selected sources and prepare the work. Customer messages wait for review.</p></div></div><div className="cr-permission-row"><span><Check size={16} />Find approved context</span><Badge tone="green">Within scope</Badge></div><div className="cr-permission-row"><span><Check size={16} />Prepare a draft</span><Badge tone="green">Within scope</Badge></div><div className="cr-permission-row"><span><LockKeyhole size={16} />Send a message</span><Badge>Approval required</Badge></div><div className="cr-guard-review"><div><FileText size={19} /><span>{scenario.output}<small>{phase === 5 ? 'Reviewed in example' : 'Ready to inspect in this example'}</small></span></div><button type="button" className="cr-button" onClick={openDraft}>Review draft<ArrowRight size={15} /></button></div></div>;
}

export default function CrownSystem() {
    const { openCalModal } = useCalModal();
    const [selected, setSelected] = useState(0);
    const [industryId, setIndustryId] = useState('legal');
    const [scenarioId, setScenarioId] = useState('followup');
    const industry = getIndustry(industryId);
    const scenario = getIndustryScenario(industryId, scenarioId);
    const [phase, setPhase] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [draft, setDraft] = useState(() => getIndustryScenario('legal', 'followup').draft);
    const [modal, setModal] = useState(null);
    const [view, setView] = useState('conversation');
    const [workflowRef, workflowVisible] = useInView('0px');
    const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const [verticalTabs, setVerticalTabs] = useState(() => window.matchMedia('(min-width: 768px)').matches);
    const tabRefs = useRef([]);
    const isPlaying = playing && phase < 4;
    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const width = window.matchMedia('(min-width: 768px)');
        const change = () => { setReducedMotion(query.matches); setVerticalTabs(width.matches); };
        query.addEventListener('change', change);
        width.addEventListener('change', change);
        return () => { query.removeEventListener('change', change); width.removeEventListener('change', change); };
    }, []);
    useEffect(() => {
        if (!isPlaying || !workflowVisible || reducedMotion || modal) return;
        const timer = setTimeout(() => setPhase(p => Math.min(4, p + 1)), 1800);
        return () => clearTimeout(timer);
    }, [phase, isPlaying, workflowVisible, reducedMotion, modal]);
    const chooseScenario = id => { if (id === scenarioId) return; const next = getIndustryScenario(industryId, id); setScenarioId(id); setPhase(0); setPlaying(false); setDraft(next.draft); };
    const chooseIndustry = id => { if (id === industryId) return; setIndustryId(id); setPhase(0); setPlaying(false); setModal(null); setDraft(getIndustryScenario(id, scenarioId).draft); };
    const reset = () => { setPhase(0); setPlaying(false); setDraft(scenario.draft); };
    const approve = () => { if (!draft.trim()) return; setPhase(5); setPlaying(false); };
    const openDraft = () => { setPlaying(false); setModal({ type: 'draft' }); };
    const openTasks = () => setModal({ type: 'tasks' });
    const editDraft = text => { setDraft(text); if (phase === 5) setPhase(4); };
    const nextPillar = () => { const next = (selected + 1) % 7; setSelected(next); tabRefs.current[next]?.focus({ preventScroll: true }); tabRefs.current[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' }); };
    const navigateTabs = e => {
        const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
        if (!keys.includes(e.key)) return;
        e.preventDefault();
        const next = e.key === 'Home' ? 0 : e.key === 'End' ? 6 : (selected + (['ArrowDown', 'ArrowRight'].includes(e.key) ? 1 : -1) + 7) % 7;
        setSelected(next); tabRefs.current[next]?.focus({ preventScroll: true }); tabRefs.current[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    };
    return <section id="crown-system" className="crown-system immersive-system" aria-labelledby="crown-title">
        <WorkStory industry={industry} onIndustryChange={chooseIndustry} scenario={scenarioId === 'research' ? getIndustryScenario(industryId, 'followup') : scenario} draft={scenarioId === 'research' ? getIndustryScenario(industryId, 'followup').draft : draft} reviewed={scenarioId !== 'research' && phase === 5} onChoose={chooseScenario} onReview={() => { if (scenarioId === 'research') { chooseScenario('followup'); setPhase(4); } else if (phase < 4) setPhase(4); openDraft(); }} />
        <MyWorkspace />
        <PartnerProof />
        <div className="cr-wrap">
            <details className="ws-extras" onToggle={() => requestAnimationFrame(() => ScrollTrigger.refresh())}>
                <summary><span><Workflow size={17} />Explore the tools and more examples</span><Plus size={18} /></summary>
            <div id="crown-pillars" className="cr-pillars">
                <SmallHead number="01">EXPLORE WHAT IT DOES<span className="cr-smallhead-hint">Choose a feature to see an example.</span></SmallHead>
                <div className="cr-explorer">
                    {/* Roving focus and arrow/Home/End behavior adapted from ddoemonn's
                        Tabs (21st.dev demo 23570); implemented without a motion dependency. */}
                    <div className="cr-tablist" role="tablist" aria-label="AI system features" aria-orientation={verticalTabs ? 'vertical' : 'horizontal'} onKeyDown={navigateTabs}>{PILLARS.map((p, i) => <button type="button" role="tab" key={p.id} id={`cr-tab-${p.id}`} aria-selected={selected === i} aria-controls={`cr-panel-${p.id}`} tabIndex={selected === i ? 0 : -1} ref={el => { tabRefs.current[i] = el; }} onClick={() => setSelected(i)}><Symbol name={p.icon} /><span>{p.name}</span><ChevronRight size={16} /></button>)}</div>
                    {PILLARS.map((p, i) => <div className="cr-pillar-panel" role="tabpanel" id={`cr-panel-${p.id}`} aria-labelledby={`cr-tab-${p.id}`} tabIndex={0} key={p.id} hidden={selected !== i}>{selected === i && <><div className="cr-pillar-heading"><span className="cr-kicker">{p.note}</span><h3>{p.title}</h3><p>{p.body}</p></div><PillarDemo pillar={p.id} scenario={scenario} phase={phase} openDraft={openDraft} openTasks={openTasks} openSource={id => setModal({ type: 'source', id })} /><div className="cr-panel-footer"><span>{p.plain}</span><button type="button" className="cr-text-btn" onClick={nextPillar}>Next feature<ArrowRight size={14} /></button></div></>}</div>)}
                </div>
            </div>


            <div id="workflow-lab" className="cr-workflow" ref={workflowRef}>
                <SmallHead number="02">FOLLOW THE WORK<Badge>Interactive example</Badge></SmallHead>
                <div className="cr-workflow-heading"><div><h3>See a task<br /><span className="drama-text">prepared for review.</span></h3><p>Choose an example. Inspect the draft,<br className="cr-desktop-break" /> then review the next step.</p></div><span className="cr-example-note"><CircleHelp size={16} />Illustrative data. No messages are sent.</span></div>
                <div className="cr-scenarios" aria-label="Choose an example workflow">{SCENARIOS.map(s => <button type="button" key={s.id} aria-pressed={scenarioId === s.id} onClick={() => chooseScenario(s.id)}><Symbol name={s.icon} size={16} />{s.name}</button>)}</div>
                <div className="cr-workflow-shell">
                    <div className="cr-workflow-top"><span><Brain size={17} />Workflow example<span className="cr-slash">/</span><span>{scenario.name}</span></span><Badge tone={phase === 5 ? 'green' : ''}><span className="cr-dot" />{phase === 5 ? 'Reviewed in example' : phase === 4 ? 'Waiting for your review' : isPlaying ? reducedMotion ? 'Manual steps' : 'Following the work' : 'Ready to explore'}</Badge></div>
                    <ol className="cr-steps" aria-label="Workflow progress">{STEPS.map((step, i) => <li key={step.label} className={i === phase ? 'is-current' : i < phase ? 'is-done' : ''} aria-current={i === phase ? 'step' : undefined}><span>{i < phase ? <Check size={13} /> : String(i + 1).padStart(2, '0')}</span><b>{step.label}</b></li>)}</ol>
                    <div className="cr-workflow-body"><div className="cr-workflow-main"><div className="cr-workflow-viewbar"><span>{scenario.result}</span><div className="cr-segment"><button type="button" aria-label="Workflow conversation view" aria-pressed={view === 'conversation'} onClick={() => setView('conversation')}><MessageSquare size={14} /><span>Conversation</span></button><button type="button" aria-label="Workflow workboard view" aria-pressed={view === 'board'} onClick={() => setView('board')}><Workflow size={14} /><span>Workboard</span></button></div></div>{view === 'conversation' ? <Conversation scenario={scenario} phase={phase} openDraft={openDraft} /> : <Workboard scenario={scenario} phase={phase} openDraft={openDraft} openTasks={openTasks} />}</div><aside className="cr-output-rail" aria-label="Example output"><span className="cr-kicker">THE WORK, WITH ITS CONTEXT</span><div className="cr-output-file"><span className="cr-logo-tile"><ToolIcon id={scenario.tool} size={25} /></span><Badge>{phase === 5 ? 'Reviewed' : 'Draft'}</Badge><h4>{scenario.output}</h4><p>{scenario.draftTitle}</p><button type="button" className="cr-text-btn" onClick={openDraft}>Open & edit<ArrowRight size={15} /></button></div><button type="button" className="cr-output-task" onClick={openTasks}><CheckCheck size={18} /><span>Next-step checklist<small>{scenario.tasks.length} prepared steps</small></span><ChevronRight size={15} /></button><div className="cr-output-sources"><b>Sources in this example</b>{scenario.sources.map(s => <span key={s}><FileText size={13} />{s}</span>)}</div><div className="cr-output-rule"><LockKeyhole size={16} /><p>{phase === 5 ? 'Your review is recorded locally in this example.' : 'The example pauses for your review before the handoff.'}</p></div></aside></div>
                    <div className="cr-playback"><div className="cr-playback-controls">{phase < 4 ? <><button type="button" className="cr-button" onClick={() => { if (reducedMotion) setPhase(p => Math.min(4, p + 1)); else { setPlaying(!isPlaying); if (phase === 0) setPhase(1); } }}>{isPlaying && !reducedMotion ? <Pause size={15} /> : <Play size={15} />}{reducedMotion ? 'Start / next step' : isPlaying ? 'Pause example' : phase === 0 ? 'Play example' : 'Continue example'}</button><button type="button" className="cr-text-btn" onClick={() => { setPlaying(false); setPhase(p => Math.min(4, p + 1)); }}>Next step<ChevronRight size={15} /></button></> : phase === 4 ? <button type="button" className="cr-button" onClick={openDraft}><ShieldCheck size={16} />Review & approve</button> : <button type="button" className="cr-button" onClick={openDraft}><FileText size={16} />View reviewed draft</button>}<button type="button" className="cr-icon-btn" onClick={reset} aria-label="Reset workflow example"><RotateCcw size={16} /></button></div><span role="status">{phase === 4 ? 'Your decision is the next step.' : phase === 5 ? 'Ready for handoff. Nothing was sent.' : `Step ${phase + 1} of ${STEPS.length} · ${STEPS[phase].label}`}</span></div>
                </div>
            </div>

            </details>
            <BuildStory />
            <div id="crown-questions" className="cr-faq" style={{ scrollMarginTop: 110 }}><div><span className="cr-eyebrow">BEFORE THE BUILD</span><h3>Before you<br /><span className="drama-text">book a call.</span></h3></div><div>{CROWN_FAQ.map(f => <details key={f.q}><summary>{f.q}<Plus size={17} /></summary><p>{f.a}</p></details>)}</div></div>
            <div className="cr-final"><Brain strokeWidth={1.2} /><span className="cr-eyebrow">START WITH ONE TASK</span><h3>Find your first<br /><span className="drama-text">AI workflow.</span></h3><p>Bring one task your team repeats.<br />I will help you decide what is worth automating.</p><button type="button" className="cr-button" onClick={() => openCalModal('developer')}>Book a 15-minute call<ArrowRight size={17} /></button><small>Discuss the task, the tools, and a practical next step.</small></div>
        </div>
        {modal && <CrownDialog modal={modal} onClose={() => setModal(null)} scenario={scenario} draft={draft} setDraft={editDraft} onApprove={approve} phase={phase} />}
    </section>;
}
