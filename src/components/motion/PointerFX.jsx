import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './pointer-fx.css';

// One delegated pointer handler. Adapted from 21st.dev Cursor Follow (4283),
// Cursor Spotlight (18361), and Magnetic (649). See EXPERIENCE_SOURCES.md.
// The native pointer stays visible; decorative cues never receive input.
export default function PointerFX() {
    const cursor = useRef(null), label = useRef(null);
    useEffect(() => {
        const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
        const cue = cursor.current;
        let dispose = () => {};
        const sync = () => {
            dispose();
            if (!media.matches) return;
            let raf = 0, last = null, tilted = null, paper = null, magnet = null, scene = null, surface = null;
            const touchedTilts = new Set();
            const position = (element, x, y) => {
                const r = element.getBoundingClientRect();
                element.style.setProperty('--mx', `${x - r.left}px`);
                element.style.setProperty('--my', `${y - r.top}px`);
                return { px: (x - r.left) / r.width - .5, py: (y - r.top) / r.height - .5 };
            };
            const resetPaper = () => {
                paper?.style.removeProperty('--cursor-rx');
                paper?.style.removeProperty('--cursor-ry');
                paper = null;
            };
            const resetMagnet = () => {
                magnet?.style.removeProperty('--pull-x');
                magnet?.style.removeProperty('--pull-y');
                magnet = null;
            };
            const untilt = element => gsap.to(element, { rotateX: 0, rotateY: 0, duration: .65, ease: 'power3.out', overwrite: 'auto' });
            const hide = () => {
                cancelAnimationFrame(raf); raf = 0; last = null;
                cue.dataset.visible = 'false';
                gsap.killTweensOf(cue);
                if (tilted) untilt(tilted);
                tilted = null;
                scene?.removeAttribute('data-pointer-inside'); scene = null;
                surface?.removeAttribute('data-pointer-inside'); surface = null;
                resetPaper(); resetMagnet();
            };
            const apply = () => {
                raf = 0;
                if (!last) return;
                const { x, y, target } = last;
                const el = target instanceof Element ? target : null;
                if (!el || document.querySelector('dialog[open]') || el.closest('input,textarea,select,[contenteditable=true]')) { hide(); return; }
                const spot = el.closest('[data-spotlight], .ws-industry-picker button');
                if (spot) position(spot, x, y);
                const nextScene = el.closest('[data-cursor-scene]');
                const nextSurface = el.closest('[data-cursor-surface]');
                if (scene !== nextScene) scene?.removeAttribute('data-pointer-inside');
                if (surface !== nextSurface) surface?.removeAttribute('data-pointer-inside');
                scene = nextScene; surface = nextSurface;
                [scene, surface].filter(Boolean).forEach(element => { position(element, x, y); element.dataset.pointerInside = 'true'; });
                const tilt = el.closest('[data-tilt]');
                if (tilted && tilted !== tilt) untilt(tilted);
                tilted = tilt;
                if (tilt) {
                    touchedTilts.add(tilt);
                    const { px, py } = position(tilt, x, y);
                    gsap.to(tilt, { rotateY: px * 9, rotateX: -py * 7, transformPerspective: 1000, duration: .6, ease: 'power3.out', overwrite: 'auto' });
                }
                const nextPaper = el.closest('[data-cursor-tilt]');
                if (paper !== nextPaper) resetPaper();
                paper = nextPaper;
                if (paper) {
                    const { px, py } = position(paper, x, y);
                    paper.style.setProperty('--cursor-rx', `${-py * 7}deg`);
                    paper.style.setProperty('--cursor-ry', `${px * 8}deg`);
                }
                // CTAButton owns its own magnet. These are the remaining primary buttons.
                const nextMagnet = el.closest('.cr-button:not(:disabled), .sb-button:not(:disabled)');
                if (magnet !== nextMagnet) resetMagnet();
                magnet = nextMagnet;
                if (magnet) {
                    const { px, py } = position(magnet, x, y);
                    magnet.style.setProperty('--pull-x', `${px * 9}px`);
                    magnet.style.setProperty('--pull-y', `${py * 7}px`);
                }
                const targetCue = el.closest('[data-cursor-style], .lb-node, .pg-card');
                if (!targetCue) { cue.dataset.visible = 'false'; return; }
                const mode = targetCue.dataset.cursorStyle || (targetCue.matches('.lb-node') ? 'brain' : 'project');
                cue.dataset.mode = mode;
                label.current.textContent = targetCue.dataset.cursorLabel || (mode === 'brain' ? 'Explore' : 'View site');
                const width = mode === 'project' ? 112 : mode === 'brain' ? 60 : 84;
                const height = mode === 'project' ? 42 : width;
                const nextX = Math.max(10, Math.min(x + 18, window.innerWidth - width - 10));
                const nextY = Math.max(10, Math.min(y + 18, window.innerHeight - height - 10));
                if (cue.dataset.visible !== 'true') gsap.set(cue, { x: nextX, y: nextY });
                else gsap.to(cue, { x: nextX, y: nextY, duration: .22, ease: 'power3.out', overwrite: true });
                cue.dataset.visible = 'true';
            };
            const onMove = event => {
                if (event.pointerType !== 'mouse') return;
                last = { x: event.clientX, y: event.clientY, target: event.target };
                if (!raf) raf = requestAnimationFrame(apply);
            };
            document.addEventListener('pointermove', onMove, { passive: true });
            document.addEventListener('pointerdown', hide, { passive: true });
            document.addEventListener('focusin', hide);
            document.addEventListener('scroll', hide, { passive: true, capture: true });
            document.documentElement.addEventListener('pointerleave', hide);
            window.addEventListener('blur', hide);
            dispose = () => {
                hide();
                touchedTilts.forEach(element => { gsap.killTweensOf(element); gsap.set(element, { rotateX: 0, rotateY: 0 }); });
                document.removeEventListener('pointermove', onMove);
                document.removeEventListener('pointerdown', hide);
                document.removeEventListener('focusin', hide);
                document.removeEventListener('scroll', hide, true);
                document.documentElement.removeEventListener('pointerleave', hide);
                window.removeEventListener('blur', hide);
            };
        };
        sync();
        media.addEventListener('change', sync);
        return () => { media.removeEventListener('change', sync); dispose(); };
    }, []);
    return <div ref={cursor} className="pointer-fx-cue" data-visible="false" aria-hidden="true"><div className="pointer-fx-shape"><span ref={label} /><svg viewBox="0 0 16 16" fill="none"><path d="M3 13 13 3M3 3h10v10" /></svg></div></div>;
}
