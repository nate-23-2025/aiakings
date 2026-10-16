// The strip under the offer: the kinds of businesses this is built for, on an
// endless slow loop. Labeled "built for", never "trusted by", because these
// are trades, not a client list. The second copy exists only to make the loop
// seamless, so screen readers skip it and reduced motion hides it.
const TRADES = [
    'Mobile detailing',
    'Junk removal',
    'Tree removal',
    'Plumbing',
    'Roofing',
    'Lawn and landscaping',
    'Salons and barbershops',
    'Pharmacy and wellness',
];

function Row({ dupe = false }) {
    return (
        <div className={`flex items-center shrink-0 ${dupe ? 'marquee-dupe' : ''}`} aria-hidden={dupe || undefined}>
            {TRADES.map((t) => (
                <span key={t} className="flex items-center">
                    <span className="drama-text text-2xl sm:text-3xl text-white/55 whitespace-nowrap px-6 sm:px-8">{t}</span>
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-brand-accent/60" />
                </span>
            ))}
        </div>
    );
}

export default function TradeMarquee() {
    return (
        <section data-noseam className="px-5 sm:px-6 md:px-8 py-4 sm:py-6">
            <div data-reveal className="max-w-6xl mx-auto rounded-[2rem] border border-white/[0.06] bg-[#111116]/80 py-7 sm:py-9 overflow-hidden">
                <p className="px-6 sm:px-10 mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                    Built for local service businesses like
                </p>
                <div className="marquee overflow-hidden">
                    <div className="marquee-track">
                        <Row />
                        <Row dupe />
                    </div>
                </div>
            </div>
        </section>
    );
}
