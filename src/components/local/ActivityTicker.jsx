import { Phone } from 'lucide-react';

// A slow, seamless marquee of receptionist "outcomes" — makes the section feel busy and alive
// while quietly showing what the AI actually does. Luxe: unhurried, edge-faded, low-key.

const ACTIVITY = [
    { who: 'Bianca', act: 'booked a Botox consult for Thursday 2:30' },
    { who: 'Cody', act: 'dispatched a tech for a no-AC call' },
    { who: 'Megan', act: 'scheduled a new-patient cleaning' },
    { who: 'Miss Sue', act: 'took a table for 4 at 7:30' },
    { who: 'Marcus', act: 'set an injury consult for 3pm' },
    { who: 'Riley', act: 'booked a balayage for Saturday' },
    { who: 'Bianca', act: 'answered an after-hours filler question' },
    { who: 'Cody', act: 'texted a confirmation for a plumbing estimate' },
    { who: 'Megan', act: 'rescheduled a cleaning in under a minute' },
    { who: 'Miss Sue', act: 'took a to-go order at 9:58pm' },
];

function Item({ who, act }) {
    return (
        <span className="inline-flex items-center gap-2 whitespace-nowrap px-6 text-sm">
            <Phone className="w-3.5 h-3.5 text-brand-accent shrink-0" />
            <span className="text-white/80 font-medium">{who}</span>
            <span className="text-white/45">{act}</span>
            <span className="text-brand-accent/50 font-mono text-xs">· answered in 0.8s</span>
            <span className="text-white/15 ml-4">|</span>
        </span>
    );
}

export default function ActivityTicker() {
    return (
        <div className="relative w-full overflow-hidden border-y border-white/5 bg-white/[0.015] py-3 marquee-mask">
            <div className="flex w-max marquee-track">
                {[0, 1].map((dup) => (
                    <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
                        {ACTIVITY.map((a, i) => <Item key={`${dup}-${i}`} {...a} />)}
                    </div>
                ))}
            </div>
        </div>
    );
}
