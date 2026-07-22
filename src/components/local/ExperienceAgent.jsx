import { useState } from 'react';
import { Phone, PhoneOutgoing, Loader2, Check, ArrowRight } from 'lucide-react';

const DEMO_PHONE = import.meta.env.VITE_DEMO_PHONE || '';

const prettyPhone = (e164) => {
    const d = (e164 || '').replace(/\D/g, '');
    const n = d.length === 11 && d[0] === '1' ? d.slice(1) : d;
    return n.length === 10 ? `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}` : e164;
};

const toE164 = (raw) => {
    const d = raw.replace(/\D/g, '');
    if (raw.trim().startsWith('+')) return '+' + d;
    if (d.length === 10) return '+1' + d;
    if (d.length === 11 && d[0] === '1') return '+' + d;
    return null;
};

export default function ExperienceAgent({ onBook }) {
    const [num, setNum] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [msg, setMsg] = useState('');

    const requestCall = async () => {
        const e164 = toE164(num);
        if (!e164) { setStatus('error'); setMsg('Enter a valid US phone number.'); return; }
        setStatus('loading'); setMsg('');
        try {
            const res = await fetch('/api/outbound-call', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: e164 }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setStatus('success');
                setMsg('Calling you now — pick up to talk to the AI receptionist.');
            } else {
                setStatus('error');
                setMsg(data.error || 'Could not place the call. Please book a call instead.');
            }
        } catch {
            setStatus('error');
            setMsg('Network error. Please try again.');
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Get a call from the AI (outbound) */}
            <div className="bg-[#15151A] border border-brand-accent/20 rounded-2xl p-6 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-2 mb-1.5">
                    <PhoneOutgoing className="w-4 h-4 text-brand-accent" />
                    <span className="text-white font-semibold text-sm">Get a call from the AI</span>
                </div>
                <p className="text-white/45 text-xs mb-4 leading-relaxed">Enter your number and the AI will call you in seconds. Hear it for yourself.</p>

                {status === 'success' ? (
                    <div className="flex-1 flex items-center gap-2 text-emerald-400 text-sm bg-emerald-400/5 border border-emerald-400/20 rounded-xl px-4 py-3">
                        <Check className="w-4 h-4 shrink-0" /> {msg}
                    </div>
                ) : (
                    <div className="mt-auto flex flex-col gap-2">
                        <div className="flex gap-2">
                            <input
                                type="tel"
                                inputMode="tel"
                                placeholder="(713) 555-1234"
                                value={num}
                                onChange={(e) => { setNum(e.target.value); if (status === 'error') setStatus('idle'); }}
                                onKeyDown={(e) => e.key === 'Enter' && requestCall()}
                                className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-accent/50 transition-colors"
                            />
                            <button
                                onClick={requestCall}
                                disabled={status === 'loading'}
                                className="shrink-0 bg-brand-accent text-brand-primary font-semibold text-sm px-4 py-3 rounded-xl hover:scale-[1.03] active:scale-[0.97] transition-transform duration-300 disabled:opacity-60 flex items-center gap-1.5"
                            >
                                {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Call me <ArrowRight className="w-3.5 h-3.5" /></>}
                            </button>
                        </div>
                        {status === 'error' && <p className="text-red-400/80 text-xs">{msg}</p>}
                        <p className="text-white/25 text-[10px]">No spam. One demo call. US numbers.</p>
                    </div>
                )}
            </div>

            {/* Call the AI (inbound) */}
            <div className="bg-[#15151A] border border-white/10 rounded-2xl p-6 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-2 mb-1.5">
                    <Phone className="w-4 h-4 text-brand-accent" />
                    <span className="text-white font-semibold text-sm">Call the AI yourself</span>
                </div>
                <p className="text-white/45 text-xs mb-4 leading-relaxed">Prefer to make the call? Dial the line and book an appointment with the AI.</p>

                <div className="mt-auto">
                    {DEMO_PHONE ? (
                        <a href={`tel:${DEMO_PHONE}`}
                            className="flex items-center justify-center gap-2 w-full bg-black/30 border border-white/10 text-white font-semibold text-base px-4 py-3 rounded-xl hover:border-brand-accent/40 transition-colors">
                            <Phone className="w-4 h-4 text-brand-accent" /> {prettyPhone(DEMO_PHONE)}
                        </a>
                    ) : (
                        <button onClick={onBook}
                            className="flex items-center justify-center gap-2 w-full bg-black/30 border border-white/10 text-white/70 font-medium text-sm px-4 py-3 rounded-xl hover:border-white/25 transition-colors">
                            Demo line coming soon — book a call
                        </button>
                    )}
                    <p className="text-white/25 text-[10px] mt-2 text-center">Available 24/7. Ask it anything a client would.</p>
                </div>
            </div>
        </div>
    );
}
