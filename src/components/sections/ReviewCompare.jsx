import { X, Check } from 'lucide-react';

// The usual review request looks like phishing, so people ignore it. Ours reads
// like the owner texting a customer, and the link is Google's own address.
// Mirrors how the review setup is actually built: owner first name, customer
// name, direct write-a-review link, no rating screen first, same ask to everyone.
const THEIRS = [
    'Comes from a number nobody recognizes',
    'Shortened link that looks like a scam',
    'Asks for a 1 to 5 rating before it ever gets to Google',
    'Reads like a robot wrote it',
];

const MINE = [
    'Comes from your business, signed with your first name',
    'Uses their name, like a text from you would',
    'Links straight to Google, and the address says Google',
    'Same ask to every customer. No filtering, no prizes',
];

function Bubble({ from, children, tone }) {
    const good = tone === 'good';
    return (
        <div className="bg-[#0D0D12] border border-white/[0.07] rounded-[1.5rem] p-4 sm:p-5">
            <p className={`font-mono text-[10px] uppercase tracking-widest mb-3 ${good ? 'text-brand-accent' : 'text-white/30'}`}>{from}</p>
            <div className={`rounded-2xl rounded-bl-md px-4 py-3 text-[13px] leading-relaxed ${good ? 'bg-[#1F1F28] text-white/85' : 'bg-[#1A1A22] text-white/55'}`}>
                {children}
            </div>
        </div>
    );
}

export default function ReviewCompare() {
    return (
        <div className="mt-20 sm:mt-24">
            <h3 className="reveal text-2xl sm:text-3xl md:text-4xl font-sans font-light text-white leading-tight mb-4 max-w-3xl">
                Most review requests look like spam. <span className="drama-text text-brand-accent">So nobody taps them.</span>
            </h3>
            <p className="reveal text-white/50 text-base sm:text-lg font-light leading-relaxed mb-10 max-w-2xl">
                You have probably gotten one. A random number, a weird short link, and your thumb goes straight to delete. Your customers do the same thing. Here is the difference.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="reveal bg-[#15151A] border border-white/[0.07] rounded-[2rem] p-6 sm:p-8">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">What they usually send</span>
                    <div className="mt-5 mb-7">
                        <Bubble from="(833) 555-0147">
                            Thank you for choosing us! Please rate your experience 1-5: <span className="underline text-sky-300/60">bit.ly/3Kx9Qz</span> Reply STOP to opt out
                        </Bubble>
                    </div>
                    <ul className="flex flex-col gap-3">
                        {THEIRS.map((t) => (
                            <li key={t} className="flex items-start gap-3 text-white/50 text-sm sm:text-base">
                                <X className="w-4 h-4 text-red-400/70 shrink-0 mt-1" strokeWidth={2.5} />
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="reveal bg-[#15151A] border border-brand-accent/25 rounded-[2rem] p-6 sm:p-8 shadow-[0_0_40px_rgba(201,168,76,0.08)]">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent">What your customers get</span>
                    <div className="mt-5 mb-7">
                        <Bubble from="Your business" tone="good">
                            Hey Maria, it&apos;s Marcus. Thanks again for having me out today. If you have a minute, a quick review would mean a lot to a small shop like mine:{' '}
                            <span className="underline text-sky-300/80 break-all">search.google.com/local/writereview</span>
                        </Bubble>
                    </div>
                    <ul className="flex flex-col gap-3">
                        {MINE.map((t) => (
                            <li key={t} className="flex items-start gap-3 text-white/75 text-sm sm:text-base">
                                <Check className="w-4 h-4 text-brand-accent shrink-0 mt-1" strokeWidth={2.5} />
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <p className="reveal text-white/30 text-xs mt-6">Example texts. Names are made up.</p>
        </div>
    );
}
