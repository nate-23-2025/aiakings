import { useState } from 'react';
import { Plus } from 'lucide-react';

const FAQS = [
    {
        q: 'Will it sound robotic?',
        a: "No. It uses the most natural AI voices available and is trained on how your business talks. Most callers can't tell. Try the demo above and judge for yourself.",
    },
    {
        q: "What if it can't answer something?",
        a: 'It handles the common questions — hours, services, pricing, availability, booking. Anything it can\'t answer, it takes a message and hands off to you (or transfers the call), so nothing slips through.',
    },
    {
        q: 'How much work is setup on my end?',
        a: "Almost none. I build and train it on your services, connect it to your calendar, and hand you a line that's ready to answer. You review it and go live.",
    },
    {
        q: 'Does it book into my calendar?',
        a: 'Yes. It checks your real availability and books directly into your booking system or calendar, then texts the client a confirmation. No double bookings.',
    },
    {
        q: 'Can it make outbound calls too?',
        a: 'Yes — it can call back missed leads, confirm appointments, and follow up automatically, not just answer inbound calls.',
    },
    {
        q: 'What does it cost?',
        a: 'It depends on your call volume and what you want it to handle. Book a quick call and I\'ll scope it to your business and give you a straight number.',
    },
];

function FaqItem({ item, open, onToggle }) {
    return (
        <div className="border-b border-white/8">
            <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 py-5 text-left group">
                <span className={`text-base sm:text-lg font-medium transition-colors ${open ? 'text-white' : 'text-white/75 group-hover:text-white'}`}>{item.q}</span>
                <Plus className={`w-5 h-5 shrink-0 text-brand-accent transition-transform duration-300 ${open ? 'rotate-45' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <p className="text-white/50 text-sm sm:text-base leading-relaxed pb-5 pr-8">{item.a}</p>
                </div>
            </div>
        </div>
    );
}

export default function FaqAccordion() {
    const [open, setOpen] = useState(0);
    return (
        <div className="flex flex-col">
            {FAQS.map((item, i) => (
                <FaqItem key={i} item={item} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
        </div>
    );
}
