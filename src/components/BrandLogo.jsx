// Original SVG artwork from SVGL, kept as images so surrounding text colors
// cannot recolor the logos. Sources are in public/brands/sources.json.
export default function BrandLogo({ name, size = 24, className = '', decorative = true }) {
    return <img src={`/brands/${name}.svg`} width={size} height={size}
        className={`brand-logo ${className}`} alt={decorative ? '' : name}
        aria-hidden={decorative || undefined} draggable="false" decoding="async" />;
}
