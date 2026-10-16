import { useEffect, useState } from 'react';
import { RefreshCw, Star } from 'lucide-react';
import { prefersReducedMotion } from '../../lib/motion';
import { useInView } from '../../hooks/useInView';

// Stage three, and the reason the other two keep working. The request goes out
// on every finished job, the review lands, and the ranking it feeds is what
// closes the loop back to stage one.
export default function ReviewLoop() {
    // 1 request sent, 2 review landed, 3 loop closes. There is no idle phase,
    // so the request bubble is on screen the whole time.
    const [reduced] = useState(prefersReducedMotion);
    const [phase, setPhase] = useState(() => (prefersReducedMotion() ? 3 : 1));
    const [ref, inView] = useInView();

    useEffect(() => {
        if (reduced || !inView) return;
        const tick = setInterval(() => setPhase((p) => (p >= 3 ? 1 : p + 1)), 1500);
        return () => clearInterval(tick);
    }, [reduced, inView]);

    return (
        <div ref={ref} data-spotlight className="bg-[#15151A] border border-white/5 rounded-[2rem] p-6 sm:p-7 h-80 flex flex-col relative shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-brand-accent font-semibold">Job finished</span>
            </div>

            {/* The ask, in the owner's voice, sent to every customer the same way */}
            <div className="bg-[#1A1A22] border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                <p className="text-xs text-white/75 leading-relaxed">
                    Thanks again for today. Mind leaving a quick review?
                </p>
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/25 mt-2 block">Sent</span>
            </div>

            {/* What comes back */}
            <div
                className="mt-3 bg-brand-accent/10 border border-brand-accent/25 rounded-2xl rounded-br-md px-4 py-3 transition-all duration-500"
                style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(10px)' }}
            >
                <div className="flex gap-1 mb-2">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <Star
                            key={i}
                            size={13}
                            className="text-brand-accent fill-brand-accent transition-all duration-300"
                            style={{
                                opacity: phase >= 2 ? 1 : 0,
                                transform: phase >= 2 ? 'scale(1)' : 'scale(0.4)',
                                transitionDelay: `${i * 90}ms`,
                            }}
                        />
                    ))}
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent/70">New review</span>
            </div>

            {/* The loop closing */}
            <div className="mt-auto pt-4 flex items-center gap-2 border-t border-white/[0.06]">
                <RefreshCw
                    size={12}
                    className={`text-brand-accent/60 transition-transform duration-700 ${phase >= 3 ? 'rotate-180' : ''}`}
                />
                <span className="text-[10px] text-white/30 leading-snug">Feeds back into how you rank.</span>
            </div>
        </div>
    );
}
