import { Link } from 'react-router-dom';
import { ArrowRight, Brain } from 'lucide-react';
import './crown.css';

export default function CrownEntry() {
    return <Link to="/one-brain" className="crown-entry" data-cursor-style="project" data-cursor-label="Explore">
        <Brain strokeWidth={1.2} />
        <div className="crown-entry-copy"><small>ONE BRAIN</small><strong>Your tools and knowledge.<br /><span className="drama-text">One connected AI brain.</span></strong><p>I connect your tools, business knowledge, and daily work in one system. Explore how it works.</p></div>
        <span>Explore One Brain<ArrowRight size={17} /></span>
    </Link>;
}
