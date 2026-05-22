import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MousePointer2 } from 'lucide-react';

export default function CursorProtocol() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

            const targetCell = container.querySelector('.grid-cell-target');
            const saveBtn = container.querySelector('.save-btn');
            const cursor = container.querySelector('.cp-cursor');

            if (!targetCell || !saveBtn || !cursor) return;

            const rect = container.getBoundingClientRect();
            const cellRect = targetCell.getBoundingClientRect();
            const btnRect = saveBtn.getBoundingClientRect();

            const cellX = cellRect.left - rect.left + cellRect.width / 2;
            const cellY = cellRect.top - rect.top + cellRect.height / 2;
            const btnX = btnRect.left - rect.left + btnRect.width / 2;
            const btnY = btnRect.top - rect.top + btnRect.height / 2;

            gsap.set('.cp-cursor', { x: 20, y: rect.height * 0.7, opacity: 0 });
            gsap.set('.grid-cell-target', { backgroundColor: 'transparent' });
            gsap.set('.save-btn', { scale: 1, backgroundColor: 'rgba(255,255,255,0.05)' });

            tl.to('.cp-cursor', { opacity: 1, duration: 0.5 })
                .to('.cp-cursor', { x: cellX, y: cellY, duration: 1, ease: 'power2.inOut' })
                .to('.cp-cursor', { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
                .to('.grid-cell-target', { backgroundColor: 'var(--color-brand-accent)', color: '#0D0D12', duration: 0.2 }, '<0.1')
                .to('.cp-cursor', { x: btnX, y: btnY, duration: 1, ease: 'power2.inOut', delay: 0.2 })
                .to('.cp-cursor', { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
                .to('.save-btn', { backgroundColor: 'var(--color-brand-accent)', color: '#0D0D12', duration: 0.2 }, '<0.1')
                .to('.save-btn', { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 }, '<')
                .to('.cp-cursor', { opacity: 0, duration: 0.5, delay: 0.5 })
                .to('.grid-cell-target', { backgroundColor: 'transparent', color: 'rgba(255,255,255,0.4)', duration: 0.5 }, '<')
                .to('.save-btn', { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', duration: 0.5 }, '<');

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div
            ref={containerRef}
            className="bg-[#15151A] border border-white/5 rounded-[2rem] p-5 sm:p-8 h-full relative shadow-2xl overflow-hidden"
        >
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-[#FAF8F5]/60 font-semibold">
                Operations Auto-Scheduler
            </div>

            <div className="mt-4 sm:mt-6 flex justify-between gap-1 max-w-[280px] mx-auto">
                {days.map((day, i) => (
                    <div
                        key={i}
                        className={`w-6 h-8 sm:w-8 sm:h-12 rounded-lg flex items-center justify-center font-mono text-xs sm:text-sm border border-white/5 transition-colors ${i === 2 ? 'grid-cell-target text-white/40' : 'text-white/20'}`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
                <button className="save-btn px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/60 transition-colors">
                    Deploy Task
                </button>
            </div>

            <div className="cp-cursor absolute pointer-events-none z-10 text-brand-accent" style={{ top: 0, left: 0 }}>
                <MousePointer2 size={20} className="fill-brand-accent drop-shadow-md" />
            </div>
        </div>
    );
}
