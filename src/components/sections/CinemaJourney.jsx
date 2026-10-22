import { useEffect, useId, useState } from 'react';
import { ArrowRight, Check, Phone, Search, Star } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { useInView } from '../../hooks/useInView';
import { prefersReducedMotion } from '../../lib/motion';

// 21st Transition Panel, Notification Stack, Encrypted Text, and Spotlight.
// All content is illustrative. No fabricated reviews, ranks, or client results.
const STAGES = [
    { name: 'Found', title: 'Be there when they look.', body: 'Your website, your business profile, and the answers people need. A clear picture of what you do and where you do it.', line: 'The search starts with a need.' },
    { name: 'Chosen', title: 'Give them a reason to choose you.', body: 'Clear services. Real work. Recent reviews. Everything a customer needs to feel good about making the call.', line: 'Trust gets built before the phone rings.' },
    { name: 'Called', title: 'Be ready when the phone rings.', body: 'An answered call keeps the conversation moving. The customer gets help while they are ready to book.', line: 'Someone is ready to talk.' },
    { name: 'Booked', title: 'Turn the conversation into a job.', body: 'The appointment lands on the calendar. The customer gets the details. You get back to the work.', line: 'The next step is already clear.' },
];

function DecodeLabel({ text }) {
    const [display, setDisplay] = useState(text);
    useEffect(() => {
        if (prefersReducedMotion()) return;
        let count = 0;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const timer = setInterval(() => {
            count += 2;
            setDisplay(text.split('').map((c, i) => c === ' ' || i < count ? c : chars[(i + count) % chars.length]).join(''));
            if (count >= text.length) clearInterval(timer);
        }, 25);
        return () => clearInterval(timer);
    }, [text]);
    return <span aria-label={text}><span aria-hidden="true">{display}</span></span>;
}

function JourneyVisual({ step }) {
    if (step === 0) return <div className="journey-search">
        <div className="journey-query"><BrandLogo name="google" size={24} /><span>A local service, near me</span><Search size={14} /></div>
        <div className="journey-result"><span className="journey-monogram">Y</span><span><small>A business in your area</small><strong>Your business</strong><p>What you do. Where you work. How to reach you.</p></span><ArrowRight size={16} /></div>
        <div className="journey-ghost" /><div className="journey-ghost short" />
    </div>;
    if (step === 1) return <div className="journey-trust"><div className="journey-stars" aria-hidden="true">{[0,1,2,3,4].map(i => <Star key={i} size={27} fill="currentColor" strokeWidth={0} />)}</div><span className="cinema-eyebrow">A reputation you earn</span><h4>Let your work<br /><em>speak for you.</em></h4><div className="journey-trust-pills">{['Real reviews', 'Clear services', 'Work they can see'].map(x => <span key={x}><Check size={11} />{x}</span>)}</div></div>;
    if (step === 2) return <div className="journey-call"><div className="journey-phone"><Phone size={27} strokeWidth={1.3} /></div><span className="cinema-eyebrow">An incoming opportunity</span><h4>A customer is calling.</h4><div className="journey-wave" aria-hidden="true">{Array.from({length:32}, (_,i) => <i key={i} style={{ '--height': (8 + Math.round(Math.abs(Math.sin(i * 1.7)) * 27)) + 'px', '--i': i }} />)}</div><p>Picked up. Questions answered.</p></div>;
    return <div className="journey-notifications">{[['calendar', 'On the calendar', 'The appointment has a home.'], ['gmail', 'Details confirmed', 'The customer knows what happens next.'], ['clickup', 'Everything recorded', 'You can pick up where the call left off.']].map(([brand,title,body],i) => <div key={brand} className="journey-notification" style={{ '--i': i }}><BrandLogo name={brand} size={27} /><span><strong>{title}</strong><small>{body}</small></span><Check size={13}/></div>)}</div>;
}

export default function CinemaJourney({ home = false }) {
    const [step, setStep] = useState(0);
    const [ref, inView] = useInView('0px');
    const id = useId();
    const current = STAGES[step];
    return <section ref={ref} className="journey-section" data-inview>
        <div className="journey-heading"><span className="cinema-eyebrow">{home ? 'The whole picture' : 'How the pieces work together'}</span><h2>From the first search<br />{' '}<span className="drama-text">to the next booked job.</span></h2><p>Explore the steps. See where your business needs the work.</p></div>
        <div className="journey-layout cinema-surface" data-playing={inView}>
            <div className="journey-copy">
                <div className="journey-tabs" role="tablist" aria-label="Explore the customer journey">{STAGES.map((s,i) => <button key={s.name} id={id + '-tab-' + i} role="tab" type="button" aria-selected={step === i} aria-controls={id + '-panel'} tabIndex={step === i ? 0 : -1} onClick={() => setStep(i)} onKeyDown={e => { let n = i; if(e.key === 'ArrowRight') n = (i+1)%4; else if(e.key === 'ArrowLeft') n = (i+3)%4; else if(e.key === 'Home') n = 0; else if(e.key === 'End') n = 3; else return; e.preventDefault(); setStep(n); document.getElementById(id + '-tab-' + n)?.focus(); }}><span>{String(i+1).padStart(2,'0')}</span>{s.name}</button>)}</div>
                <div id={id + '-panel'} role="tabpanel" aria-labelledby={id + '-tab-' + step} tabIndex={0} className="journey-description"><div key={step} className="cinema-panel-enter"><span className="cinema-eyebrow"><DecodeLabel text={'Chapter 0' + (step+1)} /></span><h3>{current.title}</h3><p>{current.body}</p></div></div>
                <button type="button" className="journey-next" onClick={() => setStep((step+1)%4)}>{step === 3 ? 'Back to the first search' : 'See what happens next'}<ArrowRight size={15}/></button>
            </div>
            <div className="journey-screen"><div className="journey-crosshair crosshair-tl"/><div className="journey-crosshair crosshair-br"/><span className="journey-screen-label">{current.line}</span><div key={step} className="journey-visual cinema-panel-enter"><JourneyVisual step={step}/></div><span className="cinema-demo-note">Illustration of the process, not a search result or customer review.</span></div>
        </div>
    </section>;
}
