// Sits above the three stage cards on wide screens: a line that draws itself
// across, then a spark that runs 1 to 2 to 3, lighting each stop as it passes.
// The stops land on the card centers of a three column grid with a 2rem gap.
const A = 'calc((100% - 4rem) / 6)';
const B = 'calc(100% - (100% - 4rem) / 6)';
const STOPS = [A, '50%', B];

export default function StageFlow() {
    return (
        <div data-inview aria-hidden="true" className="hidden lg:block relative h-9 mb-8">
            <div className="absolute top-1/2 h-px bg-white/10" style={{ left: A, right: A }} />
            <div className="flow-fill absolute top-1/2 h-px bg-gradient-to-r from-brand-accent/80 via-brand-accent/40 to-brand-accent/80" style={{ left: A, right: A }} />
            <span className="flow-dot" style={{ '--flow-a': A, '--flow-b': B }} />
            {STOPS.map((left, i) => (
                <span
                    key={left}
                    className="flow-node absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full border border-white/[0.12] bg-brand-primary font-mono text-xs text-white/45"
                    style={{ left, '--i': i }}
                >
                    {i + 1}
                </span>
            ))}
        </div>
    );
}
