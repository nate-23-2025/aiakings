import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Lock } from 'lucide-react';
import CTAButton from '../motion/CTAButton';

// The breakdown behind one row of "Agents I have built". Rendered into the
// body so no transformed ancestor can trap it. Escape, the close button, or a
// click outside closes it, focus goes to the close button on open and back to
// the row that opened it on close, and the page behind stops scrolling.
// A confidential entry shows a short note instead of a feature list.
const EXIT_MS = 220;

// The diagrams load the first time someone opens that popup, never with the page.
const VISUALS = {
    allen: lazy(() => import('../features/AllenVisual')),
    phone: lazy(() => import('../features/PhoneVisual')),
    solomon: lazy(() => import('../features/SolomonVisual')),
    daniel: lazy(() => import('../features/DanielVisual')),
    hq: lazy(() => import('../features/HQVisual')),
};

export default function AgentDetail({ agent, onClose, onBook }) {
    const [shown, setShown] = useState(false);
    const closeRef = useRef(null);
    const returnTo = useRef(null);

    useEffect(() => {
        returnTo.current = document.activeElement;
        const raf = requestAnimationFrame(() => setShown(true));
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus({ preventScroll: true });
        return () => {
            cancelAnimationFrame(raf);
            document.body.style.overflow = prevOverflow;
            returnTo.current?.focus?.({ preventScroll: true });
        };
    }, []);

    const close = () => {
        setShown(false);
        setTimeout(onClose, EXIT_MS);
    };

    const book = () => {
        close();
        // Let this one finish closing before the booking modal takes the screen.
        setTimeout(onBook, EXIT_MS + 30);
    };

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') close();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    const titleId = `agent-${agent.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const Visual = agent.visual ? VISUALS[agent.visual] : null;

    return createPortal(
        <div
            className={`fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm sm:px-4 transition-opacity duration-200 ${shown ? 'opacity-100' : 'opacity-0'}`}
            onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className={`relative w-full ${Visual ? 'sm:max-w-2xl lg:max-w-5xl' : 'sm:max-w-2xl'} max-h-[88vh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] border border-white/10 bg-[#15151A] shadow-[0_0_80px_rgba(201,168,76,0.12)] transition-[translate,scale,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                    shown ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-6 sm:translate-y-3 sm:scale-[0.97]'
                }`}
            >
                <button
                    ref={closeRef}
                    onClick={close}
                    aria-label="Close"
                    className="absolute top-4 right-4 z-10 grid place-items-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>

                <div className={`p-6 sm:p-9 ${Visual ? 'lg:grid lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-x-10' : ''}`}>
                    <div className={Visual ? 'lg:col-start-2 lg:row-start-1' : ''}>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-accent mb-3 pr-12">{agent.role}</p>
                        <h3 id={titleId} className="text-3xl sm:text-4xl font-sans font-medium tracking-tight text-white leading-tight mb-3 pr-12">
                            {agent.name}
                        </h3>
                        <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed">{agent.summary}</p>
                    </div>

                    {Visual && (
                        <div className="mt-7 lg:mt-0 lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-0 self-start">
                            <Suspense fallback={<div className="h-[560px] rounded-[1.5rem] border border-white/[0.08] bg-[#0F0F14]" />}>
                                <Visual />
                            </Suspense>
                        </div>
                    )}

                    <div className={Visual ? 'lg:col-start-2 lg:row-start-2' : ''}>
                        {agent.confidential ? (
                            <div className="mt-7 flex gap-4 rounded-2xl border border-brand-accent/25 bg-brand-accent/[0.05] p-5">
                                <span className="grid place-items-center w-9 h-9 rounded-full bg-brand-accent/15 shrink-0">
                                    <Lock size={15} className="text-brand-accent" />
                                </span>
                                <p className="text-white/70 text-sm sm:text-base leading-relaxed">{agent.note}</p>
                            </div>
                        ) : (
                            agent.sections.map((section) => (
                                <div key={section.heading} className="mt-7">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3">{section.heading}</p>
                                    <ul className="border-t border-white/[0.07]">
                                        {section.items.map((item) => (
                                            <li key={item} className="flex items-start gap-3 border-b border-white/[0.07] py-3">
                                                <Check className="w-4 h-4 text-brand-accent shrink-0 mt-[3px]" strokeWidth={2.5} />
                                                <span className="text-white/75 text-sm sm:text-base leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        )}

                        {agent.highlight && (
                            <p className="mt-6 text-white text-base sm:text-lg font-light">
                                <span className="drama-text text-brand-accent text-xl sm:text-2xl">{agent.highlight}</span>
                            </p>
                        )}

                        {agent.built && <p className="mt-5 text-white/30 text-xs italic">{agent.built}</p>}

                        {/* No booking button on confidential work: nothing should suggest the
                            details are available on a call. */}
                        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                            {!agent.confidential && (
                                <CTAButton size="md" onClick={book} className="w-full sm:w-auto">
                                    Talk to Me About One Like This
                                </CTAButton>
                            )}
                            <button onClick={close} className="text-white/45 hover:text-white/80 text-sm transition-colors">
                                Back to the list
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
