import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Check, CheckCheck, FileText, Handshake, Mail, Paperclip, Search, Users, UsersRound } from 'lucide-react';
import { canHover } from '../../lib/motion';
import { WORK_AREAS, WORK_INTRO } from './workspace-data';
import './workspace.css';

gsap.registerPlugin(ScrollTrigger);

// "Built into my own business": scrolling walks the visitor through the whole
// workspace. A 3D scene stays pinned while twelve steps scroll past it: each
// area's introduction, then each of its three documents. The step at the
// reading line is in focus, and the scene follows it: the camera travels to the
// step's area and that document's card lights up.
// Adapted from 21st.dev components, rebuilt on the site's GSAP and three.js
// (sources in EXPERIENCE_SOURCES.md):
// - daiwiikharihar's Cinematic Orbit Hero (32357): pinned stage on page scroll,
//   depth-scaled cards, pointer parallax.
// - sh20raj's Optimized Tilt Card (27139): pointer tilt, light sheen, touch hold.
// - dhileepkumargm's 3D Cards Slider (7829): depth of field, blur off focus.
// - affectUI's Email Draft (44435): the layout of a drafted email under review.

const AREA_ICONS = { clients: Users, collaboration: Handshake, research: Search };
const RECORD_ICONS = { file: FileText, mail: Mail, check: CheckCheck, people: UsersRound, search: Search, book: BookOpen };
const STEPS = WORK_AREAS.flatMap((a, area) => [{ area, doc: -1 }, ...a.records.map((r, doc) => ({ area, doc }))]);
const FALLBACK = { area: [[.5, .84], [.83, .64], [.17, .64]], record: [[.22, .3], [.5, .2], [.78, .3]] };
const MAX_TILT = 11, HOVER_SCALE = 1.045, TOUCH_HOLD_MS = 400;
const clamp01 = n => Math.max(0, Math.min(1, n));
const ease = n => n * n * (3 - 2 * n);
// The reading line: a step becomes active when its top passes it. On phones the
// scene takes the top of the screen, so the line sits lower.
const readingLine = () => window.innerHeight * (window.innerWidth < 900 ? .64 : .56);

// Pointer tilt and sheen for the floating documents (Optimized Tilt Card).
function tiltTo(card, clientX, clientY) {
    const r = card.getBoundingClientRect();
    const px = clamp01((clientX - r.left) / r.width) * 100, py = clamp01((clientY - r.top) / r.height) * 100;
    card.style.setProperty('--px', `${px.toFixed(1)}%`);
    card.style.setProperty('--py', `${py.toFixed(1)}%`);
    card.style.setProperty('--hry', `${(((px - 50) / 50) * MAX_TILT).toFixed(2)}deg`);
    card.style.setProperty('--hrx', `${(((py - 50) / 50) * -MAX_TILT).toFixed(2)}deg`);
    card.style.setProperty('--hs', String(HOVER_SCALE));
    card.dataset.hover = 'true';
}
function untilt(card) {
    card.style.setProperty('--hry', '0deg');
    card.style.setProperty('--hrx', '0deg');
    card.style.setProperty('--hs', '1');
    delete card.dataset.hover;
}

// The draft's layout follows affectUI's Email Draft: recipient and attachment,
// the message, a tone choice, and a review action. Nothing is ever sent.
function EmailExample({ example }) {
    const tones = Object.keys(example.tones);
    const [tone, setTone] = useState(tones[0]);
    const [approved, setApproved] = useState(false);
    return <div className="wsq-ex-email">
        <div className="wsq-ex-email-card">
            <div className="wsq-ex-email-head"><span className="wsq-ex-to"><small>to</small>{example.to}</span><span className="wsq-ex-file"><Paperclip size={12} />{example.attachment}</span></div>
            <b className="wsq-ex-subject">{example.subject}</b>
            <div className="wsq-ex-lines" key={tone}>{example.tones[tone].map(line => <p key={line}>{line}</p>)}</div>
            <div className="wsq-ex-email-actions">
                <div className="wsq-ex-tones" aria-label="Tone of the example draft">{tones.map(t => <button type="button" key={t} aria-pressed={tone === t} onClick={() => { setTone(t); setApproved(false); }}>{t}</button>)}</div>
                <button type="button" className="wsq-ex-approve" aria-pressed={approved} onClick={() => setApproved(a => !a)}>{approved ? <><Check size={13} />Approved</> : 'Approve'}</button>
            </div>
        </div>
        <div className="wsq-ex-email-foot"><span>{example.from}</span><em className={approved ? 'is-approved' : ''} role="status">{approved ? 'Approved in this example' : 'Waiting for my review'}</em><small>Nothing is sent</small></div>
    </div>;
}

function Example({ example }) {
    let body = null;
    if (example.type === 'email') body = <EmailExample example={example} />;
    if (example.type === 'sheet') body = <dl className="wsq-ex-sheet">{example.rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
    if (example.type === 'table') body = <table className="wsq-ex-table"><thead><tr>{example.head.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{example.rows.map(row => <tr key={row[0]}>{row.map((cell, j) => j === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={j}><span data-tone={cell}>{cell}</span></td>)}</tr>)}</tbody></table>;
    if (example.type === 'log') body = <dl className="wsq-ex-log">{example.rows.map(([tag, text]) => <div key={tag}><dt><span>{tag}</span></dt><dd>{text}</dd></div>)}</dl>;
    if (example.type === 'sources') body = <ol className="wsq-ex-sources">{example.rows.map(([title, note], i) => <li key={title}><span>{i + 1}</span><div><b>{title}</b><small>{note}</small></div></li>)}</ol>;
    if (example.type === 'findings') body = <><ol className="wsq-ex-findings">{example.rows.map(([text, refs]) => <li key={text}><span>{text}</span><small>Sources {refs}</small></li>)}</ol><p className="wsq-ex-open"><b>Open question</b>{example.open}</p></>;
    return <figure className="wsq-example"><figcaption><span>Example</span>{example.name}</figcaption>{body}</figure>;
}

export default function MyWorkspace() {
    const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const change = () => setReduced(media.matches);
        media.addEventListener('change', change);
        return () => media.removeEventListener('change', change);
    }, []);
    const root = useRef(null), track = useRef(null), stage = useRef(null), scene = useRef(null), canvas = useRef(null);
    const areaEls = useRef([]), recordEls = useRef([]), stepEls = useRef([]), fillEls = useRef([]);
    const drawRef = useRef(() => {});
    const live = useRef({ step: 0, area: 0, record: -1, focus: 0, entry: 0, travel: 0, px: 0, py: 0, pulse: 0, feed: 0 });
    const [step, setStep] = useState(0);
    const { area, doc: record } = STEPS[step];
    const current = WORK_AREAS[area];

    const activate = i => {
        const L = live.current;
        if (i === L.step) return;
        const next = STEPS[i];
        if (next.area !== L.area) L.pulse = 1;
        // Every step reached is filed into the brain.
        L.feed = 1;
        L.step = i; L.area = next.area; L.focus = next.area; L.record = next.doc;
        setStep(i);
    };
    // A document card flies out of the scene to where its step will land.
    const flyTo = (card, target) => {
        if (!card || reduced) return;
        const a = card.getBoundingClientRect();
        document.querySelectorAll('.wsq-ghost').forEach(g => { gsap.killTweensOf(g); g.remove(); });
        const ghost = card.cloneNode(true);
        ghost.className = 'wsq-doc-card wsq-ghost';
        ghost.setAttribute('aria-hidden', 'true');
        Object.assign(ghost.style, { position: 'fixed', left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px`, margin: '0', zIndex: '70', pointerEvents: 'none', animation: 'none' });
        document.body.appendChild(ghost);
        gsap.to(ghost, { left: target.left, top: target.top, width: target.width, height: 64, duration: .9, ease: 'power3.inOut' });
        gsap.to(ghost, { opacity: 0, duration: .3, delay: .72, onComplete: () => ghost.remove() });
        // A slow or backgrounded tab can stall the tween: never leave a ghost behind.
        setTimeout(() => ghost.remove(), 2000);
    };
    // Every control moves the page: scrolling owns the experience.
    const scrollToStep = (i, card) => {
        const el = stepEls.current[i];
        if (!el) return;
        const r = el.getBoundingClientRect();
        const delta = r.top - (readingLine() - 70);
        const from = window.scrollY, to = from + delta;
        if (reduced) { window.scrollTo({ top: to, behavior: 'instant' }); return; }
        const proxy = { y: from };
        gsap.to(proxy, { y: to, duration: .9, ease: 'power2.inOut', overwrite: true, onUpdate: () => window.scrollTo({ top: proxy.y, behavior: 'instant' }) });
        if (card) flyTo(card, { left: r.left + 18, top: r.top - delta + 16, width: Math.min(r.width - 36, 360) });
    };
    const goArea = i => scrollToStep(STEPS.findIndex(s => s.area === i));
    const goAreaRef = useRef(goArea);
    useEffect(() => { goAreaRef.current = goArea; });
    // The page's chapter rail can send the visitor to an area.
    useEffect(() => {
        const onGoto = e => { if (e.detail.id === 'work') goAreaRef.current(e.detail.step); };
        window.addEventListener('cinema:goto', onGoto);
        return () => window.removeEventListener('cinema:goto', onGoto);
    }, []);
    const goDoc = (i, card) => scrollToStep(STEPS.findIndex(s => s.area === area && s.doc === i), card);

    useEffect(() => { drawRef.current(); }, [step]);

    // The WebGL scene, its render loop, depth of field, parallax and label placement.
    useEffect(() => {
        const host = scene.current, cv = canvas.current, L = live.current;
        let engine = null, disposed = false, visible = false, running = false, shift = 0;
        const smooth = { focus: null, entry: reduced ? 1 : 0, px: 0, py: 0, pulse: 0, feed: 0 };
        if (reduced) L.entry = 1;
        // Station labels hang just below their station's base; documents are centered on their point.
        const setMarker = (el, x, y, s, anchor = -50) => {
            el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, ${anchor}%) scale(${s.toFixed(3)})`;
        };
        const setVar = (el, name, value) => { if (el[name] !== value) { el[name] = value; el.style.setProperty(name, value); } };
        const place = (kind, i, x, y, { scale, lean, blur }) => {
            const el = (kind === 'area' ? areaEls : recordEls).current[i];
            if (!el) return;
            setMarker(el, x, y, scale, kind === 'area' ? 0 : -50);
            el.style.zIndex = String(Math.round(scale * 100));
            if (kind === 'area') {
                setVar(el, '--wsq-depth', clamp01((scale - .66) / .4).toFixed(2));
                setVar(el, '--blur', `${(blur + smooth.pulse * 1.6).toFixed(1)}px`);
            } else {
                const active = i === L.record;
                const turn = -lean * 32 + smooth.px * 6;
                setVar(el, '--blur', `${(active ? 0 : smooth.pulse * 1.4).toFixed(1)}px`);
                setVar(el, '--lean', `${turn.toFixed(1)}deg`);
                setVar(el, '--pitch', `${(6 - smooth.py * 5).toFixed(1)}deg`);
                setVar(el, '--edge', `${(-turn / 5).toFixed(1)}px`);
            }
        };
        const placeFallback = () => {
            const w = host.clientWidth, h = host.clientHeight;
            ['area', 'record'].forEach(kind => FALLBACK[kind].forEach(([fx, fy], i) => {
                const el = (kind === 'area' ? areaEls : recordEls).current[i];
                if (el) setMarker(el, fx * w + (kind === 'area' || w < 900 ? 0 : shift * .6), fy * h, 1);
            }));
        };
        const measure = () => {
            const w = host.clientWidth, h = host.clientHeight;
            shift = w >= 900 ? Math.min(260, w * .16) : 0;
            host.style.setProperty('--wsq-shift', `${shift}px`);
            if (engine) engine.resize(w, h, shift); else placeFallback();
        };
        const draw = (time = 0, dt = 0) => {
            if (!engine) return;
            const k = rate => dt ? 1 - Math.exp(-dt * rate) : 1;
            if (smooth.focus === null) smooth.focus = L.focus;
            smooth.focus += (L.focus - smooth.focus) * k(1.9);
            smooth.entry += (L.entry - smooth.entry) * k(4);
            smooth.px += (L.px - smooth.px) * k(3);
            smooth.py += (L.py - smooth.py) * k(3);
            // The focus shift on an area change: everything softens, then the new area sharpens.
            if (L.pulse) { smooth.pulse = L.pulse; L.pulse = 0; }
            smooth.pulse = dt ? smooth.pulse * Math.exp(-dt * 2.6) : 0;
            if (L.feed) { smooth.feed = L.feed; L.feed = 0; }
            smooth.feed = dt ? smooth.feed * Math.exp(-dt * 1.4) : 0;
            engine.render({ time, focus: smooth.focus, entry: smooth.entry, travel: L.travel, feed: smooth.feed, pointerX: smooth.px, pointerY: smooth.py, record: L.record, paused: reduced }, place);
        };
        drawRef.current = () => { if (reduced || !running) draw(); };
        const tick = (time, deltaMs) => draw(time, Math.min(deltaMs, 100) / 1000);
        const sync = () => {
            const should = visible && !!engine && !reduced;
            if (should && !running) { gsap.ticker.add(tick); running = true; }
            if (!should && running) { gsap.ticker.remove(tick); running = false; }
            if (!should && engine) draw();
        };
        const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { rootMargin: '200px' });
        io.observe(host);
        const ro = new ResizeObserver(() => { measure(); drawRef.current(); });
        ro.observe(host);
        measure();

        const move = e => {
            if (e.pointerType !== 'mouse') return;
            const r = host.getBoundingClientRect();
            L.px = ((e.clientX - r.left) / r.width - .5) * 2;
            L.py = ((e.clientY - r.top) / r.height - .5) * 2;
        };
        const leave = () => { L.px = 0; L.py = 0; };
        const parallax = canHover() && !reduced;
        const trackEl = track.current;
        if (parallax) { trackEl.addEventListener('pointermove', move, { passive: true }); trackEl.addEventListener('pointerleave', leave); }

        const lost = e => { e.preventDefault(); host.dataset.ready = 'false'; engine?.dispose(); engine = null; sync(); placeFallback(); };
        cv.addEventListener('webglcontextlost', lost);
        import('./workspace-scene').then(({ createWorkspaceScene }) => {
            if (disposed) return;
            try {
                engine = createWorkspaceScene(cv, host.clientWidth, host.clientHeight);
                host.dataset.ready = 'true';
                measure(); draw(); sync();
            } catch {
                // The CSS rings and fixed label positions stay when WebGL is unavailable.
                host.dataset.ready = 'false';
            }
        }).catch(() => { if (!disposed) host.dataset.ready = 'false'; });

        return () => {
            disposed = true;
            io.disconnect(); ro.disconnect();
            if (running) gsap.ticker.remove(tick);
            if (parallax) { trackEl.removeEventListener('pointermove', move); trackEl.removeEventListener('pointerleave', leave); }
            cv.removeEventListener('webglcontextlost', lost);
            engine?.dispose(); engine = null;
            drawRef.current = () => {};
        };
    }, [reduced]);

    // Scroll: the camera moves in as the stage arrives, then the step at the
    // reading line decides the area, the document, and the progress.
    useLayoutEffect(() => {
        const L = live.current;
        const areaStarts = WORK_AREAS.map((a, i) => STEPS.findIndex(s => s.area === i));
        const update = () => {
            const line = readingLine();
            const tops = stepEls.current.map(el => el ? el.getBoundingClientRect().top : Infinity);
            let next = 0;
            tops.forEach((top, i) => { if (top <= line) next = i; });
            activate(next);
            // Each area's bar fills as its steps pass the reading line.
            let currentFill = 0;
            areaStarts.forEach((start, i) => {
                const end = areaStarts[i + 1] ?? STEPS.length;
                const first = tops[start], last = tops[end - 1];
                const fill = clamp01((line - first) / Math.max(1, last - first + 1));
                if (i === STEPS[next].area) currentFill = fill;
                const el = fillEls.current[i];
                if (el) el.style.transform = `scaleX(${(i < STEPS[next].area ? 1 : i > STEPS[next].area ? 0 : Math.max(.08, fill)).toFixed(3)})`;
            });
            // The chapter rail on wide screens shows the same progress.
            const report = `${STEPS[next].area}:${currentFill.toFixed(2)}`;
            if (report !== L.report) {
                L.report = report;
                window.dispatchEvent(new CustomEvent('cinema:progress', { detail: { id: 'work', step: STEPS[next].area, fill: currentFill } }));
            }
        };
        const ctx = gsap.context(() => {
            if (!reduced) gsap.fromTo(root.current.querySelectorAll('[data-wsq-reveal]'), { y: 36, opacity: 0 }, {
                y: 0, opacity: 1, duration: .9, ease: 'power3.out', stagger: .08,
                scrollTrigger: { trigger: root.current, start: 'top 85%', toggleActions: 'play none none none' },
            });
            const arrive = ScrollTrigger.create({ trigger: track.current, start: 'top bottom', end: 'top top', onUpdate: self => { L.entry = reduced ? 1 : ease(self.progress); } });
            const travel = ScrollTrigger.create({ trigger: track.current, start: 'top top', end: 'bottom bottom', onUpdate: self => { L.travel = self.progress; update(); }, onRefresh: update });
            // A deep link or a restored scroll position can start part way in.
            L.entry = reduced ? 1 : ease(arrive.progress);
            L.travel = travel.progress;
            update();
        }, root);
        const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => { cancelAnimationFrame(frame); ctx.revert(); };
    }, [reduced]);

    const holdTimers = useRef([]);
    const docHandlers = i => ({
        onPointerMove: e => { if (e.pointerType === 'mouse') tiltTo(e.currentTarget.firstElementChild, e.clientX, e.clientY); },
        onPointerLeave: e => { if (e.pointerType === 'mouse') untilt(e.currentTarget.firstElementChild); },
        onTouchStart: e => { clearTimeout(holdTimers.current[i]); const t = e.touches[0]; if (t) tiltTo(e.currentTarget.firstElementChild, t.clientX, t.clientY); },
        onTouchMove: e => { const t = e.touches[0]; if (t) tiltTo(e.currentTarget.firstElementChild, t.clientX, t.clientY); },
        onTouchEnd: e => { const card = e.currentTarget.firstElementChild; holdTimers.current[i] = setTimeout(() => untilt(card), TOUCH_HOLD_MS); },
    });
    useEffect(() => () => holdTimers.current.forEach(clearTimeout), []);

    return <section id="work" className="wsq" ref={root} aria-labelledby="wsq-title" data-chapter-steps={WORK_AREAS.map(a => a.label).join('|')}>
        <div className="wsq-head ws-section-heading">
            <span className="ws-eyebrow" data-wsq-reveal>HOW I USE THIS MYSELF</span>
            <h3 id="wsq-title" data-wsq-reveal>Built into<br /><span className="drama-text">my own business.</span></h3>
            <p data-wsq-reveal>{WORK_INTRO}</p>
        </div>
        <div className="wsq-track" ref={track}>
            <div className="wsq-stage" ref={stage} data-cursor-scene>
                <div className="ws-cursor-light" aria-hidden="true" />
                <nav className="wsq-nav" aria-label="Areas of my workspace">{WORK_AREAS.map((a, i) => { const Icon = AREA_ICONS[a.icon]; return <button type="button" key={a.id} aria-current={area === i ? 'step' : undefined} onClick={() => goArea(i)}>
                    <span><Icon size={13} strokeWidth={1.7} />{a.label}</span><i><em ref={el => { fillEls.current[i] = el; }} /></i>
                </button>; })}</nav>
                <div className="wsq-scene" ref={scene} data-ready="false">
                    <div className="wsq-atmosphere" aria-hidden="true" />
                    <div className="wsq-fallback" aria-hidden="true"><i /><i /><i /></div>
                    <canvas className="wsq-canvas" ref={canvas} aria-hidden="true" />
                    {/* Pointer shortcuts into the steps below. */}
                    <div className="wsq-markers" aria-hidden="true">
                        {WORK_AREAS.map((a, i) => { const Icon = AREA_ICONS[a.icon]; return <button type="button" tabIndex={-1} key={a.id} className={`wsq-station ${area === i ? 'is-active' : ''}`} ref={el => { areaEls.current[i] = el; }} onMouseDown={e => e.preventDefault()} onClick={() => goArea(i)} data-cursor-style="brain" data-cursor-label="View">
                            <Icon size={14} strokeWidth={1.6} /><span>{a.short}</span>
                        </button>; })}
                        {current.records.map((r, i) => { const Icon = RECORD_ICONS[r.icon]; return <button type="button" tabIndex={-1} key={i} className={`wsq-doc ${record === i ? 'is-active' : ''}`} ref={el => { recordEls.current[i] = el; }} onMouseDown={e => e.preventDefault()} onClick={e => goDoc(i, record === i ? null : e.currentTarget.firstElementChild)} data-cursor-style="brain" data-cursor-label="Open" {...docHandlers(i)}>
                            <span className="wsq-doc-card" key={`${current.id}-${i}`} style={{ '--i': i }}><span className="wsq-doc-icon"><Icon size={15} strokeWidth={1.6} /></span><span className="wsq-doc-text"><small>{r.kind}</small><b>{r.label}</b></span></span>
                        </button>; })}
                    </div>
                </div>
            </div>
            <div className="wsq-steps">
                {STEPS.map((s, i) => {
                    const a = WORK_AREAS[s.area];
                    const state = i === step ? 'is-active' : i < step ? 'is-past' : '';
                    if (s.doc < 0) return <article key={`${a.id}-intro`} className={`wsq-step wsq-step-intro ${state}`} ref={el => { stepEls.current[i] = el; }} aria-labelledby={`wsq-${a.id}`}>
                        <span className="wsq-count">0{s.area + 1}<i>/ 0{WORK_AREAS.length}</i><span>{a.label}</span></span>
                        <h4 id={`wsq-${a.id}`}>{a.title}</h4>
                        <p>{a.body}</p>
                    </article>;
                    const r = a.records[s.doc], Icon = RECORD_ICONS[r.icon];
                    return <article key={`${a.id}-${s.doc}`} className={`wsq-step wsq-step-doc ${state}`} ref={el => { stepEls.current[i] = el; }} aria-labelledby={`wsq-${a.id}-${s.doc}`} data-cursor-surface>
                        <div className="wsq-step-top"><span className="wsq-kind"><Icon size={14} strokeWidth={1.7} />{r.kind}</span><small>{r.label} · {s.doc + 1} of {a.records.length}</small></div>
                        <h5 id={`wsq-${a.id}-${s.doc}`}>{r.title}</h5>
                        <p>{r.body}</p>
                        <Example example={r.example} />
                    </article>;
                })}
            </div>
        </div>
        <p className="wsq-note">A simplified illustration of how I work. Every document in it is a fictional example, with no real client files or messages.</p>
    </section>;
}
