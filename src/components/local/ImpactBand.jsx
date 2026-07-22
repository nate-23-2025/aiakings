import { useEffect, useRef, useState } from 'react';

// Count-up stat tiles + the 6-persona "cast" row. Numbers animate the first time the band
// scrolls into view. Cast chips are clickable — they select that business up in the hero.

function useInView(ref) {
    const [seen, setSeen] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el || seen) return;
        const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.35 });
        io.observe(el);
        return () => io.disconnect();
    }, [ref, seen]);
    return seen;
}

function CountUp({ to, start, suffix = '' }) {
    const [v, setV] = useState(0);
    useEffect(() => {
        if (!start) return;
        let raf; const t0 = performance.now(); const dur = 1400;
        const step = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setV(Math.round(to * eased));
            if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [start, to]);
    return <>{v}{suffix}</>;
}

const STATS = [
    { render: (seen) => <><CountUp to={100} start={seen} suffix="%" /></>, label: 'of calls answered' },
    { render: () => <>&lt;1<span className="text-2xl">s</span></>, label: 'to pick up' },
    { render: () => <>24<span className="text-white/30">/</span>7</>, label: 'always on' },
    { render: (seen) => <CountUp to={6} start={seen} />, label: 'industries, one system' },
];

export default function ImpactBand({ verticals, selectedId, onSelect }) {
    const ref = useRef(null);
    const seen = useInView(ref);

    const pick = (v) => {
        onSelect(v);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div ref={ref}>
            {/* stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
                {STATS.map((s, i) => (
                    <div key={i} className="text-center rounded-2xl bg-[#15151A] border border-white/5 py-6 px-3">
                        <div className="text-4xl sm:text-5xl font-sans font-light text-brand-accent tabular-nums leading-none mb-2">{s.render(seen)}</div>
                        <div className="text-white/45 text-xs sm:text-sm">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* cast */}
            <p className="text-center text-white/40 text-xs uppercase tracking-[0.2em] font-mono mb-5">Meet the receptionists</p>
            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
                {verticals.map((v) => {
                    const active = v.id === selectedId;
                    return (
                        <button
                            key={v.id}
                            onClick={() => pick(v)}
                            className={`group flex items-center gap-3 rounded-2xl border px-4 py-2.5 transition-all duration-300 ${
                                active ? 'bg-brand-accent/10 border-brand-accent/40' : 'bg-[#15151A] border-white/5 hover:border-brand-accent/25 hover:-translate-y-0.5'
                            }`}
                        >
                            <span className="flex items-center justify-center w-9 h-9 rounded-full text-brand-accent font-sans text-lg shrink-0"
                                style={{ background: 'radial-gradient(circle at 35% 30%, rgba(201,168,76,0.35), rgba(201,168,76,0.06) 70%)' }}>
                                {v.persona.replace('Miss ', '').charAt(0)}
                            </span>
                            <span className="text-left">
                                <span className="block text-white text-sm font-semibold leading-tight">{v.persona}</span>
                                <span className="block text-white/40 text-xs leading-tight">{v.label}</span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
