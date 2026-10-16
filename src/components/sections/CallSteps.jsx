// What booking actually gets you. An owner who does not know what the call is
// assumes it is a sales pitch, so this spells it out right above the button.
const STEPS = [
    { n: '1', title: 'Pick a time', body: 'Whatever works for you. Booking takes about a minute.' },
    { n: '2', title: 'I look you up first', body: 'Before we talk, I search for your business the way your customers do.' },
    { n: '3', title: 'You see what they see', body: 'Fifteen minutes. If I cannot help, I will tell you straight.' },
];

export default function CallSteps({ className = '' }) {
    return (
        <ol className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full text-left ${className}`}>
            {STEPS.map((s) => (
                <li key={s.n} className="bg-[#15151A] border border-white/[0.07] rounded-2xl p-5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent">Step {s.n}</span>
                    <p className="text-white font-semibold mt-2 mb-1">{s.title}</p>
                    <p className="text-white/50 text-sm leading-relaxed">{s.body}</p>
                </li>
            ))}
        </ol>
    );
}
