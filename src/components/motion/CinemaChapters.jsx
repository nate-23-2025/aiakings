import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { prefersReducedMotion } from '../../lib/motion';

// 21st Kokonut UI Scroll Index, rebuilt for the page's existing scroll system.
// No scroll hijacking. The links remain ordinary, keyboard-accessible anchors.
//
// A long chapter can show its own steps. The section lists them in
// data-chapter-steps ("First|Second|Third") and reports where the visitor is:
//   window.dispatchEvent(new CustomEvent('cinema:progress', { detail: { id, step, fill } }))
// with fill from 0 to 1 through the current step. While that chapter is
// current, its tick opens into one tick per step. Selecting a step sends
// 'cinema:goto' with { id, step } so the section scrolls there its own way.
const FLASH_MS = 1900;

export default function CinemaChapters() {
    const { pathname } = useLocation();
    const [chapters, setChapters] = useState([]);
    const [active, setActive] = useState('');
    const [progress, setProgress] = useState({});
    const [flash, setFlash] = useState(null);
    const activeRef = useRef(''), progressRef = useRef({}), flashTimer = useRef(0);
    // Name the step briefly whenever the visitor enters a new one.
    const showFlash = (id, step) => {
        setFlash({ id, step });
        clearTimeout(flashTimer.current);
        flashTimer.current = setTimeout(() => setFlash(null), FLASH_MS);
    };
    useEffect(() => () => clearTimeout(flashTimer.current), []);
    useEffect(() => {
        let frame = 0;
        let items = [];
        let sectionNodes = [];
        const main = document.querySelector('main');
        if (!main) return;
        const scan = () => {
            sectionNodes = Array.from(main.querySelectorAll('section'));
            items = sectionNodes.filter(s => s.querySelector('h1,h2,h3'));
            const list = items.map((el, i) => {
                if (!el.id) el.id = 'scene-' + i;
                el.classList.add('cinema-chapter');
                const title = el.querySelector('h1,h2,h3').textContent.trim();
                const steps = el.dataset.chapterSteps ? el.dataset.chapterSteps.split('|') : null;
                return { id: el.id, label: title.length > 58 ? title.slice(0, 55) + '…' : title, steps };
            });
            setChapters(list);
            update();
        };
        const update = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const current = items.filter(el => el.getBoundingClientRect().top < window.innerHeight * .4).at(-1) || items[0];
                if (!current || current.id === activeRef.current) return;
                activeRef.current = current.id;
                setActive(current.id);
                const known = progressRef.current[current.id];
                if (known) showFlash(current.id, known.step);
            });
        };
        // The page is lazy loaded. Watch additions until its sections arrive.
        const mo = new MutationObserver(() => {
            const next = Array.from(main.querySelectorAll('section'));
            if (next.length !== sectionNodes.length || next.some((el, i) => el !== sectionNodes[i])) scan();
        });
        mo.observe(main, { childList: true, subtree: true });
        scan();
        window.addEventListener('scroll', update, { passive: true });
        return () => { mo.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', update); };
    }, [pathname]);

    useEffect(() => {
        const onProgress = e => {
            const { id, step, fill } = e.detail;
            const last = progressRef.current[id];
            if (last && last.step === step && Math.abs(last.fill - fill) < .01) return;
            if ((!last || last.step !== step) && activeRef.current === id) showFlash(id, step);
            progressRef.current = { ...progressRef.current, [id]: { step, fill } };
            setProgress(previous => {
                const last = previous[id];
                if (last && last.step === step && Math.abs(last.fill - fill) < .01) return previous;
                return { ...previous, [id]: { step, fill } };
            });
        };
        window.addEventListener('cinema:progress', onProgress);
        return () => window.removeEventListener('cinema:progress', onProgress);
    }, []);

    const goTo = id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    };
    return <nav className="cinema-chapters" aria-label="Page chapters">{chapters.map((c, i) => {
        const isActive = active === c.id;
        const open = isActive && !!c.steps;
        const state = progress[c.id];
        return <div className={`cinema-chapter-item ${open ? 'is-open' : ''}`} key={c.id}>
            <a href={'#' + c.id} aria-label={c.label} aria-current={isActive ? 'location' : undefined} onClick={e => { e.preventDefault(); goTo(c.id); }}><span>{String(i + 1).padStart(2, '0')} / {c.label}</span></a>
            {c.steps && <div className="cinema-steps" aria-hidden={!open}>{c.steps.map((label, s) => {
                const done = state && s < state.step, here = state && s === state.step;
                const fill = here ? Math.max(.06, state.fill) : done ? 1 : 0;
                const flashing = flash && flash.id === c.id && flash.step === s;
                return <a key={label} href={'#' + c.id} className={`cinema-step ${done ? 'is-done' : ''} ${here ? 'is-here' : ''}`} style={{ '--i': s }} tabIndex={open ? 0 : -1} aria-label={`${c.label}: ${label}`} aria-current={here ? 'step' : undefined}
                    onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent('cinema:goto', { detail: { id: c.id, step: s } })); }}>
                    <i><em style={{ transform: `scaleX(${fill.toFixed(3)})` }} /></i>
                    <span className={flashing ? 'is-flashing' : ''}>{label}</span>
                </a>;
            })}</div>}
        </div>;
    })}</nav>;
}
