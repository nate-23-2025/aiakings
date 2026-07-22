import { useEffect, useState } from 'react';

// Always-available "Book a Call" bar on mobile. Appears after the visitor scrolls
// past the hero so it never covers the hero CTA.
export default function StickyCta({ onBook }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className={`sm:hidden fixed bottom-0 inset-x-0 z-40 p-3 transition-transform duration-300 ${show ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="bg-[#15151A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2.5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <button onClick={onBook}
                    className="w-full bg-brand-accent text-brand-primary font-semibold text-base py-3.5 rounded-xl active:scale-[0.98] transition-transform">
                    Book a Call
                </button>
            </div>
        </div>
    );
}
