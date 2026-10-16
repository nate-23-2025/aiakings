import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCRIPT_VIEWBOX, SCRIPT_BOX, SCRIPT_GLYPHS, CROWN_AT } from './aiaKingsScript';
import { lockScroll, unlockScroll } from '../../lib/scrollLock';

// The intro, once per visit. A small script in index.html decides before the
// first paint (first page of the session, motion allowed) and sets
// data-intro="playing" on <html>, which holds the hero entrance and hides the
// nav logo.
//
// "AIA Kings" is written in calligraphy, letter by letter, as if by a pen: each
// letter's ink is revealed by a thick mask stroke travelling along its outline,
// with a glowing nib riding the point being written. When the last letter is
// down, a crown drops onto the K. A light passes over the word, the screen opens
// like two doors, and the word lifts into the nav where the logo takes over.
// About 2.7 seconds.
//
// The page renders underneath the whole time, so nothing waits on this. Any
// click, key, scroll, or tap fast-forwards it. If anything goes wrong, the
// script in index.html clears the flag after a few seconds anyway.
const SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
const WRITE_S = 1.45;     // the whole word
const MASK_WIDTH = 190;   // font units; wide enough to fill the thickest strokes
const CROWN_SCALE = 17;   // crown is drawn in a 64 x 36 box

export default function IntroOverlay() {
    const [show] = useState(() => typeof document !== 'undefined' && document.documentElement.dataset.intro === 'playing');
    const [gone, setGone] = useState(false);
    const rootRef = useRef(null);

    useLayoutEffect(() => {
        if (!show) return;
        const root = rootRef.current;
        const html = document.documentElement;
        const q = (sel) => root.querySelectorAll(sel);
        let finished = false;

        lockScroll('intro');

        const finish = () => {
            if (finished) return;
            finished = true;
            SKIP_EVENTS.forEach((ev) => window.removeEventListener(ev, skip));
            clearTimeout(safety);
            delete html.dataset.intro;
            unlockScroll('intro');
            setGone(true);
            ScrollTrigger.refresh();
        };

        const tl = gsap.timeline({ onComplete: finish });
        const skip = () => tl.timeScale(5);
        const safety = setTimeout(finish, 6000);

        // 1. The pen writes each letter in turn, at a steady speed, so a long
        //    swash takes longer than a short stroke.
        const guides = Array.from(q('.ink-guide'));
        const lengths = guides.map((p) => p.getTotalLength());
        const total = lengths.reduce((a, b) => a + b, 0);
        const nib = root.querySelector('.ink-nib');
        let at = 0.1;
        guides.forEach((guide, i) => {
            const len = lengths[i];
            const dur = (len / total) * WRITE_S;
            // Hidden until its turn: a round cap on a zero-length dash would
            // otherwise leave a dot where the letter starts.
            gsap.set(guide, { strokeDasharray: len, strokeDashoffset: len, visibility: 'hidden' });
            const state = { p: 0 };
            tl.to(state, {
                p: 1,
                duration: dur,
                ease: 'none',
                onStart: () => { guide.style.visibility = 'visible'; },
                onUpdate: () => {
                    guide.style.strokeDashoffset = len * (1 - state.p);
                    const pt = guide.getPointAtLength(len * state.p);
                    nib.setAttribute('cx', pt.x);
                    nib.setAttribute('cy', pt.y);
                },
            }, at);
            at += dur;
        });
        const written = at;
        tl.fromTo(nib, { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.1);
        tl.to(nib, { opacity: 0, duration: 0.2 }, written - 0.05);

        // 2. The crown drops onto the K, traces itself, and the gem catches light.
        const crown = root.querySelector('.ink-crown');
        tl.fromTo(crown, { y: -1300, rotation: -30, opacity: 0, svgOrigin: `${CROWN_AT.x} ${CROWN_AT.y}` },
            { y: 0, rotation: -12, opacity: 1, duration: 0.5, ease: 'back.out(2.2)' }, written - 0.08);
        tl.fromTo(q('.ink-crown-line'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.42, ease: 'power2.out' }, written - 0.02);
        tl.fromTo(q('.ink-crown-fill'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, written + 0.24);
        tl.fromTo(q('.ink-gem'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.3, ease: 'back.out(4)' }, written + 0.3);
        tl.fromTo(q('.ink-flash'), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1.2, duration: 0.22, ease: 'power2.out' }, written + 0.32);
        tl.to(q('.ink-flash'), { opacity: 0, duration: 0.35 }, written + 0.54);

        // 3. A light passes across the finished word.
        const crowned = written + 0.46;
        const shine = root.querySelector('#ink-shine');
        tl.fromTo(shine, { attr: { x1: -1400, x2: -400 } }, { attr: { x1: 10600, x2: 11600 }, duration: 0.7, ease: 'power2.inOut' }, crowned - 0.15);

        // 4. Light through the seam, the doors open, and the hero starts.
        const open = crowned + 0.3;
        tl.fromTo(q('.intro-seam'), { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.22, ease: 'power2.out' }, open - 0.16);
        tl.add(() => { html.dataset.intro = 'opening'; }, open);
        tl.to(q('.intro-door-l'), { xPercent: -101, duration: 0.65, ease: 'power4.inOut' }, open);
        tl.to(q('.intro-door-r'), { xPercent: 101, duration: 0.65, ease: 'power4.inOut' }, open);
        tl.to(q('.intro-seam'), { opacity: 0, duration: 0.3 }, open + 0.1);

        // 5. The word lifts into the nav, and the logo fades in under it.
        const mark = root.querySelector('.intro-mark');
        const logo = document.getElementById('navbar-logo');
        const m = mark.getBoundingClientRect();
        const l = logo?.getBoundingClientRect();
        if (l && l.width > 0 && m.width > 0) {
            tl.to(mark, {
                x: l.left + l.width / 2 - (m.left + m.width / 2),
                y: l.top + l.height / 2 - (m.top + m.height / 2),
                scale: (l.width / m.width) * 1.15,
                duration: 0.62,
                ease: 'power3.inOut',
            }, open);
            tl.add(() => { html.dataset.intro = 'landing'; }, open + 0.42);
            tl.to(mark, { opacity: 0, duration: 0.2 }, open + 0.44);
        } else {
            tl.to(mark, { opacity: 0, duration: 0.3 }, open + 0.05);
        }

        SKIP_EVENTS.forEach((ev) => window.addEventListener(ev, skip, { passive: true }));

        return () => {
            SKIP_EVENTS.forEach((ev) => window.removeEventListener(ev, skip));
            clearTimeout(safety);
            tl.kill();
            unlockScroll('intro');
        };
    }, [show]);

    if (!show || gone) return null;

    return (
        <div ref={rootRef} className="intro" aria-hidden="true">
            <div className="intro-door intro-door-l" />
            <div className="intro-door intro-door-r" />
            <div className="intro-seam" />
            <div className="intro-center">
                <div className="intro-mark">
                    <svg viewBox={SCRIPT_VIEWBOX} className="intro-script" fill="none">
                        <defs>
                            <linearGradient id="ink-gold" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stopColor="#E7CC7C" />
                                <stop offset="0.55" stopColor="#C9A84C" />
                                <stop offset="1" stopColor="#B08E3A" />
                            </linearGradient>
                            <linearGradient id="ink-shine" gradientUnits="userSpaceOnUse" x1="-1400" y1="0" x2="-400" y2="0" gradientTransform="skewX(-20)">
                                <stop offset="0" stopColor="#FFF6D6" stopOpacity="0" />
                                <stop offset="0.5" stopColor="#FFF6D6" stopOpacity="0.95" />
                                <stop offset="1" stopColor="#FFF6D6" stopOpacity="0" />
                            </linearGradient>
                            <radialGradient id="ink-nib-glow">
                                <stop offset="0" stopColor="#FFF4D2" stopOpacity="1" />
                                <stop offset="0.35" stopColor="#F1DC9B" stopOpacity="0.7" />
                                <stop offset="1" stopColor="#C9A84C" stopOpacity="0" />
                            </radialGradient>
                            {SCRIPT_GLYPHS.map((g, i) => (
                                <mask key={i} id={`ink-mask-${i}`} maskUnits="userSpaceOnUse" {...SCRIPT_BOX}>
                                    <path
                                        className="ink-guide"
                                        d={g.d}
                                        stroke="#fff"
                                        strokeWidth={MASK_WIDTH}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                    />
                                </mask>
                            ))}
                        </defs>

                        {SCRIPT_GLYPHS.map((g, i) => (
                            <path key={i} d={g.d} fill="url(#ink-gold)" mask={`url(#ink-mask-${i})`} />
                        ))}

                        {/* The glint that passes over the finished word */}
                        <g className="ink-shine-layer">
                            {SCRIPT_GLYPHS.map((g, i) => (
                                <path key={i} d={g.d} fill="url(#ink-shine)" />
                            ))}
                        </g>

                        <circle className="ink-nib" r="80" fill="url(#ink-nib-glow)" opacity="0" />

                        {/* The crown, placed over the K in font units */}
                        <g className="ink-crown" opacity="0">
                            <g transform={`translate(${CROWN_AT.x - 32 * CROWN_SCALE} ${CROWN_AT.y - 36 * CROWN_SCALE}) scale(${CROWN_SCALE})`}>
                                <circle className="ink-flash" cx="32" cy="18" r="22" fill="url(#ink-nib-glow)" opacity="0" />
                                <path className="ink-crown-fill" d="M6 27 L10 9 L22 19 L32 4 L42 19 L54 9 L58 27 Z" fill="#C9A84C" fillOpacity="0.22" opacity="0" />
                                <path className="ink-crown-line" d="M6 27 L10 9 L22 19 L32 4 L42 19 L54 9 L58 27 Z" pathLength="1" stroke="#E1C46F" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
                                <path className="ink-crown-line" d="M8 32 H56" pathLength="1" stroke="#E1C46F" strokeWidth="1.7" strokeLinecap="round" style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
                                <circle className="ink-gem" cx="32" cy="4" r="2" fill="#FFF1C4" />
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    );
}
