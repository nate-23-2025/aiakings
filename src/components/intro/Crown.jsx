// The crown mark from the intro and the page transitions. Drawn as two
// strokes with pathLength 1, so a stroke-dashoffset tween traces it like a pen.
export default function Crown({ className = '' }) {
    return (
        <svg viewBox="0 0 64 36" className={className} fill="none" aria-hidden="true">
            <path
                d="M6 27 L10 9 L22 19 L32 4 L42 19 L54 9 L58 27 Z"
                pathLength="1"
                stroke="#C9A84C"
                strokeWidth="1.6"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ strokeDasharray: 1 }}
            />
            <path d="M8 32 H56" pathLength="1" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" style={{ strokeDasharray: 1 }} />
            <circle cx="32" cy="4" r="1.6" fill="#F1DC9B" className="crown-gem" />
        </svg>
    );
}
