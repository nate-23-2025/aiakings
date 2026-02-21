import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MousePointer2 } from 'lucide-react';

export default function CursorProtocol() {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

            // Initial state
            gsap.set('.custom-cursor', { x: 20, y: 150, opacity: 0 });
            gsap.set('.grid-cell-target', { backgroundColor: 'transparent' });
            gsap.set('.save-btn', { scale: 1, backgroundColor: 'rgba(255,255,255,0.05)' });

            // Animation sequence
            tl.to('.custom-cursor', { opacity: 1, duration: 0.5 })
                .to('.custom-cursor', { x: 120, y: 60, duration: 1, ease: 'power2.inOut' }) // Move to Tuesday
                .to('.custom-cursor', { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 }) // Click
                .to('.grid-cell-target', { backgroundColor: 'var(--color-brand-accent)', color: '#0D0D12', duration: 0.2 }, '<0.1') // Highlight Target Date
                .to('.custom-cursor', { x: 220, y: 220, duration: 1, ease: 'power2.inOut', delay: 0.2 }) // Move to Save button
                .to('.custom-cursor', { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 }) // Click
                .to('.save-btn', { backgroundColor: 'var(--color-brand-accent)', color: '#0D0D12', duration: 0.2 }, '<0.1') // Highlight Button
                .to('.save-btn', { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 }, '<') // Button click visual
                .to('.custom-cursor', { opacity: 0, duration: 0.5, delay: 0.5 })
                .to('.grid-cell-target', { backgroundColor: 'transparent', color: 'rgba(255,255,255,0.4)', duration: 0.5 }, '<')
                .to('.save-btn', { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', duration: 0.5 }, '<');

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div
            ref={containerRef}
            className="bg-[#15151A] border border-white/5 rounded-[2rem] p-8 h-80 relative shadow-2xl overflow-hidden"
        >
            <div className="absolute top-6 left-6 text-xs uppercase tracking-widest text-[#FAF8F5]/60 font-semibold">
                Operations Auto-Scheduler
            </div>

            <div className="mt-12 flex justify-between gap-1 max-w-[280px] mx-auto">
                {days.map((day, i) => (
                    <div
                        key={i}
                        className={`w-8 h-12 rounded-lg flex items-center justify-center font-mono text-sm border border-white/5 transition-colors ${i === 2 ? 'grid-cell-target text-white/40' : 'text-white/20'}`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="absolute bottom-8 right-8">
                <button className="save-btn px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-white/60 transition-colors">
                    Deploy Task
                </button>
            </div>

            <div className="custom-cursor absolute pointer-events-none z-10 text-brand-accent">
                <MousePointer2 size={24} className="fill-brand-accent drop-shadow-md" />
            </div>
        </div>
    );
}
