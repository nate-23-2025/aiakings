import { X, ArrowRight } from 'lucide-react';
import { useCalModal } from '../../context/CalModalContext';

// The usual review request looks like phishing, so people ignore it. The left
// card shows that. The right card deliberately does not spell out how the
// method works or show a sample message; it only says it is different, and
// the details get walked through on the call. On scroll the spam text arrives
// the way a real one does, three dots first. Motion comes from the page's
// useReveal.
const THEIRS = [
    'Comes from a number nobody recognizes',
    'Shortened link that looks like a scam',
    'Asks for a 1 to 5 rating before it ever gets to Google',
    'Reads like a robot wrote it',
];

function Bubble({ from, children, delay = 0 }) {
    return (
        <div className="bg-[#0D0D12] border border-white/[0.07] rounded-[1.5rem] p-4 sm:p-5" style={{ '--d': `${delay}s` }}>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3 text-white/30">{from}</p>
            <div className="relative">
                <span aria-hidden="true" className="chat-typing absolute left-0 top-0 items-center gap-1 rounded-2xl rounded-bl-md px-4 py-3.5 bg-[#1A1A22]">
                    <span /><span /><span />
                </span>
                <div className="chat-bubble rounded-2xl rounded-bl-md px-4 py-3 text-[13px] leading-relaxed bg-[#1A1A22] text-white/55">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function ReviewCompare() {
    const { openCalModal } = useCalModal();

    return (
        <div className="mt-20 sm:mt-24">
            <h3 data-reveal="lines" className="text-2xl sm:text-3xl md:text-4xl font-sans font-light text-white leading-tight mb-4 max-w-3xl">
                Most review requests look like spam. <span className="drama-text text-brand-accent">So nobody taps them.</span>
            </h3>
            <p data-reveal className="text-white/50 text-base sm:text-lg font-light leading-relaxed mb-10 max-w-2xl">
                You have probably gotten one. A random number, a weird short link, and your thumb goes straight to delete. Your customers do the same thing. So I do it differently.
            </p>

            <div data-reveal-group className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div data-inview data-spotlight className="relative bg-[#15151A] border border-white/[0.07] rounded-[2rem] p-6 sm:p-8">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">What they usually send</span>
                    <div className="mt-5 mb-7">
                        <Bubble from="(833) 555-0147" delay={0.3}>
                            Thank you for choosing us! Please rate your experience 1-5: <span className="underline text-sky-300/60">bit.ly/3Kx9Qz</span> Reply STOP to opt out
                        </Bubble>
                    </div>
                    <ul className="flex flex-col gap-3">
                        {THEIRS.map((t, i) => (
                            <li key={t} className="flex items-start gap-3 text-white/50 text-sm sm:text-base">
                                <X className="draw w-4 h-4 text-red-400/70 shrink-0 mt-1" strokeWidth={2.5} style={{ '--d': `${1.7 + i * 0.12}s` }} />
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>

                <div data-spotlight className="relative flex flex-col bg-[#15151A] border border-brand-accent/25 rounded-[2rem] p-6 sm:p-8 shadow-[0_0_40px_rgba(201,168,76,0.08)]">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent">What I do instead</span>
                    <h4 className="mt-5 text-2xl sm:text-3xl font-sans font-light text-white leading-tight">
                        Not the spammy link. <span className="drama-text text-brand-accent">A different method.</span>
                    </h4>
                    <p className="mt-5 text-white/60 text-sm sm:text-base leading-relaxed">
                        The usual way is a blast of links that people have learned to ignore, and it does not work. I do not send those. I have my own method for asking your customers for reviews.
                    </p>
                    <p className="mt-4 text-white/60 text-sm sm:text-base leading-relaxed">
                        I will walk you through how it works on the call.
                    </p>
                    <button
                        onClick={openCalModal}
                        className="group mt-auto pt-8 self-start inline-flex items-center gap-2 text-brand-accent text-sm font-medium hover:opacity-80 transition-opacity"
                    >
                        Book a call to see it
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </div>
            </div>

            <p data-reveal className="text-white/30 text-xs mt-6">Example text. Not a real number.</p>
        </div>
    );
}
