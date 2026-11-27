import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight, Network } from 'lucide-react';
import { useCalModal } from '../../context/CalModalContext';
import { canHover, prefersReducedMotion } from '../../lib/motion';
import { SERVICES, TOOLS } from './hero-data';
import PerspectiveTunnel from '../ui/perspective-tunnel';
import LivingBrain from './LivingBrain';
import { PILLARS } from '../crown/crown-data';
import './system-hero.css';

// Adapted from "Scroll Morph Hero" (21st.dev): cards scatter, line up, form a
// ring, then open into an arc that turns card by card. Rebuilt for this site:
// real page scroll drives it (the stage is sticky), so nothing captures the
// wheel; GSAP instead of framer-motion; one loop writes transforms directly
// instead of re-rendering React every frame. The story is ours: twenty AI tools
// form the ring, gather by role into five services, and those same five cards
// travel through the perspective tunnel to reveal one AI brain.

// Card size in CSS pixels at scale 1. Every layout scales from this.
const CARD_W = 150;
const CARD_H = 210;
const N = SERVICES.length;
const FLOW_CARDS = TOOLS.map(tool => {
    const serviceIndex = SERVICES.findIndex(s => s.ringTools.includes(tool.id));
    const group = SERVICES[serviceIndex].ringTools;
    return { tool, serviceIndex, member: group.indexOf(tool.id), groupSize: group.length };
});

// Scroll budget in screen heights while the stage stays pinned.
const MORPH = 0.8;        // ring opens into the arc, tools merge into services
const PER_SERVICE = 0.5;  // scroll between two services
const FINALE = 1.3;       // the five services assemble the living brain
const HOLD = 0.65;        // space to explore its connections
const DIVE = 1.25;        // the camera passes through the brain
const LAND = 0.35;        // the interior resolves before the page continues
const LAST = N - 1;
const SCREENS = MORPH + PER_SERVICE * LAST + FINALE + HOLD + DIVE + LAND;
const P_FOCUS = MORPH / SCREENS;
const P_FINALE = (MORPH + PER_SERVICE * LAST) / SCREENS;
const P_DONE = (MORPH + PER_SERVICE * LAST + FINALE) / SCREENS;
const P_ENTER = (MORPH + PER_SERVICE * LAST + FINALE + HOLD) / SCREENS;
const P_LAND = (SCREENS - LAND) / SCREENS;

const clamp01 = x => Math.max(0, Math.min(1, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = x => { const t = clamp01(x); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

// Seeded, so the scatter is the same on every visit.
function rng(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const SCATTER = (() => { const r = rng(7); return TOOLS.map(() => ({ x: (r() - 0.5) * 1.5, y: (r() - 0.5) * 1.1, rot: (r() - 0.5) * 180 })); })();

// An ellipse of n cards, as large as the screen allows, with the card scale
// reduced until they fit around it with room between them.
function ringFor(w, h, n, sMax) {
    const ry = Math.min(h * 0.36, 330);
    let s = sMax;
    let rx = 0;
    for (let pass = 0; pass < 3; pass++) {
        // The desktop orbit is an ellipse with enough horizontal room for
        // the headline. Tying both radii to height let cards cover the words.
        rx = Math.max(90, Math.min(w * (w < 768 ? 0.5 : 0.35), 440, w / 2 - (CARD_H * s) / 2 - 8));
        const per = (2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2)) / n;
        s = Math.min(sMax, (per * 0.66) / CARD_W);
    }
    return { rx, ry, s };
}

function geometry(w, h) {
    const mobile = w < 768;
    const Ra = Math.min(w, h * 1.5) * (mobile ? 1.4 : 1.1);
    const arcS = mobile ? 0.62 : 0.92;
    const brainY = -h * (mobile ? 0.14 : 0.15);
    return {
        w, h,
        // Everything sits a little below centre so the ring clears the navbar.
        cy: h * (mobile ? 0.015 : 0.025),
        ring: ringFor(w, h, TOOLS.length, mobile ? 0.25 : 0.42),
        Ra, arcS,
        focusS: mobile ? 0.8 : 1.12,
        apexY: h * (mobile ? 0.23 : 0.19),
        step: (CARD_W * arcS * 1.3) / Ra,
        lineGap: Math.max(CARD_W * 0.16, Math.min(CARD_W * 0.42 * 1.18, (w - 40) / TOOLS.length)),
        brainY,
    };
}

function onEllipse(rx, ry, th) {
    const angle = Math.atan2(Math.sin(th) / ry, Math.cos(th) / rx);
    return { x: rx * Math.cos(th), y: ry * Math.sin(th), r: (angle * 180) / Math.PI + 90 };
}

// Rotation b moved by whole turns so it sits within 180 degrees of a, so a card never spins the long way round.
const near = (a, b) => b + 360 * Math.round((a - b) / 360);

function ServiceFace({ service, index }) {
    return <div className="sb-face sb-back sb-service-face">
        <i>{String(index + 1).padStart(2, '0')}</i>
        <small>{service.kicker}</small>
        <div className="sb-service-logos">{service.tools.map(tool => <img key={tool.id} src={tool.logo} alt={tool.name} className={tool.tile ? 'is-tile' : ''} draggable="false" decoding="async" />)}</div>
        <b>{service.name}</b>
    </div>;
}

function ToolFace({ tool }) {
    return <div className="sb-face sb-front">
        <img src={tool.logo} alt="" className={tool.tile ? 'is-tile' : ''} draggable="false" decoding="async" />
        <span>{tool.name}</span>
    </div>;
}

function OpenCopy({ onBook, onSee }) {
    return <>
        <span className="sb-kicker">AI SYSTEMS FOR YOUR BUSINESS</span>
        <h1 id="sb-title">Every AI tool does one piece. <span className="drama-text">None of them know your business.</span></h1>
        <p>I build one AI brain that does, connected to the right tools and built around how your business runs.</p>
        <div className="sb-actions"><button type="button" className="sb-button" onClick={onBook}>Book a call<ArrowRight size={16} /></button><button type="button" className="sb-text-btn" onClick={onSee}>See what goes into it<ArrowDown size={15} /></button></div>
        <a className="sb-skip-example" href="/one-brain#crown-workflow">Skip to a workflow example<ArrowDown size={12} /></a>
    </>;
}

function FinaleCopy({ onBook, onExplore }) {
    return <>
        <h2>It all comes together <span className="drama-text">in one AI brain.</span></h2>
        <p>Your automations, agents, pipeline, tools and team, all working from one memory of your business. You approve anything that matters.</p>
        <div className="sb-actions"><button type="button" className="sb-button" onClick={onBook}>Book a call<ArrowRight size={16} /></button><button type="button" className="sb-text-btn" onClick={onExplore}>See how the brain works<ArrowDown size={15} /></button></div>
    </>;
}

// For screen readers: the full list, since the stage shows one service at a time.
function ServiceList() {
    return <ol className="sr-only" aria-label="What goes into your AI brain">{SERVICES.map(s => <li key={s.id}>{s.name}. {s.line} Example tools: {s.tools.map(t => t.name).join(', ')}.</li>)}</ol>;
}

const INTERIOR_NODES = [[62, 71], [167, 27], [300, 13], [433, 27], [538, 71], [465, 213], [135, 213]];
function BrainInterior() {
    return <>
        <span className="sb-kicker">HOW IT WORKS</span>
        <h2>Inside your <span className="drama-text">business brain.</span></h2>
        <p>Your knowledge, tools, and AI assistants working together.</p>
        <div className="sb-interior-map">
            <svg viewBox="0 0 600 250" aria-hidden="true"><defs><radialGradient id="sb-inside-glow"><stop stopColor="#c9a84c" stopOpacity=".2" /><stop offset="1" stopColor="#c9a84c" stopOpacity="0" /></radialGradient></defs><ellipse cx="300" cy="125" rx="140" ry="100" fill="url(#sb-inside-glow)" />{INTERIOR_NODES.map(([x, y], i) => <path key={i} d={`M300 125 Q${(300 + x) / 2} ${125 + (y - 125) * 0.2} ${x} ${y}`} />)}</svg>
            <div className="sb-interior-core"><Network size={27} strokeWidth={1.2} /><span>Your business</span></div>
            <ul aria-label="Connected parts of your AI system">{PILLARS.map((p, i) => <li key={p.id} style={{ left: `${INTERIOR_NODES[i][0] / 6}%`, top: `${INTERIOR_NODES[i][1] / 2.5}%` }}><i />{p.plain}</li>)}</ul>
        </div>
        <button type="button" className="sb-text-btn" onClick={() => document.getElementById('crown-workflow')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth', block: 'start' })}>Try a workflow<ArrowDown size={15} /></button>
    </>;
}

const explore = () => document.getElementById('crown-system')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth', block: 'start' });

function StaticHero({ onBook }) {
    return <section className="sb-hero is-static" aria-labelledby="sb-title">
        <div className="sb-static-open"><OpenCopy onBook={onBook} onSee={() => document.getElementById('services')?.scrollIntoView({ block: 'start' })} />
            <ul className="sb-static-tools" aria-label="AI tools a business may already use">{TOOLS.map(t => <li key={t.id}><img src={t.logo} alt="" className={t.tile ? 'is-tile' : ''} />{t.name}</li>)}</ul>
        </div>
        <div className="sb-static-services" id="services"><span className="sb-kicker">WHAT GOES INTO YOUR AI BRAIN</span>
            <ol>{SERVICES.map((s, k) => <li key={s.id}><ServiceFace service={s} index={k} /><p>{s.line}</p></li>)}</ol>
        </div>
        <div className="sb-static-finale"><LivingBrain still /><FinaleCopy onBook={onBook} onExplore={explore} /></div>
    </section>;
}

export default function SystemBrainHero() {
    const { openCalModal } = useCalModal();
    const [reduced] = useState(prefersReducedMotion);
    const [focus, setFocus] = useState(0);
    const sectionRef = useRef(null);
    const stageRef = useRef(null);
    const servicesRef = useRef(null);
    const cardRefs = useRef([]);
    const brainRef = useRef(null);
    const tunnelRef = useRef(null);
    const openRef = useRef(null);
    const cueRef = useRef(null);
    const panelRef = useRef(null);
    const finaleRef = useRef(null);
    const interiorRef = useRef(null);
    const book = () => openCalModal('developer');

    useLayoutEffect(() => {
        if (reduced) return;
        const section = sectionRef.current;
        const stage = stageRef.current;
        const html = document.documentElement;
        const cards = cardRefs.current.map(el => ({ el, inner: el.firstElementChild, x: 0, y: 0, z: 0, r: 0, s: 0.3, o: 0, f: 0, d: null }));
        const S = { p: 0, ps: 0, introStart: null, spin: 0, mouse: 0, mouseT: 0, mouseY: 0, mouseYT: 0, focus: 0, last: 0, g: null };

        const measure = () => {
            S.g = geometry(stage.clientWidth, stage.clientHeight);
            servicesRef.current.style.top = `${P_FOCUS * (section.offsetHeight - window.innerHeight)}px`;
            stage.style.setProperty('--sb-cy', `${S.g.cy.toFixed(1)}px`);
        };
        measure();
        cards.forEach((c, i) => { c.x = SCATTER[i].x * S.g.w; c.y = SCATTER[i].y * S.g.h; c.r = SCATTER[i].rot; });
        const ro = new ResizeObserver(measure);
        ro.observe(stage);

        // The calligraphy intro plays first on a visitor's first page. The cards
        // fly in as its doors open, so the page has one continuous opening.
        const begin = () => { if (S.introStart == null) S.introStart = performance.now(); };
        let mo = null;
        if (html.dataset.intro === 'playing') {
            mo = new MutationObserver(() => { if (html.dataset.intro !== 'playing') { begin(); mo.disconnect(); } });
            mo.observe(html, { attributes: true, attributeFilter: ['data-intro'] });
        } else begin();

        const st = ScrollTrigger.create({
            trigger: section, start: 'top top', end: 'bottom bottom',
            onUpdate: self => { S.p = self.progress; },
            // Page scroll stays free. Snapping while an anchor crosses the
            // hero can cancel that navigation and pull visitors back here.
        });

        const onMove = e => {
            const rect = stage.getBoundingClientRect();
            S.mouseT = (((e.clientX - rect.left) / rect.width) * 2 - 1) * 36;
            S.mouseYT = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        };
        const hover = canHover();
        if (hover) stage.addEventListener('pointermove', onMove);

        // A layer is hidden from clicks, focus and screen readers only once it is gone.
        const setLayer = (el, o, y, gone = o < 0.02) => {
            el.style.opacity = o.toFixed(3);
            el.style.visibility = gone ? 'hidden' : 'visible';
            el.style.setProperty('--sb-y', `${y.toFixed(1)}px`);
        };

        const tick = () => {
            const now = performance.now();
            const dt = Math.min(0.05, (now - (S.last || now)) / 1000);
            S.last = now;
            S.ps += (S.p - S.ps) * (1 - Math.exp(-dt * 10));
            S.mouse += (S.mouseT - S.mouse) * (1 - Math.exp(-dt * 3));
            S.mouseY += (S.mouseYT - S.mouseY) * (1 - Math.exp(-dt * 3));
            const { g } = S;
            const t = S.introStart == null ? -1 : (now - S.introStart) / 1000;
            const m = clamp01(S.ps / P_FOCUS);
            const f = clamp01((S.ps - P_FOCUS) / (P_FINALE - P_FOCUS)) * LAST;
            const q = clamp01((S.ps - P_FINALE) / (P_DONE - P_FINALE));
            const journey = clamp01((S.ps - P_ENTER) / (P_LAND - P_ENTER));
            if (m < 1) S.spin += dt * ((2 * Math.PI) / 120);
            const kc = 1 - Math.exp(-dt * (t >= 0 && t < 2.8 ? 3.6 : 9));

            cards.forEach((c, i) => {
                const { serviceIndex: k, member, groupSize } = FLOW_CARDS[i];
                // 1. Intro: scattered and hidden, then a row, then the ring.
                let base;
                if (t < 0 || t < 0.3 + i * 0.025) {
                    base = { x: SCATTER[i].x * g.w, y: SCATTER[i].y * g.h, r: SCATTER[i].rot, s: g.ring.s * 0.7, o: 0 };
                } else if (t < 1.7 + i * 0.02) {
                    base = { x: (i - (TOOLS.length - 1) / 2) * g.lineGap, y: g.cy, r: 0, s: Math.min(g.ring.s, (g.lineGap * 0.85) / CARD_W), o: 1 };
                } else {
                    const pt = onEllipse(g.ring.rx, g.ring.ry, (i / TOOLS.length) * Math.PI * 2 - Math.PI / 2 + S.spin);
                    base = { ...pt, y: pt.y + g.cy, s: g.ring.s, o: 1 };
                }
                // 2. Related tools gather into one service, retaining their brand marks.
                // The arc loops, so the five services always sit around the one in the middle.
                const mk = ease(m * 1.5 - k * 0.08 - (member / Math.max(1, groupSize - 1)) * 0.12);
                const d = ((((k - f) % N) + N * 1.5) % N) - N / 2;
                const ang = -Math.PI / 2 + d * g.step;
                const merged = member ? 1 - clamp01((mk - 0.85) / 0.15) : 1;
                const arc = {
                    x: g.Ra * Math.cos(ang) + S.mouse,
                    y: g.cy + g.apexY + g.Ra + g.Ra * Math.sin(ang),
                    r: (ang * 180) / Math.PI + 90,
                    s: lerp(g.arcS, g.focusS, clamp01(1 - Math.abs(d))),
                    // Fades out at the far end of the loop, where the card wraps to the other side.
                    o: clamp01((N / 2 - Math.abs(d)) / 0.45) * merged,
                };
                let x = lerp(base.x, arc.x, mk);
                let y = lerp(base.y, arc.y, mk);
                let z = 0;
                let r = lerp(near(arc.r, base.r), arc.r, mk);
                let s = lerp(base.s, arc.s, mk);
                let o = lerp(base.o, arc.o, mk);
                const flip = ease((mk - 0.3) / 0.5) * 180;
                // 3. Keep the same five cards, faces and logos for the entire
                // tunnel. They recede into depth, then pass the camera.
                if (q > 0) {
                    const join = ease(q / 0.24);
                    const local = clamp01((q - (k / LAST) * 0.22) / 0.65);
                    const angle = k * 137.5 * Math.PI / 180;
                    const mobile = g.w < 768;
                    const tx = Math.cos(angle) * g.w * (mobile ? 0.49 : 0.32 + (k % 3) * 0.045);
                    const ty = g.cy + g.brainY + Math.sin(angle) * g.h * (0.29 + (k % 2) * 0.07);
                    x = lerp(x, tx - S.mouse * 0.35, join);
                    y = lerp(y, ty, join);
                    z = lerp(0, (mobile ? -1200 : -1700) + local * (mobile ? 1550 : 2200), join);
                    r = lerp(r, near(r, (k % 2 ? -1 : 1) * (3 + k * 2)), join);
                    s = lerp(s, mobile ? 0.95 : 1.3, join);
                    o = member ? o * (1 - join) : lerp(o, 1, join) * clamp01((1 - local) / 0.18);
                    // The sheets become the five streams building the cortex.
                    const collect = ease((q - 0.3) / 0.32);
                    x = lerp(x, 0, collect);
                    y = lerp(y, g.cy + g.brainY, collect);
                    z = lerp(z, -250, collect);
                    s = lerp(s, 0.08, collect);
                    o *= 1 - ease((q - 0.4) / 0.22);
                }
                // When a card wraps from one end of the arc to the other it is invisible; move it there at once.
                if (c.d != null && Math.abs(d - c.d) > N / 2) { c.x = x; c.y = y; c.r = r; }
                c.d = d;
                c.x += (x - c.x) * kc;
                c.y += (y - c.y) * kc;
                c.z += (z - c.z) * kc;
                c.r += (r - c.r) * kc;
                c.s += (s - c.s) * kc;
                c.o += (o - c.o) * kc;
                c.f += (flip - c.f) * kc;
                c.el.style.opacity = c.o.toFixed(3);
                c.el.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, ${c.z.toFixed(1)}px) rotate(${c.r.toFixed(2)}deg) scale(${c.s.toFixed(4)})`;
                c.inner.style.transform = `perspective(900px) rotateY(${c.f.toFixed(2)}deg)`;
            });

            // The Z-axis tunnel shares this timeline and reverses with the page.
            tunnelRef.current?.update(Math.min(1, q * 1.4), g);

            brainRef.current?.update({ formation: clamp01((q - 0.2) / 0.65), journey, pointerX: S.mouse / 36, pointerY: S.mouseY, time: now / 1000, w: g.w, h: g.h });

            const openIn = t < 0 ? 0 : ease((t - 1.85) / 0.9);
            const openOut = 1 - clamp01(m / 0.3);
            // The headline stays readable to screen readers while the cards fly in; it hides once scrolled past.
            setLayer(openRef.current, openIn * openOut, (1 - openIn) * 16 - (1 - openOut) * 30, openOut < 0.02);
            setLayer(cueRef.current, openIn * (1 - clamp01(m / 0.12)), 0);
            setLayer(panelRef.current, clamp01((m - 0.72) / 0.28) * (1 - clamp01(q / 0.3)), (1 - clamp01((m - 0.72) / 0.28)) * 14);
            const finalIn = clamp01((q - 0.84) / 0.16);
            setLayer(finaleRef.current, finalIn * (1 - clamp01(journey / 0.2)), (1 - finalIn) * 18 - journey * 45);
            const inside = clamp01((journey - 0.48) / 0.3);
            setLayer(interiorRef.current, inside, (1 - inside) * 28);
            const fi = Math.round(f);
            if (fi !== S.focus) { S.focus = fi; setFocus(fi); }
        };

        // The loop only runs while the hero is on screen.
        let running = false;
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !running) { running = true; S.last = 0; gsap.ticker.add(tick); }
            else if (!entry.isIntersecting && running) { running = false; gsap.ticker.remove(tick); }
        });
        io.observe(section);

        return () => {
            io.disconnect();
            if (running) gsap.ticker.remove(tick);
            st.kill();
            ro.disconnect();
            mo?.disconnect();
            if (hover) stage.removeEventListener('pointermove', onMove);
        };
    }, [reduced]);

    if (reduced) return <StaticHero onBook={book} />;

    const seeWhatGoesIn = () => {
        const el = sectionRef.current;
        const top = el.getBoundingClientRect().top + window.scrollY + P_FOCUS * (el.offsetHeight - window.innerHeight);
        window.scrollTo({ top, behavior: 'smooth' });
    };
    const enterBrain = () => {
        const el = sectionRef.current;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + P_LAND * (el.offsetHeight - window.innerHeight), behavior: 'smooth' });
    };
    const service = SERVICES[focus];
    const cardBox = { width: CARD_W, height: CARD_H, marginLeft: -CARD_W / 2, marginTop: -CARD_H / 2 };
    return <section className="sb-hero" ref={sectionRef} style={{ '--sb-screens': SCREENS }} aria-labelledby="sb-title">
        <span id="services" ref={servicesRef} className="sb-service-anchor" aria-hidden="true" />
        <div className="sb-stage" ref={stageRef}>
            <div className="sb-light" aria-hidden="true" />
            <PerspectiveTunnel ref={tunnelRef}>
            <div className="sb-cards" aria-hidden="true">
                {FLOW_CARDS.map(({ tool, serviceIndex }, i) => <div className="sb-card" key={tool.id} ref={el => { cardRefs.current[i] = el; }} style={cardBox}>
                    <div className="sb-card-inner"><ToolFace tool={tool} /><ServiceFace service={SERVICES[serviceIndex]} index={serviceIndex} /></div>
                </div>)}
            </div>
            </PerspectiveTunnel>
            <LivingBrain ref={brainRef} />
            <div className="sb-layer sb-open" ref={openRef}><OpenCopy onBook={book} onSee={seeWhatGoesIn} /></div>
            <div className="sb-layer sb-cue" ref={cueRef} aria-hidden="true"><span>SCROLL TO SEE WHAT GOES INTO IT</span><i /></div>
            <div className="sb-layer sb-panel" ref={panelRef} aria-hidden="true">
                <div className="sb-panel-top"><span>WHAT GOES INTO YOUR AI BRAIN</span><span>{String(focus + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span></div>
                <div className="sb-panel-body" key={service.id}><span className="sb-kicker">{service.kicker}</span><h2>{service.name}</h2><p>{service.line}</p><div className="sb-panel-tools"><small>Example tools</small>{service.tools.map(tool => <span key={tool.id}><img src={tool.logo} alt="" className={tool.tile ? 'is-tile' : ''} />{tool.name}</span>)}</div></div>
                <div className="sb-dots">{SERVICES.map((s, k) => <span key={s.id} className={k === focus ? 'is-on' : ''} />)}</div>
            </div>
            <div className="sb-layer sb-finale" ref={finaleRef}><FinaleCopy onBook={book} onExplore={enterBrain} /><span className="sb-enter-cue">KEEP SCROLLING TO MOVE INSIDE<span /></span></div>
            <div className="sb-layer sb-interior" ref={interiorRef}><BrainInterior /></div>
            <ServiceList />
        </div>
    </section>;
}
