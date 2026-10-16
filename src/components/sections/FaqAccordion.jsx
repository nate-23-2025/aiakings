import { useId, useState } from 'react';
import { Plus } from 'lucide-react';

// The FAQ as cards that open one or more at a time. Each card rises in on
// scroll, opens with a smooth height change, and tints with a sapphire edge
// while open. Answers stay in the page when closed, so search engines and the
// FAQ schema still see them. Modeled on "FAQ Accordion Reveal" on 21st.dev.
export default function FaqAccordion({ items, defaultOpen = 0 }) {
    const base = useId();
    const [open, setOpen] = useState(() => new Set(defaultOpen === null ? [] : [defaultOpen]));

    const toggle = (i) => setOpen((prev) => {
        const next = new Set(prev);
        if (next.has(i)) next.delete(i);
        else next.add(i);
        return next;
    });

    return (
        <div data-reveal-group className="flex flex-col gap-3">
            {items.map(({ q, a }, i) => {
                const isOpen = open.has(i);
                const id = `${base}-${i}`;
                return (
                    <div key={q} className={`faq-card ${isOpen ? 'is-open' : ''}`}>
                        <h3>
                            <button
                                type="button"
                                id={`${id}-q`}
                                aria-expanded={isOpen}
                                aria-controls={`${id}-a`}
                                onClick={() => toggle(i)}
                                className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 sm:px-6 sm:py-5 text-white text-base sm:text-lg font-medium"
                            >
                                {q}
                                <span className="faq-icon grid place-items-center w-8 h-8 shrink-0 rounded-full border border-white/15 text-white/60">
                                    <Plus size={15} />
                                </span>
                            </button>
                        </h3>
                        <div id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} className="faq-body">
                            <div className="overflow-hidden">
                                <p className="px-5 sm:px-6 pb-5 text-white/55 text-sm sm:text-base leading-relaxed">{a}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
