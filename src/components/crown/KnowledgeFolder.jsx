import { useId, useRef, useState } from 'react';
import { BookOpen, ChevronDown, FileText, Mic, Network } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { useInView } from '../../hooks/useInView';
import { SOURCES } from './crown-data';

// Adapted from Kedhareswer Naidu's Glassmorphism Folder Cards, demo 37625.
// Listed in 21st.dev Top Today on 2026-11-04:
// https://21st.dev/@kedhareswer/components/glass-folder-cards
// Retains the back/files/frosted-front layering, hinged pocket, file fan,
// pointer tilt, on-view assembly, and inert closed contents. Actual records
// open the existing source dialog. Artwork is a CSS gradient, with no media.
export default function KnowledgeFolder({ selected, onSelect, onOpenSource, sources = SOURCES, logo = 'drive' }) {
    const [open, setOpen] = useState(false);
    const [folderRef, inView] = useInView('0px');
    const trigger = useRef(null);
    const uid = useId();
    const tilt = event => {
        if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const box = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--folder-x', `${((event.clientX - box.left) / box.width - .5) * 8}deg`);
        event.currentTarget.style.setProperty('--folder-y', `${((event.clientY - box.top) / box.height - .5) * -6}deg`);
    };
    return <div className="cr-knowledge-library">
        <div ref={folderRef} className={`cr-knowledge-folder ${open ? 'is-open' : ''} ${inView ? 'is-in-view' : ''}`} onPointerMove={tilt} onPointerLeave={event => { event.currentTarget.style.setProperty('--folder-x', '0deg'); event.currentTarget.style.setProperty('--folder-y', '0deg'); }} onKeyDown={event => { if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false); trigger.current?.focus(); } }}>
            <div className="cr-folder-object">
                <div className="cr-folder-shadow" aria-hidden="true" />
                <div className="cr-folder-back" aria-hidden="true"><span /><Network size={45} strokeWidth={.7} /></div>
                <div id={uid} className="cr-folder-files" role="group" aria-label="Business knowledge sources" inert={!open} aria-hidden={!open}>
                    {sources.map((source, i) => <button key={source.id} type="button" className={`cr-folder-sheet ${selected === source.id ? 'is-selected' : ''}`} style={{ '--sheet-order': i, '--sheet-angle': `${[-5, 0, 5][i]}deg` }} tabIndex={open ? 0 : -1} aria-label={`Read ${source.title}`} onClick={() => { onSelect(source.id); onOpenSource(source.id); }}>
                        <span className="cr-sheet-title">{source.id === 'call' ? <Mic size={13} /> : source.id === 'preferences' ? <BookOpen size={13} /> : <FileText size={13} />}{source.title}</span>
                        <span className="cr-sheet-meta">{source.type} · Example source</span><span className="cr-sheet-lines" aria-hidden="true"><i /><i /><i /></span>
                    </button>)}
                </div>
                <button type="button" ref={trigger} className="cr-folder-front" aria-expanded={open} aria-controls={uid} aria-label={`${open ? 'Close' : 'Open'} business knowledge folder`} onClick={() => setOpen(!open)}>
                    <span className="cr-folder-glass" aria-hidden="true" />
                    <span className="cr-folder-label"><span><BrandLogo name={logo} size={21} /><ChevronDown size={16} /></span><strong>Business knowledge</strong><small>{sources.length} example sources · {open ? 'Select a file above' : 'Click to open'}</small></span>
                </button>
            </div>
        </div>
        <p className="cr-folder-hint">Open the folder. Read the context behind the work.</p>
    </div>;
}
