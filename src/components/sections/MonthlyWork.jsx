import { useEffect, useRef, useState } from 'react';
import { Check, Search, MapPin, Star, Camera, Clock, FileText, Send } from 'lucide-react';

// "What I actually do every month" as a list with a panel beside it. As the
// visitor scrolls, the item crossing the middle of the screen lights up and
// the panel swaps to a small picture of that piece of the work. Clicking an
// item does the same. Every item's text stays open, so nothing above the
// reader ever changes height mid-scroll. The pictures are desktop only. From "Features With Panel" (scrollxui) on 21st.dev, rebuilt here
// in CSS (.fp-* in index.css). Every picture is a drawing of the work, never
// a real result: no names, no numbers.

function Line({ w, gold = false }) {
    return <span className={`block h-1.5 rounded-full ${gold ? 'bg-brand-accent/50' : 'bg-white/10'}`} style={{ width: w }} />;
}

// One picture per item, in the same order as the list.
const PICTURES = [
    // The pages get written as answers
    () => (
        <div className="fp-card">
            <span className="fp-label">A page on your site</span>
            <p className="mt-3 text-white text-lg font-semibold leading-snug">Do you come to my driveway?</p>
            <div className="mt-3 flex flex-col gap-2"><Line w="92%" /><Line w="84%" /><Line w="60%" /></div>
            <p className="mt-5 text-white/80 text-sm font-medium">What areas do you cover?</p>
            <div className="mt-2 flex flex-col gap-2"><Line w="88%" /><Line w="52%" /></div>
            <div className="fp-chip mt-5"><Search size={12} /> Answers the question as asked</div>
        </div>
    ),
    // The site gets made readable to AI
    () => (
        <div className="fp-card">
            <span className="fp-label">What Google and AI read</span>
            <div className="mt-4 flex flex-col gap-2.5">
                {['What you do', 'Where you work', 'When you are open', 'How to reach you'].map((k, i) => (
                    <div key={k} className="fp-row" style={{ '--i': i }}>
                        <span className="text-white/45 text-xs w-32 shrink-0">{k}</span>
                        <Line w="100%" gold />
                        <Check size={14} className="text-brand-accent shrink-0" />
                    </div>
                ))}
            </div>
            <span aria-hidden="true" className="fp-scan" />
        </div>
    ),
    // Your listings stop contradicting each other
    () => (
        <div className="fp-card">
            <span className="fp-label">Everywhere you are listed</span>
            <div className="mt-4 flex flex-col gap-2.5">
                {['Your website', 'Your Google profile', 'Map apps', 'Directories'].map((k, i) => (
                    <div key={k} className="fp-row" style={{ '--i': i }}>
                        <MapPin size={13} className="text-white/35 shrink-0" />
                        <span className="text-white/70 text-xs w-32 shrink-0">{k}</span>
                        <span className="text-white/40 text-[11px] flex-grow">Same name, phone, hours</span>
                        <Check size={14} className="text-brand-accent shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    ),
    // Your profile stays alive
    () => (
        <div className="fp-card">
            <span className="fp-label">Your business profile</span>
            <div className="mt-4 flex items-center gap-3">
                <span className="grid place-items-center w-10 h-10 rounded-full bg-brand-accent/15 text-brand-accent drama-text text-lg">Y</span>
                <div className="flex-grow flex flex-col gap-1.5"><span className="text-white text-sm font-medium">Your business</span><Line w="50%" /></div>
                <span className="fp-live">Open</span>
            </div>
            <div className="mt-5 flex flex-col gap-2.5">
                {[[Camera, 'New photos added'], [FileText, 'Fresh post this week'], [Clock, 'Hours checked and current']].map((pair, i) => {
                    const Icon = pair[0];
                    return (
                        <div key={pair[1]} className="fp-row" style={{ '--i': i }}>
                            <Icon size={13} className="text-brand-accent shrink-0" />
                            <span className="text-white/70 text-xs">{pair[1]}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    ),
    // The reviews keep coming in
    () => (
        <div className="fp-card">
            <span className="fp-label">After every finished job</span>
            <div className="mt-4 fp-bubble">
                <Send size={12} className="text-brand-accent shrink-0 mt-0.5" />
                <span className="text-white/75 text-xs leading-relaxed">Thanks for having me out today. Would you leave a quick review? It helps a small business like mine a lot.</span>
            </div>
            <div className="mt-5 flex flex-col gap-3">
                {[0, 1].map((r) => (
                    <div key={r} className="fp-row" style={{ '--i': r + 1 }}>
                        <span className="flex gap-0.5 text-brand-accent">{[0, 1, 2, 3, 4].map((s) => <Star key={s} size={12} fill="currentColor" />)}</span>
                        <Line w={r ? '46%' : '62%'} />
                    </div>
                ))}
            </div>
            <div className="fp-chip mt-5"><Check size={12} /> Same ask, every customer</div>
        </div>
    ),
    // You get told what moved
    () => (
        <div className="fp-card">
            <span className="fp-label">Your monthly report</span>
            <div className="mt-4 flex flex-col gap-3.5">
                {['What got built', 'What changed', 'Where you show up now', 'What is next'].map((k, i) => (
                    <div key={k} className="fp-row flex-col items-start gap-2" style={{ '--i': i }}>
                        <span className="text-white/80 text-xs font-medium">{k}</span>
                        <Line w={['78%', '64%', '86%', '54%'][i]} />
                    </div>
                ))}
            </div>
            <p className="mt-5 text-white/35 text-[11px]">In plain English. No dashboards to decode.</p>
        </div>
    ),
];

export default function MonthlyWork({ items }) {
    const [active, setActive] = useState(0);
    const listRef = useRef(null);

    // The item crossing the middle band of the screen is the active one.
    useEffect(() => {
        const els = Array.from(listRef.current.children);
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) setActive(els.indexOf(e.target));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    const Picture = PICTURES[active];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-10 lg:gap-14 items-start">
            <ol ref={listRef} className="flex flex-col gap-2">
                {items.map(({ title, body }, i) => {
                    const on = active === i;
                    return (
                        <li key={title} data-reveal className={`fp-item ${on ? 'is-on' : ''}`}>
                            <button type="button" onClick={() => setActive(i)} aria-pressed={on} className="w-full flex items-center gap-4 text-left">
                                <span className="fp-num">{i + 1}</span>
                                <span className="fp-title text-base sm:text-lg font-semibold">{title}</span>
                            </button>
                            <p className="fp-body pl-11 pt-2 text-sm sm:text-base leading-relaxed">{body}</p>
                        </li>
                    );
                })}
            </ol>

            <div className="hidden lg:block sticky top-28" aria-hidden="true">
                <div key={active} className="fp-panel"><Picture /></div>
                <p className="text-white/25 text-xs mt-4 leading-relaxed">
                    Drawings of the work, not live results. Nobody controls what Google or AI says, which is exactly why the work is the part worth paying for.
                </p>
            </div>
        </div>
    );
}
