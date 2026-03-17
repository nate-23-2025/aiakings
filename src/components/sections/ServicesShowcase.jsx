import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Crosshair, Bot, Workflow, Target,
    Search, Mail, Linkedin, Filter,
    Headphones, Eye, Database, CalendarCheck,
    Settings, ShieldCheck, BarChart3, FlaskConical,
} from 'lucide-react';
import ServiceCard from '../features/ServiceCard';

gsap.registerPlugin(ScrollTrigger);

/* ─── Category definitions ─── */
const CATEGORIES = [
    { id: 'gtm', label: 'Go-To-Market', icon: Crosshair },
    { id: 'agents', label: 'Agentic AI', icon: Bot },
    { id: 'automation', label: 'Automation', icon: Workflow },
    { id: 'strategy', label: 'Strategy', icon: Target },
];

/* ─── Service data with category assignments ─── */
const SERVICES = [
    /* ── GO-TO-MARKET ── */
    {
        id: 'prospect-research', category: 'gtm',
        icon: Search,
        title: 'Prospect Research & List Building',
        painPoint: 'Buying generic lists. Spending hours on LinkedIn. Half your contacts are outdated or irrelevant.',
        outcome: 'Laser-targeted prospect lists built from real intent signals.',
        animPattern: 'chaosToOrder',
        today: ['Buying generic contact lists', 'Manual LinkedIn searches', 'Outdated or irrelevant contacts', 'No verification or enrichment'],
        automation: ['Firmographic + technographic filters applied', 'Contacts verified and enriched automatically', 'Lists refreshed on cadence', 'Delivered directly to your outreach tool'],
        ai: ['Score prospects by fit and intent', 'Identify lookalike companies from closed deals', 'Surface hiring signals and funding events'],
    },
    {
        id: 'cold-email', category: 'gtm',
        icon: Mail,
        title: 'AI Cold Email Campaigns',
        painPoint: 'Writing the same email 500 times. Low open rates. Replies going to spam. No personalization at scale.',
        outcome: '10,000+ personalized emails per month with 35%+ open rates.',
        animPattern: 'manualToAutomated',
        today: ['Writing emails one at a time', 'Copy-paste personalization', 'Low open and reply rates', 'No A/B testing or optimization'],
        automation: ['Personalized sequences generated per prospect', 'Multi-touch follow-ups triggered automatically', 'Domain warming and deliverability managed', 'A/B tests run continuously'],
        ai: ['Generate personalized opening lines from prospect data', 'Optimize send times per recipient', 'Detect positive reply intent and route to sales'],
    },
    {
        id: 'linkedin-outreach', category: 'gtm',
        icon: Linkedin,
        title: 'LinkedIn Outreach Automation',
        painPoint: 'Spending 2 hours a day on LinkedIn. Connection requests ignored. No system for follow-ups.',
        outcome: 'Automated multi-channel outreach across email + LinkedIn.',
        animPattern: 'disconnectedToConnected',
        today: ['Manual connection requests', 'No follow-up system', 'Hours spent scrolling feeds', 'Inconsistent messaging'],
        automation: ['Connection requests sent on autopilot', 'Multi-step message sequences', 'Synced with email campaigns for multi-channel', 'Activity logged to CRM'],
        ai: ['Personalize connection messages from profile data', 'Identify best time to engage', 'Flag warm leads for immediate follow-up'],
    },
    {
        id: 'lead-scoring', category: 'gtm',
        icon: Filter,
        title: 'Lead Scoring & Qualification',
        painPoint: 'Every lead treated the same. Sales wasting time on unqualified prospects. No way to prioritize.',
        outcome: 'Sales only talks to leads most likely to close.',
        animPattern: 'unknownToGuided',
        today: ['All leads treated equally', 'No scoring methodology', 'Sales wastes time on bad fits', 'Pipeline visibility is guesswork'],
        automation: ['Leads scored automatically on ingestion', 'Qualification criteria enforced before handoff', 'Priority queue updated in real time'],
        ai: ['Predict conversion likelihood from behavior', 'Surface buying signals from email engagement', 'Recommend next best action per lead'],
    },
    /* ── AGENTIC AI ── */
    {
        id: 'support-agent', category: 'agents',
        icon: Headphones,
        title: 'Customer Support Agent',
        painPoint: 'Missed calls. Slow response times. Customers leave before they ever talk to a human.',
        outcome: '24/7 support that qualifies leads and books meetings while you sleep.',
        animPattern: 'pendingToResolved',
        today: ['Missed calls and voicemails', 'Slow email response times', 'Customers churning from frustration', 'No after-hours coverage'],
        automation: ['Inbound queries handled instantly', 'FAQs answered without human involvement', 'Meetings booked directly on your calendar', 'Escalation to humans when needed'],
        ai: ['Understand natural language queries', 'Qualify leads through conversation', 'Learn from past interactions to improve'],
    },
    {
        id: 'sales-intel', category: 'agents',
        icon: Eye,
        title: 'Sales Intelligence Agent',
        painPoint: 'Website visitors leave without a trace. No idea who visited, what they looked at, or how to follow up.',
        outcome: 'Every high-intent visitor identified and engaged automatically.',
        animPattern: 'missingToComplete',
        today: ['Anonymous website traffic', 'No visitor identification', 'No trigger-based outreach', 'Sales flying blind'],
        automation: ['Visitor companies identified in real time', 'High-intent pages trigger alerts', 'Personalized outreach fired automatically', 'Activity synced to CRM'],
        ai: ['Score visitors by engagement depth', 'Match visitors to prospect lists', 'Generate personalized follow-up messaging'],
    },
    {
        id: 'data-agent', category: 'agents',
        icon: Database,
        title: 'Data Processing Agent',
        painPoint: 'Copy-pasting between tools. Manual data entry. The same information typed into 3 different systems.',
        outcome: 'Zero manual data entry. Error-free processing across your stack.',
        animPattern: 'manualToAutomated',
        today: ['Copy-pasting between systems', 'Manual data entry and re-keying', 'Errors from human transcription', 'Hours lost to repetitive work'],
        automation: ['Data extracted and transformed automatically', 'Fields validated before entry', 'Synced across all systems in real time'],
        ai: ['Detect anomalies in incoming data', 'Flag entries needing human review', 'Pre-fill fields for one-click approval'],
    },
    {
        id: 'appointment-agent', category: 'agents',
        icon: CalendarCheck,
        title: 'Appointment Setting Agent',
        painPoint: 'Back-and-forth emails to schedule meetings. Double bookings. No-shows with no follow-up.',
        outcome: 'Meetings booked, confirmed, and reminded — all on autopilot.',
        animPattern: 'chaosToOrder',
        today: ['Manual scheduling back-and-forth', 'Double bookings and conflicts', 'No-shows without follow-up', 'Calendar management eating hours'],
        automation: ['Calendar availability shared automatically', 'Meetings booked without human intervention', 'Reminders and confirmations sent on schedule', 'No-show follow-ups triggered instantly'],
        ai: ['Suggest optimal meeting times', 'Predict no-show likelihood and adjust reminders', 'Route meetings to the right team member'],
    },
    /* ── AUTOMATION ── */
    {
        id: 'crm-integration', category: 'automation',
        icon: Settings,
        title: 'CRM Integration & Management',
        painPoint: 'Data stuck in silos. CRM never up to date. Nobody trusts the numbers in your pipeline.',
        outcome: 'Single source of truth. Every touchpoint logged automatically.',
        animPattern: 'disconnectedToConnected',
        today: ['CRM data is stale and incomplete', 'Manual entry after every interaction', 'Pipeline numbers unreliable', 'Tools disconnected from each other'],
        automation: ['All interactions logged automatically', 'Contact records enriched on ingestion', 'Pipeline stages updated in real time', 'Tools connected via API integrations'],
        ai: ['Predict deal outcomes from activity data', 'Surface at-risk deals before they stall', 'Recommend next actions per opportunity'],
    },
    {
        id: 'deliverability', category: 'automation',
        icon: ShieldCheck,
        title: 'Email Deliverability Management',
        painPoint: 'Emails landing in spam. Domain reputation tanking. No idea why open rates dropped.',
        outcome: '98%+ inbox placement. Sender reputation protected.',
        animPattern: 'pendingToResolved',
        today: ['Emails going to spam folders', 'Domain reputation degrading', 'No SPF/DKIM/DMARC setup', 'Open rates declining with no diagnosis'],
        automation: ['Domain warming on autopilot', 'SPF/DKIM/DMARC configured and monitored', 'Bounce rates tracked and addressed', 'Sender reputation dashboards'],
        ai: ['Predict deliverability issues before they hit', 'Recommend content changes to avoid spam filters', 'Optimize sending patterns per domain'],
    },
    {
        id: 'reporting-dash', category: 'automation',
        icon: BarChart3,
        title: 'Reporting & Analytics Dashboard',
        painPoint: 'Pulling numbers from 5 different tools. Manually building reports. No real-time visibility into performance.',
        outcome: 'One dashboard. Real-time metrics. Zero manual reporting.',
        animPattern: 'manualToAutomated',
        today: ['Data scattered across multiple tools', 'Reports built manually in spreadsheets', 'No real-time performance visibility', 'Hours spent compiling weekly updates'],
        automation: ['Data aggregated from all sources automatically', 'Dashboards update in real time', 'Scheduled reports delivered on cadence', 'Alerts triggered on key metric changes'],
        ai: ['Generate executive summaries from raw data', 'Spot trends and anomalies automatically', 'Recommend optimizations based on performance'],
    },
    {
        id: 'follow-up', category: 'automation',
        icon: Mail,
        title: 'Follow-Up Sequence Automation',
        painPoint: 'Leads go cold because nobody followed up. Manual reminders forgotten. Revenue left on the table.',
        outcome: 'Every lead nurtured. No opportunity falls through the cracks.',
        animPattern: 'missingToComplete',
        today: ['Follow-ups dependent on human memory', 'Leads going cold after first touch', 'No system for multi-touch nurturing', 'Revenue lost to dropped conversations'],
        automation: ['Multi-step sequences triggered by behavior', 'Reminders stop when prospects reply', 'Escalation rules for high-priority leads', 'Activity synced to CRM'],
        ai: ['Adjust messaging based on engagement signals', 'Optimize sequence timing per prospect', 'Identify re-engagement opportunities in dead leads'],
    },
    /* ── STRATEGY ── */
    {
        id: 'icp-research', category: 'strategy',
        icon: Target,
        title: 'ICP & Market Research',
        painPoint: 'Targeting everyone and converting no one. No clear ideal customer profile. Marketing budget wasted on bad fits.',
        outcome: 'Crystal-clear ICP. Every dollar spent on the right audience.',
        animPattern: 'unknownToGuided',
        today: ['Vague target audience', 'No data-driven ICP', 'Marketing budget spread too thin', 'Attracting low-quality leads'],
        automation: ['ICP frameworks built from closed-deal data', 'Market segments defined and prioritized', 'Targeting criteria synced to outreach tools'],
        ai: ['Analyze conversion patterns to refine ICP', 'Identify underserved market segments', 'Surface emerging verticals from data trends'],
    },
    {
        id: 'campaign-optimization', category: 'strategy',
        icon: FlaskConical,
        title: 'Campaign Optimization & A/B Testing',
        painPoint: 'Running the same campaigns with no idea what works. No testing framework. Results plateau and nobody knows why.',
        outcome: 'Continuous improvement. Every campaign better than the last.',
        animPattern: 'manualToAutomated',
        today: ['No systematic testing', 'Same messaging used for months', 'No data on what works vs what doesn\'t', 'Performance plateaus with no diagnosis'],
        automation: ['A/B tests run automatically across variants', 'Winners promoted, losers killed', 'Subject lines, CTAs, and copy tested continuously', 'Performance data fed back into strategy'],
        ai: ['Generate test hypotheses from performance data', 'Predict winning variants before full deployment', 'Recommend messaging pivots based on market response'],
    },
];

export default function ServicesShowcase() {
    const sectionRef = useRef(null);
    const tabBarRef = useRef(null);
    const indicatorRef = useRef(null);
    const gridRef = useRef(null);
    const [activeTab, setActiveTab] = useState('gtm');
    const isFirstRender = useRef(true);

    const activeServices = SERVICES.filter(s => s.category === activeTab);

    /* ─── Header scroll reveal ─── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.svc-header',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    /* ─── Slide gold indicator to active tab ─── */
    const moveIndicator = useCallback(() => {
        const bar = tabBarRef.current;
        const indicator = indicatorRef.current;
        if (!bar || !indicator) return;
        const activeBtn = bar.querySelector(`[data-tab="${activeTab}"]`);
        if (!activeBtn) return;
        const barRect = bar.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();
        gsap.to(indicator, {
            x: btnRect.left - barRect.left,
            width: btnRect.width,
            duration: 0.5,
            ease: 'elastic.out(1, 0.75)',
        });
        // Glow pulse on arrival
        gsap.fromTo(indicator,
            { boxShadow: '0 0 0px rgba(201,168,76,0)' },
            { boxShadow: '0 0 20px rgba(201,168,76,0.6)', duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' }
        );
    }, [activeTab]);

    useEffect(() => {
        moveIndicator();
        window.addEventListener('resize', moveIndicator);
        return () => window.removeEventListener('resize', moveIndicator);
    }, [moveIndicator]);

    /* ─── Card transition on tab change ─── */
    useEffect(() => {
        if (!gridRef.current) return;
        const cards = gridRef.current.querySelectorAll('.svc-card');
        const shimmer = gridRef.current.querySelector('.svc-shimmer');
        if (!cards.length) return;

        if (isFirstRender.current) {
            // First load — rise up with scale
            gsap.fromTo(cards,
                { y: 40, opacity: 0, scale: 0.92 },
                { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
            );
            isFirstRender.current = false;
        } else {
            // Tab switch — dramatic entrance from right with scale + blur clear
            gsap.fromTo(cards,
                { x: 80, opacity: 0, scale: 0.88, filter: 'blur(6px)' },
                { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, stagger: 0.08, ease: 'power3.out' }
            );
            // Gold shimmer line sweeps across
            if (shimmer) {
                gsap.fromTo(shimmer,
                    { x: '-100%', opacity: 1 },
                    { x: '200%', opacity: 0, duration: 0.8, ease: 'power2.inOut' }
                );
            }
        }
    }, [activeTab]);

    /* ─── Handle tab click with exit animation ─── */
    const handleTabClick = (tabId) => {
        if (tabId === activeTab) return;
        const cards = gridRef.current?.querySelectorAll('.svc-card');
        if (cards?.length) {
            gsap.to(cards, {
                x: -60, opacity: 0, scale: 0.9, filter: 'blur(4px)',
                duration: 0.35, stagger: 0.04, ease: 'power3.in',
                onComplete: () => setActiveTab(tabId),
            });
        } else {
            setActiveTab(tabId);
        }
    };

    return (
        <section id="services-showcase" ref={sectionRef} className="py-28 px-8 bg-[#0A0A0E]">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="mb-14 max-w-3xl">
                    <span className="svc-header block text-brand-accent tracking-[0.2em] text-xs font-semibold uppercase mb-4">
                        The Full Stack
                    </span>
                    <h2 className="svc-header text-4xl md:text-5xl lg:text-6xl font-sans font-medium tracking-tight text-white leading-[1.1] mb-6">
                        Everything between{' '}
                        <span className="drama-text text-brand-accent">first touch</span>
                        <br />
                        and closed deal.
                    </h2>
                    <p className="svc-header text-lg text-white/40 font-light leading-relaxed">
                        {SERVICES.length} systems across outbound, AI agents, automation, and strategy — each one engineered with guardrails, real-time analytics, and an AI layer that gets smarter over time.
                    </p>
                </div>

                {/* Tab Bar */}
                <div className="relative mb-10" ref={tabBarRef}>
                    <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                data-tab={cat.id}
                                onClick={() => handleTabClick(cat.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                                    activeTab === cat.id
                                        ? 'text-brand-accent'
                                        : 'text-white/40 hover:text-white/60'
                                }`}
                            >
                                <cat.icon size={15} />
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                    {/* Sliding indicator */}
                    <div
                        ref={indicatorRef}
                        className="absolute bottom-0 left-0 h-[2px] bg-brand-accent rounded-full"
                        style={{ width: 0 }}
                    />
                </div>

                {/* Service Grid — only shows active category */}
                <div ref={gridRef} className="relative grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[280px] overflow-hidden">
                    {/* Gold shimmer line — sweeps across on tab change */}
                    <div className="svc-shimmer absolute inset-y-0 left-0 w-[2px] z-10 pointer-events-none opacity-0"
                         style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(201,168,76,0.8) 40%, rgba(201,168,76,0.8) 60%, transparent 100%)', boxShadow: '0 0 30px 8px rgba(201,168,76,0.2)' }} />
                    {activeServices.map((service, i) => (
                        <ServiceCard key={service.id} service={service} index={i} />
                    ))}
                </div>

                {/* Service count hint */}
                <p className="mt-6 text-center text-[13px] text-white/20">
                    {activeServices.length} automations in this category &middot; Click any card for the full breakdown
                </p>
            </div>
        </section>
    );
}
