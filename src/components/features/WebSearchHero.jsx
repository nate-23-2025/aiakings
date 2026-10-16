import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { prefersReducedMotion } from '../../lib/motion';
import { useInView } from '../../hooks/useInView';

// The Marketer hero. A customer's question goes in, the answer engine checks
// the four things the monthly work keeps in order, one by one, and the answer
// it lands on is "Your business". Adapted from the "Web Search" component on
// 21st.dev (the streaming search, the spinning globe while a source loads, the
// check when it is done), restyled to the brand. It shows what the engine looks
// at, never a promised position. Illustration only.
const QUERY = 'best mobile detailer near me';

const SITES = [
    { title: 'Your Google profile', detail: 'category, hours, photos, posts', discover: 500, finish: 1700 },
    { title: 'Your website', detail: 'pages AI can actually read', discover: 1300, finish: 2600 },
    { title: 'Your reviews', detail: 'fresh, from every finished job', discover: 2100, finish: 3500 },
    { title: 'Your listings', detail: 'same name, address, and phone', discover: 2900, finish: 4400 },
];
const LAST = Math.max(...SITES.map((s) => s.finish));
const ANSWER_AT = LAST + 600;
const RESTART_AT = ANSWER_AT + 3600;

// Six meridians, phase-offset by 1/6 of the cycle, read as one rotating
// sphere. Kept from the original component.
const M = {
    L: 'M6.057 11.565 C2.081 11.565 0.371 8.159 0.371 5.964 C0.371 3.642 2.152 0.329 6.05 0.329',
    ML: 'M6.012 11.55 C4.575 10.496 3.333 8.116 3.321 5.964 C3.307 3.399 4.974 0.977 6.012 0.329',
    MR: 'M6.012 11.55 C7.211 10.781 8.715 8.287 8.715 5.964 C8.715 3.399 7.24 1.233 6.012 0.329',
    R: 'M6.012 11.55 C9.677 11.55 11.65 8.487 11.65 5.964 C11.65 3.499 9.748 0.329 6.012 0.329',
};

function Globe() {
    const values = [M.L, M.ML, M.MR, M.R, M.L].join(';');
    return (
        <svg viewBox="0 0 12 12" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" style={{ overflow: 'visible' }}>
            <circle cx="6" cy="6" r="5.7" opacity="0.9" />
            <line x1="0.3" y1="6" x2="11.7" y2="6" opacity="0.9" />
            {['0s', '-1.2s', '-2.4s', '-3.6s', '-4.8s', '-6s'].map((begin) => (
                <path key={begin} d={M.L} opacity="0">
                    <animate attributeName="d" dur="7.2s" begin={begin} repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1" values={values} />
                    <animate attributeName="opacity" dur="7.2s" begin={begin} repeatCount="indefinite" calcMode="linear" keyTimes="0;0.05;0.7;0.75;1" values="0;0.9;0.9;0;0" />
                </path>
            ))}
        </svg>
    );
}

const SearchIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);
const Dots = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="9" strokeWidth="1.8" strokeDasharray="1.8 3.6" strokeLinecap="round" />
    </svg>
);
const CheckCircle = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export default function WebSearchHero() {
    const [reduced] = useState(prefersReducedMotion);
    const [states, setStates] = useState(() => SITES.map(() => (prefersReducedMotion() ? 'done' : 'pending')));
    const [answered, setAnswered] = useState(() => prefersReducedMotion());
    const [ref, inView] = useInView('0px');

    useEffect(() => {
        if (reduced || !inView) return;
        let timers = [];
        let cancelled = false;
        const run = () => {
            setStates(SITES.map(() => 'pending'));
            setAnswered(false);
            timers = [];
            const at = (ms, fn) => timers.push(setTimeout(fn, ms));
            SITES.forEach((site, i) => {
                at(site.discover, () => setStates((p) => p.map((v, j) => (j === i ? 'loading' : v))));
                at(site.finish, () => setStates((p) => p.map((v, j) => (j === i ? 'done' : v))));
            });
            at(ANSWER_AT, () => setAnswered(true));
            at(RESTART_AT, () => !cancelled && run());
        };
        run();
        return () => {
            cancelled = true;
            timers.forEach(clearTimeout);
        };
    }, [reduced, inView]);

    return (
        <div ref={ref} data-spotlight className="ws relative w-full max-w-[460px] mx-auto rounded-[1.75rem] border border-white/10 bg-[#111116]/95 p-5 sm:p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)]" data-state={answered ? 'done' : 'loading'}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-accent mb-4">A customer asks</p>

            <div className="flex items-center gap-2.5 text-white/60">
                <SearchIcon />
                <span className={`ws-shimmer text-[13px] sm:text-sm ${answered ? 'is-done' : ''}`}>
                    {answered ? 'Searched' : 'Searching'} <span className="text-white/85">&ldquo;{QUERY}&rdquo;</span>
                </span>
            </div>

            <div className="relative mt-4 pl-[22px]">
                <span aria-hidden="true" className="absolute left-[7px] top-1 bottom-1 w-px bg-white/10" />
                <ul className="flex flex-col gap-2.5">
                    {SITES.map((site, i) => (
                        <li key={site.title} className="ws-site flex items-center gap-2.5 text-[13px]" data-state={states[i]}>
                            <span className="ws-bullet relative -ml-[23px] grid place-items-center w-4 h-4 bg-[#111116]">
                                <span className="ws-dots"><Dots /></span>
                                <span className="ws-globe"><Globe /></span>
                                <span className="ws-check"><CheckCircle /></span>
                            </span>
                            <span className="text-white/85 whitespace-nowrap">{site.title}</span>
                            <span className="text-white/25">&middot;</span>
                            <span className="text-white/40 truncate">{site.detail}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-5 pt-4 border-t border-white/[0.07]">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">The answer</p>
                <div className={`ws-answer flex items-center gap-3 rounded-xl border px-4 py-3 ${answered ? 'is-in' : ''}`}>
                    <span className="grid place-items-center w-6 h-6 rounded-full bg-brand-accent shrink-0">
                        <Check size={13} strokeWidth={3} className="text-brand-primary" />
                    </span>
                    <span className="text-white font-medium">Your business</span>
                    <span className="ml-auto font-mono text-[9px] uppercase tracking-widest text-brand-accent/80">Named</span>
                </div>
                {[0, 1].map((n) => (
                    <div key={n} className="flex items-center gap-3 px-4 py-2.5 mt-1.5">
                        <span className="w-5 h-5 rounded-full border border-white/10 shrink-0" />
                        <span className="h-2 rounded-full bg-white/10" style={{ width: n ? '42%' : '56%' }} />
                    </div>
                ))}
            </div>
            <p className="mt-3 text-[10px] text-white/25">Illustration. Nobody controls what AI says; this is what it looks at.</p>
        </div>
    );
}
