import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-brand-primary text-brand-background rounded-t-[4rem] px-8 py-20 mt-32 relative overflow-hidden">
            {/* Background texture matching the Midnight Luxe motif */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2600&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                <div className="col-span-1 md:col-span-2">
                    <Link to="/" className="text-3xl font-bold tracking-tight mb-4 block">
                        AIA KINGS
                    </Link>
                    <p className="opacity-70 max-w-sm font-light">
                        Automating operations and driving precision lead generation for the modern financial atelier and Houston's leading local businesses.
                    </p>

                    <div className="mt-8 flex items-center gap-3 data-text text-sm opacity-80">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Systems Operational</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <span className="font-semibold text-brand-accent tracking-wide text-sm uppercase">Divisions</span>
                    <Link to="/" className="opacity-70 hover:opacity-100 transition-opacity">Finance Protocol</Link>
                    <Link to="/houston" className="opacity-70 hover:opacity-100 transition-opacity">Houston Local</Link>
                    <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">Case Studies</a>
                </div>

                <div className="flex flex-col gap-4">
                    <span className="font-semibold text-brand-accent tracking-wide text-sm uppercase">Legal</span>
                    <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">Privacy Policy</a>
                    <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">Terms of Service</a>
                    <a href="mailto:hello@aiakings.com" className="opacity-70 hover:opacity-100 transition-opacity mt-4 data-text">hello@aiakings.com</a>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/10 text-center opacity-40 text-sm data-text">
                &copy; {new Date().getFullYear()} AIA Kings. All Rights Reserved.
            </div>
        </footer>
    );
}
