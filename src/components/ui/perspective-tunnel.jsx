import { useImperativeHandle, useRef } from 'react';
import './perspective-tunnel.css';

// Adapted from Perspective Tunnel Hero by daiwiikharihar on 21st.dev:
// https://21st.dev/@daiwiikharihar/components/perspective-tunnel-hero
// Keeps its golden-angle layout and Z-axis flight. The existing hero supplies
// page-scroll progress, so this version needs no wheel trap or second ticker.
const clamp = n => Math.max(0, Math.min(1, n));

export default function PerspectiveTunnel({ ref, children }) {
    const root = useRef(null);
    const atmosphere = useRef(null);

    useImperativeHandle(ref, () => ({
        update(progress, { w, cy, brainY }) {
            const el = root.current;
            if (!el) return;
            const active = progress > 0.035 && progress < 0.96;
            el.style.setProperty('--tunnel-y', `${(cy + brainY).toFixed(1)}px`);
            el.style.perspective = w < 768 ? '900px' : '1200px';
            atmosphere.current.style.visibility = active ? 'visible' : 'hidden';
            atmosphere.current.style.opacity = Math.min(clamp((progress - 0.035) / 0.1), clamp((0.96 - progress) / 0.12)).toFixed(3);
        },
    }), []);

    return <div className="perspective-tunnel" ref={root} aria-hidden="true">
        <div className="perspective-tunnel-atmosphere" ref={atmosphere}>
        <div className="perspective-tunnel-grid" />
        <div className="perspective-tunnel-guide is-inner" />
        <div className="perspective-tunnel-guide is-outer" />
        </div>
        {children}
    </div>;
}
