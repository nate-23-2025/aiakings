import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function NeuralCore({ className = "w-40 h-40" }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Rotating outer data rings
            gsap.to('.data-ring-1', { rotationZ: 360, duration: 24, ease: 'linear', repeat: -1 });
            gsap.to('.data-ring-2', { rotationZ: -360, duration: 18, ease: 'linear', repeat: -1 });

            // Floating particles
            gsap.to('.particle', {
                y: 'random(-20, 20)',
                x: 'random(-20, 20)',
                opacity: 'random(0.2, 0.8)',
                duration: 'random(2, 4)',
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                stagger: 0.2
            });

            gsap.to('.core-pulse', { scale: 1.1, opacity: 0.6, duration: 1.5, ease: 'power2.inOut', yoyo: true, repeat: -1 });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative flex items-center justify-center ${className}`}
            style={{ perspective: '800px' }}
        >
            {/* 3D Isometric View Container */}
            <div className="absolute w-[120%] h-[120%] flex items-center justify-center" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(55deg) rotateY(10deg)' }}>
                {/* Outer Dashed Ring */}
                <div className="data-ring-1 absolute inset-0 border-[2px] border-dashed border-brand-accent/20 rounded-full shadow-[0_0_30px_rgba(201,168,76,0.1)]"></div>

                {/* Inner Solid Ring */}
                <div className="data-ring-2 absolute inset-6 border-[3px] border-white/10 rounded-full flex items-center justify-center">
                    {/* Core Element in Isometric */}
                    <div className="absolute inset-4 border border-brand-accent/40 rounded-full shadow-[inset_0_0_20px_rgba(201,168,76,0.2)]" />
                </div>
            </div>

            {/* Vertical Energy Beam (Straight up/down) */}
            <div className="core-pulse absolute w-1 h-[140%] bg-gradient-to-b from-transparent via-brand-accent/40 to-transparent blur-[2px]"></div>

            {/* Neural Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="particle absolute w-1.5 h-1.5 bg-brand-accent rounded-full blur-[1px]"
                        style={{
                            top: `${Math.random() * 80 + 10}%`,
                            left: `${Math.random() * 80 + 10}%`,
                            opacity: 0.5
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
