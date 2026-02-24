import { useEffect, useRef } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { useCalModal } from '../context/CalModalContext';

export default function CalModal() {
    const { isOpen, closeCalModal } = useCalModal();
    const overlayRef = useRef(null);
    const cardRef = useRef(null);

    // Initialize Cal.com theme
    useEffect(() => {
        (async function () {
            const cal = await getCalApi({ namespace: '15min' });
            cal('ui', {
                theme: 'dark',
                styles: { branding: { brandColor: '#fdb800' } },
                hideEventTypeDetails: false,
                layout: 'month_view',
            });
        })();
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
                className="relative w-full max-w-2xl max-h-[90vh] bg-[#15151A] border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(201,168,76,0.15)]"
            >
                {/* Close button */}
                <button
                    onClick={closeCalModal}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors duration-200"
                >
                    <X size={20} />
                </button>

                {/* Cal.com embed */}
                <div className="p-2 pt-12 min-h-[500px]">
                    <Cal
                        namespace="15min"
                        calLink="nate-mamo/15min"
                        style={{ width: '100%', height: '100%', overflow: 'auto' }}
                        config={{
                            layout: 'month_view',
                            theme: 'dark',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
