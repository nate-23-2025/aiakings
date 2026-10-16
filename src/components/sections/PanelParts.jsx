import { H3, LEDE } from '../../lib/ui';

// Headline on the left, one line of context on the right.
export function PanelHead({ title, lede, as = 'h3', size = H3 }) {
    const Tag = as;
    return (
        <div className="grid md:grid-cols-2 gap-5 md:gap-12 md:items-end mb-8 sm:mb-12">
            <Tag data-reveal="lines" className={size}>{title}</Tag>
            <p data-reveal className={`${LEDE} md:pb-2`}>{lede}</p>
        </div>
    );
}

// Numbered rows: the big index, the point, the explanation.
export function Rows({ items }) {
    return (
        <ol data-reveal-group className="border-t border-white/[0.07]">
            {items.map(({ title, body }, i) => (
                <li key={title} className="grid grid-cols-[3.25rem_minmax(0,1fr)] md:grid-cols-[6rem_minmax(0,0.9fr)_minmax(0,1.3fr)] gap-x-4 md:gap-x-8 gap-y-2 border-b border-white/[0.07] py-6 sm:py-7">
                    <span className="text-3xl sm:text-4xl font-light text-white/90 tracking-tight tabular-nums leading-none">
                        {String(i + 1).padStart(2, '0')}<span className="text-brand-accent">.</span>
                    </span>
                    <h4 className="text-lg sm:text-xl font-semibold text-white">{title}</h4>
                    <p className="col-start-2 md:col-start-3 text-white/50 text-sm sm:text-base leading-relaxed">{body}</p>
                </li>
            ))}
        </ol>
    );
}
