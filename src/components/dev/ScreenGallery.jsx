import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BUILDS } from '../../data/builds';
import CTAButton from '../motion/CTAButton';

gsap.registerPlugin(ScrollTrigger);

// Every build on a desktop and on a phone, in one long row. On a desktop with
// motion allowed, the section pins and the vertical scroll drives the row
// sideways. Everywhere else it is a plain swipeable row, so nothing is ever
// out of reach.
const SHOTS = BUILDS.flatMap((b) => [
    { src: `/work/${b.img}.jpg`, kind: 'desktop', alt: `${b.name} website, desktop view`, caption: `${b.short}, on a desktop.` },
    { src: `/work/${b.img}-phone.jpg`, kind: 'phone', alt: `${b.name} website, phone view`, caption: `${b.short}, on a phone.` },
]);

const HEIGHT = 'h-[230px] sm:h-[300px] lg:h-[50vh]';

export default function ScreenGallery({ onBook }) {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const barRef = useRef(null);

    useLayoutEffect(() => {
        // The screenshots sit off to the right, so the browser's lazy loading
        // only fetches each one as it slides toward the screen, and on a slow
        // connection it can pop in mid-slide. Start them all once the section
        // is about a screen away instead.
        const imgs = Array.from(sectionRef.current.querySelectorAll('img'));
        const warm = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 200%',
            once: true,
            onEnter: () => imgs.forEach((img) => { img.loading = 'eager'; }),
        });

        const mm = gsap.matchMedia();
        mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
            const track = trackRef.current;
            const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
            gsap.to(track, {
                x: () => -distance(),
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: () => `+=${distance()}`,
                    pin: true,
                    scrub: 0.6,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
                    },
                },
            });
        });
        return () => {
            warm.kill();
            mm.revert();
        };
    }, []);

    return (
        <section data-noseam ref={sectionRef} aria-label="My builds on desktop and phone" className="relative overflow-hidden py-14 lg:py-0 lg:h-[100dvh] lg:flex lg:flex-col lg:justify-center">
            <div ref={trackRef} className="gallery-track flex items-end gap-6 lg:gap-12 w-full px-5 sm:px-6 lg:px-[8vw] scroll-px-5 sm:scroll-px-6 pb-2">
                <div className="shrink-0 w-[80vw] sm:w-[380px] lg:w-[400px] self-center lg:pr-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-accent mb-4">Desktop and phone</p>
                    <h2 data-reveal="lines" className="text-4xl sm:text-5xl lg:text-6xl font-sans font-medium tracking-tight text-white leading-[1.02] mb-5">
                        Same job on <span className="drama-text text-brand-accent">every screen.</span>
                    </h2>
                    <p data-reveal className="text-white/50 text-base sm:text-lg font-light leading-relaxed">
                        On a desktop, and on the phone most customers actually use.
                    </p>
                    <p className="hidden lg:block mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">Keep scrolling &rarr;</p>
                </div>

                {SHOTS.map((s) => (
                    <figure key={s.src} className="shrink-0">
                        {s.kind === 'desktop' ? (
                            <div className={`${HEIGHT} aspect-[16/11] flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#15151A] shadow-[0_30px_80px_rgba(0,0,0,0.5)]`}>
                                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06] shrink-0">
                                    <span className="w-2 h-2 rounded-full bg-white/15" />
                                    <span className="w-2 h-2 rounded-full bg-white/15" />
                                    <span className="w-2 h-2 rounded-full bg-white/15" />
                                </div>
                                <img src={s.src} alt={s.alt} loading="lazy" decoding="async" className="block w-full flex-1 min-h-0 object-cover object-top" />
                            </div>
                        ) : (
                            <div className={`${HEIGHT} aspect-[390/800] rounded-[1.4rem] overflow-hidden border-[4px] border-[#2A2A35] bg-black shadow-[0_30px_80px_rgba(0,0,0,0.55)]`}>
                                <img src={s.src} alt={s.alt} loading="lazy" decoding="async" className="block w-full h-full object-cover object-top" />
                            </div>
                        )}
                        <figcaption className="mt-4 inline-block rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] text-white/45">
                            {s.caption}
                        </figcaption>
                    </figure>
                ))}

                <div className="shrink-0 w-[72vw] sm:w-[340px] lg:w-[380px] self-center flex flex-col items-start gap-6 lg:pl-4">
                    <p className="text-2xl sm:text-3xl font-light text-white leading-tight">
                        Want one like these?
                    </p>
                    <CTAButton size="md" onClick={onBook}>Book a 15-Minute Call</CTAButton>
                </div>
            </div>

            {/* How far along the row the visitor is */}
            <div aria-hidden="true" className="hidden lg:motion-safe:block absolute left-[8vw] right-[8vw] bottom-10 h-px bg-white/10">
                <div ref={barRef} className="h-full origin-left bg-brand-accent" style={{ transform: 'scaleX(0)' }} />
            </div>
        </section>
    );
}
