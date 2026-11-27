import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEOHead from '../components/SEOHead';
import SystemBrainHero from '../components/hero/SystemBrainHero';
import CrownSystem from '../components/crown/CrownSystem';
import { prefersReducedMotion } from '../lib/motion';

// The standalone One Brain experience, alongside the Marketer and Developer pages.
// Its complete tool-to-brain scroll story stays together on /one-brain.
export default function OneBrainPage() {
    const { hash, key } = useLocation();
    const mounted = useRef(false);
    useEffect(() => {
        const firstVisit = !mounted.current;
        if (!hash) { mounted.current = true; return; }
        let frame = 0;
        let nextFrame = 0;
        let cancelled = false;
        // The hero measures the services stop during layout. Wait for that
        // measurement before a deep link scrolls into its pinned sequence.
        const align = () => {
            if (cancelled) return;
            cancelAnimationFrame(frame);
            cancelAnimationFrame(nextFrame);
            frame = requestAnimationFrame(() => {
                nextFrame = requestAnimationFrame(() => {
                    if (cancelled) return;
                    mounted.current = true;
                    const target = document.getElementById(hash.slice(1));
                    const details = target?.closest('details');
                    if (details && !details.open) details.open = true;
                    target?.scrollIntoView({
                        behavior: firstVisit || prefersReducedMotion() ? 'instant' : 'smooth',
                        block: 'start',
                    });
                });
            });
        };
        // On a direct visit, browser restoration and the first scroll-layout
        // refresh can run after React mounts. Align once more after those
        // events, unless the visitor has already started moving themselves.
        const stop = () => { cancelled = true; };
        const afterRefresh = () => { ScrollTrigger.removeEventListener('refresh', afterRefresh); align(); };
        if (firstVisit) {
            window.addEventListener('load', align, { once: true });
            ScrollTrigger.addEventListener('refresh', afterRefresh);
            window.addEventListener('wheel', stop, { once: true, passive: true });
            window.addEventListener('touchstart', stop, { once: true, passive: true });
            window.addEventListener('keydown', stop, { once: true });
        }
        align();
        return () => {
            cancelled = true;
            cancelAnimationFrame(frame); cancelAnimationFrame(nextFrame);
            window.removeEventListener('load', align);
            ScrollTrigger.removeEventListener('refresh', afterRefresh);
            window.removeEventListener('wheel', stop);
            window.removeEventListener('touchstart', stop);
            window.removeEventListener('keydown', stop);
        };
    }, [hash, key]);
    return <>
        <SEOHead
            title="One Brain | AI Automation Kings"
            description="I build one AI brain for your business: AI automation, custom AI agents, CRM and sales automation, connections to your tools, and team training. Houston, TX."
            canonical="https://aiautomationkings.com/one-brain"
        />
        <SystemBrainHero />
        <nav className="brain-page-nav" aria-label="One Brain chapters">
            {[
                ['#crown-workflow', 'Examples'], ['#work', 'My work'], ['#partnership', 'Partner'],
                ['#crown-build', 'Build'], ['#crown-questions', 'Questions'],
            ].map(([to, label]) => <Link key={to} to={to} aria-current={hash === to ? 'location' : undefined}>{label}</Link>)}
        </nav>
        <CrownSystem />
    </>;
}
