import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// No result numbers here on purpose. Nobody controls a ranking position or a
// placement in an AI answer, so every tile describes what gets built and run,
// not what it will return.
const INCLUDED = [
    { stat: 'Readable', label: 'Site built for the engines that answer', context: 'Not just for a search box' },
    { stat: 'Every page', label: 'Written for how people ask now', context: 'Questions, not keywords' },
    { stat: '24/7', label: 'Every call picked up', context: 'Nights, weekends, holidays' },
    { stat: 'Every job', label: 'Ends with a review request', context: 'Same ask to every customer' },
    { stat: 'One place', label: 'Calls, texts, reviews, bookings', context: 'One login, not five tools' },
    { stat: 'Monthly', label: 'A report in plain English', context: 'What moved and what did not' },
];

export default function WhatYouGet() {
    const sectionRef = useRef(null);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = gsap.context(() => {
            gsap.from('.results-header', {
                y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
            });
            gsap.from('.result-card', {
                y: 40, opacity: 0, scale: 0.95, duration: 0.6, stagger: 0.1, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-20 sm:py-28 md:py-36 px-5 sm:px-6 md:px-8 bg-[#0A0A0E] overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 sm:mb-16">
                    <span className="results-header block text-brand-accent tracking-[0.2em] text-xs font-semibold uppercase mb-4">
                        What you get
                    </span>
                    <h3 className="results-header text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight max-w-2xl">
                        Everything except <span className="drama-text text-brand-accent">the work itself.</span>
                    </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                    {INCLUDED.map((r) => (
                        <div key={r.label} className="result-card bg-[#15151A] border border-white/5 rounded-2xl p-5 sm:p-6 text-center">
                            <p className="text-lg sm:text-xl font-semibold text-white mb-2">{r.stat}</p>
                            <p className="text-white/60 text-xs sm:text-sm leading-snug mb-2">{r.label}</p>
                            <p className="text-white/30 text-[10px] uppercase tracking-wider">{r.context}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
