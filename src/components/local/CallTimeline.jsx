import { useEffect, useRef } from 'react';

/**
 * CallTimeline — scroll-driven "one call, handled end to end" value-prop section.
 * Alternating timeline (card left / copy right, then flipped) down a gold spine.
 * Each card plays a SaaS-style staged sequence when it enters view, then loops.
 * Pure coded UI (no video) so text stays razor-sharp. Respects reduced-motion.
 */

const PERIOD = 9000; // ms per card loop
const RAMP = 0.05;   // fade-in ramp (fraction of period)
const OUT = 0.045;   // fade-out ramp
const HOLD_END = 0.9;

const WAVE = Array.from({ length: 30 });

function Wave() {
    return (
        <div className="ct-wave">
            {WAVE.map((_, i) => (
                <i key={i} style={{ animationDelay: `${i * 0.05}s` }} />
            ))}
        </div>
    );
}

export default function CallTimeline() {
    const rootRef = useRef(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const rows = [...root.querySelectorAll('.ct-row')];
        const fill = root.querySelector('.ct-fill');
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const cards = rows.map((r) => ({
            row: r,
            i: +r.dataset.i,
            active: false,
            start: 0,
            els: [...r.querySelectorAll('[data-appear]')].map((el) => ({
                el,
                a: parseFloat(el.dataset.appear),
                v: el.dataset.vanish ? parseFloat(el.dataset.vanish) : HOLD_END,
                pop: el.hasAttribute('data-pop'),
            })),
        }));

        if (reduce) {
            cards.forEach((c) => c.els.forEach((o) => {
                o.el.style.opacity = 1;
                o.el.style.transform = 'none';
            }));
            rows.forEach((r) => r.classList.add('in'));
            return;
        }

        const easeOut = (x) => (x < 0 ? 0 : x > 1 ? 1 : 1 - Math.pow(1 - x, 3));
        let raf = 0;
        const frame = (now) => {
            for (const c of cards) {
                if (!c.active) continue;
                const p = ((now - c.start) % PERIOD) / PERIOD;
                for (const o of c.els) {
                    let op = Math.min((p - o.a) / RAMP, (o.v - p) / OUT);
                    op = op < 0 ? 0 : op > 1 ? 1 : op;
                    o.el.style.opacity = op.toFixed(3);
                    if (o.pop) {
                        const settle = p - o.a > 0.07 ? 1 : easeOut((p - o.a) / 0.07) * 1.25;
                        o.el.style.transform = `scale(${op <= 0 ? 0 : Math.min(settle, 1.25).toFixed(3)})`;
                    } else {
                        o.el.style.transform = `translateY(${((1 - easeOut((p - o.a) / RAMP)) * 12).toFixed(2)}px)`;
                    }
                }
            }
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);

        let maxSeen = -1;
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    const c = cards[+e.target.dataset.i];
                    if (!c) continue;
                    if (e.isIntersecting) {
                        e.target.classList.add('in');
                        if (!c.active) { c.active = true; c.start = performance.now(); }
                        if (c.i > maxSeen) {
                            maxSeen = c.i;
                            if (fill) fill.style.height = `${((c.i + 0.5) / rows.length) * 100}%`;
                        }
                    } else {
                        c.active = false;
                    }
                }
            },
            { rootMargin: '-35% 0px -35% 0px', threshold: 0 }
        );
        rows.forEach((r) => io.observe(r));

        return () => { cancelAnimationFrame(raf); io.disconnect(); };
    }, []);

    return (
        <section ref={rootRef} className="ct-section relative py-16 sm:py-24 px-6 md:px-8 bg-brand-primary overflow-hidden">
            <div className="text-center mb-6 sm:mb-10 max-w-2xl mx-auto">
                <span className="text-brand-accent uppercase tracking-[0.2em] font-mono text-xs sm:text-sm mb-3 block">
                    One call, handled end to end
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight">
                    The moment someone dials, <span className="drama-text text-brand-accent">watch what happens.</span>
                </h2>
                <p className="text-white/55 text-base sm:text-lg leading-relaxed mt-5">
                    No voicemail. No missed money. No front-desk scramble. Follow a single call from ring to booked to logged.
                </p>
            </div>

            <div className="ct-wrap">
                <div className="ct-spine"><div className="ct-fill" /></div>

                {/* 01 — card left, copy right */}
                <div className="ct-row" data-i="0" data-side="left">
                    <div className="ct-node" data-n="1" />
                    <div className="ct-visual">
                        <div className="ct-card">
                            <div className="ct-glow" />
                            <div className="ct-head">
                                <div className="ct-crown">&#9812;</div>
                                <div className="ct-who"><div className="ct-name">AI Receptionist</div><div className="ct-sub">INBOUND CALL &middot; #A-4471</div></div>
                                <div className="ct-pill"><span className="ct-d" /><span className="ct-l">Live</span></div>
                            </div>
                            <div className="ct-body">
                                <Wave />
                                <div className="ct-rlab" data-appear="0.10">Caller</div>
                                <div className="ct-bub caller" data-appear="0.10">Hi, I&rsquo;d like to book a facial for Friday.</div>
                                <div className="ct-rlab ct-right" data-appear="0.30">Agent</div>
                                <div className="ct-typing" data-appear="0.30" data-vanish="0.46"><span /><span /><span /></div>
                                <div className="ct-bub agent" data-appear="0.46">Of course. I have Friday at 2:00 or 4:30. Which works?</div>
                                <div className="ct-confirm" data-appear="0.64">
                                    <div className="ct-ico"><span className="ct-m">FRI</span><span className="ct-dd">18</span></div>
                                    <div className="ct-cmeta"><div className="ct-a">Facial &middot; 2:00 PM</div><div className="ct-b">Added to calendar &middot; confirmation texted</div></div>
                                    <div className="ct-stamp"><span className="ct-c" data-appear="0.74" data-pop>&#10003;</span>Booked</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ct-copy">
                        <div className="ct-num">01 &middot; The call comes in</div>
                        <h3>Answers in two rings, books on the spot.</h3>
                        <p>It picks up in your brand&rsquo;s voice, talks like your best front-desk hire, and locks in the appointment while the caller is still on the line.</p>
                    </div>
                </div>

                {/* 02 — copy left, card right */}
                <div className="ct-row" data-i="1" data-side="right">
                    <div className="ct-node" data-n="2" />
                    <div className="ct-copy">
                        <div className="ct-num">02 &middot; If one slips through</div>
                        <h3>Texts back a missed call in seconds.</h3>
                        <p>After hours or slammed at the desk? It fires a warm text back within seconds, so the lead never goes cold and never dials your competitor.</p>
                    </div>
                    <div className="ct-visual">
                        <div className="ct-card">
                            <div className="ct-glow" />
                            <div className="ct-head">
                                <div className="ct-crown">&#9812;</div>
                                <div className="ct-who"><div className="ct-name">AI Receptionist</div><div className="ct-sub">MISSED CALL &middot; auto text-back</div></div>
                                <div className="ct-pill"><span className="ct-d" /><span className="ct-l">Active</span></div>
                            </div>
                            <div className="ct-body">
                                <div className="ct-confirm ct-flat" data-appear="0.10">
                                    <div className="ct-ico ct-muted">&#9742;</div>
                                    <div className="ct-cmeta"><div className="ct-a">Missed call &middot; (713) 555&ndash;0148</div><div className="ct-b">No voicemail left</div></div>
                                    <div className="ct-stamp ct-time">7:42 PM</div>
                                </div>
                                <div className="ct-rlab ct-right" data-appear="0.34">You &middot; auto-text</div>
                                <div className="ct-typing" data-appear="0.34" data-vanish="0.52"><span /><span /><span /></div>
                                <div className="ct-bub agent" data-appear="0.52">Hi! Sorry we just missed you, this is Bella Med Spa. Want me to get you booked? Reply here and I&rsquo;ll take care of it.</div>
                                <div className="ct-confirm" data-appear="0.70">
                                    <div className="ct-ico">&#9993;</div>
                                    <div className="ct-cmeta"><div className="ct-a">Text sent automatically</div><div className="ct-b">4 seconds after the missed call</div></div>
                                    <div className="ct-stamp"><span className="ct-c" data-appear="0.78" data-pop>&#10003;</span>Sent</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 03 — card left, copy right */}
                <div className="ct-row" data-i="2" data-side="left">
                    <div className="ct-node" data-n="3" />
                    <div className="ct-visual">
                        <div className="ct-card">
                            <div className="ct-glow" />
                            <div className="ct-head">
                                <div className="ct-crown">&#9812;</div>
                                <div className="ct-who"><div className="ct-name">Call Summary</div><div className="ct-sub">sent to the owner</div></div>
                                <div className="ct-pill"><span className="ct-d" /><span className="ct-l">Done</span></div>
                            </div>
                            <div className="ct-body">
                                <div className="ct-field" data-appear="0.10"><span className="ct-k">To</span><span className="ct-v">owner@bellamedspa.com</span></div>
                                <div className="ct-field" data-appear="0.20"><span className="ct-k">Subject</span><span className="ct-v">Call summary &mdash; new booking (facial)</span></div>
                                <div className="ct-rlist">
                                    <div className="ct-ritem" data-appear="0.32"><span className="ct-dot" />New client booked a facial for Friday at 2:00 PM.</div>
                                    <div className="ct-ritem" data-appear="0.42"><span className="ct-dot" />Asked about pricing &mdash; quoted the intro offer.</div>
                                    <div className="ct-ritem" data-appear="0.52"><span className="ct-dot" />Mood: warm, ready to buy. Worth a personal follow-up.</div>
                                    <div className="ct-ritem" data-appear="0.60"><span className="ct-dot" />Full transcript + recording attached.</div>
                                </div>
                                <div className="ct-confirm" data-appear="0.72">
                                    <div className="ct-ico">&#9993;</div>
                                    <div className="ct-cmeta"><div className="ct-a">Summary emailed to you</div><div className="ct-b">The moment the call ended</div></div>
                                    <div className="ct-stamp"><span className="ct-c" data-appear="0.80" data-pop>&#10003;</span>Sent</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ct-copy">
                        <div className="ct-num">03 &middot; After every call</div>
                        <h3>Sends you a clean summary.</h3>
                        <p>Who called, what they wanted, what got booked. A tidy recap lands in your inbox the second the call ends. You read it in ten seconds.</p>
                    </div>
                </div>

                {/* 04 — copy left, card right */}
                <div className="ct-row" data-i="3" data-side="right">
                    <div className="ct-node" data-n="4" />
                    <div className="ct-copy">
                        <div className="ct-num">04 &middot; Behind the scenes</div>
                        <h3>Logs everything to your systems.</h3>
                        <p>Every booking hits your calendar and every lead lands in your CRM automatically. Nothing re-typed, nothing dropped, nothing to chase.</p>
                    </div>
                    <div className="ct-visual">
                        <div className="ct-card">
                            <div className="ct-glow" />
                            <div className="ct-head">
                                <div className="ct-crown">&#9812;</div>
                                <div className="ct-who"><div className="ct-name">CRM Sync</div><div className="ct-sub">lead + booking written</div></div>
                                <div className="ct-pill"><span className="ct-d" /><span className="ct-l">Synced</span></div>
                            </div>
                            <div className="ct-body">
                                <div className="ct-crow" data-appear="0.12"><span className="ct-k">Name</span><span className="ct-v">Jordan Reyes</span><span className="ct-tag">New lead</span></div>
                                <div className="ct-crow" data-appear="0.24"><span className="ct-k">Service</span><span className="ct-v">Facial &middot; Fri 2:00 PM</span></div>
                                <div className="ct-crow" data-appear="0.36"><span className="ct-k">Source</span><span className="ct-v">Inbound call</span></div>
                                <div className="ct-crow" data-appear="0.48"><span className="ct-k">Status</span><span className="ct-v">Booked</span><span className="ct-tag">Calendar &#10003;</span></div>
                                <div className="ct-confirm" data-appear="0.66">
                                    <div className="ct-ico">&#9741;</div>
                                    <div className="ct-cmeta"><div className="ct-a">Written to your CRM &amp; calendar</div><div className="ct-b">No one typed a thing</div></div>
                                    <div className="ct-stamp"><span className="ct-c" data-appear="0.76" data-pop>&#10003;</span>Synced</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .ct-wrap { position: relative; max-width: 1080px; margin: 24px auto 0; padding: 20px 8px 20px; }
                .ct-spine { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; transform: translateX(-50%); background: rgba(255,255,255,0.08); }
                .ct-fill { position: absolute; inset: 0 0 auto 0; width: 100%; height: 0; background: linear-gradient(#C9A84C, #6b5c2e); transition: height .6s ease; }

                .ct-row { position: relative; display: grid; grid-template-columns: 1fr 1fr; column-gap: 72px; align-items: center; padding: 56px 0; min-height: 56vh; }
                .ct-row[data-side="left"] .ct-visual { grid-column: 1; }
                .ct-row[data-side="left"] .ct-copy { grid-column: 2; text-align: left; }
                .ct-row[data-side="right"] .ct-copy { grid-column: 1; text-align: right; justify-self: end; }
                .ct-row[data-side="right"] .ct-visual { grid-column: 2; }

                .ct-node { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: 20px; height: 20px; border-radius: 50%; background: #15151A; border: 2px solid rgba(255,255,255,0.08); z-index: 3; transition: all .5s ease; }
                .ct-node::after { content: attr(data-n); position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.4); transition: color .5s; }
                .ct-row.in .ct-node { border-color: #C9A84C; background: #C9A84C; box-shadow: 0 0 0 7px rgba(201,168,76,0.14); }
                .ct-row.in .ct-node::after { color: #12100a; font-weight: 700; }

                .ct-copy { max-width: 38ch; }
                .ct-row[data-side="right"] .ct-copy { margin-left: auto; }
                .ct-num { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.2em; color: #C9A84C; text-transform: uppercase; }
                .ct-copy h3 { font-family: var(--font-sans); font-size: clamp(22px, 3vw, 32px); font-weight: 600; letter-spacing: -0.02em; margin: 14px 0 16px; line-height: 1.1; color: #fff; text-wrap: balance; }
                .ct-copy p { color: rgba(255,255,255,0.6); font-size: 16px; line-height: 1.6; }

                /* reveal on enter */
                .ct-visual, .ct-copy > * { opacity: 0; transition: opacity .7s ease, transform .7s ease; }
                .ct-row[data-side="left"] .ct-visual { transform: translateX(-30px); }
                .ct-row[data-side="right"] .ct-visual { transform: translateX(30px); }
                .ct-copy > * { transform: translateY(16px); }
                .ct-row.in .ct-visual { opacity: 1; transform: translateX(0); }
                .ct-row.in .ct-copy > * { opacity: 1; transform: translateY(0); }
                .ct-row.in .ct-num { transition-delay: .05s; }
                .ct-row.in .ct-copy h3 { transition-delay: .12s; }
                .ct-row.in .ct-copy p { transition-delay: .19s; }

                .ct-card { position: relative; border-radius: 24px; background: linear-gradient(180deg,#16161C,#101015); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 40px 100px rgba(0,0,0,0.55); padding: 26px; overflow: hidden; }
                .ct-glow { position: absolute; left: 50%; bottom: -45%; transform: translateX(-50%); width: 90%; height: 70%; background: radial-gradient(closest-side, rgba(201,168,76,0.15), transparent); pointer-events: none; }
                .ct-head { display: flex; align-items: center; gap: 13px; margin-bottom: 20px; }
                .ct-crown { width: 40px; height: 40px; border-radius: 11px; flex: 0 0 auto; background: linear-gradient(160deg,#20201a,#141410); border: 1px solid rgba(201,168,76,0.4); display: flex; align-items: center; justify-content: center; color: #C9A84C; font-size: 18px; }
                .ct-who { flex: 1; }
                .ct-name { font-family: var(--font-sans); font-size: 17px; font-weight: 600; letter-spacing: -0.02em; color: #fff; }
                .ct-sub { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.07em; color: rgba(255,255,255,0.4); margin-top: 3px; }
                .ct-pill { display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 999px; background: rgba(201,168,76,0.14); border: 1px solid rgba(201,168,76,0.35); }
                .ct-d { width: 8px; height: 8px; border-radius: 50%; background: #C9A84C; }
                .ct-row.in .ct-d { animation: ct-pulse 1.6s ease-in-out infinite; }
                .ct-l { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; color: #C9A84C; text-transform: uppercase; }

                .ct-body { display: flex; flex-direction: column; gap: 11px; min-height: 230px; }
                .ct-body [data-appear] { will-change: opacity, transform; }
                .ct-wave { display: flex; align-items: flex-end; gap: 4px; height: 30px; justify-content: center; margin-bottom: 4px; }
                .ct-wave i { width: 4px; border-radius: 3px; background: linear-gradient(#C9A84C, rgba(201,168,76,0.3)); height: 7px; }
                .ct-row.in .ct-wave i { animation: voicewave 1.1s ease-in-out infinite; transform-origin: bottom; height: 26px; }

                .ct-rlab { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin: 0 3px; }
                .ct-rlab.ct-right { text-align: right; }
                .ct-bub { max-width: 84%; padding: 12px 16px; border-radius: 15px; font-size: 15px; line-height: 1.35; }
                .ct-bub.caller { align-self: flex-start; background: #1B1B22; border: 1px solid rgba(255,255,255,0.08); border-top-left-radius: 5px; color: #fff; }
                .ct-bub.agent { align-self: flex-end; background: linear-gradient(160deg, rgba(201,168,76,0.20), rgba(201,168,76,0.08)); border: 1px solid rgba(201,168,76,0.3); color: #F3E9CC; border-top-right-radius: 5px; }

                .ct-typing { display: inline-flex; gap: 5px; align-self: flex-end; padding: 12px 16px; border-radius: 15px; background: linear-gradient(160deg, rgba(201,168,76,0.16), rgba(201,168,76,0.06)); border: 1px solid rgba(201,168,76,0.25); }
                .ct-typing span { width: 7px; height: 7px; border-radius: 50%; background: rgba(201,168,76,0.8); }
                .ct-row.in .ct-typing span { animation: ct-typing 1.1s ease-in-out infinite; }
                .ct-row.in .ct-typing span:nth-child(2) { animation-delay: .15s; }
                .ct-row.in .ct-typing span:nth-child(3) { animation-delay: .3s; }

                .ct-confirm { margin-top: auto; display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 13px; background: #1B1B22; border: 1px solid rgba(201,168,76,0.3); }
                .ct-confirm.ct-flat { margin-top: 0; border-color: rgba(255,255,255,0.08); }
                .ct-ico { width: 36px; height: 36px; border-radius: 9px; flex: 0 0 auto; background: #0f0f13; border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; flex-direction: column; color: #C9A84C; font-size: 16px; }
                .ct-ico.ct-muted { color: rgba(255,255,255,0.6); }
                .ct-m { font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.06em; }
                .ct-dd { font-size: 15px; font-weight: 700; line-height: 1; color: #fff; }
                .ct-cmeta { flex: 1; }
                .ct-a { font-size: 14px; font-weight: 500; color: #fff; }
                .ct-b { font-family: var(--font-mono); font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 3px; }
                .ct-stamp { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #C9A84C; }
                .ct-stamp.ct-time { color: rgba(255,255,255,0.4); }
                .ct-c { width: 20px; height: 20px; border-radius: 50%; background: #C9A84C; color: #12100a; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; }

                .ct-field { display: flex; gap: 10px; font-size: 14px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
                .ct-k { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; color: rgba(255,255,255,0.4); width: 60px; flex: 0 0 auto; padding-top: 2px; }
                .ct-field .ct-v { color: #fff; }
                .ct-rlist { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
                .ct-ritem { display: flex; align-items: flex-start; gap: 9px; font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.4; }
                .ct-dot { width: 5px; height: 5px; border-radius: 50%; background: #C9A84C; flex: 0 0 auto; margin-top: 7px; }

                .ct-crow { display: flex; align-items: center; gap: 11px; padding: 11px 13px; border-radius: 10px; background: #1B1B22; border: 1px solid rgba(255,255,255,0.08); }
                .ct-crow .ct-k { font-family: var(--font-mono); font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.05em; width: 64px; flex: 0 0 auto; }
                .ct-crow .ct-v { font-size: 14px; color: #fff; font-weight: 500; }
                .ct-tag { margin-left: auto; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #C9A84C; background: rgba(201,168,76,0.14); border: 1px solid rgba(201,168,76,0.3); padding: 4px 9px; border-radius: 999px; }

                @media (max-width: 820px) {
                    .ct-spine { left: 22px; }
                    .ct-row { grid-template-columns: 1fr; row-gap: 22px; padding: 40px 0 40px 52px; min-height: auto; }
                    .ct-node { left: 22px; top: 48px; transform: translate(-50%,0); }
                    .ct-row[data-side="left"] .ct-copy, .ct-row[data-side="right"] .ct-copy { grid-column: 1; text-align: left; justify-self: start; margin: 0; max-width: none; }
                    .ct-row[data-side="left"] .ct-visual, .ct-row[data-side="right"] .ct-visual { grid-column: 1; transform: translateY(20px); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .ct-visual, .ct-copy > * { opacity: 1 !important; transform: none !important; transition: none !important; }
                }
            `}</style>
        </section>
    );
}
