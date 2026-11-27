import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { track } from '@vercel/analytics';
import { useCalModal } from '../context/CalModalContext';
import { useReveal } from '../hooks/useReveal';
import { prefersReducedMotion } from '../lib/motion';
import SEOHead from '../components/SEOHead';
import CTAButton from '../components/motion/CTAButton';
import BeamRing from '../components/motion/BeamRing';
import HeroGlow from '../components/motion/HeroGlow';
import MeetNate from '../components/sections/MeetNate';
import PartnerProof from '../components/partnership/PartnerProof';
import CallSteps from '../components/sections/CallSteps';
import { HomeProof, HomeServices, HomeWorkflow } from '../components/sections/HomeOverview';
import { SITE_LINKS } from '../data/siteNavigation';

const CALL_STEPS = [
    { n: '1', title: 'Tell me what you need', body: 'A website, a repeated task, or work that needs connecting. Start with the problem.' },
    { n: '2', title: 'I work through it with you', body: 'I ask about your team, your tools, and what a useful result would look like.' },
    { n: '3', title: 'Leave with a clear next step', body: 'If I can help, I explain the work involved. If I cannot, I tell you straight.' },
];

export default function MainLandingPage() {
    const rootRef = useRef(null);
    const heroRef = useRef(null);
    const { openCalModal } = useCalModal();
    useReveal(rootRef);

    useEffect(() => {
        const mm = gsap.matchMedia();
        mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
            const st = { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true };
            gsap.to('[data-hero-content]', { y: 60, opacity: 0.3, scale: 0.98, ease: 'none', scrollTrigger: st });
            gsap.to('[data-hero-bg]', { y: 120, ease: 'none', scrollTrigger: st });
        });
        return () => mm.revert();
    }, []);

    const seeServices = e => {
        e.preventDefault();
        document.getElementById('services-overview')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    };

    return <div ref={rootRef} className="seams ux-home min-h-screen text-brand-background">
        <SEOHead title="AIA Kings | Websites, Search, and Custom AI" description="I build websites that help customers find you and AI systems that help your team get work done. Explore Websites & Search, Custom AI Development, and One Brain. Houston, Texas." canonical="https://aiautomationkings.com/" />
        <section id="home-overview" ref={heroRef} className="ux-home-hero">
            <div data-hero-bg className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="aurora-blob aurora-blob-1 absolute w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(201,168,76,.14), transparent 70%)', top: '-20%', right: '-10%' }} />
                <div className="aurora-blob aurora-blob-2 absolute w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(91,123,213,.14), transparent 70%)', bottom: '-25%', left: '-10%' }} />
            </div>
            <HeroGlow />
            <div data-hero-content className="ux-home-hero-copy">
                <p className="ux-eyebrow focus-in">WEBSITES, SEARCH, AND CUSTOM AI</p>
                <h1 className="focus-in" style={{ '--d': '.06s' }}>Get found. Get booked.<br /><span className="drama-text">Get your time back.</span></h1>
                <p className="ux-home-lede focus-in" style={{ '--d': '.14s' }}>I build websites that help customers find you and AI systems that help your team get work done.</p>
                <div className="ux-home-actions focus-in" style={{ '--d': '.22s' }}>
                    <CTAButton onClick={openCalModal} glint>Book a Call</CTAButton>
                    <a href="#services-overview" onClick={seeServices} className="ux-text-link">Explore services<ArrowDown size={16} /></a>
                </div>
                <p className="ux-home-call-note">Tell me what you need. I will help you find a useful place to start.</p>
                <nav className="ux-home-paths" aria-label="Explore services">{SITE_LINKS.map(service => <Link key={service.to} to={service.to} onClick={() => track('service_select', { service: service.label, placement: 'hero' })}>{service.label}<ArrowRight size={14} /></Link>)}</nav>
            </div>
        </section>
        <HomeProof />
        <HomeServices />
        <PartnerProof compact />
        <HomeWorkflow />
        <MeetNate />
        <section className="ux-section ux-home-call" aria-labelledby="home-call-title">
            <div className="ux-call-surface"><BeamRing /><span className="ux-eyebrow">LET'S TALK ABOUT YOUR BUSINESS</span>
                <h2 id="home-call-title">What would you like<br /><span className="drama-text">to work better?</span></h2>
                <p>A short conversation to understand what you need and whether I can help.</p>
                <CallSteps steps={CALL_STEPS} className="mt-9 mb-9" />
                <CTAButton onClick={openCalModal} size="xl" halo glint>Book a Call</CTAButton>
                <a href="mailto:nate@aiautomationkings.com" className="ux-call-email">or email nate@aiautomationkings.com</a>
            </div>
        </section>
    </div>;
}
