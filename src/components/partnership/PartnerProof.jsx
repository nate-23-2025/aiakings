import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, ArrowUpRight, Cloud, Instagram, Network, ShieldCheck } from 'lucide-react';
import { KEN_INSTAGRAM } from '../../data/socialLinks';
import { PARTNER, PARTNER_REFERENCES, PARTNER_TECHNOLOGIES } from '../../data/partnerProof';
import { useCalModal } from '../../context/CalModalContext';
import './partner-proof.css';

function SourceLink({ href, children, className = '' }) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}<ArrowUpRight size={15} aria-hidden="true" /></a>;
}

export default function PartnerProof({ compact = false }) {
    const root = useRef(null);
    const bridge = useRef(null);
    const { openCalModal } = useCalModal();

    useLayoutEffect(() => {
        const mm = gsap.matchMedia();
        mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
            gsap.fromTo(bridge.current, { rotationX: 9, y: 30 }, {
                rotationX: 0, y: 0, ease: 'none',
                scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'center 65%', scrub: .5 },
            });
        });
        return () => mm.revert();
    }, []);

    return <section id="partnership" ref={root} className={`partner-proof ${compact ? 'is-compact' : ''}`} aria-labelledby="partner-proof-title">
        <div className="pp-heading">
            <div><span className="pp-eyebrow">WORKING WITH COMPUSOLUTIONX</span><h2 id="partner-proof-title">Partners in AI implementation.<br /><span className="drama-text">With the technical understanding behind it.</span></h2></div>
            <p>Ken Akiri at CompuSolutionX is my partner in AI implementation. He is an IT expert with the technical understanding behind the work, and he now uses AI to build robust systems faster.</p>
        </div>

        <div className="pp-stage">
            <div className="pp-stage-grid" aria-hidden="true" />
            <div className="pp-bridge" ref={bridge}>
                <div className="pp-identity pp-aiak"><span className="pp-identity-label">AIA KINGS</span><span className="pp-wordmark drama-text">AIA Kings</span><p>AI agents &amp; implementation</p></div>
                <div className="pp-connection" aria-hidden="true"><span /><div><Network size={25} strokeWidth={1.2} /></div><span /></div>
                <div className="pp-identity pp-compux"><span className="pp-identity-label">COMPUSOLUTIONX</span><SourceLink href={PARTNER.website} className="pp-partner-logo"><img src="/brands/partners/compusolutionx.png" alt="CompuSolutionX" width="400" height="90" loading="lazy" decoding="async" /></SourceLink><p>IT expertise &amp; AI implementation</p></div>
            </div>
            <div className="pp-credentials"><a href={PARTNER.history} target="_blank" rel="noopener noreferrer"><b>2002</b><span>CompuSolutionX founded<ArrowUpRight size={12} /></span></a><div><b>Ken Akiri</b><span>Founder, CompuSolutionX</span><a href={KEN_INSTAGRAM.href} target="_blank" rel="noopener noreferrer" aria-label={`Ken Akiri on Instagram, ${KEN_INSTAGRAM.handle}`} className="site-social-link pp-social-link"><Instagram size={16} aria-hidden="true" />{KEN_INSTAGRAM.handle}</a></div><div className="pp-capabilities"><span><Cloud size={16} />Cloud</span><span><ShieldCheck size={16} />Security</span><span><Network size={16} />Connected tools</span></div></div>
        </div>

        <div className="pp-recognition" aria-labelledby="partner-recognition-title">
            <div className="pp-recognition-heading"><div><span className="pp-eyebrow">PARTNER RECOGNITION</span><h3 id="partner-recognition-title">References from CompuSolutionX.</h3></div><p>CompuSolutionX displays these badges on its website. Each links to the original reference.</p></div>
            <ul className="pp-recognition-list">{PARTNER_REFERENCES.map(reference => <li key={reference.name}><SourceLink href={reference.source} className="pp-recognition-link"><div className="pp-recognition-art"><img src={`/brands/partners/${reference.image}`} alt="" width="240" height="120" loading="lazy" decoding="async" /></div><div className="pp-recognition-caption"><b>{reference.name}</b><span>{reference.detail} · CompuSolutionX</span><small>View source<ArrowUpRight size={13} aria-hidden="true" /></small></div></SourceLink></li>)}</ul>
        </div>

        <div className="pp-evidence-grid">
            <article className="pp-evidence" aria-labelledby="partner-profile-title">
                <span className="pp-evidence-kind">FOUNDER PROFILE / OCTOBER 2021</span>
                <div className="pp-publication">SHOUTOUT <span>HTX</span></div>
                <h3 id="partner-profile-title">Meet the person behind CompuSolutionX.</h3>
                <p>In his published interview, Kenneth Akiri describes starting CompuSolutionX in Houston and building its IT consulting business.</p>
                <SourceLink href={PARTNER.interview} className="pp-source-link">Read Ken’s interview</SourceLink>
            </article>
            <article className="pp-evidence pp-client-credit" aria-labelledby="partner-client-title">
                <span className="pp-evidence-kind">CLIENT-SIDE WEBSITE CREDIT</span>
                <div className="pp-client-heading"><img src="/brands/partners/diamond-dialysis.png" alt="" width="60" height="60" loading="lazy" decoding="async" /><div><h3 id="partner-client-title">Diamond Dialysis</h3><span>Healthcare / Houston area</span></div></div>
                <p>Diamond Dialysis names Kenneth Akiri and CompuSolutionX as the contact for technical assistance with its website.</p>
                <SourceLink href={PARTNER.clientCredit} className="pp-source-link">See the website credit</SourceLink>
            </article>
        </div>

        <div className="pp-technology">
            <div className="pp-technology-heading"><span>PLATFORMS REFERENCED BY COMPUSOLUTIONX</span><SourceLink href={PARTNER.website}>View technology references</SourceLink></div>
            <ul aria-label="Software platforms referenced on CompuSolutionX’s website">{PARTNER_TECHNOLOGIES.map(technology => <li key={technology.name}><div className={`pp-technology-mark is-${technology.mark}`}><img src={`/brands/partners/${technology.image}`} alt="" width="144" height="48" loading="lazy" decoding="async" /></div><span>{technology.name}</span></li>)}</ul>
        </div>

        <div className="pp-footnote"><p>This experience belongs to CompuSolutionX. I agree the team, responsibilities, and access with you for your project.</p>{compact ? <Link to="/one-brain#partnership" className="pp-project-link">Explore the partnership<ArrowRight size={16} /></Link> : <button type="button" className="pp-project-link" onClick={() => openCalModal('developer')}>Discuss your AI project<ArrowRight size={16} /></button>}</div>
    </section>;
}
