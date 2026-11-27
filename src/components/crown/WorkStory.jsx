import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Brain, BriefcaseBusiness, Calculator, Check, CheckCheck, FileText, HeartPulse, LockKeyhole, Mic, Scale, Search, ShieldCheck } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { prefersReducedMotion } from '../../lib/motion';
import { SCENARIOS } from './crown-data';
import { getIndustryScenario, INDUSTRIES } from './industry-data';
import './work-story.css';
import './industry-controls.css';

gsap.registerPlugin(ScrollTrigger);

// Adapted from 21st.dev: minhxthanh's Interactive Scrolling Story (6265),
// dillionverma's Animated Beam (919), and manuarora700's Container Scroll (1081).
// Uses the site's GSAP engine and page scroll, with no nested scroll container.
// Sources and the exact adaptations are listed in EXPERIENCE_SOURCES.md.

const BEATS = [
    { label: 'Understand the task', title: <>It starts with<br /><em>what happened.</em></>, body: 'A call. A meeting. A document. The system starts with the information your team already has.', note: 'The original source stays with the work.' },
    { label: 'Prepare the work', title: <>Your context.<br /><em>A useful draft.</em></>, body: 'The right files and your instructions come together to prepare the next step.', note: 'Missing information gets flagged for review.' },
    { label: 'Make the decision', title: <>Ready for you.<br /><em>Still your decision.</em></>, body: 'Read the draft, make a change, and decide what happens next. Try it yourself.', note: 'Your approval is part of the workflow.' },
];
const OPTIONS = [SCENARIOS[0], SCENARIOS[2], SCENARIOS[1]];
const INDUSTRY_ICONS = { legal: Scale, accounting: Calculator, healthcare: HeartPulse, consulting: BriefcaseBusiness };
const ENTRY_QUOTES = { legal: '“Please send the intake checklist.”', accounting: '“Which records are still missing?”', healthcare: '“Prepare a reminder for the missing form.”', consulting: '“Send me an outline before our next call.”' };

function useSceneMotion(ref) {
    useLayoutEffect(() => {
        const root = ref.current;
        const io = new IntersectionObserver(([entry]) => root.classList.toggle('is-inview', entry.isIntersecting), { rootMargin: '80px' });
        io.observe(root);
        const mm = gsap.matchMedia();
        mm.add('(prefers-reduced-motion: no-preference)', () => {
            const ctx = gsap.context(() => {
                gsap.utils.toArray('[data-story-reveal]').forEach(el => gsap.fromTo(el, { y: 36, opacity: 0 }, {
                    y: 0, opacity: 1, duration: .9, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
                }));
                gsap.utils.toArray('[data-story-screen]').forEach(el => gsap.fromTo(el,
                    { rotateX: 17, scale: .9, y: 65, transformPerspective: 1200 },
                    { rotateX: 0, scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'center 60%', scrub: .7 } },
                ));
            }, root);
            return () => ctx.revert();
        });
        return () => { io.disconnect(); mm.revert(); };
    }, [ref]);
}

// Beams measure the real nodes, including when the layout changes on a phone.
// The moving stroke pauses when the scene is offscreen or reduced motion is on.
function ConnectionBeam({ container, from, to, bend = 0 }) {
    const ref = useRef(null);
    const id = useId();
    useEffect(() => {
        const update = () => {
            const outer = container.current, a = from.current, b = to.current, svg = ref.current;
            if (!outer || !a || !b || !svg) return;
            // The nodes are direct children of the positioned graph. Layout
            // coordinates keep the connectors aligned during its 3D entrance.
            const x1 = a.offsetLeft + a.offsetWidth / 2, y1 = a.offsetTop + a.offsetHeight / 2;
            const x2 = b.offsetLeft + b.offsetWidth / 2, y2 = b.offsetTop + b.offsetHeight / 2;
            svg.setAttribute('viewBox', `0 0 ${outer.offsetWidth} ${outer.offsetHeight}`);
            const d = `M${x1},${y1} C${x1 + (x2 - x1) * .45},${y1 + bend} ${x2 - (x2 - x1) * .45},${y2 + bend} ${x2},${y2}`;
            svg.querySelectorAll('path').forEach(path => path.setAttribute('d', d));
        };
        const observer = new ResizeObserver(update);
        [container.current, from.current, to.current].filter(Boolean).forEach(el => observer.observe(el));
        update();
        return () => observer.disconnect();
    }, [container, from, to, bend]);
    return <svg ref={ref} className="ws-beam" fill="none" aria-hidden="true"><defs><linearGradient id={id}><stop stopColor="#5b7bd5" /><stop offset="1" stopColor="#dfc67d" /></linearGradient></defs><path className="ws-beam-track" /><path className="ws-beam-light" pathLength="1" stroke={`url(#${id})`} /></svg>;
}

function ContextScene({ input, scenario, phase, onReview, draft, reviewed }) {
    const graph = useRef(null), source = useRef(null), brain = useRef(null), result = useRef(null);
    return <div className={`ws-console ws-console-${phase}`} data-cursor-surface>
        <div className="ws-console-bar"><span><i />Workflow example</span><span>{phase === 0 ? 'Source attached' : phase === 1 ? 'Preparing a draft' : 'Your review'}</span></div>
        <div className="ws-graph" ref={graph}>
            <ConnectionBeam container={graph} from={source} to={brain} bend={-20} />
            <ConnectionBeam container={graph} from={brain} to={result} bend={20} />
            <div className="ws-tool-node" ref={source}><BrandLogo name={input.tool} size={27} /><span>{phase === 0 ? 'Source' : 'Your tools'}</span></div>
            <div className="ws-brain-node" ref={brain}><span className="ws-brain-ring" /><Brain size={40} strokeWidth={1} /><span>Your AI brain</span></div>
            <div className="ws-tool-node" ref={result}>{phase === 2 ? <ShieldCheck size={27} /> : <BrandLogo name={scenario.tool} size={27} />}<span>{phase === 2 ? 'Your review' : 'Prepared work'}</span></div>
        </div>
        <div className="ws-scene-content" key={`${scenario.industryId}-${scenario.id}-${phase}`}>
            {phase === 0 ? <div className="ws-source-sheet">
                <div className="ws-sheet-label">{scenario.id === 'documents' ? <FileText size={14} /> : <Mic size={14} />}{input.label}<span>Example</span></div>
                {scenario.id === 'documents' ? <div className="ws-document-lines" aria-hidden="true"><i /><i /><i /></div> : <div className="ws-wave" aria-hidden="true">{Array.from({ length: 35 }, (_, i) => <i key={i} style={{ '--height': `${18 + ((i * 37) % 61)}%`, '--delay': `${i * -.08}s` }} />)}</div>}
                <blockquote>{input.text}</blockquote>
                <div className="ws-extracted"><Check size={14} /><span>{input.tag}</span><span>Captured</span></div>
            </div> : phase === 1 ? <div className="ws-preparation">
                <div className="ws-context-source"><span className="ws-context-icon"><BrandLogo name={input.tool} size={22} /></span><div><b>{scenario.sources[0]}</b><small>Relevant source attached</small></div><Check size={16} /></div>
                <div className="ws-context-source"><span className="ws-context-icon"><BookOpen size={20} /></span><div><b>Your instructions</b><small>Plain words. Flag gaps. Ask for review.</small></div><Check size={16} /></div>
                <div className="ws-drafting"><span><FileText size={15} />{scenario.output}</span><p>{scenario.draft.slice(0, scenario.draft.indexOf('\n\n'))}</p><div className="ws-draft-lines" aria-hidden="true"><i /><i /><i /></div></div>
            </div> : <div className="ws-review-sheet">
                <span className="ws-paper-status"><span />{reviewed ? 'REVIEWED IN EXAMPLE' : 'READY FOR YOUR REVIEW'}</span><h4>{scenario.draftTitle}</h4><p>{draft.split('\n\n')[0]}</p>
                <div className="ws-missing"><Search size={14} />{input.gap}</div>
                <button type="button" className="ws-review-button" onClick={onReview}>{reviewed ? 'View reviewed draft' : 'Open & edit the draft'}<ArrowUpRight size={17} /></button>
            </div>}
        </div>
        <div className="ws-console-footer"><LockKeyhole size={12} /><span>Illustrative data. No messages are sent.</span></div>
    </div>;
}

export default function WorkStory({ industry, onIndustryChange, scenario, onChoose, onReview, draft, reviewed }) {
    const root = useRef(null), sequence = useRef(null), progress = useRef(null);
    const [phase, setPhase] = useState(0);
    const [reduced, setReduced] = useState(prefersReducedMotion);
    useSceneMotion(root);
    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const change = () => setReduced(query.matches);
        query.addEventListener('change', change);
        return () => query.removeEventListener('change', change);
    }, []);
    useLayoutEffect(() => {
        if (reduced) return;
        const trigger = ScrollTrigger.create({
            trigger: sequence.current, start: 'top top', end: 'bottom bottom',
            onUpdate: self => {
                setPhase(Math.min(2, Math.floor(self.progress * 3)));
                if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`;
            },
        });
        return () => trigger.kill();
    }, [reduced]);
    const go = i => {
        if (reduced) setPhase(i);
        else {
            const el = sequence.current;
            const start = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: start + (el.offsetHeight - window.innerHeight) * ((i + .13) / 3), behavior: 'smooth' });
        }
    };
    const input = scenario.input;
    const entry = getIndustryScenario(industry.id, 'followup');
    return <div ref={root} className="work-story">
        <header className="ws-entry">
            <div className="ws-entry-thread" aria-hidden="true"><i /></div>
            <p className="ws-eyebrow" data-story-reveal>CONNECTED TO YOUR DAILY WORK</p>
            <h2 id="crown-title" data-story-reveal>Now watch it<br /><span className="drama-text">get to work.</span></h2>
            <p className="ws-entry-copy" data-story-reveal>I connect your tools and business knowledge<br className="ws-desktop" /> so AI can prepare the work your team repeats.</p>
            <div className="ws-launch" data-story-reveal>
                <div className="ws-aperture" aria-hidden="true"><i /><i /><i /></div>
                <span className="ws-launch-tool ws-launch-tool-mail" aria-hidden="true"><BrandLogo name={industry.tools[0].id} size={27} /></span>
                <span className="ws-launch-tool ws-launch-tool-drive" aria-hidden="true"><BrandLogo name={industry.tools[1].id} size={25} /></span>
                <svg className="ws-launch-paths" viewBox="0 0 680 270" fill="none" aria-hidden="true"><path d="M110 130C180 130 190 85 265 85M570 155C500 155 495 105 415 105M340 195V266" /><path className="ws-launch-pulse" pathLength="1" d="M110 130C180 130 190 85 265 85M570 155C500 155 495 105 415 105M340 195V266" /></svg>
                <a href="#crown-workflow" className="ws-task-entry" draggable="false" data-cursor-style="workflow" data-cursor-label="View workflow" onClick={() => onChoose('followup')} aria-label={`Follow one task: ${entry.name.toLowerCase()}`}>
                    <span className="ws-task-paper" data-cursor-tilt><span className="ws-task-paper-top"><Mic size={14} />EXAMPLE REQUEST<span>{industry.name.toUpperCase()}</span></span><span className="ws-task-wave" aria-hidden="true">{Array.from({ length: 27 }, (_, i) => <i key={i} style={{ '--height': `${18 + ((i * 37) % 61)}%`, '--delay': `${i * -.08}s` }} />)}</span><strong>{ENTRY_QUOTES[industry.id]}</strong><span className="ws-task-paper-bottom"><span /><span>{entry.output} to prepare</span><ArrowRight size={14} /></span></span>
                    <span className="ws-follow">Follow one task<ArrowDown size={16} /></span>
                </a>
            </div>
        </header>
        <div className="ws-sequence" id="crown-workflow" ref={sequence}>
            <div className="ws-sticky" data-phase={phase} data-cursor-scene>
                <div className="ws-ambient" aria-hidden="true" />
                <div className="ws-cursor-light" aria-hidden="true" />
                <div className="ws-stage">
                    <div className="ws-stage-top"><span><span className="ws-live-dot" />ONE TASK, FROM START TO REVIEW</span><span className="ws-stage-hint">{reduced ? 'Choose a step to explore' : 'Scroll to follow the work'}<ArrowDown size={12} /></span></div>
                    <div className="ws-industry-picker" role="group" aria-label="Choose your industry"><span>CHOOSE YOUR INDUSTRY</span><div>{INDUSTRIES.map(item => { const Icon = INDUSTRY_ICONS[item.id]; return <button key={item.id} type="button" aria-pressed={industry.id === item.id} onClick={() => onIndustryChange(item.id)}><Icon size={15} strokeWidth={1.5} />{item.name}</button>; })}</div></div>
                    <div className="ws-scenario-switch" aria-label="Choose a business task">{OPTIONS.map(s => <button key={s.id} type="button" aria-pressed={s.id === scenario.id} onClick={() => onChoose(s.id)}>{s.id === 'followup' ? 'Follow-ups' : s.id === 'documents' ? 'Documents' : 'Team handoffs'}</button>)}</div>
                    <div className="ws-industry-tools" aria-label={`Example software for ${industry.name.toLowerCase()}`}><span>EXAMPLE TOOLS</span>{industry.tools.map(tool => <span key={tool.id}><BrandLogo name={tool.id} size={17} />{tool.name}</span>)}</div>
                    <div className="ws-stage-layout">
                        <div className="ws-story-copy">
                            <div className="ws-beat-heading" key={`${industry.id}-${phase}`}><span className="ws-eyebrow">0{phase + 1} / {BEATS[phase].label}</span><h3>{BEATS[phase].title}</h3><p>{phase === 0 ? `Keep the ${input.label.toLowerCase()} with the work so ${industry.audience.toLowerCase()} can check the original request.` : phase === 1 ? industry.instruction : BEATS[phase].body}</p><small><ShieldCheck size={14} />{BEATS[phase].note}</small></div>
                            <nav className="ws-steps" aria-label="Workflow scenes">{BEATS.map((beat, i) => <button key={beat.label} type="button" aria-label={`Show scene ${i + 1}: ${beat.label}`} aria-current={i === phase ? 'step' : undefined} onClick={() => go(i)}><span>{i < phase ? <Check size={12} /> : `0${i + 1}`}</span><b>{beat.label}</b><i /></button>)}</nav>
                        </div>
                        <div className="ws-screen-space"><div className="ws-screen" data-story-screen><ContextScene input={input} scenario={scenario} phase={phase} onReview={onReview} draft={draft} reviewed={reviewed} /></div><div className="ws-screen-floor" aria-hidden="true" /></div>
                    </div>
                    <div className="ws-stage-bottom"><span>{scenario.name}</span><button type="button" onClick={() => phase < 2 ? go(phase + 1) : onReview()}>{phase < 2 ? 'Next scene' : reviewed ? 'View reviewed draft' : 'Try the draft'}<ArrowRight size={14} /></button></div>
                    <div className="ws-progress" aria-hidden="true"><i ref={progress} /></div>
                </div>
            </div>
        </div>
    </div>;
}

const BUILD_STEPS = [
    { title: 'Map the work.', text: 'Show me the task, the tools, and where your team gets stuck. I help you choose a useful starting point.', icon: Search, output: 'A clear first workflow', items: ['What starts the task?', 'What information does it need?', 'What would make it useful?'] },
    { title: 'Build and test.', text: 'I connect the right information, set the access and approval rules, and test the workflow on real examples.', icon: Brain, output: 'A workflow your team can test', items: ['Connect approved sources', 'Test the complete handoff', 'Check the review points'] },
    { title: 'Train your team.', text: 'Your team learns how to request work, check results, and make corrections before the system takes on more.', icon: CheckCheck, output: 'A team ready to use it', items: ['Practice with real tasks', 'Review and correct results', 'Agree support and next steps'] },
];

export function BuildStory() {
    const root = useRef(null);
    useSceneMotion(root);
    useLayoutEffect(() => {
        if (prefersReducedMotion()) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.ws-build-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 65%', end: 'bottom 70%', scrub: .5 } });
            gsap.utils.toArray('.ws-build-step').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 65%', end: 'max', toggleClass: 'is-lit' }));
        }, root);
        return () => ctx.revert();
    }, []);
    return <section id="crown-build" className="ws-build" ref={root} aria-labelledby="ws-build-title">
        <div className="ws-section-heading" data-story-reveal><span className="ws-eyebrow">FROM YOUR FIRST TASK TO DAILY USE</span><h3 id="ws-build-title">Start small.<br /><span className="drama-text">Build what works.</span></h3></div>
        <div className="ws-build-track"><span className="ws-build-line" aria-hidden="true"><i className="ws-build-fill" /></span>{BUILD_STEPS.map((step, i) => { const Icon = step.icon; return <div className="ws-build-step" key={step.title}>
            <span className="ws-build-number">0{i + 1}</span><div className="ws-build-copy" data-story-reveal><h4>{step.title}</h4><p>{step.text}</p></div><div className="ws-build-preview" data-story-reveal><Icon size={23} strokeWidth={1.5} /><b>{step.output}</b>{step.items.map(item => <span key={item}><Check size={13} />{item}</span>)}</div>
        </div>; })}</div>
        <p className="ws-build-note"><LockKeyhole size={15} />I agree ownership, full costs, access, and support with you before the build.</p>
    </section>;
}
