import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Native scrolling supplies the progress. Nothing captures a swipe or hides copy.
export function useHomeMotion(rootRef) {
    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const media = gsap.matchMedia();
        media.add({
            phone: '(max-width: 767px)',
            tall: '(min-height: 740px)',
            reduced: '(prefers-reduced-motion: reduce)',
        }, ({ conditions }) => {
            if (conditions.reduced) return;
            root.classList.add('has-home-motion');
            if (conditions.phone) root.classList.add('is-mobile-motion');
            if (conditions.phone && conditions.tall) root.classList.add('has-mobile-stack');

            root.querySelectorAll('.ux-proof-image img').forEach(image => {
                gsap.fromTo(image, { scale: conditions.phone ? 1.08 : 1.05 }, {
                    scale: 1, ease: 'none',
                    scrollTrigger: { trigger: image.closest('li'), start: 'top bottom', end: 'bottom 35%', scrub: .35 },
                });
            });

            // Trace each real project as it passes through the reading area.
            // Measure only on resize; scrolling animates strokes and transforms.
            const projects = [...root.querySelectorAll('.ux-proof-grid > li > a')];
            const measure = () => projects.forEach(project => {
                const outline = project.querySelector('.ux-proof-trace rect');
                outline?.setAttribute('width', Math.max(0, project.clientWidth - 2));
                outline?.setAttribute('height', Math.max(0, project.clientHeight - 2));
            });
            const resize = new ResizeObserver(measure);
            projects.forEach(project => {
                resize.observe(project);
                gsap.fromTo(project.querySelector('.ux-proof-trace rect'), { strokeDashoffset: 1 }, {
                    strokeDashoffset: 0, ease: 'none',
                    scrollTrigger: { trigger: project, start: 'top 92%', end: 'bottom 46%', scrub: .35 },
                });
                gsap.timeline({ scrollTrigger: { trigger: project, start: 'top 92%', end: 'bottom 15%', scrub: .35 } })
                    .fromTo(project, { '--proof-light': 0 }, { '--proof-light': 1, duration: .45, ease: 'none' })
                    .to(project, { '--proof-light': 0, duration: .55, ease: 'none' });
                gsap.fromTo(project.querySelector('.ux-proof-copy h3 svg'), { x: -3, y: 3 }, {
                    x: 1, y: -1, ease: 'none',
                    scrollTrigger: { trigger: project, start: 'top 85%', end: 'center 50%', scrub: .3 },
                });
            });
            measure();

            if (conditions.phone && conditions.tall) {
                const cards = [...root.querySelectorAll('.ux-service-card')];
                cards.slice(0, -1).forEach((card, index) => {
                    gsap.to(card, {
                        scale: .95, transformOrigin: 'center top', ease: 'none',
                        scrollTrigger: {
                            trigger: cards[index + 1], start: `top ${270 + index * 12}px`,
                            end: `top ${116 + index * 12}px`, scrub: .3,
                        },
                    });
                });
            }

            // On larger screens, draw the existing connection between the two
            // partners as their shared implementation story comes into view.
            if (!conditions.phone) {
                root.querySelectorAll('.pp-connection > span').forEach((line, index) => {
                    gsap.fromTo(line, { scaleX: 0, transformOrigin: index === 0 ? 'left' : 'right' }, {
                        scaleX: 1, ease: 'none',
                        scrollTrigger: { trigger: line.closest('.pp-stage'), start: 'top 80%', end: 'center 55%', scrub: .4 },
                    });
                });
            }

            // Switching examples replaces the list. Rebind just this sequence,
            // releasing the previous triggers rather than retaining detached nodes.
            const demo = root.querySelector('.ux-workflow-demo');
            let flowContext;
            const bindFlow = () => {
                flowContext?.revert();
                flowContext = gsap.context(() => {
                    demo?.querySelectorAll('.ux-example-flow > li').forEach(step => {
                        gsap.fromTo(step, { '--flow-progress': 0 }, {
                            '--flow-progress': 1, ease: 'none',
                            scrollTrigger: { trigger: step, start: 'top 78%', end: 'bottom 48%', scrub: .25 },
                        });
                        const icon = step.querySelector('.ux-example-icon');
                        gsap.fromTo(icon, { scale: .92 }, {
                            scale: 1, ease: 'none',
                            scrollTrigger: { trigger: step, start: 'top 78%', end: 'top 55%', scrub: .25 },
                        });
                    });
                }, root);
            };
            bindFlow();
            const observer = new MutationObserver(bindFlow);
            if (demo) observer.observe(demo, { childList: true });

            return () => {
                resize.disconnect();
                observer.disconnect();
                flowContext?.revert();
                root.classList.remove('has-home-motion', 'is-mobile-motion', 'has-mobile-stack');
            };
        }, root);
        return () => media.revert();
    }, [rootRef]);
}
