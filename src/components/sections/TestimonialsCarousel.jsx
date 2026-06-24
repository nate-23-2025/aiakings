import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RESULTS = [
    { stat: '7.5 hrs', label: 'Admin eliminated per client', context: 'Professional services firm' },
    { stat: '12 steps', label: 'Client lifecycle fully automated', context: 'Professional services firm' },
    { stat: '6 figures', label: 'Projected annual ROI', context: 'From time savings alone' },
    { stat: '5 min/day', label: 'Owner daily routine (was all-manual)', context: 'Local service business' },
    { stat: '60 sec', label: 'Missed call auto-response', context: 'AI receptionist' },
    { stat: '6+ weeks', label: 'System runs unattended', context: 'Designed for zero maintenance' },
];

export default function TestimonialsCarousel() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.results-header',
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
                }
            );
            gsap.fromTo('.result-card',
                { y: 40, opacity: 0, scale: 0.95 },
                {
                    y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 sm:py-32 md:py-40 px-6 md:px-8 bg-[#0A0A0E] overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 sm:mb-16 md:mb-20">
                    <span className="results-header block text-brand-accent tracking-[0.2em] text-xs font-semibold uppercase mb-4">
                        Results
                    </span>
                    <h3 className="results-header text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight max-w-2xl">
                        What I've <span className="drama-text text-brand-accent">built.</span>
                    </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                    {RESULTS.map((r) => (
                        <div key={r.label} className="result-card bg-[#15151A] border border-white/5 rounded-2xl p-5 sm:p-6 text-center">
                            <p className="text-2xl sm:text-3xl font-semibold text-white mb-2">{r.stat}</p>
                            <p className="text-white/60 text-xs sm:text-sm leading-snug mb-2">{r.label}</p>
                            <p className="text-white/30 text-[10px] uppercase tracking-wider">{r.context}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
