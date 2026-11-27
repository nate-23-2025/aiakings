// Original software artwork, kept as images so text colors cannot recolor it.
// Sources are in public/brands/sources.json.
const FILES = { clio: 'clio.png', simplepractice: 'simplepractice.png', docusign: 'docusign.png' };
export default function BrandLogo({ name, size = 24, className = '', decorative = true }) {
    // The official Clio artwork includes a large social-preview canvas.
    // Frame its original symbol at icon size rather than shrinking the wordmark.
    if (name === 'clio') return <svg width={size} height={size} viewBox="345 225 182 182"
        className={`brand-logo ${className}`} role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : 'Clio'} aria-hidden={decorative || undefined}>
        <image href="/brands/clio.png" width="1200" height="630" />
    </svg>;
    return <img src={`/brands/${FILES[name] || `${name}.svg`}`} width={size} height={size}
        className={`brand-logo ${className}`} alt={decorative ? '' : name}
        aria-hidden={decorative || undefined} draggable="false" decoding="async" />;
}
