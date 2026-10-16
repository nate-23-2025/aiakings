import { useEffect, useState } from 'react';
import { Lock, Star, Phone } from 'lucide-react';
import { prefersReducedMotion } from '../../lib/motion';
import { useInView } from '../../hooks/useInView';

// The Dev hero. A local business site puts itself together piece by piece,
// gets its second check, and goes live, then starts over. The timeline under
// it follows the real process: one kickoff call, the build, the second check,
// live. Everything is placeholder ("Your business") so nothing reads as a
// real client.
const STAGES = [
    { label: 'Kickoff call', at: 1 },
    { label: 'Build', at: 2 },
    { label: 'Second check', at: 7 },
    { label: 'Live', at: 8 },
];

const LAST = 15;   // ticks per cycle, the tail end is the finished site holding
const FADE = 14;   // the tick where the finished site fades out for the restart
const TICK_MS = 650;
const DONE = 10;   // what a reduced-motion visitor sees, finished and live

export default function SiteAssembler() {
    const [reduced] = useState(prefersReducedMotion);
    const [step, setStep] = useState(() => (prefersReducedMotion() ? DONE : 0));
    const [ref, inView] = useInView();

    useEffect(() => {
        if (reduced || !inView) return;
        const id = setInterval(() => setStep((s) => (s >= LAST ? 0 : s + 1)), TICK_MS);
        return () => clearInterval(id);
    }, [reduced, inView]);

    const fading = step >= FADE;
    const at = (n) => step >= n && !fading;
    const live = at(8);
    const checking = step === 7;

    // One transition recipe for every piece that drops into place.
    const piece = (n, from = 'translateY(10px)') => ({
        opacity: at(n) ? 1 : 0,
        transform: at(n) ? 'none' : from,
        transition: 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
    });
    const bar = (n, delay = 0) => ({
        transform: at(n) ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: '0 50%',
        transition: `transform 0.7s cubic-bezier(0.65, 0, 0.35, 1) ${delay}s`,
    });

    return (
        <div ref={ref} className="relative w-full max-w-[460px] mx-auto">
            <div className="relative pr-8 pb-10">
                {/* Browser */}
                <div data-spotlight className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#15151A] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                    <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/[0.06]">
                        <span className="w-2 h-2 rounded-full bg-white/15" />
                        <span className="w-2 h-2 rounded-full bg-white/15" />
                        <span className="w-2 h-2 rounded-full bg-white/15" />
                        <span className="ml-2 flex-grow flex items-center gap-1.5 truncate rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[10px]">
                            {live ? (
                                <>
                                    <Lock size={9} className="text-emerald-400/90 shrink-0" />
                                    <span className="text-white/60">yourbusiness.com</span>
                                </>
                            ) : (
                                <span className="text-white/30">
                                    building<span className="caret">_</span>
                                </span>
                            )}
                        </span>
                        <span
                            className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-emerald-400/90"
                            style={piece(8, 'scale(0.6)')}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live
                        </span>
                    </div>

                    {/* The page */}
                    <div className="relative aspect-[16/12] p-4 sm:p-5">
                        {/* Faint layout grid, visible while it is still being built */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
                                backgroundSize: '22px 22px',
                                opacity: live ? 0 : 1,
                                transition: 'opacity 0.8s ease',
                            }}
                        />

                        {/* The second check, a scan down the finished page */}
                        <div
                            aria-hidden="true"
                            className="absolute left-0 right-0 h-px bg-[#F1DC9B] shadow-[0_0_16px_3px_rgba(201,168,76,0.55)] pointer-events-none z-10"
                            style={{ top: at(7) ? '100%' : '0%', opacity: checking ? 1 : 0, transition: 'top 0.65s linear, opacity 0.2s ease' }}
                        />

                        <div className="relative flex flex-col h-full gap-3">
                            {/* Nav */}
                            <div className="flex items-center justify-between" style={piece(1, 'translateY(-8px)')}>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3.5 h-3.5 rounded-[4px] bg-brand-accent" />
                                    <span className="text-[10px] font-semibold text-white/80">Your business</span>
                                </span>
                                <span className="hidden sm:flex items-center gap-2.5">
                                    <span className="w-7 h-1 rounded-full bg-white/15" />
                                    <span className="w-7 h-1 rounded-full bg-white/15" />
                                    <span className="w-7 h-1 rounded-full bg-white/15" />
                                </span>
                                <span className="flex items-center gap-1 rounded-full bg-brand-accent px-2 py-1 text-[8px] font-semibold text-brand-primary">
                                    <Phone size={8} strokeWidth={3} /> Call
                                </span>
                            </div>

                            {/* Headline */}
                            <div className="mt-2 flex flex-col gap-2">
                                <span className="block h-3 w-[78%] rounded-full bg-white/80" style={bar(2)} />
                                <span className="block h-3 w-[52%] rounded-full bg-brand-accent" style={bar(2, 0.15)} />
                                <span className="block h-1.5 w-[88%] rounded-full bg-white/15 mt-1" style={bar(3)} />
                                <span className="block h-1.5 w-[64%] rounded-full bg-white/15" style={bar(3, 0.1)} />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 mt-1" style={piece(4)}>
                                <span className="rounded-full bg-brand-accent px-3 py-1.5 text-[9px] font-semibold text-brand-primary">Book now</span>
                                <span className="rounded-full border border-white/20 px-3 py-1.5 text-[9px] text-white/70">Call now</span>
                            </div>

                            {/* Services */}
                            <div className="grid grid-cols-3 gap-2 mt-auto">
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        className="flex flex-col gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] p-2"
                                        style={{ ...piece(5, 'translateY(14px)'), transitionDelay: `${i * 0.09}s` }}
                                    >
                                        <span className="w-4 h-4 rounded-full bg-brand-accent/25 border border-brand-accent/40" />
                                        <span className="h-1 w-[80%] rounded-full bg-white/25" />
                                        <span className="h-1 w-[55%] rounded-full bg-white/10" />
                                    </span>
                                ))}
                            </div>

                            {/* Reviews */}
                            <div className="flex items-center gap-2" style={piece(6)}>
                                <span className="flex gap-0.5">
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <Star
                                            key={i}
                                            size={10}
                                            className="text-brand-accent fill-brand-accent"
                                            style={{
                                                opacity: at(6) ? 1 : 0,
                                                transform: at(6) ? 'scale(1)' : 'scale(0.3)',
                                                transition: `opacity 0.3s ease ${0.15 + i * 0.07}s, transform 0.4s cubic-bezier(0.2, 1.4, 0.4, 1) ${0.15 + i * 0.07}s`,
                                            }}
                                        />
                                    ))}
                                </span>
                                <span className="h-1 w-20 rounded-full bg-white/15" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* The phone version, which is the one most customers see */}
                <div
                    className="absolute right-0 bottom-0 w-[27%] rounded-[1.1rem] overflow-hidden border-[3px] border-[#2A2A35] bg-[#15151A] shadow-[0_14px_44px_rgba(0,0,0,0.65)]"
                    style={piece(8, 'translateY(30px) rotate(4deg)')}
                >
                    <div className="aspect-[9/17] p-2 flex flex-col gap-1.5">
                        <span className="flex items-center justify-between">
                            <span className="w-2.5 h-2.5 rounded-[3px] bg-brand-accent" />
                            <span className="w-5 h-2 rounded-full bg-brand-accent" />
                        </span>
                        <span className="h-1.5 w-[90%] rounded-full bg-white/70 mt-2" />
                        <span className="h-1.5 w-[60%] rounded-full bg-brand-accent" />
                        <span className="h-1 w-[85%] rounded-full bg-white/15 mt-1" />
                        <span className="mt-1.5 rounded-full bg-brand-accent h-3.5 w-[70%]" />
                        <span className="mt-auto grid grid-cols-2 gap-1">
                            <span className="h-6 rounded bg-white/[0.06]" />
                            <span className="h-6 rounded bg-white/[0.06]" />
                        </span>
                    </div>
                </div>
            </div>

            {/* Where it is in the process */}
            <ol className="mt-2 grid grid-cols-4 gap-2" aria-label="How a build runs">
                {STAGES.map((s, i) => {
                    const lit = at(s.at);
                    return (
                        <li key={s.label} className="flex flex-col gap-2">
                            <span className="relative h-[2px] rounded-full bg-white/10 overflow-hidden">
                                <span
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-accent to-[#F1DC9B]"
                                    style={{ transform: lit ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: '0 50%', transition: `transform 0.6s cubic-bezier(0.65, 0, 0.35, 1) ${i === 0 ? 0 : 0.05}s` }}
                                />
                            </span>
                            <span
                                className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest"
                                style={{ color: lit ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)', transition: 'color 0.4s ease' }}
                            >
                                {s.label}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
