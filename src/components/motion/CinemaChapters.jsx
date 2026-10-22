import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { prefersReducedMotion } from '../../lib/motion';

// 21st Kokonut UI Scroll Index, rebuilt for the page's existing scroll system.
// No scroll hijacking. The links remain ordinary, keyboard-accessible anchors.
export default function CinemaChapters() {
    const { pathname } = useLocation();
    const [chapters, setChapters] = useState([]);
    const [active, setActive] = useState('');
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
                return { id: el.id, label: title.length > 58 ? title.slice(0, 55) + '…' : title };
            });
            setChapters(list);
            update();
        };
        const update = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const current = items.filter(el => el.getBoundingClientRect().top < window.innerHeight * .4).at(-1) || items[0];
                if (current) setActive(current.id);
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
    return <nav className="cinema-chapters" aria-label="Page chapters">{chapters.map((c, i) => <a key={c.id} href={'#' + c.id} aria-label={c.label} aria-current={active === c.id ? 'location' : undefined} onClick={e => { const el = document.getElementById(c.id); if (!el) return; e.preventDefault(); el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' }); }}><span>{String(i + 1).padStart(2, '0')} / {c.label}</span></a>)}</nav>;
}
