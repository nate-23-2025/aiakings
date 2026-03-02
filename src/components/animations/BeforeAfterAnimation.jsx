import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle2 } from 'lucide-react';

export default function BeforeAfterAnimation({ className = "w-full h-full" }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            // INITIAL SETUP
            gsap.set('.ba-container', { opacity: 0 });
            gsap.set('.ba-label-before', { opacity: 0 });
            gsap.set('.ba-label-after', { opacity: 0 });
            gsap.set('.ba-item', { opacity: 0, scale: 0 });
            gsap.set('.ba-box', { opacity: 1 });
            gsap.set('.ba-check', { opacity: 0 });

            // Set scattered "chaos" positions for each item
            const scatteredPositions = [
                { x: 15, y: 20 },
                { x: 65, y: 10 },
                { x: 45, y: 45 },
                { x: 85, y: 35 },
                { x: 25, y: 60 },
                { x: 75, y: 65 }
            ];

            // Set organized grid positions (2 columns, 3 rows)
            const gridPositions = [
                { x: 35, y: 25 },
                { x: 65, y: 25 },
                { x: 35, y: 45 },
                { x: 65, y: 45 },
                { x: 35, y: 65 },
                { x: 65, y: 65 }
            ];

            // Apply initial scattered positions
            scatteredPositions.forEach((pos, i) => {
                gsap.set(`.ba-item-${i + 1}`, {
                    left: `${pos.x}%`,
                    top: `${pos.y}%`
                });
            });

            // STAGE 1 — Container fades in (0s - 0.3s)
            tl.to('.ba-container', { opacity: 1, duration: 0.3 }, 0);

            // STAGE 2 — "Before" label fades in (0s - 0.3s)
            tl.to('.ba-label-before', { opacity: 1, duration: 0.3 }, 0);

            // STAGE 3 — 6 red boxes appear at random scattered positions (0.3s - 1.0s)
            tl.to('.ba-item', {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                stagger: 0.1,
                ease: 'back.out(2)'
            }, 0.3);

            // STAGE 4 — Hold chaos state (1.0s - 2.5s)
            tl.to({}, { duration: 1.5 });

            // STAGE 5 — "After" label fades in (2.5s - 2.8s)
            tl.to('.ba-label-after', { opacity: 1, duration: 0.3 }, 2.5);

            // STAGE 6 — Red boxes morph to green checks (2.8s - 3.8s)
            // Color transition + icon swap + scale bounce
            tl.to('.ba-box', {
                backgroundColor: 'rgba(74,222,128,0.6)',
                duration: 0.4,
                stagger: 0.08,
                ease: 'power2.inOut'
            }, 2.8)
            .to('.ba-item', {
                scale: 1.3,
                duration: 0.2,
                stagger: 0.08,
                ease: 'back.out(2)',
                yoyo: true,
                repeat: 1
            }, 2.8)
            .to('.ba-box', {
                opacity: 0,
                duration: 0.15,
                stagger: 0.08
            }, 3.0)
            .to('.ba-check', {
                opacity: 1,
                duration: 0.15,
                stagger: 0.08
            }, 3.0);

            // STAGE 7 — Checks slide into aligned grid positions (3.8s - 4.5s)
            gridPositions.forEach((pos, i) => {
                tl.to(`.ba-item-${i + 1}`, {
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    duration: 0.6,
                    ease: 'power2.out'
                }, 3.8);
            });

            // STAGE 8 — Hold organized state (4.5s - 6.5s)
            tl.to({}, { duration: 2.0 });

            // RESET (6.5s - 7.0s)
            tl.to('.ba-container', { opacity: 0, duration: 0.4 })
              .set('.ba-label-before', { opacity: 0 })
              .set('.ba-label-after', { opacity: 0 })
              .set('.ba-item', { opacity: 0, scale: 0 })
              .set('.ba-box', { opacity: 1, backgroundColor: 'rgba(239,68,68,0.6)' })
              .set('.ba-check', { opacity: 0 })
              .call(() => {
                  // Reset to scattered positions
                  scatteredPositions.forEach((pos, i) => {
                      gsap.set(`.ba-item-${i + 1}`, {
                          left: `${pos.x}%`,
                          top: `${pos.y}%`
                      });
                  });
              })
              .to('.ba-container', { opacity: 1, duration: 0.1 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={`relative overflow-hidden rounded-2xl bg-[#0D0D12]/50 border border-white/5 p-4 ${className}`}>
            <div className="ba-container relative w-full h-full opacity-0">

                {/* Labels */}
                <span className="ba-label-before font-mono text-[10px] text-white/30 uppercase absolute top-2 left-4 opacity-0">
                    Before
                </span>
                <span className="ba-label-after font-mono text-[10px] text-green-400/60 uppercase absolute top-2 right-4 opacity-0">
                    After
                </span>

                {/* 6 items that morph from red boxes to green checks */}
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div
                        key={num}
                        className={`ba-item ba-item-${num} absolute -translate-x-1/2 -translate-y-1/2 opacity-0`}
                    >
                        {/* Red box (before state) */}
                        <div className="ba-box w-3 h-3 rounded bg-red-500/60" />
                        {/* Green check (after state) */}
                        <div className="ba-check absolute inset-0 flex items-center justify-center opacity-0">
                            <CheckCircle2 size={14} className="text-green-400" strokeWidth={2.5} />
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}
