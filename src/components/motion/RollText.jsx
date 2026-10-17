// Letters that roll up on hover: each one slides out the top while its copy
// slides in from below, a beat after the letter before it. The copy is a text
// shadow, so there is only one set of letters in the page. Screen readers get
// the plain word. The parent link carries the .roll-host class (.roll in
// index.css). From the link hover in "Immersive Full Screen Navigation"
// (hyperiux) on 21st.dev.
export default function RollText({ text }) {
    return (
        <>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true" className="roll">
                {[...text].map((c, i) => (
                    <span key={i} style={{ '--i': i }}>{c === ' ' ? ' ' : c}</span>
                ))}
            </span>
        </>
    );
}
