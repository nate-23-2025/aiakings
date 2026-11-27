import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Brain, Check, FileText, Globe, ShieldCheck, Workflow } from 'lucide-react';
import { track } from '@vercel/analytics';
import { BUILDS } from '../../data/builds';
import { SITE_LINKS } from '../../data/siteNavigation';
import BrandLogo from '../BrandLogo';

export function HomeProof() {
    return <section id="builds" className="ux-section ux-proof" aria-labelledby="home-proof-title">
        <div className="ux-section-head"><div><span className="ux-eyebrow">WEBSITES I HAVE BUILT</span><h2 id="home-proof-title">See the work <span className="drama-text">for yourself.</span></h2></div><p>Live client websites. Open any build to explore it.</p></div>
        <ul className="ux-proof-grid">{BUILDS.map(b => <li key={b.img}><a href={b.url} target="_blank" rel="noopener noreferrer" onClick={() => track('work_view', { project: b.img, page: '/' })}>
            <svg className="ux-proof-trace" aria-hidden="true" focusable="false"><rect x="1" y="1" rx="17" pathLength="1" /></svg>
            <div className="ux-proof-image"><img src={`/work/${b.img}.jpg`} alt={`${b.name} website`} width="1440" height="900" loading="lazy" decoding="async" /><span>View live site<ArrowUpRight size={15} /></span></div>
            <div className="ux-proof-copy"><small>{b.where}</small><h3>{b.short}<ArrowUpRight size={16} /></h3><p>{b.line}</p></div>
        </a></li>)}</ul>
    </section>;
}

const SERVICE_DETAILS = [
    { Icon: Globe, need: 'Help customers find you', body: 'I build your website and manage the search work, reviews, and call handling that help turn interest into inquiries.', examples: ['Website builds', 'Search visibility', 'Reviews & calls'], action: 'Explore websites & search' },
    { Icon: Workflow, need: 'Take a repeated job off your plate', body: 'I build an AI agent for a defined task, connected to the tools it needs and clear about when to ask for your approval.', examples: ['Client follow-up', 'Document preparation', 'Research'], action: 'Explore custom AI development' },
    { Icon: Brain, need: 'Connect the work across your business', body: 'I connect your tools, knowledge, and AI assistants in one system so your team can work from the same information.', examples: ['Shared knowledge', 'Connected tools', 'Team workflows'], action: 'Experience One Brain' },
];

// Adapted from Kokonut UI's Bento Grid (21st.dev, demo 622). The entire
// card is a real link, and its action stays visible on touch and keyboard.
export function HomeServices() {
    return <section id="services-overview" className="ux-section" aria-labelledby="home-services-title">
        <span id="doors" aria-hidden="true" className="absolute top-0" />
        <div className="ux-section-head"><div><span className="ux-eyebrow">HOW I CAN HELP</span><h2 id="home-services-title">Start with what <span className="drama-text">you need.</span></h2></div><p>Choose a service to see what I build, who it is for, and how to get started.</p></div>
        <div className="ux-service-grid">{SITE_LINKS.map((service, i) => {
            const { Icon, need, body, examples, action } = SERVICE_DETAILS[i];
            return <Link key={service.to} to={service.to} className={`ux-service-card ux-service-${i}`} style={{ '--stack-order': i }} onClick={() => track('service_select', { service: service.label, placement: 'homepage' })} data-spotlight>
                <div className="ux-service-top"><span><Icon size={25} strokeWidth={1.4} /></span><small>0{i + 1}</small></div>
                <p className="ux-service-need">{need}</p><h3>{service.label}</h3><p>{body}</p>
                <ul>{examples.map(example => <li key={example}><Check size={13} />{example}</li>)}</ul>
                <span className="ux-service-action">{action}<ArrowRight size={17} /></span>
            </Link>;
        })}</div>
    </section>;
}

const EXAMPLES = [
    { label: 'Follow-ups', request: 'Prepare a follow-up from my client call.', context: 'Call notes, the last conversation, and agreed next steps.', output: 'A draft reply with the next steps ready to check.' },
    { label: 'Documents', request: 'Prepare a project brief from these notes.', context: 'The approved scope, shared files, and your writing instructions.', output: 'A brief with its sources attached and missing details flagged.' },
    { label: 'Team handoffs', request: 'Prepare a handoff for the next person.', context: 'The latest decisions, open tasks, and project history.', output: 'A handoff with responsibilities and questions ready to review.' },
];

export function HomeWorkflow() {
    const [selected, setSelected] = useState(0);
    const example = EXAMPLES[selected];
    return <section className="ux-section ux-workflow-section" aria-labelledby="home-workflow-title">
        <div className="ux-workflow-intro"><span className="ux-eyebrow">ONE BRAIN IN PRACTICE</span><h2 id="home-workflow-title">The right information.<br /><span className="drama-text">Work ready to review.</span></h2><p>I connect the information your team already has so AI can prepare the next step. You check the work and make the decision.</p><Link to="/one-brain#crown-workflow" className="ux-text-link">Try the full interactive example<ArrowRight size={17} /></Link></div>
        <div className="ux-workflow-demo">
            <div className="ux-example-tabs" role="group" aria-label="Choose an illustrative task">{EXAMPLES.map((item, i) => <button type="button" key={item.label} aria-pressed={selected === i} onClick={() => { setSelected(i); track('example_select', { example: item.label, page: '/' }); }}>{item.label}</button>)}</div>
            <ol className="ux-example-flow" aria-live="polite" aria-atomic="true" key={example.label}>
                <li><span className="ux-example-icon"><FileText size={19} /></span><div><small>01 / YOUR REQUEST</small><p>{example.request}</p></div></li>
                <li><span className="ux-example-icon"><Brain size={19} /></span><div><small>02 / CONNECTED CONTEXT</small><p>{example.context}</p><span className="ux-example-brands"><BrandLogo name="outlook" size={20} />Outlook<BrandLogo name="drive" size={20} />Drive<BrandLogo name="slack" size={20} />Slack</span></div></li>
                <li><span className="ux-example-icon"><ShieldCheck size={19} /></span><div><small>03 / YOUR REVIEW</small><p>{example.output}</p><span className="ux-review-state"><span />Waiting for your approval</span></div></li>
            </ol>
            <p className="ux-example-note">Illustrative tasks and example tools. No accounts are connected.</p>
        </div>
    </section>;
}
