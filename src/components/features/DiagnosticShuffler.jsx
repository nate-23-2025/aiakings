import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Database, Filter, Target } from 'lucide-react';

export default function DiagnosticShuffler() {
    const containerRef = useRef(null);
    const [cards, setCards] = useState([
        { id: 1, title: 'Data Extraction', value: 'High Net-Worth Profiles', icon: Database },
        { id: 2, title: 'Enrichment', value: 'Verify SEC Filings', icon: Filter },
        { id: 3, title: 'Targeting', value: 'Hyper-Personalized Sync', icon: Target },
    ]);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Setup initial positions
            const elements = gsap.utils.toArray('.shuffler-card');

            const animateCards = () => {
                elements.forEach((el, index) => {
                    gsap.to(el, {
                        y: index * 12,
                        scale: 1 - index * 0.05,
                        opacity: 1 - index * 0.2,
                        zIndex: elements.length - index,
                        duration: 0.8,
                        ease: 'back.out(1.2)',
                    });
                });
            };

            animateCards();

            const interval = setInterval(() => {
                setCards(prev => {
                    const newCards = [...prev];
                    const first = newCards.shift();
                    newCards.push(first);
                    return newCards;
                });
            }, 3000);

            return () => clearInterval(interval);
        }, containerRef);

        return () => ctx.revert();
    }, [cards]); // Re-run animation when state changes

    return (
        <div
            ref={containerRef}
            className="bg-[#15151A] border border-white/5 rounded-[2rem] p-8 h-80 flex flex-col items-center justify-center relative shadow-2xl"
        >
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold">Lead Gen Array</span>
            </div>

            <div className="relative w-full max-w-[240px] h-32 mt-4">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.id}
                            className="shuffler-card absolute top-0 left-0 w-full bg-[#1A1A22] border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Icon size={16} className="text-brand-accent" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-white/60">{card.title}</span>
                            </div>
                            <div className="font-mono text-sm text-white/90 truncate">{card.value}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
