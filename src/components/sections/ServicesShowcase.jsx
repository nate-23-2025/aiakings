import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    FileText, Search, UserPlus, Database,
    Archive, CreditCard, BarChart3, Mail,
    ListChecks, BookOpen, ShieldCheck, HardDrive,
    Users, CalendarClock,
    FolderOpen, Handshake, Settings, Scale,
} from 'lucide-react';
import ServiceCard from '../features/ServiceCard';

gsap.registerPlugin(ScrollTrigger);

/* ─── Category definitions ─── */
const CATEGORIES = [
    { id: 'docs', label: 'Documents & Data', icon: FolderOpen },
    { id: 'clients', label: 'Client Management', icon: Handshake },
    { id: 'operations', label: 'Operations', icon: Settings },
    { id: 'compliance', label: 'Compliance & Scale', icon: Scale },
];

/* ─── Service data with category assignments ─── */
const SERVICES = [
    {
        id: 'doc-intake', category: 'docs',
        icon: FileText,
        title: 'Document Intake & Management',
        painPoint: 'Clients email docs randomly. Staff renames, files, merges PDFs, and confirms receipt — for every single client.',
        outcome: 'Save hours weekly. Audit-ready records on autopilot.',
        animPattern: 'chaosToOrder',
        today: ['Clients email documents at random', 'Staff downloads, renames, files manually', 'PDFs merged by hand', 'Receipt confirmed manually', 'Missing docs go unnoticed'],
        automation: ['Dedicated inbox monitored automatically', 'Attachments downloaded and converted to PDF', 'Naming conventions applied, filed into client folders', 'Receipt logged and staff notified instantly'],
        ai: ['Classify document type (W-2, 1099, invoice)', 'Flag unreadable or incomplete documents', 'Detect missing required documents', 'Summarize contents for reviewer'],
    },
    {
        id: 'data-entry', category: 'docs',
        icon: Database,
        title: 'Data Entry & Re-Keying',
        painPoint: 'Copying data from PDFs into software. Entering invoices by hand. The same numbers typed into 3 different tools.',
        outcome: 'Eliminate double-entry. Human review only where it matters.',
        animPattern: 'manualToAutomated',
        today: ['Copying data from PDFs manually', 'Entering invoices one by one', 'Duplicating data across multiple tools'],
        automation: ['Structured data extracted automatically', 'Fields validated before entry', 'Data synced across systems in real time'],
        ai: ['Detect anomalies in extracted values', 'Flag entries needing human review', 'Pre-fill entries for one-click approval'],
    },
    {
        id: 'invoice-archive', category: 'docs',
        icon: Archive,
        title: 'Invoice & Bill Archiving',
        painPoint: 'Manually downloading PDFs, inconsistent backups, and the constant fear of losing data if your software changes.',
        outcome: 'Every invoice backed up, categorized, and searchable.',
        animPattern: 'pendingToResolved',
        today: ['Manually downloading invoice PDFs', 'Inconsistent backup processes', 'Fear of data loss during software changes'],
        automation: ['New invoices/bills detected automatically', 'PDFs exported and saved to Drive', 'Activity logged for audit trail'],
        ai: ['Categorize expense types automatically', 'Flag unusual invoice amounts', 'Summarize vendor spending patterns'],
    },
    {
        id: 'backup', category: 'docs',
        icon: HardDrive,
        title: 'Data Backup & Retention',
        painPoint: 'Manual exports. Inconsistent backups. One missed backup could mean lost client data.',
        outcome: 'Automated, monitored backups. Never lose a file.',
        animPattern: 'unknownToGuided',
        today: ['Manual exports on inconsistent schedules', 'No alerts when backups fail'],
        automation: ['Scheduled backups on reliable cadence', 'Secure cloud storage with redundancy', 'Logs and alerts for every backup event'],
        ai: ['Monitor for backup failures proactively', 'Flag data gaps before they become problems'],
    },
    {
        id: 'missing-docs', category: 'clients',
        icon: Search,
        title: 'Missing Document Tracking',
        painPoint: 'Manual checklists and spreadsheets. Reminder emails that never get sent. Clients who hold up entire engagements.',
        outcome: 'Zero forgotten follow-ups. Clients stay on track.',
        animPattern: 'missingToComplete',
        today: ['Manual checklists per client', 'Spreadsheet tracking for engagement status', 'Reminder emails sent (or forgotten) manually', 'No escalation when clients go dark'],
        automation: ['Per-engagement document checklists auto-generated', 'Received vs missing detected automatically', 'Timed reminder sequences sent without staff effort', 'Reminders stop when docs arrive'],
        ai: ['Adjust reminder tone based on client history', 'Escalate only when needed', 'Summarize who is blocking progress'],
    },
    {
        id: 'onboarding', category: 'clients',
        icon: UserPlus,
        title: 'Client Onboarding',
        painPoint: 'Intake emails, PDFs to fill out, missing info, manual folder creation. Every new client is a 2-hour headache.',
        outcome: 'New clients onboarded in minutes, not days.',
        animPattern: 'manualToAutomated',
        today: ['Intake emails back and forth', 'PDFs sent to fill out manually', 'Missing info discovered too late', 'Folders and tasks created by hand'],
        automation: ['Intake form triggers full workflow', 'Client folder structure created automatically', 'Tasks assigned, client type tagged', 'Confirmation emails sent instantly'],
        ai: ['Review intake for completeness', 'Flag inconsistencies in submitted data', 'Suggest missing information proactively'],
    },
    {
        id: 'billing', category: 'clients',
        icon: CreditCard,
        title: 'Billing & Payment Follow-Ups',
        painPoint: 'Manually sending invoices. Chasing late payments. Awkward "just checking in" emails that never feel right.',
        outcome: 'Invoices out on time. Late payments handled without the awkwardness.',
        animPattern: 'pendingToResolved',
        today: ['Invoices sent manually each cycle', 'Late payments tracked in spreadsheets', 'Awkward follow-up conversations with clients'],
        automation: ['Invoices auto-sent on schedule', 'Friendly reminders triggered by payment status', 'Escalation rules enforce your collection policy'],
        ai: ['Predict which clients will pay late', 'Adjust reminder timing per client', 'Summarize accounts receivable risk'],
    },
    {
        id: 'crm', category: 'clients',
        icon: Users,
        title: 'CRM & Relationship Management',
        painPoint: 'Client notes buried in emails. No consistent tracking. You find out a client is unhappy when they leave.',
        outcome: 'Full client health visibility. Churn risk caught early.',
        animPattern: 'disconnectedToConnected',
        today: ['Client notes scattered across emails', 'Inconsistent relationship tracking', 'No early warning for at-risk clients'],
        automation: ['Interactions logged automatically from all channels', 'Client status updated in real time'],
        ai: ['Summarize client health at a glance', 'Identify churn risk before it escalates', 'Suggest proactive follow-up actions'],
    },
    {
        id: 'email-mgmt', category: 'operations',
        icon: Mail,
        title: 'Email & Communication Management',
        painPoint: 'Inbox overload. Lost threads. Staff manually forwarding messages to the right person. Context disappears.',
        outcome: 'Every email routed, logged, and actionable.',
        animPattern: 'chaosToOrder',
        today: ['Overflowing inboxes with no structure', 'Lost email threads and missed messages', 'Manual forwarding and client-matching'],
        automation: ['Emails auto-labeled by client and topic', 'Routed to correct staff automatically', 'Linked to client records for full context'],
        ai: ['Summarize long email threads', 'Draft reply suggestions', 'Flag urgent messages for immediate action'],
    },
    {
        id: 'task-mgmt', category: 'operations',
        icon: ListChecks,
        title: 'Task & Deadline Management',
        painPoint: 'Sticky notes, verbal reminders, and email threads pretending to be project management. Deadlines slip through.',
        outcome: 'Every deadline tracked. Bottlenecks caught before they cost you.',
        animPattern: 'disconnectedToConnected',
        today: ['Tasks tracked via emails and sticky notes', 'Verbal reminders between staff', 'Deadlines missed without visibility'],
        automation: ['Tasks created automatically from events', 'Deadline reminders sent to owners', 'Status dashboards for firm-wide visibility'],
        ai: ['Predict workload bottlenecks before they hit', 'Suggest task re-assignment when staff is overloaded', 'Highlight risk areas across engagements'],
    },
    {
        id: 'reporting', category: 'operations',
        icon: BarChart3,
        title: 'Monthly & Quarterly Reporting',
        painPoint: 'Running reports, formatting PDFs, emailing clients, saving copies. The same ritual every month, by hand.',
        outcome: 'Reports generated, delivered, and archived automatically.',
        animPattern: 'manualToAutomated',
        today: ['Reports run manually each period', 'Formatted into PDFs by hand', 'Emailed individually to each client', 'Copies saved manually to folders'],
        automation: ['Scheduled report generation on cadence', 'Auto-delivered to clients on time', 'Copies archived automatically'],
        ai: ['Generate executive summaries per report', 'Highlight period-over-period changes', 'Flag issues for partner review'],
    },
    {
        id: 'training', category: 'compliance',
        icon: BookOpen,
        title: 'Staff Training & SOP Enforcement',
        painPoint: 'Tribal knowledge in senior staff heads. New hires take months to ramp. Processes vary person to person.',
        outcome: 'Consistent execution. Faster ramp-up. SOPs that enforce themselves.',
        animPattern: 'unknownToGuided',
        today: ['Tribal knowledge — nothing documented', 'New staff takes months to get productive', 'Processes vary by person'],
        automation: ['SOP checklists triggered by workflow events', 'Required steps enforced before task completion', 'Task completion tracked for accountability'],
        ai: ['Answer SOP questions in real time', 'Guide junior staff step-by-step through processes', 'Detect deviations from standard procedures'],
    },
    {
        id: 'audit', category: 'compliance',
        icon: ShieldCheck,
        title: 'Audit Readiness & Compliance',
        painPoint: 'Scrambling to gather documentation during audits. Searching for proof of actions taken months ago.',
        outcome: 'Audit-ready at all times. Documentation compiled in seconds.',
        animPattern: 'missingToComplete',
        today: ['Manual documentation gathering before audits', 'Stress and scrambling during review periods', 'Searching for proof of past actions'],
        automation: ['Activity logs maintained automatically', 'Document trails with timestamps', 'Every action recorded for compliance'],
        ai: ['Compile audit packets on demand', 'Summarize activity history per client', 'Flag missing documentation before it matters'],
    },
    {
        id: 'busy-season', category: 'compliance',
        icon: CalendarClock,
        title: 'Busy Season Preparation',
        painPoint: 'Every January starts with scrambling. Manual checklists, overwhelmed staff, and the same fire drills as last year.',
        outcome: 'Walk into busy season prepared. Staff focused on high-value work from day one.',
        animPattern: 'chaosToOrder',
        today: ['Scrambling every January', 'Manual pre-season checklists', 'Staff overloaded from day one'],
        automation: ['Pre-season workflows kick off automatically', 'Client document requests sent on schedule', 'Progress dashboards for real-time tracking'],
        ai: ['Predict workload distribution and peaks', 'Flag staffing gaps before they impact delivery', 'Optimize scheduling across the team'],
    },
];

export default function ServicesShowcase() {
    const sectionRef = useRef(null);
    const tabBarRef = useRef(null);
    const indicatorRef = useRef(null);
    const gridRef = useRef(null);
    const [activeTab, setActiveTab] = useState('docs');
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
        <section ref={sectionRef} className="py-28 px-8 bg-[#0A0A0E]">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="mb-14 max-w-3xl">
                    <span className="svc-header block text-brand-accent tracking-[0.2em] text-xs font-semibold uppercase mb-4">
                        What We Automate
                    </span>
                    <h2 className="svc-header text-4xl md:text-5xl lg:text-6xl font-sans font-medium tracking-tight text-white leading-[1.1] mb-6">
                        Your team is buried in{' '}
                        <span className="drama-text text-brand-accent">manual work.</span>
                        <br />
                        We fix that.
                    </h2>
                    <p className="svc-header text-lg text-white/40 font-light leading-relaxed">
                        14 workflows CPA firms run by hand every week — each one automated with guardrails, audit trails, and an AI layer that gets smarter over time.
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
