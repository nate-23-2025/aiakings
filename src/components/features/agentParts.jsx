// Shared bits for the three agent animations so they read as one system:
// a consistent "live" label chip and a faint scanline overlay.

export function LiveLabel({ text, right = null }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/60 font-semibold font-mono">{text}</span>
            </div>
            {right && <span className="text-[10px] font-mono text-white/30">{right}</span>}
        </div>
    );
}

export function Scanline() {
    return (
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05]">
            <div className="w-full h-full bg-gradient-to-b from-transparent via-brand-accent/30 to-transparent -translate-y-full animate-[scan_5s_linear_infinite]" />
        </div>
    );
}
