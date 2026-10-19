import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/motion';

// Fine streaks of light drifting up, each fading in, then out, somewhere new.
// Mostly gold, a few sapphire. One canvas, sized to its parent, with the count
// scaled to the area and capped. It starts once the browser is idle, so the
// headline paints first, and stops whenever it is off screen or the tab is
// hidden. Reduced motion gets nothing. From "Particle Hero" (designali-in)
// on 21st.dev.
export default function ParticleField({ className = '', density = 5200, max = 170 }) {
    const ref = useRef(null);

    useEffect(() => {
        if (prefersReducedMotion()) return;
        const canvas = ref.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w = 0;
        let h = 0;
        let parts = [];
        let raf = 0;
        let onScreen = false;

        const spawn = () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            speed: Math.random() * 0.22 + 0.1,
            len: Math.random() * 2.2 + 1.2,
            life: 0,
            span: 220 + Math.random() * 520,
            blue: Math.random() < 0.18,
        });

        const resize = () => {
            const r = canvas.getBoundingClientRect();
            w = r.width;
            h = r.height;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const n = Math.min(max, Math.floor((w * h) / density));
            parts = Array.from({ length: n }, () => {
                const p = spawn();
                p.life = Math.random() * p.span;
                return p;
            });
        };

        const frame = () => {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < parts.length; i++) {
                const p = parts[i];
                p.y -= p.speed;
                p.life += 1;
                if (p.y < -6 || p.life >= p.span) {
                    parts[i] = spawn();
                    continue;
                }
                const a = Math.min(1, p.life / 50) * Math.min(1, (p.span - p.life) / 140);
                ctx.fillStyle = p.blue ? `rgba(142, 165, 238, ${a * 0.7})` : `rgba(241, 220, 155, ${a * 0.85})`;
                ctx.fillRect(p.x, p.y, 1, p.len);
            }
            raf = requestAnimationFrame(frame);
        };

        const run = () => {
            cancelAnimationFrame(raf);
            if (onScreen && !document.hidden) raf = requestAnimationFrame(frame);
        };

        let io;
        let ro;
        const start = () => {
            resize();
            ro = new ResizeObserver(resize);
            ro.observe(canvas);
            io = new IntersectionObserver(([entry]) => {
                onScreen = entry.isIntersecting;
                run();
            });
            io.observe(canvas);
            document.addEventListener('visibilitychange', run);
        };
        const idle = window.requestIdleCallback
            ? window.requestIdleCallback(start, { timeout: 2000 })
            : setTimeout(start, 900);

        return () => {
            if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
            clearTimeout(idle);
            cancelAnimationFrame(raf);
            io?.disconnect();
            ro?.disconnect();
            document.removeEventListener('visibilitychange', run);
        };
    }, [density, max]);

    return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
