import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Phone, Send, ClipboardList, RotateCcw, FileText, Search, Radar, Inbox } from 'lucide-react';
import { prefersReducedMotion } from '../../lib/motion';
import { useInView } from '../../hooks/useInView';
import { AGENT_USES } from '../../data/agents';

// "What agents can do" as a bento: one large tile where a magnifying lens
// glides over the jobs an agent can take on (the lens shows a real, enlarged
// copy of what is under it), and a tile per job. Modeled on the bento grid
// and "Magnified Bento" components on 21st.dev, built from scratch here.
const ICONS = [Phone, Send, ClipboardList, RotateCcw, FileText, Search, Radar, Inbox];

const CHIPS = [
    'Missed calls', 'Booking', 'Quotes', 'Follow-ups', 'Reminders', 'Customer records',
    'Intake forms', 'Win-backs', 'Review asks', 'Reports', 'Scheduling', 'Inbox triage',
    'Paperwork', 'Listings check', 'Research', 'Hand-offs',
];

const LENS = 56;   // lens radius in px
const ZOOM = 1.65;

function ChipField({ copy = false }) {
    return (
        <div className={`absolute inset-0 flex flex-wrap content-center justify-center gap-2 px-6 ${copy ? '' : 'opacity-70'}`} aria-hidden={copy || undefined}>
            {CHIPS.map((c) => (
                <span key={c} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/70 whitespace-nowrap">
                    {c}
                </span>
            ))}
        </div>
    );
}

function Magnifier() {
    const wrapRef = useRef(null);
    const lensRef = useRef(null);
    const innerRef = useRef(null);
    const [size, setSize] = useState({ w: 0, h: 0 });
    const [viewRef, inView] = useInView();

    useLayoutEffect(() => {
        const el = wrapRef.current;
        const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const lens = lensRef.current;
        const inner = innerRef.current;
        const { w, h } = size;
        if (!lens || !inner || !w) return;
        const place = (x, y) => {
            lens.style.transform = `translate(${x - LENS}px, ${y - LENS}px)`;
            inner.style.transform = `translate(${-(x * ZOOM - LENS)}px, ${-(y * ZOOM - LENS)}px) scale(${ZOOM})`;
        };
        if (prefersReducedMotion() || !inView) {
            place(w * 0.5, h * 0.5);
            return;
        }
        let raf = 0;
        const start = performance.now();
        const tick = (now) => {
            const t = ((now - start) / 11000) * Math.PI * 2;
            const x = w / 2 + (w / 2 - LENS - 8) * Math.sin(t);
            const y = h / 2 + (h / 2 - LENS * 0.55) * Math.sin(t * 2) * 0.8;
            place(x, y);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [size, inView]);

    return (
        <div ref={(el) => { wrapRef.current = el; viewRef.current = el; }} className="relative h-56 sm:h-64 overflow-hidden rounded-xl" style={{ maskImage: 'radial-gradient(ellipse 90% 85% at 50% 50%, #000 55%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 85% at 50% 50%, #000 55%, transparent 100%)' }}>
            <ChipField />
            <div ref={lensRef} className="magnifier-lens" style={{ width: LENS * 2, height: LENS * 2 }} aria-hidden="true">
                <div ref={innerRef} className="absolute left-0 top-0 origin-top-left" style={{ width: size.w, height: size.h }}>
                    <ChipField copy />
                </div>
                <span className="magnifier-handle" />
            </div>
        </div>
    );
}

export default function AgentBento() {
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
                    <div key={title} data-spotlight className="group relative rounded-2xl border border-white/[0.07] bg-[#15151A] p-5 sm:p-6 transition-colors duration-300 hover:border-white/15">
                        <div className="flex items-center justify-between">
                            <span className="grid place-items-center w-9 h-9 rounded-xl border border-white/10 bg-white/[0.03] text-brand-accent transition-[background-color,border-color] duration-300 group-hover:border-brand-accent/40 group-hover:bg-brand-accent/10">
                                <Icon className="w-4 h-4" strokeWidth={1.8} />
                            </span>
                            <span className="font-mono text-[10px] tracking-widest text-white/30">{String(i + 1).padStart(2, '0')}</span>
                        </div>
                        <h4 className="mt-4 text-white font-semibold text-base sm:text-lg">{title}</h4>
                        <p className="mt-2 text-white/50 text-sm leading-relaxed">{body}</p>
                    </div>
                );
            })}
        </div>
    );
}
