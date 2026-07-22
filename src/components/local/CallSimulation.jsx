import { useEffect, useRef, useState } from 'react';
import { Phone, PhoneCall, Check } from 'lucide-react';

// On-page "play a live call" demo. Runs the selected vertical's script:
// ring -> connected -> transcript types out -> booked. No audio required.
const WAVE_BARS = 28;

export default function CallSimulation({ vertical }) {
    const [phase, setPhase] = useState('idle');   // idle | ringing | live | done
    const [revealed, setRevealed] = useState(0);
    const [speaker, setSpeaker] = useState(null);
    const timers = useRef([]);
    const script = vertical.script;

    const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

    // Clean up pending timers on unmount. The parent remounts this (via key) when the
    // vertical changes, so state resets naturally without a setState-in-effect.
    useEffect(() => () => clearTimers(), []);

    const play = () => {
        clearTimers();
        setPhase('ringing'); setRevealed(0); setSpeaker(null);
        timers.current.push(setTimeout(() => setPhase('live'), 1400));

        let delay = 1700;
        script.forEach((line, i) => {
            timers.current.push(setTimeout(() => {
                setSpeaker(line.who);
                setRevealed(i + 1);
            }, delay));
            delay += 1300 + line.text.length * 26;
        });
        timers.current.push(setTimeout(() => { setSpeaker(null); setPhase('done'); }, delay));
    };

    const live = phase === 'live';
    const statusText = phase === 'ringing' ? 'Ringing…'
        : phase === 'live' ? 'Connected'
        : phase === 'done' ? 'Call complete'
        : 'AI Receptionist';

    return (
        <div className="bg-[#15151A] border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
            {/* Call header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0D0D12]">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${live ? 'bg-brand-accent/20' : 'bg-white/5'}`}>
                        <PhoneCall className={`w-4 h-4 ${live ? 'text-brand-accent' : 'text-white/50'}`} />
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium leading-tight">{vertical.label} Receptionist</p>
                        <p className={`text-[11px] font-mono ${phase === 'ringing' ? 'text-brand-accent animate-pulse' : phase === 'done' ? 'text-emerald-400' : 'text-white/40'}`}>{statusText}</p>
                    </div>
                </div>
                {(phase === 'live' || phase === 'ringing') && (
                    <span className="flex items-center gap-1.5 text-emerald-400/80 text-[10px] font-mono uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                    </span>
                )}
            </div>

            {/* Waveform */}
            <div className="flex items-center justify-center gap-[3px] h-16 px-6 bg-[#101015]">
                {Array.from({ length: WAVE_BARS }).map((_, i) => (
                    <span
                        key={i}
                        className={`w-[3px] rounded-full ${live ? 'voicewave-bar bg-brand-accent/80' : 'bg-white/10'}`}
                        style={live ? { height: '70%', animationDelay: `${(i % 7) * 0.08}s`, opacity: speaker ? 1 : 0.4 } : { height: '18%' }}
                    />
                ))}
            </div>

            {/* Transcript */}
            <div className="px-5 sm:px-6 py-5 min-h-[210px] flex flex-col gap-2.5 justify-end">
                {phase === 'idle' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-6">
                        <p className="text-white/40 text-sm max-w-xs">Hear the AI handle a real booking for {vertical.service}.</p>
                        <button onClick={play}
                            className="flex items-center gap-2 bg-brand-accent text-brand-primary font-semibold text-sm px-6 py-3 rounded-full hover:scale-[1.03] active:scale-[0.97] transition-transform duration-300">
                            <Phone className="w-4 h-4" /> Play the call
                        </button>
                    </div>
                )}

                {phase !== 'idle' && script.slice(0, revealed).map((line, i) => (
                    <div key={i} className={`flex ${line.who === 'agent' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`text-sm leading-snug px-4 py-2.5 rounded-2xl max-w-[82%] ${
                            line.book
                                ? 'bg-brand-accent/15 border border-brand-accent/30 text-brand-accent'
                                : line.who === 'agent'
                                    ? 'bg-brand-accent/10 border border-brand-accent/20 text-white/85'
                                    : 'bg-white/[0.04] border border-white/5 text-white/65'
                        }`}>
                            {line.book && <Check className="inline w-4 h-4 mr-1 -mt-0.5" />}
                            {line.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / replay */}
            {phase === 'done' && (
                <div className="px-6 pb-5 -mt-1 flex items-center justify-between">
                    <span className="text-emerald-400 text-xs font-medium flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Appointment booked — in {Math.round(script.reduce((a, l) => a + l.text.length, 0) / 14)}s
                    </span>
                    <button onClick={play} className="text-white/40 hover:text-white text-xs font-medium transition-colors">Replay ↻</button>
                </div>
            )}
        </div>
    );
}
