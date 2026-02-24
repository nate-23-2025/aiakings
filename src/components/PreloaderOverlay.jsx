import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function PreloaderOverlay() {
    const overlayRef = useRef(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Lock scroll during preloader
        document.body.style.overflow = 'hidden';

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = '';
                    setVisible(false);
                },
            });

            const letters = overlayRef.current.querySelectorAll('.preloader-letter');
            const line = overlayRef.current.querySelector('.preloader-line');
            const topHalf = overlayRef.current.querySelector('.curtain-top');
            const bottomHalf = overlayRef.current.querySelector('.curtain-bottom');
            const content = overlayRef.current.querySelector('.preloader-content');

            // 1. Type letters one by one — staggered fade+rise
            tl.fromTo(letters,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.05, stagger: 0.06, ease: 'power2.out' }
            );

            // 2. Gold line draws from center outward
            tl.fromTo(line,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.4, ease: 'power3.inOut' },
                '-=0.15'
            );

            // 3. Brief gold glow pulse on text
            tl.fromTo(letters,
                { textShadow: '0 0 0px rgba(201,168,76,0)' },
                { textShadow: '0 0 20px rgba(201,168,76,0.4)', duration: 0.3, ease: 'power2.out' }
            );

            // 4. Hold — let it breathe
            tl.to({}, { duration: 0.3 });

            // 5. Content fades out + slight scale down
            tl.to(content, {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                ease: 'power2.in',
            });

            // 6. Curtain split — top rises, bottom drops
            tl.to(topHalf, {
                yPercent: -100,
                duration: 0.6,
                ease: 'power4.inOut',
            }, '-=0.1');
            tl.to(bottomHalf, {
                yPercent: 100,
                duration: 0.6,
                ease: 'power4.inOut',
            }, '<');
        }, overlayRef);

        return () => {
            document.body.style.overflow = '';
            ctx.revert();
        };
    }, []);

    if (!visible) return null;

    const brandName = 'AIA KINGS';

    return (
        <div ref={overlayRef} className="fixed inset-0 z-[9999]">
            {/* Curtain halves */}
            <div className="curtain-top absolute inset-x-0 top-0 h-1/2 bg-brand-primary" />
            <div className="curtain-bottom absolute inset-x-0 bottom-0 h-1/2 bg-brand-primary" />

            {/* Centered brand text + gold line */}
            <div className="preloader-content absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="flex" style={{ letterSpacing: '0.15em' }}>
                    {brandName.split('').map((char, i) => (
                        <span
                            key={i}
                            className="preloader-letter drama-text text-brand-accent text-4xl md:text-5xl opacity-0"
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </div>
                <div
                    className="preloader-line w-20 h-[1px] bg-brand-accent mt-4 origin-center"
                    style={{ transform: 'scaleX(0)' }}
                />
            </div>
        </div>
    );
}
