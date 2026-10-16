import { ArrowUpRight, Check } from 'lucide-react';
import { BUILDS } from '../../data/builds';

// Proof as two lists side by side, like a press and awards panel: the live
// sites on the left (each one opens in a new tab), and what every build
// ships with on the right. The screenshots come right after, in the gallery.
const SHIPS = [
    'Your services',
    'The areas you cover',
    'Proof',
    'A phone number nobody can miss on a phone screen',
];

export default function BuildList() {
    return (
        <section data-noseam id="builds" className="scroll-mt-24 px-5 sm:px-6 md:px-8 py-4 sm:py-6">
            <div className="max-w-6xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] border border-white/[0.06] bg-[#111116]/80 p-6 sm:p-10 lg:p-14">
                <div className="grid md:grid-cols-2 gap-5 md:gap-12 md:items-end mb-10 sm:mb-14">
                    <h2 data-reveal="lines" className="text-4xl sm:text-5xl md:text-6xl font-sans font-medium tracking-tight text-white leading-[1.02]">
                        Live right now. <span className="drama-text text-brand-accent">Go click around.</span>
                    </h2>
                    <p data-reveal className="text-white/50 text-base sm:text-lg font-light leading-relaxed md:pb-2">
                        Real local businesses, live today. And many more.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 mb-3">My builds</p>
                        <ul data-reveal-group className="border-t border-white/[0.07]">
                            {BUILDS.map((b) => (
                                <li key={b.url}>
                                    <a
                                        href={b.url}
                                        target="_blank"
                                        rel="noopener"
                                        className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-white/[0.07] py-5 px-1 transition-colors hover:bg-white/[0.02]"
                                    >
                                        <span className="live-dot block w-2 h-2 rounded-full bg-emerald-400 text-emerald-400" aria-label="Live" />
                                        <span className="min-w-0">
                                            <span className="block text-white text-base sm:text-lg font-medium truncate transition-colors group-hover:text-brand-accent">{b.name}</span>
                                            <span className="block text-white/40 text-sm truncate">{b.where}</span>
                                        </span>
                                        <ArrowUpRight className="w-4 h-4 text-white/40 transition-[translate,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-accent" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 mb-3">Every build ships with</p>
                        <ul data-reveal-group data-inview className="border-t border-white/[0.07]">
                            {SHIPS.map((s, i) => (
                                <li key={s} className="flex items-center gap-4 border-b border-white/[0.07] py-5 px-1">
                                    <Check className="draw w-4 h-4 text-brand-accent shrink-0" strokeWidth={2.5} style={{ '--d': `${0.4 + i * 0.12}s` }} />
                                    <span className="text-white/75 text-base sm:text-lg">{s}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
