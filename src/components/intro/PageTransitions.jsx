import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { prefersReducedMotion } from '../../lib/motion';
import { Search, Check } from 'lucide-react';
import Crown from './Crown';

// A different short transition for each side of the site, played when a link
// takes the visitor to another page:
//   to Nate the Marketer   a gold light sweeps in, a search types out, and the
//                          answer that comes back is "Your business"
//   to Nate the Dev        a sapphire scan, top to bottom, the grid boots up
//   back home              the two doors close on the crown and open again
//
// It listens for clicks on any internal link, so no link needs changing. The
// cover runs while the next page's code downloads (it is fetched right away),
// the route changes behind it, then it reveals. About 0.7s in all. Same-page
// links, the booking buttons, new tabs, and modified clicks are left alone. A
// click, key, or scroll mid-transition fast-forwards it. Reduced motion just
// navigates, and nothing plays while the intro is running.
const LOADERS = {
    '/marketer': () => import('../../pages/MarketerPage'),
    '/developer': () => import('../../pages/DeveloperPage'),
};

const kindFor = (path) => {
    if (path.startsWith('/marketer')) return 'marketer';
    if (path.startsWith('/developer')) return 'dev';
    if (path === '/') return 'home';
    return 'fade';
};

const SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel'];
const nextFrame = () => new Promise((r) => requestAnimationFrame(r));
const play = (tl) => new Promise((r) => tl.eventCallback('onComplete', r));

export default function PageTransitions() {
    const navigate = useNavigate();
    const rootRef = useRef(null);
    const busy = useRef(false);

    useEffect(() => {
        const root = rootRef.current;
        const q = (sel) => root.querySelectorAll(sel);
        let speed = 1;
        let current = null;
        const skip = () => {
            speed = 6;
            current?.timeScale(6);
        };
        const run = (tl) => {
            current = tl;
            tl.timeScale(speed);
            return play(tl);
        };

        const cover = (kind) => {
            const tl = gsap.timeline();
            if (kind === 'marketer') {
                tl.fromTo(q('.pt-sweep'), { xPercent: -101 }, { xPercent: 0, duration: 0.3, ease: 'power3.inOut' });
                tl.fromTo(q('.pt-search'), { opacity: 0, y: 10, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: 'back.out(2)' }, 0.1);
                tl.fromTo(q('.pt-search-text'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.2, ease: 'steps(14)' }, 0.16);
                tl.fromTo(q('.pt-answer'), { opacity: 0, y: 12, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'back.out(2.6)' }, 0.32);
                tl.fromTo(q('.pt-answer-glow'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1.25, duration: 0.18, ease: 'power2.out' }, 0.34);
                tl.to(q('.pt-answer-glow'), { opacity: 0, duration: 0.14 }, 0.44);
                tl.fromTo(q('.pt-label-marketer'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 0.38);
                tl.fromTo(q('.pt-label-marketer'), { backgroundPosition: '100% 0' }, { backgroundPosition: '0% 0', duration: 0.26, ease: 'power2.inOut' }, 0.36);
            } else if (kind === 'dev') {
                tl.fromTo(q('.pt-boot'), { yPercent: -101 }, { yPercent: 0, duration: 0.3, ease: 'power3.inOut' });
                tl.fromTo(q('.pt-boot-grid'), { opacity: 0 }, { opacity: 1, duration: 0.24 }, 0.1);
                tl.fromTo(q('.pt-label-dev'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.22, ease: 'steps(12)' }, 0.14);
            } else if (kind === 'home') {
                tl.fromTo(q('.pt-door-l'), { xPercent: -101 }, { xPercent: 0, duration: 0.28, ease: 'power3.inOut' });
                tl.fromTo(q('.pt-door-r'), { xPercent: 101 }, { xPercent: 0, duration: 0.28, ease: 'power3.inOut' }, 0);
                tl.fromTo(q('.pt-crown path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.22, ease: 'power2.out' }, 0.14);
                tl.fromTo(q('.pt-crown'), { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' }, 0.14);
            } else {
                tl.fromTo(q('.pt-fade'), { opacity: 0 }, { opacity: 1, duration: 0.25 });
            }
            return tl;
        };

        const reveal = (kind) => {
            const tl = gsap.timeline();
            if (kind === 'marketer') {
                tl.to(q('.pt-mk'), { x: 60, opacity: 0, duration: 0.14, ease: 'power2.in' });
                tl.to(q('.pt-sweep'), { xPercent: 101, duration: 0.3, ease: 'power3.inOut' }, 0.02);
            } else if (kind === 'dev') {
                tl.to(q('.pt-label-dev'), { opacity: 0, duration: 0.14 });
                tl.to(q('.pt-boot'), { yPercent: 101, duration: 0.32, ease: 'power3.inOut' }, 0.02);
            } else if (kind === 'home') {
                tl.to(q('.pt-crown'), { opacity: 0, duration: 0.14 });
                tl.to(q('.pt-door-l'), { xPercent: -101, duration: 0.34, ease: 'power4.inOut' }, 0.02);
                tl.to(q('.pt-door-r'), { xPercent: 101, duration: 0.34, ease: 'power4.inOut' }, 0.02);
            } else {
                tl.to(q('.pt-fade'), { opacity: 0, duration: 0.3 });
            }
            return tl;
        };

        const go = async (to, path) => {
            busy.current = true;
            speed = 1;
            const kind = kindFor(path);
            root.dataset.kind = kind;
            gsap.set(root, { autoAlpha: 1 });
            gsap.set(q('.pt-label-marketer, .pt-label-dev, .pt-crown, .pt-mk'), { clearProps: 'opacity,transform' });
            SKIP_EVENTS.forEach((ev) => window.addEventListener(ev, skip, { passive: true }));
            try {
                const load = LOADERS[path]?.().catch(() => {}) ?? Promise.resolve();
                await Promise.all([run(cover(kind)), load]);
                navigate(to);
                await nextFrame();
                await run(reveal(kind));
            } finally {
                SKIP_EVENTS.forEach((ev) => window.removeEventListener(ev, skip));
                gsap.set(root, { autoAlpha: 0 });
                current = null;
                busy.current = false;
            }
        };

        const onClick = (e) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
            if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download') || 'noTransition' in a.dataset) return;
            const url = new URL(a.href, window.location.href);
            if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
            if (prefersReducedMotion() || document.documentElement.dataset.intro) return;
            e.preventDefault();
            e.stopPropagation();
            if (busy.current) return;
            go(url.pathname + url.search + url.hash, url.pathname);
        };

        document.addEventListener('click', onClick, true);
        return () => {
            document.removeEventListener('click', onClick, true);
            SKIP_EVENTS.forEach((ev) => window.removeEventListener(ev, skip));
        };
    }, [navigate]);

    return (
        <div ref={rootRef} className="pt" aria-hidden="true">
            {/* to Nate the Marketer */}
            <div className="pt-sweep">
                <div className="pt-streak" />
                <div className="pt-mk">
                    <div className="pt-search">
                        <Search size={18} className="text-white/45 shrink-0" />
                        <span className="pt-search-text">who should I call near me</span>
                    </div>
                    <div className="pt-answer">
                        <span className="pt-answer-glow" />
                        <span className="pt-check"><Check size={14} strokeWidth={3.2} /></span>
                        Your business
                    </div>
                    <span className="pt-label-marketer drama-text">Nate the Marketer</span>
                </div>
            </div>
            {/* to Nate the Dev */}
            <div className="pt-boot">
                <div className="pt-boot-grid" />
                <span className="pt-label-dev">
                    &gt; Nate the Dev<span className="caret">_</span>
                </span>
            </div>
            {/* back home */}
            <div className="pt-door pt-door-l" />
            <div className="pt-door pt-door-r" />
            <Crown className="pt-crown" />
            {/* anywhere else */}
            <div className="pt-fade" />
        </div>
    );
}
