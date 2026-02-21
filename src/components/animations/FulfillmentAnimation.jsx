import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Database, Receipt, Package } from 'lucide-react';

export default function FulfillmentAnimation({ className = "w-full h-full" }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            // SVG Path lengths for strokeDasharray
            const pathLength1 = 120; // CRM to Invoicing
            const pathLength2 = 120; // Invoicing to Fulfillment
            const pathLength3 = 120; // Fulfillment to CRM

            // INITIAL SETUP
            gsap.set('.ff-node', { scale: 0.8, opacity: 0 });
            gsap.set('.ff-circuit', { strokeDasharray: 120, strokeDashoffset: 120 });
            gsap.set('.ff-packet', { opacity: 0 });
            gsap.set('.ff-status-manual', { opacity: 1, y: 0 });
            gsap.set('.ff-status-auto', { opacity: 0, y: 10 });

            // STAGE 1 - Nodes appear (0s - 1s)
            tl.to('.ff-node-1', { scale: 1, opacity: 0.6, duration: 0.5, ease: 'back.out(1.5)' }, 0)
                .to('.ff-node-2', { scale: 1, opacity: 0.6, duration: 0.5, ease: 'back.out(1.5)' }, 0.2)
                .to('.ff-node-3', { scale: 1, opacity: 0.6, duration: 0.5, ease: 'back.out(1.5)' }, 0.4)
                .to({}, { duration: 0.2 }); // Hold

            // STAGE 2 - Wiring (1s - 2.5s)
            // Line 1: CRM to Invoicing
            tl.to('.ff-circuit-1', { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut' }, 1.0)
                .to(['.ff-node-1', '.ff-node-2'], { borderColor: 'rgba(201,168,76,0.6)', duration: 0.2, yoyo: true, repeat: 1 }, 1.3);

            // Line 2: Invoicing to Fulfillment
            tl.to('.ff-circuit-2', { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut' }, 1.4)
                .to(['.ff-node-2', '.ff-node-3'], { borderColor: 'rgba(201,168,76,0.6)', duration: 0.2, yoyo: true, repeat: 1 }, 1.7);

            // Line 3: Fulfillment to CRM
            tl.to('.ff-circuit-3', { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut' }, 1.8)
                .to(['.ff-node-3', '.ff-node-1'], { borderColor: 'rgba(201,168,76,0.6)', duration: 0.2, yoyo: true, repeat: 1 }, 2.1);

            // Brighten all nodes
            tl.to('.ff-node', { opacity: 1, borderColor: 'rgba(201,168,76,0.3)', boxShadow: '0 0 15px rgba(201,168,76,0.2)', duration: 0.4 }, 2.2);

            // STAGE 3 - Data flowing & Status Change (2.5s - 4.5s)
            const flowStart = 2.5;

            // Status Text swap
            tl.to('.ff-status-manual', { opacity: 0, y: -10, duration: 0.3 }, flowStart)
                .to('.ff-status-auto', { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(2)' }, flowStart + 0.1);

            // Data Packets (Simulated motion along the straight lines via x/y offsets)
            // Packet 1: CRM (top center) to Invoicing (bottom left)
            tl.fromTo('.ff-packet-1',
                { opacity: 0, x: 0, y: 0 },
                { opacity: 1, duration: 0.1 }, flowStart)
                .to('.ff-packet-1', { x: -60, y: 80, duration: 0.8, ease: 'none' }, flowStart)
                .to('.ff-packet-1', { opacity: 0, duration: 0.1 }, flowStart + 0.7);

            // Packet 2: Invoicing (bottom left) to Fulfillment (bottom right)
            tl.fromTo('.ff-packet-2',
                { opacity: 0, x: -60, y: 80 },
                { opacity: 1, duration: 0.1 }, flowStart + 0.4)
                .to('.ff-packet-2', { x: 60, y: 80, duration: 0.8, ease: 'none' }, flowStart + 0.4)
                .to('.ff-packet-2', { opacity: 0, duration: 0.1 }, flowStart + 1.1);

            // Packet 3: Fulfillment (bottom right) to CRM (top center)
            tl.fromTo('.ff-packet-3',
                { opacity: 0, x: 60, y: 80 },
                { opacity: 1, duration: 0.1 }, flowStart + 0.8)
                .to('.ff-packet-3', { x: 0, y: 0, duration: 0.8, ease: 'none' }, flowStart + 0.8)
                .to('.ff-packet-3', { opacity: 0, duration: 0.1 }, flowStart + 1.5);

            // STAGE 4 - Hold
            tl.to({}, { duration: 1.0 });

            // RESET
            tl.to('.ff-container', { opacity: 0, duration: 0.4 })
                .set('.ff-node', { scale: 0.8, opacity: 0, borderColor: 'rgba(255,255,255,0.1)', boxShadow: 'none' })
                .set('.ff-circuit', { strokeDashoffset: 120 })
                .set('.ff-packet', { opacity: 0, x: 0, y: 0 })
                .set('.ff-status-manual', { opacity: 1, y: 0 })
                .set('.ff-status-auto', { opacity: 0, y: 10 })
                .to('.ff-container', { opacity: 1, duration: 0.4 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={`relative overflow-hidden rounded-2xl bg-[#0D0D12]/50 border border-white/5 flex flex-col items-center justify-center p-6 ${className}`}>
            <div className="ff-container relative w-full h-[200px] flex items-center justify-center max-w-[280px]">

                {/* SVG Connecting Lines (Absolute behind) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 200 160">
                    {/* CRM (100, 20) to Invoicing (40, 100) */}
                    <path className="ff-circuit ff-circuit-1" d="M 100 20 L 40 100" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeDasharray="120" strokeDashoffset="120" opacity="0.6" />
                    {/* Invoicing (40, 100) to Fulfillment (160, 100) */}
                    <path className="ff-circuit ff-circuit-2" d="M 40 100 L 160 100" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeDasharray="120" strokeDashoffset="120" opacity="0.6" />
                    {/* Fulfillment (160, 100) to CRM (100, 20) */}
                    <path className="ff-circuit ff-circuit-3" d="M 160 100 L 100 20" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeDasharray="120" strokeDashoffset="120" opacity="0.6" />
                </svg>

                {/* Triangle Grid Setup */}
                <div className="relative w-[180px] h-[140px] z-10">

                    {/* Node 1: CRM (Top Center) */}
                    <div className="ff-node ff-node-1 absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                        <div className="bg-[#1A1A22] border border-white/10 rounded-xl p-3 flex items-center justify-center transition-colors">
                            <Database size={20} className="text-white/60" />
                        </div>
                        <span className="font-mono text-[9px] text-white/40 tracking-wider">CRM</span>
                    </div>

                    {/* Node 2: Invoicing (Bottom Left) */}
                    <div className="ff-node ff-node-2 absolute bottom-0 left-0 flex flex-col items-center gap-2">
                        <div className="bg-[#1A1A22] border border-white/10 rounded-xl p-3 flex items-center justify-center transition-colors">
                            <Receipt size={20} className="text-white/60" />
                        </div>
                        <span className="font-mono text-[9px] text-white/40 tracking-wider">INVOICE</span>
                    </div>

                    {/* Node 3: Fulfillment (Bottom Right) */}
                    <div className="ff-node ff-node-3 absolute bottom-0 right-0 flex flex-col items-center gap-2">
                        <div className="bg-[#1A1A22] border border-white/10 rounded-xl p-3 flex items-center justify-center transition-colors">
                            <Package size={20} className="text-white/60" />
                        </div>
                        <span className="font-mono text-[9px] text-white/40 tracking-wider">FULFILL</span>
                    </div>

                    {/* Data Packets */}
                    {/* Initial positions matches CRM node center (approx relative to container) */}
                    <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                        <div className="ff-packet ff-packet-1 absolute w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(201,168,76,0.8)]"></div>
                        <div className="ff-packet ff-packet-2 absolute w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(201,168,76,0.8)]"></div>
                        <div className="ff-packet ff-packet-3 absolute w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(201,168,76,0.8)]"></div>
                    </div>
                </div>
            </div>

            {/* Status Label (Bottom Center) */}
            <div className="relative mt-2 h-6 flex items-center justify-center w-full">
                <span className="ff-status-manual absolute font-mono text-xs text-white/30 tracking-widest uppercase line-through">Manual</span>
                <span className="ff-status-auto absolute font-mono text-xs text-brand-accent tracking-widest uppercase drop-shadow-[0_0_8px_rgba(201,168,76,0.4)]">Automated</span>
            </div>
        </div>
    );
}
