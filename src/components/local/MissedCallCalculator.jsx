import { useEffect, useRef, useState } from 'react';

// Interactive missed-call ROI calculator. All figures come from the visitor's own
// inputs (their math, not our claimed results) and are labeled as estimates.
const WEEKS_PER_MONTH = 4.33;

function useCountUp(value) {
    const [display, setDisplay] = useState(value);
    const fromRef = useRef(value);
    const rafRef = useRef();

    useEffect(() => {
        const from = fromRef.current;
        const to = value;
        const start = performance.now();
        const dur = 500;
        cancelAnimationFrame(rafRef.current);
        const tick = (now) => {
            const t = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            const current = Math.round(from + (to - from) * eased);
            setDisplay(current);
            if (t < 1) rafRef.current = requestAnimationFrame(tick);
            else fromRef.current = to;
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [value]);

    return display;
}

const fmt = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });

export default function MissedCallCalculator({ vertical, onBook }) {
    const [callsPerWeek, setCallsPerWeek] = useState(40);
    const [percentMissed, setPercentMissed] = useState(25);
    const [avgValue, setAvgValue] = useState(vertical.avgValue);
    const [inView, setInView] = useState(false);
    const outRef = useRef(null);

    // Reset the value slider to the vertical's default when the vertical changes
    useEffect(() => { setAvgValue(vertical.avgValue); }, [vertical]);

    // Count up from $0 the first time the result scrolls into view
    useEffect(() => {
        const el = outRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.4 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const missedPerMonth = Math.round(callsPerWeek * (percentMissed / 100) * WEEKS_PER_MONTH);
    const lostPerMonth = missedPerMonth * avgValue;
    const animatedLost = useCountUp(inView ? lostPerMonth : 0);

    const sliderCls = 'w-full accent-brand-accent cursor-pointer';

    return (
        <div className="bg-[#15151A] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Inputs */}
                <div className="flex flex-col gap-7">
                    <div>
                        <div className="flex justify-between items-baseline mb-2">
                            <label className="text-white/70 text-sm font-medium">Calls you get per week</label>
                            <span className="text-brand-accent font-mono text-sm">{callsPerWeek}</span>
                        </div>
                        <input type="range" min="5" max="200" step="5" value={callsPerWeek}
                            onChange={(e) => setCallsPerWeek(+e.target.value)} className={sliderCls} />
                    </div>

                    <div>
                        <div className="flex justify-between items-baseline mb-2">
                            <label className="text-white/70 text-sm font-medium">% of calls you miss</label>
                            <span className="text-brand-accent font-mono text-sm">{percentMissed}%</span>
                        </div>
                        <input type="range" min="5" max="60" step="1" value={percentMissed}
                            onChange={(e) => setPercentMissed(+e.target.value)} className={sliderCls} />
                        <p className="text-white/30 text-xs mt-1.5">Most local businesses miss 20–30% of inbound calls.</p>
                    </div>

                    <div>
                        <div className="flex justify-between items-baseline mb-2">
                            <label className="text-white/70 text-sm font-medium">Average value of a client</label>
                            <span className="text-brand-accent font-mono text-sm">${fmt(avgValue)}</span>
                        </div>
                        <input type="range" min="50" max="3000" step="50" value={avgValue}
                            onChange={(e) => setAvgValue(+e.target.value)} className={sliderCls} />
                    </div>
                </div>

                {/* Output */}
                <div ref={outRef} className="text-center lg:text-left bg-[#0D0D12] border border-brand-accent/15 rounded-2xl p-6 sm:p-8">
                    <p className="text-white/40 text-xs uppercase tracking-[0.15em] font-mono mb-3">Estimated revenue you're losing</p>
                    <p className="text-4xl sm:text-5xl md:text-6xl font-semibold text-brand-accent leading-none mb-1">
                        ${fmt(animatedLost)}
                    </p>
                    <p className="text-white/50 text-sm mb-6">per month, from <span className="text-white/70">{missedPerMonth}</span> missed calls</p>
                    <button onClick={onBook}
                        className="w-full sm:w-auto bg-brand-accent text-brand-primary font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full hover:scale-[1.03] active:scale-[0.97] transition-transform duration-300 shadow-[0_0_40px_rgba(201,168,76,0.25)]">
                        Stop losing ${fmt(lostPerMonth)}/mo
                    </button>
                    <p className="text-white/25 text-[11px] mt-3">Estimate based on your inputs. Your {vertical.noun}'s numbers may vary.</p>
                </div>
            </div>
        </div>
    );
}
