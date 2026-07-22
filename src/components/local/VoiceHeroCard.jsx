import { useEffect, useRef, useState } from 'react';
import { ConversationProvider, useConversation } from '@elevenlabs/react';
import { Mic, MicOff, PhoneOff, Loader2, Radio, ChevronLeft, ChevronRight } from 'lucide-react';
import { VERTICALS } from '../../data/verticals';

// A Bland.ai-style interactive hero card, now a carousel of animated receptionists.
// Each agent has a looping portrait video (them, in-industry, in motion). Arrows cross-fade
// between agents — and because every video stays mounted and playing, the incoming one is
// already mid-animation when it fades in. On a call, the portrait shrinks to a compact avatar
// so the live transcript gets full room. Until the videos exist, a living gold orb stands in.

const N_BARS = 28;

// Flip to true once /public/agents/<key>.mp4 (+ .jpg poster) exist for every agent.
const MEDIA_READY = true;
const videoSrc = (key) => `/agents/${key}.mp4`;
const posterSrc = (key) => `/agents/${key}.jpg`;

function usePrefersReducedMotion() {
    const [reduce, setReduce] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
    useEffect(() => {
        const m = window.matchMedia('(prefers-reduced-motion: reduce)');
        const h = (e) => setReduce(e.matches);
        m.addEventListener?.('change', h);
        return () => m.removeEventListener?.('change', h);
    }, []);
    return reduce;
}

// Always animated: gentle idle shimmer, real frequency data when live.
function Visualizer({ getFreq, live }) {
    const barsRef = useRef([]);
    const rafRef = useRef(0);
    useEffect(() => {
        const tick = () => {
            const bars = barsRef.current;
            const data = live ? getFreq?.() : null;
            const t = performance.now() / 1000;
            for (let i = 0; i < N_BARS; i++) {
                let h;
                if (data && data.length) {
                    const step = Math.floor(data.length / N_BARS) || 1;
                    h = Math.max(0.08, Math.min(1, (data[i * step] / 255) * 1.6));
                } else {
                    const s = Math.sin(t * 1.5 + i * 0.5) * 0.5 + 0.5;
                    const s2 = Math.sin(t * 0.8 + i * 0.28) * 0.5 + 0.5;
                    h = 0.12 + s * s2 * 0.26;
                }
                if (bars[i]) bars[i].style.transform = `scaleY(${h.toFixed(3)})`;
            }
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [live, getFreq]);

    return (
        <div className="flex items-end justify-center gap-[3px] h-14 w-full">
            {Array.from({ length: N_BARS }).map((_, i) => (
                <span key={i} ref={(el) => (barsRef.current[i] = el)}
                    className={`w-[3px] sm:w-[4px] flex-1 max-w-[6px] origin-bottom rounded-full bg-gradient-to-t from-brand-accent/40 to-brand-accent ${live ? '' : 'opacity-50'}`}
                    style={{ transform: 'scaleY(0.1)' }} />
            ))}
        </div>
    );
}

// The living gold orb — fallback visual before persona videos exist.
function Orb({ initial, connected, isSpeaking }) {
    return (
        <div className="relative flex items-center justify-center w-full h-full">
            <div aria-hidden className="absolute w-[70%] h-[70%] rounded-full spin-slow opacity-70"
                style={{ background: 'conic-gradient(from 0deg, transparent, rgba(201,168,76,0.55), transparent 60%)', WebkitMask: 'radial-gradient(farthest-side, transparent 61%, #000 63%)', mask: 'radial-gradient(farthest-side, transparent 61%, #000 63%)' }} />
            <div aria-hidden className="absolute w-[86%] h-[86%] rounded-full spin-slower opacity-40"
                style={{ background: 'conic-gradient(from 180deg, transparent, rgba(201,168,76,0.35), transparent 55%)', WebkitMask: 'radial-gradient(farthest-side, transparent 70%, #000 72%)', mask: 'radial-gradient(farthest-side, transparent 70%, #000 72%)' }} />
            {isSpeaking && <div aria-hidden className="absolute w-[58%] h-[58%] rounded-full border border-brand-accent/40 animate-ping" style={{ animationDuration: '1.6s' }} />}
            <div className={`relative flex items-center justify-center w-[58%] h-[58%] rounded-full ${connected ? '' : 'breathe'}`}
                style={{ background: 'radial-gradient(circle at 35% 28%, rgba(201,168,76,0.38), rgba(201,168,76,0.08) 55%, rgba(255,255,255,0.015) 78%)', boxShadow: 'inset 0 0 30px rgba(201,168,76,0.25), 0 0 44px rgba(201,168,76,0.18)' }}>
                <span className="text-3xl font-sans font-light text-brand-accent select-none">{initial}</span>
            </div>
        </div>
    );
}

function VoiceHeroInner({ vertical, onSelectVertical }) {
    const [error, setError] = useState('');
    const [starting, setStarting] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const scrollRef = useRef(null);
    const reduce = usePrefersReducedMotion();

    const conversation = useConversation({
        onConnect: () => { setStarting(false); setError(''); },
        onDisconnect: () => { setStarting(false); },
        onError: (message) => {
            setStarting(false);
            const m = typeof message === 'string' ? message : 'Something went wrong.';
            setError(/permission|denied|microphone/i.test(m)
                ? 'Microphone access is needed to talk. Enable it and try again.'
                : 'All demo lines are busy right now — give it a moment and try again.');
        },
        onMessage: ({ message, source }) => {
            if (!message) return;
            setTranscript((t) => [...t.slice(-6), { source, text: message }]);
        },
    });

    const { status, isSpeaking, startSession, endSession, isMuted, setMuted, getOutputByteFrequencyData, getInputByteFrequencyData } = conversation;
    const connected = status === 'connected';
    const connecting = status === 'connecting' || starting;
    const initial = vertical.persona.replace('Miss ', '').charAt(0);
    const idx = VERTICALS.findIndex((v) => v.id === vertical.id);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [transcript]);

    const selectVertical = (v) => {
        if (v.id === vertical.id) return;
        if (connected || connecting) endSession();
        setTranscript([]); setError('');
        onSelectVertical(v);
    };
    const go = (dir) => selectVertical(VERTICALS[(idx + dir + VERTICALS.length) % VERTICALS.length]);

    const startCall = async () => {
        setError(''); setTranscript([]); setStarting(true);
        try {
            const res = await fetch('/api/voice-token', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: vertical.agentKey }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) { setStarting(false); setError(data.error || 'Could not start the demo. Please book a call instead.'); return; }
            startSession({ conversationToken: data.token, connectionType: 'webrtc' });
        } catch {
            setStarting(false); setError('Network error. Please try again.');
        }
    };

    const stateChip = connected
        ? (isSpeaking ? `${vertical.persona} is speaking` : 'Listening…')
        : connecting ? 'Connecting…' : 'Ready when you are';

    // Media stage: portrait when idle, compact avatar on a call (so transcript gets room).
    const stageClass = connected
        ? 'w-20 h-20 rounded-full'
        : 'w-full max-w-[185px] aspect-[4/5] rounded-2xl';

    return (
        <div className="relative mx-auto w-full max-w-[340px]">
            {/* titanium rim */}
            <div className="relative rounded-[3.1rem] p-[3px] shadow-[0_50px_120px_rgba(0,0,0,0.7)]" style={{ background: 'linear-gradient(150deg,#7a7a82 0%,#2c2c31 24%,#17171b 50%,#2c2c31 76%,#6a6a72 100%)' }}>
                {/* black bezel */}
                <div className="relative rounded-[2.95rem] p-[9px] bg-black">
                    {/* screen */}
                    <div className="relative rounded-[2.35rem] bg-[#15151A] overflow-hidden">
                        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-brand-accent/10 blur-[80px]" />

                        {/* Dynamic Island */}
                        <div aria-hidden className="absolute top-[10px] left-1/2 -translate-x-1/2 z-30 h-[26px] w-[92px] bg-black rounded-full flex items-center justify-end pr-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
                        </div>

                        {/* screen content */}
                        <div className="relative px-5 pt-12 pb-6">

            {/* header */}
            <div className="relative flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-2 text-white/70 text-xs font-mono uppercase tracking-wider">
                    <span className="relative flex h-2 w-2">
                        <span className={`absolute inline-flex h-full w-full rounded-full ${connected ? 'bg-emerald-400 animate-ping' : 'bg-brand-accent/60'} opacity-75`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${connected ? 'bg-emerald-400' : 'bg-brand-accent'}`} />
                    </span>
                    Live demo
                </span>
                <span className="text-white/35 text-[11px]">Real AI receptionist</span>
            </div>

            {/* media stage + carousel arrows */}
            <div className="relative flex items-center justify-center gap-2">
                {!connected && (
                    <button onClick={() => go(-1)} aria-label="Previous receptionist"
                        className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 text-white/60 hover:text-white hover:border-brand-accent/30 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}

                <div className={`relative mx-auto overflow-hidden transition-all duration-500 ${stageClass}`}>
                    {MEDIA_READY ? (
                        VERTICALS.map((v) => {
                            const active = v.id === vertical.id;
                            return reduce ? (
                                <img key={v.id} src={posterSrc(v.agentKey)} alt={`${v.persona}, ${v.label} receptionist`}
                                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                                    style={{ opacity: active ? 1 : 0 }} />
                            ) : (
                                <video key={v.id} src={videoSrc(v.agentKey)} poster={posterSrc(v.agentKey)}
                                    muted loop autoPlay playsInline preload="auto"
                                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                                    style={{ opacity: active ? 1 : 0 }} />
                            );
                        })
                    ) : (
                        <Orb initial={initial} connected={connected} isSpeaking={isSpeaking} />
                    )}
                    {/* scrim so text/pulse read on a call */}
                    {connected && isSpeaking && MEDIA_READY && (
                        <div aria-hidden className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping" style={{ animationDuration: '1.6s' }} />
                    )}
                </div>

                {!connected && (
                    <button onClick={() => go(1)} aria-label="Next receptionist"
                        className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 text-white/60 hover:text-white hover:border-brand-accent/30 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* identity (re-fades on switch) */}
            <div key={vertical.id} className="fade-in-up text-center mt-4">
                <h3 className="text-white font-semibold text-lg leading-tight">{vertical.persona}</h3>
                <p className="text-white/45 text-sm">{vertical.business}</p>
                <p className="text-brand-accent/70 text-xs mt-0.5 font-mono">{vertical.voice}</p>
            </div>

            {/* dots */}
            {!connected && (
                <div className="flex justify-center gap-1.5 mt-4">
                    {VERTICALS.map((v) => (
                        <button key={v.id} onClick={() => selectVertical(v)} aria-label={`${v.persona}, ${v.label}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${v.id === vertical.id ? 'w-5 bg-brand-accent' : 'w-1.5 bg-white/20 hover:bg-white/40'}`} />
                    ))}
                </div>
            )}

            {/* live area */}
            <div className="w-full mt-4">
                <Visualizer live={connected} getFreq={isSpeaking ? getOutputByteFrequencyData : getInputByteFrequencyData} />
                {connected ? (
                    <>
                        <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-white/50">
                            <Radio className="w-3.5 h-3.5 text-brand-accent" /> {stateChip}
                        </div>
                        <div ref={scrollRef} className="mt-4 max-h-32 overflow-y-auto text-left space-y-1.5 no-scrollbar">
                            {transcript.map((m, i) => (
                                <p key={i} className={`text-[13px] leading-snug ${m.source === 'ai' ? 'text-white/80' : 'text-white/45'}`}>
                                    <span className={`font-mono text-[10px] uppercase mr-1.5 ${m.source === 'ai' ? 'text-brand-accent/70' : 'text-white/30'}`}>{m.source === 'ai' ? vertical.persona : 'You'}</span>
                                    {m.text}
                                </p>
                            ))}
                        </div>
                        <div className="flex items-center justify-center gap-3 mt-5">
                            <button onClick={() => setMuted(!isMuted)} aria-label={isMuted ? 'Unmute' : 'Mute'}
                                className={`flex items-center justify-center w-11 h-11 rounded-full border transition-colors ${isMuted ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.04] border-white/10 text-white/70 hover:text-white'}`}>
                                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>
                            <button onClick={() => endSession()}
                                className="flex items-center gap-2 bg-red-500/90 hover:bg-red-500 text-white font-semibold text-sm px-5 h-11 rounded-full transition-colors">
                                <PhoneOff className="w-4 h-4" /> End call
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <button onClick={startCall} disabled={connecting}
                            className="group relative w-full mt-3 flex items-center justify-center gap-2.5 bg-brand-accent text-brand-primary font-semibold text-base px-6 py-4 rounded-2xl transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 shadow-[0_0_40px_rgba(201,168,76,0.25)]">
                            {connecting ? <><Loader2 className="w-5 h-5 animate-spin" /> Connecting…</> : <><Mic className="w-5 h-5" /> Click to speak with {vertical.persona}</>}
                        </button>
                        <p className="text-white/30 text-[11px] mt-3 text-center">Uses your microphone · one demo conversation · no signup</p>
                        {error && <p className="text-red-400/80 text-xs mt-3 text-center">{error}</p>}
                    </>
                )}
            </div>
                        </div>

                        {/* home indicator */}
                        <div aria-hidden className="absolute bottom-[7px] left-1/2 -translate-x-1/2 w-[108px] h-1 rounded-full bg-white/25" />
                    </div>
                </div>

                {/* side buttons */}
                <div aria-hidden className="absolute left-[-2px] top-[92px] h-8 w-[3px] rounded-l-sm" style={{ background: 'linear-gradient(180deg,#7a7a82,#2c2c31)' }} />
                <div aria-hidden className="absolute left-[-2px] top-[132px] h-16 w-[3px] rounded-l-sm" style={{ background: 'linear-gradient(180deg,#7a7a82,#2c2c31)' }} />
                <div aria-hidden className="absolute right-[-2px] top-[116px] h-20 w-[3px] rounded-r-sm" style={{ background: 'linear-gradient(180deg,#7a7a82,#2c2c31)' }} />
            </div>
        </div>
    );
}

export default function VoiceHeroCard({ vertical, onSelectVertical }) {
    return (
        <ConversationProvider>
            <VoiceHeroInner vertical={vertical} onSelectVertical={onSelectVertical} />
        </ConversationProvider>
    );
}
