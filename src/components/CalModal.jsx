import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { useCalModal } from '../context/CalModalContext';

// The booking widget is served from the white-labeled GHL domain. form_embed.js
// posts the widget's real height back up and resizes the iframe, so the iframe
// itself never scrolls. The card scrolls instead when the month view runs long.
const BOOKING_URL = 'https://api.aiautomationkings.com/widget/booking/qwkWGz8DTsKfVRuLkn88';
const EMBED_SCRIPT = 'https://api.aiautomationkings.com/js/form_embed.js';
const IFRAME_ID = 'qwkWGz8DTsKfVRuLkn88_1788315968767';

export default function CalModal() {
    const { isOpen, closeCalModal } = useCalModal();
    const overlayRef = useRef(null);
    const cardRef = useRef(null);

    // Load the resize script once. This component is lazy loaded, so it only
    // ever hits the network when somebody actually reaches for the button.
    useEffect(() => {
        if (document.querySelector(`script[src="${EMBED_SCRIPT}"]`)) return;
        const script = document.createElement('script');
        script.src = EMBED_SCRIPT;
        script.async = true;
        document.body.appendChild(script);
    }, []);

    // GSAP open/close animations + scroll lock + escape key
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            gsap.set(overlayRef.current, { display: 'flex' });
            gsap.fromTo(overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
            gsap.fromTo(cardRef.current,
                { opacity: 0, scale: 0.92, y: 40 },
                { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 }
            );
        } else {
            document.body.style.overflow = '';

            if (overlayRef.current) {
                gsap.to(cardRef.current, {
                    opacity: 0, scale: 0.95, y: 20,
                    duration: 0.3, ease: 'power2.in',
                });
                gsap.to(overlayRef.current, {
                    opacity: 0, duration: 0.3, ease: 'power2.in', delay: 0.1,
                    onComplete: () => {
                        gsap.set(overlayRef.current, { display: 'none' });
                    },
                });
            }
        }
    }, [isOpen]);

    // Escape key handler
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) closeCalModal();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeCalModal]);

    return (
        <div
            ref={overlayRef}
            onClick={(e) => { if (e.target === overlayRef.current) closeCalModal(); }}
            className="fixed inset-0 z-[100] hidden items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            style={{ display: 'none' }}
        >
            <div
                ref={cardRef}
                className="relative w-full max-w-3xl max-h-[90vh] bg-[#15151A] border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(201,168,76,0.15)]"
            >
                {/* Close button */}
                <button
                    onClick={closeCalModal}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors duration-200"
                >
                    <X size={20} />
                </button>

                {/* Booking embed. The white panel is deliberate: the widget renders
                    light out of the box, so it reads as a surface instead of a bug. */}
                <div className="p-2 pt-12 max-h-[90vh] overflow-y-auto">
                    <div className="rounded-[1.5rem] bg-white overflow-hidden">
                        <iframe
                            id={IFRAME_ID}
                            src={BOOKING_URL}
                            title="Book a call with Nate"
                            allow="payment"
                            scrolling="no"
                            style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight: '640px' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
