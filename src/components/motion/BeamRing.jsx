// A light that travels around the edge of whatever it sits in. Drop it inside
// any element with position: relative and rounded corners; it takes the
// corners from its parent. Modeled on "Animated Border" on 21st.dev, done in
// pure CSS (.beam-ring in index.css). Reduced motion leaves a still gold edge.
export default function BeamRing({ className = '' }) {
    return <span aria-hidden="true" className={`beam-ring ${className}`} />;
}
