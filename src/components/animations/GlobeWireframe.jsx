import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GlobeWireframe({ className = "w-40 h-40" }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.to('.ring-x', { rotationX: 360, duration: 15, ease: 'linear', repeat: -1 });
            gsap.to('.ring-y', { rotationY: 360, duration: 20, ease: 'linear', repeat: -1 });
            gsap.to('.ring-z', { rotationZ: 360, duration: 25, ease: 'linear', repeat: -1 });
            gsap.to('.core-dot', { scale: 1.5, opacity: 0.8, yoyo: true, repeat: -1, duration: 2, ease: 'sine.inOut' });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative flex items-center justify-center ${className}`}
            style={{ perspective: '1000px' }}
        >
            <div className="absolute w-full h-full ring-x" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-0 border border-white/20 rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" />
            </div>
            <div className="absolute w-full h-full ring-y rotate-y-45" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-2 border border-white/10 rounded-full" />
            </div>
            <div className="absolute w-full h-full ring-z rotate-x-45" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-4 border border-white/5 rounded-full border-dashed" />
            </div>

            {/* Central Core */}
            <div className="core-dot absolute w-3 h-3 bg-white/40 rounded-full blur-[2px] shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
        </div>
    );
}
