import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ScannerGrid({ className = "w-40 h-40" }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Lasers sweep up and down the grid
            gsap.to('.laser-line', {
                top: '100%',
                duration: 2.5,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1
            });

            // The grid slowly rotates on its Z axis for dynamic feel
            gsap.to('.grid-plane', {
                rotationZ: -180,
                duration: 60,
                ease: 'linear',
                repeat: -1
            });

            // Flashing node intersection points
            gsap.to('.node', {
                opacity: 1,
                duration: 0.1,
                stagger: {
                    each: 0.05,
                    from: 'random',
                    repeat: -1,
                    yoyo: true,
                    repeatDelay: 1
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative flex items-center justify-center overflow-hidden rounded-3xl ${className}`}
            style={{ perspective: '800px' }}
        >
            <div
                className="absolute w-[200%] h-[200%] grid-plane"
                style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(45deg)' }}
            >
                {/* CSS Hex/Lines Grid */}
                <div
                    className="w-full h-full opacity-30"
                    style={{
                        backgroundImage: `linear-gradient(var(--color-brand-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-accent) 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Scanner Laser */}
                <div
                    className="laser-line absolute left-0 right-0 h-[2px] bg-brand-accent z-10 shadow-[0_0_20px_var(--color-brand-accent),0_0_40px_var(--color-brand-accent)]"
                    style={{ top: '0%' }}
                >
                    {/* Laser fade gradient */}
                    <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-brand-accent/20 to-transparent -translate-y-full blur-sm" />
                </div>

                {/* Nodes */}
                <div className="absolute inset-0">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="node absolute w-2 h-2 bg-white rounded-full opacity-0 shadow-[0_0_10px_white]"
                            style={{
                                top: `${Math.floor(Math.random() * 20) * 12}px`,
                                left: `${Math.floor(Math.random() * 20) * 12}px`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Outer vignette masking */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#1A1A22_70%)] rounded-3xl" />
        </div>
    );
}
