import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { SERVICES } from './hero-data';
import './living-brain.css';

const LABELS = ['Workflows', 'AI team', 'Pipeline', 'Tools', 'People'];
const clamp = n => Math.max(0, Math.min(1, n));

function BrainStill() {
    return <svg className="lb-fallback" viewBox="-180 -150 360 300" fill="none" aria-hidden="true">
        <defs><linearGradient id="lb-still-color"><stop stopColor="#8ea5ee" /><stop offset=".5" stopColor="#f1d89a" /><stop offset="1" stopColor="#c9a84c" /></linearGradient></defs>
        <g stroke="url(#lb-still-color)" strokeWidth="1.1">
            {[-1, 1].map(side => <g key={side} transform={`scale(${side},1)`}>
                <path d="M9 104C-2 72 6 40 5 8C2-28-1-68 18-96C35-127 74-132 104-113C138-96 152-62 145-32C166 2 151 34 130 49C133 76 109 91 88 92C70 116 35 120 9 104Z" />
                {Array.from({ length: 8 }, (_, i) => <path key={i} opacity={0.35 + i * 0.06} d={`M${18 + i * 13} ${-91 + i * 2}C${-2 + i * 11} ${-57 + i * 5},${65 + i * 8} ${-72 + i * 8},${35 + i * 11} ${-28 + i * 6}S${86 + i * 5} ${26 + i * 4},${25 + i * 10} ${83 - i * 3}`} />)}
            </g>)}
        </g>
    </svg>;
}

export default function LivingBrain({ ref, still = false }) {
    const rootRef = useRef(null);
    const canvasRef = useRef(null);
    const controlsRef = useRef(null);
    const nodeRefs = useRef([]);
    const engineRef = useRef(null);
    const latestRef = useRef(null);
    const activeRef = useRef(-1);
    const [hovered, setHovered] = useState(-1);
    const [selected, setSelected] = useState(-1);
    const active = hovered < 0 ? selected : hovered;
    useEffect(() => { activeRef.current = active; }, [active]);

    const paint = data => {
        const root = rootRef.current;
        if (!root) return;
        const visible = data.formation > 0.005;
        root.style.visibility = visible ? 'visible' : 'hidden';
        root.setAttribute('aria-hidden', visible ? 'false' : 'true');
        const controls = data.formation > 0.98 && data.journey < 0.065;
        controlsRef.current.inert = !controls;
        controlsRef.current.style.opacity = controls ? '1' : '0';
        controlsRef.current.style.visibility = controls ? 'visible' : 'hidden';
        root.style.setProperty('--lb-entry', clamp(data.journey / 0.6).toFixed(3));
        engineRef.current?.render({ ...data, active: data.journey > 0.05 ? -1 : activeRef.current }, (i, x, y) => {
            nodeRefs.current[i].style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
        });
    };
    useImperativeHandle(ref, () => ({ update(data) { latestRef.current = data; paint(data); } }));

    useEffect(() => {
        if (still) return;
        let disposed = false;
        const root = rootRef.current;
        const canvas = canvasRef.current;
        const lost = e => { e.preventDefault(); root.dataset.ready = 'false'; engineRef.current?.dispose(); engineRef.current = null; };
        canvas.addEventListener('webglcontextlost', lost);
        import('./brain-scene').then(({ createBrainScene }) => {
            if (disposed) return;
            try {
                engineRef.current = createBrainScene(canvas, root.clientWidth, root.clientHeight);
                root.dataset.ready = 'true';
                if (latestRef.current) paint(latestRef.current);
            } catch {
                // The still, vector brain stays visible when WebGL is unavailable.
                root.dataset.ready = 'false';
            }
        }).catch(() => { if (!disposed) root.dataset.ready = 'false'; });
        return () => {
            disposed = true;
            canvas.removeEventListener('webglcontextlost', lost);
            engineRef.current?.dispose(); engineRef.current = null;
        };
    }, [still]);

    return <div className={`lb-scene ${still ? 'is-still' : ''}`} ref={rootRef} data-ready="false">
        <div className="lb-atmosphere" aria-hidden="true" />
        <BrainStill />
        {!still && <canvas className="lb-canvas" ref={canvasRef} aria-hidden="true" />}
        <div className="lb-controls" ref={controlsRef} aria-label="Explore the connections in the AI brain">
            {SERVICES.map((service, i) => <button type="button" key={service.id} className={`lb-node lb-node-${i} ${active === i ? 'is-active' : ''}`} ref={el => { nodeRefs.current[i] = el; }} aria-label={`${service.name}: ${service.tools.map(t => t.name).join(', ')}`} aria-pressed={selected === i} onPointerEnter={e => { if (e.pointerType === 'mouse') setHovered(i); }} onPointerLeave={() => setHovered(-1)} onFocus={() => setHovered(i)} onBlur={() => setHovered(-1)} onClick={() => setSelected(previous => previous === i ? -1 : i)}>
                <span className="lb-node-mark"><img src={service.tools[0].logo} alt="" className={service.tools[0].tile ? 'is-tile' : ''} /></span><span>{LABELS[i]}</span><i />
            </button>)}
            <div className="lb-context" aria-live="polite">{active < 0 ? <span>Explore a connection</span> : <><b>{LABELS[active]}</b><span>{SERVICES[active].tools.map(t => t.name).join(' · ')}</span></>}</div>
        </div>
    </div>;
}
