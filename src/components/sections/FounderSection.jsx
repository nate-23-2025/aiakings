import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play } from 'lucide-react';
import SignatureDraw from '../features/SignatureDraw';
import { useCalModal } from '../../context/CalModalContext';

gsap.registerPlugin(ScrollTrigger);

// "Meet the Founder":
//  - your ambient video is the full-bleed BACKGROUND.
//  - a LARGE VSL player sits center-right, layered behind the copy (the copy floats
//    over its left edge); click it to play your recorded message with sound.
//  - the diagonal signature is the bottom-left flourish; CTA lives in the copy.
// Background loop: replace FOUNDER_VIDEOS with a single file, e.g. ['/videos/founder.mp4'].
// VSL: drop your recording at /public/videos/vsl.mp4 (poster at /public/images/vsl-poster.jpg).
const FOUNDER_VIDEOS = ['/videos/nate-hero.mp4', '/videos/nate-command-physical.mp4', '/videos/nate-dive-physical.mp4'];
const VSL_SRC = '/videos/vsl.mp4';
const VSL_POSTER = '/images/vsl-poster.jpg';
const CROSSFADE_MS = 900;

export default function FounderSection() {
    const rootRef = useRef(null);
    const videoRefs = useRef([]);
    const vslRef = useRef(null);
    const [active, setActive] = useState(0);
    const activeRef = useRef(0);
    const transitioningRef = useRef(false);
    const [sigOn, setSigOn] = useState(false);
    const [vslPlaying, setVslPlaying] = useState(false);
    const { openCalModal } = useCalModal();

    const advance = useCallback(() => {
        if (transitioningRef.current) return;
        transitioningRef.current = true;
        const next = (activeRef.current + 1) % FOUNDER_VIDEOS.length;
        const el = videoRefs.current[next];
        if (el) { el.currentTime = 0; el.play().catch(() => {}); }
        activeRef.current = next;
        setActive(next);
        setTimeout(() => { transitioningRef.current = false; }, CROSSFADE_MS);
    }, []);

    useEffect(() => { activeRef.current = active; }, [active]);

    useEffect(() => {
        const el = videoRefs.current[active];
        if (!el) return;
        el.play().catch(() => {});
        const triggerAt = 0.6;
        const handler = () => {
            if (el.duration - el.currentTime <= triggerAt) advance();
        };
        el.addEventListener('timeupdate', handler);
        return () => el.removeEventListener('timeupdate', handler);
    }, [active, advance]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.founder-reveal',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out',
                    scrollTrigger: { trigger: rootRef.current, start: 'top 74%' } });
            ScrollTrigger.create({ trigger: rootRef.current, start: 'top 64%', once: true, onEnter: () => setSigOn(true) });
        }, rootRef);
        return () => ctx.revert();
    }, []);

    const playVsl = () => {
        setVslPlaying(true);
        const v = vslRef.current;
        if (v) v.play().catch(() => {});
    };

    return (
        <section ref={rootRef} className="relative flex items-center overflow-hidden py-24 sm:py-28 md:py-32">
            {/* Full-bleed BACKGROUND video */}
            <div aria-hidden className="absolute inset-0">
                {FOUNDER_VIDEOS.map((src, i) => (
                    <video
                        key={src}
                        ref={el => { videoRefs.current[i] = el; }}
                        muted
                        playsInline
                        preload="auto"
                        poster={i === 0 ? '/images/nate-hero-final.jpg' : undefined}
                        src={src}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ objectPosition: '68% 32%', opacity: active === i ? 1 : 0, transition: `opacity ${CROSSFADE_MS}ms ease-in-out` }}
                    />
                ))}
                <div className="absolute inset-0" style={{ background: 'rgba(13,13,18,0.45)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #0D0D12 0%, rgba(13,13,18,0.7) 40%, rgba(13,13,18,0.1) 100%)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0D0D12 0%, transparent 16%), linear-gradient(to top, #0D0D12 0%, transparent 18%)' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-8">
                <div className="relative flex flex-col lg:block lg:min-h-[480px]">

                    {/* LARGE VSL — center-right, layered behind the copy */}
                    <div className="founder-reveal order-2 lg:order-none mt-10 lg:mt-0 w-full lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[64%] z-0">
                        <p className="text-white/45 text-xs uppercase tracking-[0.2em] font-mono mb-3 text-center lg:text-right">A minute from me</p>
                        <div
                            className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/12 shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
                            style={{ background: 'linear-gradient(150deg, #1b1b24 0%, #0c0c11 72%)' }}
                        >
                            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(70% 70% at 50% 42%, rgba(201,168,76,0.12), transparent 68%)' }} />
                            <video
                                ref={vslRef}
                                src={VSL_SRC}
                                poster={VSL_POSTER}
                                controls={vslPlaying}
                                playsInline
                                preload="none"
                                className="absolute inset-0 w-full h-full object-cover bg-transparent"
                            />
                            {!vslPlaying && (
                                <>
                                    <div aria-hidden className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/25 via-black/5 to-black/40" />
                                    <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5 text-white/90 text-[10px] font-mono uppercase tracking-[0.16em]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" /> Watch
                                    </span>
                                    <button onClick={playVsl} aria-label="Play video" className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 group">
                                        <span className="relative flex items-center justify-center">
                                            <span aria-hidden className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-brand-accent/40 animate-ping" style={{ animationDuration: '2.4s' }} />
                                            <span className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-accent/25 border border-brand-accent/50 flex items-center justify-center backdrop-blur-sm group-hover:bg-brand-accent/45 group-hover:scale-110 transition-all duration-300 shadow-[0_0_50px_rgba(201,168,76,0.4)]">
                                                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-brand-accent ml-1" />
                                            </span>
                                        </span>
                                        <span className="text-white text-xs sm:text-sm font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">Watch a minute from me</span>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* signature signs the bottom-right of the VSL, oversized and layered on top */}
                        <div
                            aria-hidden
                            className="hidden lg:block absolute right-[-3%] bottom-[-17%] w-[56%] max-w-[420px] z-10 pointer-events-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]"
                            style={{ transform: 'rotate(-9deg)' }}
                        >
                            <SignatureDraw draw={sigOn} strokeWidth={20} drawDuration={4.4} eraseDuration={1.0} className="w-full h-auto" />
                        </div>
                    </div>

                    {/* COPY — layered in front of the video */}
                    <div className="hero-legible relative z-20 order-1 lg:order-none max-w-xl lg:max-w-[47%] lg:py-6">
                        <div
                            aria-hidden
                            className="hidden lg:block absolute -inset-x-8 -inset-y-10 -z-10 rounded-[2rem]"
                            style={{ background: 'linear-gradient(90deg, #0D0D12 0%, rgba(13,13,18,0.92) 52%, rgba(13,13,18,0) 100%)' }}
                        />
                        <span className="founder-reveal inline-block text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-4">Who builds this</span>
                        <h2 className="founder-reveal text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-6">
                            I don't resell tools. <span className="drama-text text-brand-accent">I build the growth.</span>
                        </h2>
                        <div className="founder-reveal space-y-4 text-white/70 text-base sm:text-lg leading-relaxed">
                            <p>
                                I'm Nate Mamo. I build AI agents around one thing: the biggest return a local business can get. The agents on your calls, your leads, and your reviews are built to book more work and win back the customers you're quietly losing. Not a rented tool. Not a template.
                            </p>
                            <p>
                                I also build custom web apps, web development, and agentic architectures, the same caliber of work I ship as Lead CTO and co-founder of Allen AI. That's fully custom, taken on by request.
                            </p>
                        </div>
                        <p className="founder-reveal text-white/50 text-sm mt-6">
                            Need a build like that?{' '}
                            <Link to="/custom" className="text-brand-accent/90 hover:text-brand-accent underline underline-offset-4 transition-colors">
                                Let's scope it
                            </Link>.
                        </p>
                        <div className="founder-reveal mt-8">
                            <button onClick={openCalModal} className="inline-flex items-center gap-2 bg-brand-accent text-brand-primary font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full hover:scale-[1.03] active:scale-[0.97] transition-transform duration-300 shadow-[0_0_40px_rgba(201,168,76,0.25)]">
                                Book a call with me <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
