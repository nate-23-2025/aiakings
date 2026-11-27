import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import gsap from 'gsap';
import { useCalModal } from '../context/CalModalContext';
import { lockScroll, unlockScroll } from '../lib/scrollLock';
import { prefersReducedMotion } from '../lib/motion';

const BOOKING_URL = 'https://api.aiautomationkings.com/widget/booking/qwkWGz8DTsKfVRuLkn88';
const EMBED_SCRIPT = 'https://api.aiautomationkings.com/js/form_embed.js';
const IFRAME_ID = 'qwkWGz8DTsKfVRuLkn88_1788315968767';
const AI_BOOKING_URL = 'https://cal.com/nate-mamo/ai-agent-call';
const AgentCallBooking = lazy(() => import('./AgentCallBooking'));

export default function CalModal() {
    const { isOpen, calendar, closeCalModal, selectCalendar } = useCalModal();
    const dialogRef = useRef(null);
    const cardRef = useRef(null);
    const [opened, setOpened] = useState({});
    if (isOpen && calendar !== 'choice' && !opened[calendar]) setOpened({ ...opened, [calendar]: true });
    const showMarketing = !!opened.marketing;
    const showDeveloper = !!opened.developer;
    const choice = calendar === 'choice';

    useEffect(() => {
        if (!showMarketing || document.querySelector(`script[src="${EMBED_SCRIPT}"]`)) return;
        const script = document.createElement('script');
        script.src = EMBED_SCRIPT;
        script.async = true;
        document.body.appendChild(script);
    }, [showMarketing]);

    // The native dialog contains keyboard focus, handles Escape, and makes
    // the page behind it inert. Restore the trigger when the dialog closes.
    useEffect(() => {
        if (!isOpen) return;
        const dialog = dialogRef.current;
        const trigger = document.activeElement;
        dialog.showModal();
        lockScroll('cal-modal');
        const animation = prefersReducedMotion() ? null : gsap.fromTo(cardRef.current, { opacity: 0, y: 16, scale: .985 }, { opacity: 1, y: 0, scale: 1, duration: .3, ease: 'power2.out' });
        return () => {
            animation?.kill();
            dialog.close();
            unlockScroll('cal-modal');
            if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
        };
    }, [isOpen]);

    const changeService = which => {
        selectCalendar(which);
        cardRef.current.scrollTop = 0;
        cardRef.current.focus({ preventScroll: true });
    };

    return <dialog ref={dialogRef} className="booking-dialog" aria-labelledby="booking-title" onCancel={e => { e.preventDefault(); closeCalModal(); }} onClick={e => { if (e.target === e.currentTarget) closeCalModal(); }}>
        <div ref={cardRef} className={`booking-card ${choice ? 'is-choice' : ''}`} tabIndex={-1}>
            <button type="button" onClick={closeCalModal} className="booking-close" aria-label="Close booking"><X size={20} /></button>
            <span className="ux-eyebrow">{choice ? 'A SHORT CALL WITH NATE' : calendar === 'marketing' ? 'A 10-MINUTE CALL WITH NATE' : 'A 15-MINUTE CALL WITH NATE'}</span>
            <h2 id="booking-title" className="booking-heading">{choice ? 'What would you like help with?' : calendar === 'marketing' ? 'Websites & Search' : 'Custom AI & One Brain'}</h2>
            {choice ? <>
                <p className="booking-lede">Choose the work you have in mind so I can point you to the right call.</p>
                <div className="booking-choices">
                    <button type="button" className="booking-choice" onClick={() => changeService('marketing')}><span><b>Websites & Search</b><small>A new website, getting found, reviews, or call handling.</small></span><ArrowRight size={20} /></button>
                    <button type="button" className="booking-choice" onClick={() => changeService('developer')}><span><b>Custom AI & One Brain</b><small>A specific AI task, connected tools, or a system for your team.</small></span><ArrowRight size={20} /></button>
                </div>
                <p className="booking-fallback">Unsure where to start? <a href="mailto:nate@aiautomationkings.com">Email me what you need.</a></p>
            </> : <button type="button" className="booking-back" onClick={() => changeService('choice')}><ArrowLeft size={14} />Choose a different service</button>}
            {showMarketing && <div hidden={calendar !== 'marketing'} className="rounded-2xl bg-white overflow-hidden mt-3">
                <iframe id={IFRAME_ID} src={BOOKING_URL} title="Book a Websites & Search call with Nate" scrolling="no" style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight: '640px' }} />
            </div>}
            {showDeveloper && <div hidden={calendar !== 'developer'} className="mt-3"><Suspense fallback={<p role="status" className="booking-lede py-10">Loading available times...</p>}><AgentCallBooking /></Suspense></div>}
            {!choice && <p className="booking-fallback">Calendar taking a moment? <a href={calendar === 'marketing' ? BOOKING_URL : AI_BOOKING_URL} target="_blank" rel="noopener noreferrer">Open booking in a new tab</a>.</p>}
        </div>
    </dialog>;
}
