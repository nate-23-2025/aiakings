// What booking actually gets you. An owner who does not know what the call is
// assumes it is a sales pitch, so this spells it out right above the button.
// The bar beside each step fills one after another, so it reads as a sequence.
const STEPS = [
    { n: '1', title: 'Pick a time', body: 'Whatever works for you. Booking takes about a minute.' },
    { n: '2', title: 'I look you up first', body: 'Before we talk, I search for your business the way your customers do.' },
    { n: '3', title: 'You see what they see', body: 'Fifteen minutes. If I cannot help, I will tell you straight.' },
];

export default function CallSteps({ className = '', steps = STEPS }) {
    return (
        <ol data-reveal-group data-inview className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full text-left ${className}`}>
            {steps.map((s, i) => (
                <li key={s.n} data-spotlight className="relative bg-[#15151A] border border-white/[0.07] rounded-2xl p-5 overflow-hidden">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent shrink-0">Step {s.n}</span>
                        <span aria-hidden="true" className="relative flex-grow h-[2px] rounded-full bg-white/[0.07] overflow-hidden">
                            <span className="step-bar" style={{ '--d': `${0.5 + i * 0.55}s` }} />
                        </span>
                    </div>
                    <p className="text-white font-semibold mt-2 mb-1">{s.title}</p>
                    <p className="text-white/50 text-sm leading-relaxed">{s.body}</p>
                </li>
            ))}
        </ol>
    );
}
