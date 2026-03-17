import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
    {
        id: 1,
        name: 'Marcus Chen',
        title: 'VP of Sales',
        company: 'Apex Logistics',
        quote: 'We went from 3 meetings a month to 18 — all inbound-quality leads booked directly on our calendar. The AI outbound system paid for itself in week two.',
    },
    {
        id: 2,
        name: 'Sarah Mitchell',
        title: 'CEO',
        company: 'BrightPath Consulting',
        quote: 'Our support agent handles 80% of inbound queries without human intervention. Clients don\'t even realize they\'re talking to AI until we tell them.',
    },
    {
        id: 3,
        name: 'David Okonkwo',
        title: 'Founder',
        company: 'NovaTech Solutions',
        quote: 'AIA Kings didn\'t just build us a cold email system — they engineered an entire pipeline machine. 10K emails a month, 37% open rates, zero manual work.',
    },
    {
        id: 4,
        name: 'Rachel Torres',
        title: 'Head of Growth',
        company: 'Meridian Health',
        quote: 'We replaced two full-time SDRs with their GTM engine. Lower cost, higher quality meetings, and the system gets smarter every week.',
    },
];

export default function TestimonialsCarousel() {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const autoPlayRef = useRef(null);

    const total = TESTIMONIALS.length;

    const goTo = useCallback((index) => {
        const next = ((index % total) + total) % total;
        setCurrent(next);
    }, [total]);

    const next = useCallback(() => goTo(current + 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1), [current, goTo]);

    // Auto-advance
    useEffect(() => {
        if (isPaused) return;
        autoPlayRef.current = setInterval(() => {
            setCurrent((c) => (c + 1) % total);
        }, 5000);
        return () => clearInterval(autoPlayRef.current);
    }, [isPaused, total]);

    // Animate slide transitions
    useEffect(() => {
        if (!trackRef.current) return;
        gsap.to(trackRef.current, {
            x: `-${current * 100}%`,
            duration: 0.6,
            ease: 'power3.out',
        });
    }, [current]);

    // Section entrance animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.testimonials-header',
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
                }
            );
            gsap.fromTo('.testimonials-body',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const getInitials = (name) =>
        name.split(' ').map((n) => n[0]).join('').toUpperCase();

    return (
        <section ref={sectionRef} className="py-24 sm:py-32 md:py-40 px-6 md:px-8 bg-[#0A0A0E] overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 sm:mb-16 md:mb-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div>
                        <span className="testimonials-header block text-brand-accent tracking-[0.2em] text-xs font-semibold uppercase mb-4">
                            Testimonials
                        </span>
                        <h3 className="testimonials-header text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight max-w-2xl">
                            What our clients <span className="drama-text text-brand-accent">say.</span>
                        </h3>
                    </div>

                    {/* Navigation arrows — desktop */}
                    <div className="hidden sm:flex items-center gap-3 testimonials-header">
                        <button
                            onClick={prev}
                            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-brand-accent/40 transition-all duration-300"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={next}
                            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-brand-accent/40 transition-all duration-300"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Carousel */}
                <div
                    className="testimonials-body relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Track */}
                    <div className="overflow-hidden">
                        <div
                            ref={trackRef}
                            className="flex"
                            style={{ width: `${total * 100}%` }}
                        >
                            {TESTIMONIALS.map((t) => (
                                <div
                                    key={t.id}
                                    className="px-2 sm:px-3"
                                    style={{ width: `${100 / total}%` }}
                                >
                                    <div className="bg-[#15151A] border border-white/5 rounded-[2rem] p-8 sm:p-10 h-full flex flex-col">
                                        {/* Quote icon */}
                                        <Quote size={32} className="text-brand-accent/30 mb-6 shrink-0" />

                                        {/* Quote text */}
                                        <p className="text-white/80 text-base sm:text-lg leading-relaxed font-light flex-grow mb-8">
                                            "{t.quote}"
                                        </p>

                                        {/* Author */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center shrink-0">
                                                <span className="text-brand-accent text-sm font-semibold">
                                                    {getInitials(t.name)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm">{t.name}</p>
                                                <p className="text-white/40 text-xs">
                                                    {t.title}, {t.company}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dot indicators */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        {TESTIMONIALS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    i === current
                                        ? 'bg-brand-accent w-6'
                                        : 'bg-white/20 hover:bg-white/40'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Mobile arrows */}
                    <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
                        <button
                            onClick={prev}
                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 active:scale-95 transition-transform"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={next}
                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 active:scale-95 transition-transform"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
