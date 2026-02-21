import { useEffect, useState, useRef } from 'react';
import { Terminal } from 'lucide-react';

const MESSAGES = [
    "> INITIALIZING CLIENT ONBOARDING AGENT...",
    "> CONNECTING TO TAX PORTAL API...",
    "> PARSING W2 AND 1099 DOCUMENTS...",
    "> IDENTIFYING DEDUCTION OPPORTUNITIES...",
    "> SYNCING WITH CRM SYSTEM...",
    "> AGENT DEPLOYMENT COMPLETE.",
];

export default function TelemetryTypewriter() {
    const [text, setText] = useState('');
    const [msgIndex, setMsgIndex] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        let currentText = '';
        let charIndex = 0;
        const targetMsg = MESSAGES[msgIndex];

        const typeInterval = setInterval(() => {
            if (charIndex < targetMsg.length) {
                currentText += targetMsg.charAt(charIndex);
                setText(currentText);
                charIndex++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                    setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
                }, 2000);
            }
        }, 40);

        return () => clearInterval(typeInterval);
    }, [msgIndex]);

    return (
        <div
            className="bg-[#15151A] border border-white/5 rounded-[2rem] p-8 h-80 flex flex-col relative shadow-2xl overflow-hidden"
        >
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#2A2A35]/40 px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-emerald-400/80 font-mono">Live Feed</span>
            </div>

            <div className="mt-8 flex-grow flex flex-col justify-end">
                <div className="mb-4">
                    <Terminal size={24} className="text-brand-accent/50" />
                </div>
                <div className="font-mono text-sm text-brand-accent/90 h-16 leading-relaxed">
                    {text}
                    <span className="inline-block w-2 h-4 ml-1 bg-brand-accent animate-pulse align-middle" />
                </div>
            </div>

            {/* Decorative scanning line */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                <div className="w-full h-full bg-gradient-to-b from-transparent via-brand-accent/10 to-transparent -translate-y-full animate-[scan_4s_linear_infinite]" />
            </div>
        </div>
    );
}
