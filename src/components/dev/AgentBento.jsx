import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import {
    Phone, Send, ClipboardList, RotateCcw, FileText, Search, Radar, Inbox,
    PhoneMissed, CalendarCheck, Receipt, MessageSquare, Bell, Users, Star, Clock, Files, MapPin, Handshake,
} from 'lucide-react';
import { prefersReducedMotion } from '../../lib/motion';
import { useInView } from '../../hooks/useInView';
import { AGENT_USES } from '../../data/agents';

// "What agents can do" as a bento: one large tile where rows of jobs drift
// past in opposite directions and a magnifying lens glides over them, lighting
// up whatever is under it in gold. The lens can be dragged; once someone moves
// it, it stays where they leave it. Then a tile per job. From "Magnified
// Bento" (0xUrvish) on 21st.dev, rebuilt without extra libraries (.mb-* in
// index.css).
const ICONS = [Phone, Send, ClipboardList, RotateCcw, FileText, Search, Radar, Inbox];
const EXAMPLES = [
    'A customer calls after hours. The agent answers from your business information and checks your calendar before offering a time.',
    'A new inquiry comes in. The agent prepares the next reply and keeps track of which quotes still need attention.',
    'A call ends. The useful details and next steps are saved with the right customer.',
    'A past customer is due for another service. The agent prepares a relevant follow-up for your review.',
    'A form arrives. The agent pulls out the details and files them where the next person can find them.',
    'You ask a question. The agent researches it and returns a summary with the sources beside the findings.',
    'Something changes on your public site or listings. The agent brings it to your attention.',
    'A request arrives. The agent routes it, prepares the reply, and keeps the next step from being forgotten.',
];

function JobVisual({ index }) {
    if (index === 0) return <div className="job-wave" aria-hidden="true">{Array.from({ length: 22 }, (_, i) => <i key={i} style={{ height: (8 + Math.abs(Math.sin(i * 1.4)) * 34) + 'px' }} />)}</div>;
    if (index === 2 || index === 4) return <div className="job-document" aria-hidden="true"><span /><span /><span /><i /></div>;
    if (index === 5 || index === 6) return <div className="job-radar" aria-hidden="true"><span /><span /><i /><b /></div>;
    return <div className="agent-mini" aria-hidden="true"><span /><span /><span /></div>;
}

const ROWS = [
    [['Missed calls', PhoneMissed], ['Booking', CalendarCheck], ['Quotes', Receipt], ['Follow-ups', MessageSquare], ['Reminders', Bell]],
    [['Customer records', Users], ['Intake forms', ClipboardList], ['Win-backs', RotateCcw], ['Review asks', Star], ['Reports', FileText]],
    [['Scheduling', Clock], ['Inbox triage', Inbox], ['Paperwork', Files], ['Listings check', MapPin], ['Research', Search], ['Hand-offs', Handshake]],
];

const LENS = 46; // lens radius in px

// Three copies of each row, so the drift can loop by a third without a seam.
// Both layers mount together, so their drift stays in step.
function Rows({ lit = false }) {
    return ROWS.map((row, r) => (
        <div key={r} className={`mb-row ${r % 2 ? 'is-rev' : ''}`}>
            {[...row, ...row, ...row].map(([label, icon], i) => {
                const Icon = icon;
                return (
                    <span key={i} className={`mb-chip ${lit ? 'is-lit' : ''}`}>
                        <Icon size={13} strokeWidth={1.8} />
                        {label}
                    </span>
                );
            })}
        </div>
    ));
}

function Magnifier() {
    const wrapRef = useRef(null);
    const lensRef = useRef(null);
    const size = useRef({ w: 0, h: 0 });
    const held = useRef(false);
    const [viewRef, inView] = useInView();

    const place = (x, y) => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const { w, h } = size.current;
        const cx = Math.min(Math.max(x, LENS), w - LENS);
        const cy = Math.min(Math.max(y, LENS), h - LENS);
        wrap.style.setProperty('--x', `${cx}px`);
        wrap.style.setProperty('--y', `${cy}px`);
        lensRef.current.style.transform = `translate(${cx - LENS}px, ${cy - LENS}px)`;
    };

    useLayoutEffect(() => {
        const el = wrapRef.current;
        const measure = () => {
            size.current = { w: el.clientWidth, h: el.clientHeight };
            if (!held.current) place(size.current.w / 2, size.current.h / 2);
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Glide on its own until someone grabs it.
    useEffect(() => {
        if (prefersReducedMotion() || !inView) return;
        let raf = 0;
        const start = performance.now();
        const tick = (now) => {
            if (!held.current) {
                const { w, h } = size.current;
                const t = ((now - start) / 12000) * Math.PI * 2;
                place(w / 2 + (w / 2 - LENS - 10) * Math.sin(t), h / 2 + (h / 2 - LENS - 6) * Math.sin(t * 2) * 0.8);
                raf = requestAnimationFrame(tick);
            }
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView]);

    const onPointerDown = (e) => {
        held.current = true;
        const lens = lensRef.current;
        lens.setPointerCapture(e.pointerId);
        const box = wrapRef.current.getBoundingClientRect();
        const move = (ev) => place(ev.clientX - box.left, ev.clientY - box.top);
        const up = () => {
            lens.removeEventListener('pointermove', move);
            lens.removeEventListener('pointerup', up);
            lens.removeEventListener('pointercancel', up);
        };
        lens.addEventListener('pointermove', move);
        lens.addEventListener('pointerup', up);
        lens.addEventListener('pointercancel', up);
        move(e);
    };

    return (
        <div ref={(el) => { wrapRef.current = el; viewRef.current = el; }} className="mb-field" style={{ '--r': `${LENS - 4}px` }}>
            <div className="mb-layer mb-base" aria-hidden="true"><Rows /></div>
            <div className="mb-layer mb-lit" aria-hidden="true"><Rows lit /></div>
            <div
                ref={lensRef}
                onPointerDown={onPointerDown}
                className="magnifier-lens mb-lens"
                style={{ width: LENS * 2, height: LENS * 2 }}
                aria-hidden="true"
            />
        </div>
    );
}

export default function AgentBento() {
    const [selected, setSelected] = useState(null);
    const id = useId();
    return (
        <div data-reveal-group className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div data-spotlight className="relative sm:col-span-2 lg:row-span-2 rounded-2xl border border-brand-accent/25 bg-gradient-to-b from-[#17150F] to-[#111116] p-5 sm:p-6 flex flex-col overflow-hidden">
                <Magnifier />
                <div className="mt-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-accent">One agent, a whole list of jobs</span>
                    <h4 className="mt-3 text-white text-xl sm:text-2xl font-semibold tracking-tight">The busywork, handled the same way every time.</h4>
                    <p className="mt-2 text-white/55 text-sm sm:text-base leading-relaxed">It works through the jobs that eat your day at any hour, and hands you anything that needs a person.</p>
                </div>
            </div>

            {AGENT_USES.map(({ title, body }, i) => {
                const Icon = ICONS[i];
                return (
                    <div key={title} data-spotlight data-tilt className="agent-job-card group relative rounded-2xl border border-white/[0.07] bg-[#15151A] p-5 sm:p-6 transition-colors duration-300 hover:border-white/15">
                        <div className="flex items-center justify-between">
                            <span className="grid place-items-center w-9 h-9 rounded-xl border border-white/10 bg-white/[0.03] text-brand-accent transition-[background-color,border-color] duration-300 group-hover:border-brand-accent/40 group-hover:bg-brand-accent/10">
                                <Icon className="w-4 h-4" strokeWidth={1.8} />
                            </span>
                            <span className="font-mono text-[10px] tracking-widest text-white/30">{String(i + 1).padStart(2, '0')}</span>
                        </div>
                        <JobVisual index={i} />
                        <h4 className="mt-4 text-white font-semibold text-base sm:text-lg">{title}</h4>
                        <p className="mt-2 text-white/50 text-sm leading-relaxed">{body}</p>
                        <button type="button" className="job-explore" aria-expanded={selected === i} aria-controls={id + '-' + i} onClick={() => setSelected(selected === i ? null : i)}>{selected === i ? 'Close the example' : 'See an example'}<span aria-hidden="true">{selected === i ? '−' : '+'}</span></button>
                        <div id={id + '-' + i} hidden={selected !== i} className="job-detail">{EXAMPLES[i]}</div>
                    </div>
                );
            })}
        </div>
    );
}
