import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';

// On a phone the visitor is one thumb-reach from the only action that matters,
// no matter how far down the page they have scrolled. Appears once the hero
// button has scrolled away so the two never compete.
export default function StickyCTA() {
    const { openCalModal } = useCalModal();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div
            className={`md:hidden fixed inset-x-0 bottom-0 z-[80] px-4 pt-3 bg-brand-primary/90 backdrop-blur-md border-t border-white/10 transition-transform duration-300 ${
                show ? 'translate-y-0' : 'translate-y-full'
            }`}
            style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
        >
            <div className="flex items-center gap-3">
                <button
                    onClick={openCalModal}
                    className="flex-grow bg-brand-accent text-brand-primary rounded-[2rem] py-3.5 font-semibold text-base min-h-[52px] active:scale-[0.98] transition-transform"
                >
                    Book a Call
                </button>
                <a
                    href="mailto:nate@aiautomationkings.com"
                    aria-label="Email Nate"
                    className="shrink-0 grid place-items-center w-[52px] h-[52px] rounded-full border border-white/20 text-white/80 active:scale-[0.98] transition-transform"
                >
                    <Mail size={20} />
                </a>
            </div>
        </div>
    );
}
