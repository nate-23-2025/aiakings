import { useRef, useState } from 'react';
import { ArrowLeftRight, Users, Database, RotateCcw } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { useInView } from '../../hooks/useInView';
import { ROLES, TOOLS } from './crown-data';

// Adapted from DHxWhy's Team Lanyard Rail, 21st.dev demo 43143.
// Listed in Top Today on 2026-11-04:
// https://21st.dev/@dhxwhy/components/team-lanyard-rail
// The metal rail, hanging straps, double-sided badges, and keyboard controls
// are adapted for example AI roles. No portraits, invented employees, or links.
const TONES = ['#79bdb2', '#d59880', '#ad9ed9', '#84adcf'];

export default function CouncilRail({ selected, onSelect }) {
    const [flipped, setFlipped] = useState(null);
    const [railRef, inView] = useInView('0px');
    const buttons = useRef([]);
    const navigate = event => {
        if (event.key === 'Escape') { setFlipped(null); return; }
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const index = ROLES.findIndex(role => role.id === selected);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? ROLES.length - 1 : (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + ROLES.length) % ROLES.length;
        onSelect(ROLES[next].id);
        setFlipped(null);
        buttons.current[next]?.focus({ preventScroll: true });
    };
    return <div ref={railRef} className={`cr-council-rail ${inView ? 'is-in-view' : ''}`}>
        <div className="cr-lanyard-stage" role="group" aria-label="AI assistant role badges" onKeyDown={navigate}>
            <div className="cr-metal-rail" aria-hidden="true"><i /><i /></div>
            {ROLES.map((role, i) => <div className={`cr-lanyard-slot ${selected === role.id ? 'is-selected' : ''}`} key={role.id} style={{ '--badge-tone': TONES[i], '--badge-angle': `${[-2, 1.5, -1.2, 2][i]}deg`, '--badge-drop': `${[0, 12, 5, 16][i]}px`, '--badge-delay': `${i * 65}ms` }}>
                <span className="cr-lanyard-ring" aria-hidden="true" />
                <span className="cr-lanyard-strap" aria-hidden="true"><i /></span>
                <span className="cr-lanyard-clip" aria-hidden="true" />
                <button type="button" className="cr-role-badge" aria-label={`${role.name} role badge`} aria-pressed={flipped === role.id} aria-describedby="cr-badge-hint" tabIndex={selected === role.id ? 0 : -1} ref={el => { buttons.current[i] = el; }} onClick={() => { onSelect(role.id); setFlipped(flipped === role.id ? null : role.id); }}>
                    <span className={`cr-badge-turn ${flipped === role.id ? 'is-flipped' : ''}`}>
                        <span className="cr-badge-face cr-badge-front" aria-hidden={flipped === role.id}>
                            <span className="cr-badge-band"><Users size={10} />AI ASSISTANTS</span>
                            <span className="cr-badge-hole" />
                            <span className="cr-badge-emblem">{role.initials}</span>
                            <strong>{role.name}</strong><span className="cr-badge-subtitle">{role.job}</span>
                            <span className="cr-badge-bottom"><span>AI ROLE / 0{i + 1}</span><RotateCcw size={10} /></span>
                        </span>
                        <span className="cr-badge-face cr-badge-back" aria-hidden={flipped !== role.id}>
                            <span className="cr-badge-band">ASSIGNED TO THE WORK</span><span className="cr-badge-hole" />
                            <strong>{role.name}</strong><span className="cr-badge-back-job">{role.job}</span>
                            <span className="cr-badge-tools">{role.tools.map(id => { const tool = TOOLS.find(t => t.id === id); return <span key={id}>{tool.logo ? <BrandLogo name={tool.logo} size={17} /> : <Database size={17} />}<span>{tool.name}</span></span>; })}</span>
                            <span className="cr-badge-bottom"><span>SCOPED ACCESS</span><RotateCcw size={10} /></span>
                        </span>
                    </span>
                </button>
            </div>)}
        </div>
        <p id="cr-badge-hint" className="cr-rail-hint"><ArrowLeftRight size={12} />Choose a role. Click to flip its badge.</p>
    </div>;
}
