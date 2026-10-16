import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

// SplitText is fetched the first time a page needs it, after the first paint,
// so it never sits between a visitor and the headline.
let splitTextPromise = null;
const loadSplitText = () => {
    splitTextPromise ??= import('gsap/SplitText').then(({ SplitText }) => {
        gsap.registerPlugin(SplitText);
        return SplitText;
    });
    return splitTextPromise;
};

// One scroll system for every page. Markup opts in with a data attribute, so a
// section never needs an effect of its own:
//
//   data-reveal           fades and rises as it scrolls in
//   data-reveal="lines"   headline rises line by line out of a mask
//   data-reveal="scale"   rises and settles from slightly small (cards)
//   data-reveal-group     direct children rise one after another
//   data-scrub            words light up one at a time as the visitor scrolls
//   data-inview           gets .is-in once on screen, and CSS does the rest
//   data-parallax="60"    drifts that many pixels against the scroll, desktop only
//   data-rise="90"        climbs that many pixels into place as the page runs
//                         out (for things that sit at the very bottom)
//
// Anything revealed also gets .is-in, which is what sets off the gold shimmer
// on the italic phrases. With reduced motion nothing moves: every element is
// marked as already in and renders in its finished state.
//
// Never put data-reveal on an element that carries a CSS transform transition
// (the gold buttons, anything with transition-transform). The CSS transition
// fights the tween and the element can settle in the wrong place. Wrap it.
export function useReveal(rootRef) {
    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const all = (sel) => Array.from(root.querySelectorAll(sel));
        const markIn = (els) => els.forEach((el) => el.classList.add('is-in'));

        if (prefersReducedMotion()) {
            markIn(all('[data-reveal], [data-reveal-group], [data-inview]'));
            return;
        }

        const desktop = window.matchMedia('(min-width: 768px)').matches;
        const blur = desktop ? 'blur(8px)' : 'blur(0px)';

        const ctx = gsap.context(() => {
            const blocks = all('[data-reveal]:not([data-reveal="lines"])');
            if (blocks.length) gsap.set(blocks, { autoAlpha: 0 });
            if (blocks.length) ScrollTrigger.batch(blocks, {
                start: 'top 90%',
                once: true,
                onEnter: (els) => {
                    markIn(els);
                    gsap.fromTo(els,
                        { autoAlpha: 0, y: 32, scale: (i, el) => (el.dataset.reveal === 'scale' ? 0.95 : 1), filter: blur },
                        { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.95, ease: 'power3.out', stagger: 0.09, clearProps: 'transform,filter' },
                    );
                },
            });

            all('[data-reveal-group]').forEach((group) => {
                const kids = Array.from(group.children);
                gsap.set(kids, { autoAlpha: 0 });
                ScrollTrigger.create({
                    trigger: group,
                    start: 'top 86%',
                    once: true,
                    onEnter: () => {
                        markIn([group]);
                        gsap.fromTo(kids,
                            { autoAlpha: 0, y: 40, scale: 0.96, filter: blur },
                            { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,filter' },
                        );
                    },
                });
            });

            // Headlines stay hidden until SplitText arrives a moment later.
            const lines = all('[data-reveal="lines"]');
            if (lines.length) gsap.set(lines, { autoAlpha: 0 });

            const inview = all('[data-inview]');
            if (inview.length) ScrollTrigger.batch(inview, { start: 'top 85%', once: true, onEnter: markIn });

            all('[data-rise]').forEach((el) => {
                const px = parseFloat(el.dataset.rise) || 90;
                gsap.fromTo(el, { y: px, opacity: 0.2 }, {
                    y: 0,
                    opacity: 1,
                    ease: 'none',
                    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: 0.4 },
                });
            });

            if (desktop) {
                all('[data-parallax]').forEach((el) => {
                    const px = parseFloat(el.dataset.parallax) || 60;
                    gsap.fromTo(el, { y: px }, {
                        y: -px,
                        ease: 'none',
                        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
                    });
                });
            }
        }, root);

        let cancelled = false;
        const lines = all('[data-reveal="lines"]');
        const scrubs = all('[data-scrub]');
        if (lines.length || scrubs.length) {
            loadSplitText().then((SplitText) => {
                if (cancelled) return;
                ctx.add(() => {
                    // autoSplit re-splits when the webfont lands or the width
                    // changes, so the lines always match what is on screen.
                    lines.forEach((el) => {
                        gsap.set(el, { autoAlpha: 1 });
                        SplitText.create(el, {
                            type: 'lines',
                            mask: 'lines',
                            linesClass: 'split-line',
                            autoSplit: true,
                            onSplit: (self) => gsap.from(self.lines, {
                                yPercent: 115,
                                duration: 1.1,
                                ease: 'power4.out',
                                stagger: 0.12,
                                scrollTrigger: { trigger: el, start: 'top 88%', once: true, onEnter: () => markIn([el]) },
                            }),
                        });
                    });

                    scrubs.forEach((el) => {
                        const split = SplitText.create(el, { type: 'words', wordsClass: 'scrub-word' });
                        gsap.fromTo(split.words, { opacity: 0.14 }, {
                            opacity: 1,
                            ease: 'none',
                            stagger: 0.1,
                            scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: 0.6 },
                        });
                    });
                });
            });
        }

        return () => {
            cancelled = true;
            ctx.revert();
            all('.is-in').forEach((el) => el.classList.remove('is-in'));
        };
    }, [rootRef]);
}
