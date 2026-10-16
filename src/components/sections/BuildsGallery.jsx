import { ArrowUpRight } from 'lucide-react';
import { BUILDS } from '../../data/builds';

// Every build, desktop and phone, as one fanned 3D stack. Hovering a screen
// lifts it to the front and dims the rest; each one opens the live site. On a
// phone the stack becomes a slow, endless strip. Modeled on the "Portfolio
// Gallery" component on 21st.dev, built in CSS (.pg-* in index.css).
const SHOTS = BUILDS.flatMap((b) => [
    { key: `${b.img}-d`, src: `/work/${b.img}.jpg`, w: 1200, h: 750, kind: 'desktop', alt: `${b.name} website, desktop view`, b },
    { key: `${b.img}-p`, src: `/work/${b.img}-phone.jpg`, w: 390, h: 844, kind: 'phone', alt: `${b.name} website, phone view`, b },
]);

function Shot({ s, hidden = false }) {
    return (
        <a
            href={s.b.url}
            target="_blank"
            rel="noopener"
            className={`pg-card pg-${s.kind}`}
            aria-hidden={hidden || undefined}
            tabIndex={hidden ? -1 : undefined}
        >
            <img src={s.src} alt={hidden ? '' : s.alt} width={s.w} height={s.h} loading="lazy" decoding="async" />
            <span className="pg-caption">
                {s.b.short}
                <ArrowUpRight size={12} />
            </span>
        </a>
    );
}

export default function BuildsGallery() {
    return (
        <div className="pg">
            {/* Desktop: the fanned stack */}
            <div data-reveal-group className="pg-stage hidden md:flex">
                {SHOTS.map((s) => <Shot key={s.key} s={s} />)}
            </div>

            {/* Phone: an endless strip. The second copy only makes the loop seamless. */}
            <div className="pg-strip md:hidden">
                <div className="pg-track">
                    {SHOTS.map((s) => <Shot key={s.key} s={s} />)}
                    {SHOTS.map((s) => <Shot key={`${s.key}-dupe`} s={s} hidden />)}
                </div>
            </div>
        </div>
    );
}
