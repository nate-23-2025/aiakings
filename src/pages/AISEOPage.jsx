import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import SEOHead from '../components/SEOHead';
import AnswerEngine from '../components/features/AnswerEngine';

gsap.registerPlugin(ScrollTrigger);

// Old search versus how the same customer behaves now. Kept as two plain
// columns so it stays readable when it stacks on a phone.
const SHIFT = [
    { then: 'Typed three words into a box', now: 'Asks a full question out loud' },
    { then: 'Got ten links and a map', now: 'Gets two or three names read back' },
    { then: 'Clicked around and compared', now: 'Calls the first one that sounds right' },
    { then: 'Page two still got some traffic', now: 'There is no page two' },
];

const WORK = [
    {
        title: 'The pages get written as answers',
        body: 'Every service you offer, every area you cover, and every question you get asked on the phone becomes a page that answers it directly. An engine cannot cite you on something you never put in writing.',
    },
    {
        title: 'The site gets made machine readable',
        body: 'Structured data, clean headings, real hours, real service areas, and a page an agent can parse without guessing. Most local sites are readable by people and close to invisible to anything else.',
    },
    {
        title: 'Your listings stop contradicting each other',
        body: 'Same name, same address, same phone, same hours, everywhere you appear. Nothing kills confidence in a business faster than three different phone numbers across four listings.',
    },
    {
        title: 'Your profile stays alive',
        body: 'A business profile that stopped posting and stopped collecting reviews reads as closed. Keeping it current is boring, ongoing, and it is most of the difference.',
    },
    {
        title: 'The reviews keep coming in',
        body: 'Reviews are one of the few signals about you that anything can actually verify, and they go stale. Every finished job ends with the same request to every customer, no filtering and no incentives.',
    },
    {
        title: 'You get told what moved',
        body: 'A monthly report in plain English. What got built, what changed, where you show up now that you did not before, and what I am working on next.',
    },
];

const FAQ = [
    {
        q: 'What is answer engine optimization?',
        a: 'It is the work of making your business readable and citable by the tools people ask instead of scrolling search results. Rather than chasing a position in a list of links, you are making sure that when something answers "who should I call for this near me," your business is one it can see, verify, and has a reason to mention.',
    },
    {
        q: 'Is this different from regular SEO?',
        a: 'The technical foundations overlap, so good AEO work makes normal search better too. The difference is where the weight goes. AEO leans much harder on question-shaped content, structured data an engine can parse, consistency across every place you are listed, and a review profile that is actively growing. And the stakes are sharper, because an answer names two or three businesses rather than ten.',
    },
    {
        q: 'Can you guarantee I will show up in AI answers?',
        a: 'No, and be careful with anyone who does. Nobody controls what an answer engine says, the same way nobody ever controlled a Google ranking. What I control is whether your business is findable, readable, consistent, current, and backed by a live review profile. Skip that work and you are not in the running at all.',
    },
    {
        q: 'What if I do not have a website?',
        a: 'Then that comes first, because there is nothing for an engine to read. I build the site, and it gets built for this from day one rather than retrofitted later. If you already have a site, I work on what is there.',
    },
    {
        q: 'How long does this take to show up?',
        a: 'It is not a switch. The build happens up front, then the profile work, content, and reviews compound month over month. This is a stay-with-it service, not a one time project, and I will tell you that on the call rather than after you have paid.',
    },
    {
        q: 'What does it cost?',
        a: 'It depends on whether you need a site built or already have one, how many services and areas you cover, and whether you want the phone and review side running too. Pricing gets scoped on the call once I know which of those apply to you.',
    },
];

const PAGE_JSONLD = [
    {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Answer Engine Optimization for Local Service Businesses',
        serviceType: 'Answer Engine Optimization',
        provider: {
            '@type': 'ProfessionalService',
            name: 'AI Automation Kings',
            url: 'https://aiautomationkings.com',
        },
        areaServed: { '@type': 'Country', name: 'US' },
        description:
            'Answer engine optimization and website builds for local service businesses. Question-shaped pages, structured data, listing consistency, business profile upkeep, and ongoing review collection, so the tools people ask can read the business and have a reason to name it.',
    },
    {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
        })),
    },
];

export default function AISEOPage() {
    const rootRef = useRef(null);
    const { openCalModal } = useCalModal();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.reveal').forEach((el) => {
                gsap.from(el, {
                    y: 30, opacity: 0, duration: 0.7, ease: 'power2.out',
                    scrollTrigger: { trigger: el, start: 'top 88%' },
                });
            });
        }, rootRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={rootRef} className="bg-brand-primary min-h-screen text-brand-background overflow-x-hidden">
            <SEOHead
                title="AI SEO & Answer Engine Optimization for Local Service Businesses | AIA Kings"
                description="Answer engine optimization for local service businesses. I make your business readable to the tools customers ask, keep your listings and reviews current, and build the site if you do not have one."
                canonical="https://aiautomationkings.com/ai-seo"
                jsonLd={PAGE_JSONLD}
            />

            {/* HERO */}
            <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 px-5 sm:px-6 md:px-8 overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="aurora-blob aurora-blob-1 absolute w-[500px] h-[500px] rounded-full"
                         style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)', top: '-20%', right: '-10%' }} />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <p className="text-brand-accent uppercase tracking-[0.2em] font-mono text-[10px] sm:text-xs mb-5">
                        Answer engine optimization
                    </p>
                    <h1 className="text-[2rem] leading-[1.1] sm:text-4xl md:text-6xl font-sans font-medium tracking-tight text-white mb-5">
                        Be the business it names.
                    </h1>
                    <p className="text-white/60 text-base sm:text-lg md:text-xl font-light max-w-2xl mb-10 leading-relaxed">
                        Your next customer is going to ask a question and get a short list back. This is the work that decides whether your business is one of the names on it, and whether anything happens after they call.
                    </p>
                    <button
                        onClick={openCalModal}
                        className="group relative overflow-hidden bg-brand-accent text-brand-primary px-9 py-4 rounded-[2rem] font-semibold text-base tracking-wide transition-transform active:scale-[0.97] sm:hover:scale-[1.03] duration-300 shadow-[0_0_30px_rgba(201,168,76,0.25)] min-h-[52px] w-full sm:w-auto"
                    >
                        <span className="relative z-10">Book a Call</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 mix-blend-overlay"></div>
                    </button>
                </div>
            </section>

            {/* WHAT CHANGED */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8 bg-[#0A0A0E]">
                <div className="max-w-5xl mx-auto">
                    <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-4">
                        The customer did not change. <span className="drama-text text-brand-accent">The search did.</span>
                    </h2>
                    <p className="reveal text-white/50 text-base sm:text-lg font-light max-w-2xl mb-12 leading-relaxed">
                        Same person, same problem, same urgency. Everything about how they go looking for you is different.
                    </p>

                    <div className="reveal grid grid-cols-2 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
                        <div className="bg-[#0A0A0E] px-4 py-3 sm:px-6 sm:py-4">
                            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white/25">A few years ago</span>
                        </div>
                        <div className="bg-[#0A0A0E] px-4 py-3 sm:px-6 sm:py-4">
                            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-brand-accent">Now</span>
                        </div>

                        {SHIFT.map(({ then, now }) => (
                            <div key={then} className="contents">
                                <div className="bg-[#15151A] px-4 py-4 sm:px-6 sm:py-5">
                                    <p className="text-white/35 text-[13px] sm:text-base font-light leading-snug line-through decoration-white/15">{then}</p>
                                </div>
                                <div className="bg-[#15151A] px-4 py-4 sm:px-6 sm:py-5">
                                    <p className="text-white text-[13px] sm:text-base font-light leading-snug">{now}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* THE TWO STARTING POINTS */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-12">
                        Where you start depends on <span className="drama-text text-brand-accent">one thing.</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="reveal bg-[#15151A] border border-white/[0.07] rounded-[2rem] p-7 sm:p-9">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent">If you have no website</span>
                            <h3 className="text-2xl font-semibold text-white mt-4 mb-4">I build you one.</h3>
                            <p className="text-white/50 text-sm sm:text-base leading-relaxed">
                                There is nothing for an engine to read right now, so nothing else can start. You get a site built for this from the first line rather than patched for it two years later. Fast, works on a phone, phone number you can tap, and every service and area you cover written out as its own answer.
                            </p>
                        </div>

                        <div className="reveal bg-[#15151A] border border-white/[0.07] rounded-[2rem] p-7 sm:p-9">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent">If you already have one</span>
                            <h3 className="text-2xl font-semibold text-white mt-4 mb-4">I work on what is there.</h3>
                            <p className="text-white/50 text-sm sm:text-base leading-relaxed">
                                No rebuild for the sake of a rebuild. I go through what you have, find what an engine cannot read or cannot verify, fix it, then start adding the pages and the profile work that give it something to cite. If the site genuinely cannot get there, I will say so.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE WORK */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8 bg-[#0A0A0E]">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">
                        <div>
                            <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-12">
                                What I actually do <span className="drama-text text-brand-accent">every month.</span>
                            </h2>

                            <div className="flex flex-col gap-8">
                                {WORK.map(({ title, body }) => (
                                    <div key={title} className="reveal flex gap-4">
                                        <Check className="w-5 h-5 text-brand-accent shrink-0 mt-1" strokeWidth={2.5} />
                                        <div>
                                            <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
                                            <p className="text-white/50 text-sm sm:text-base leading-relaxed">{body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="reveal hidden lg:block sticky top-28">
                            <AnswerEngine />
                            <p className="text-white/25 text-xs mt-4 leading-relaxed">
                                Illustration, not a live result. Nobody controls what an answer engine says, which is exactly why the work above is the part worth paying for.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY IT DOES NOT STOP AT RANKING */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-8">
                        Getting named is only worth something <span className="drama-text text-brand-accent">if you pick up.</span>
                    </h2>
                    <p className="reveal text-white/50 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-6">
                        The whole point of this work is a phone that rings more often. That is also where most of it gets wasted. The call comes in at seven at night, you are finishing a job, and by the time you listen to the voicemail the customer has already booked someone else.
                    </p>
                    <p className="reveal text-white/50 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-6">
                        So the ranking work does not ship alone. Something answers every call, handles the usual questions, and puts the job on the calendar. When the job is done, the review request goes out, same ask to every customer.
                    </p>
                    <p className="reveal text-xl sm:text-2xl text-white font-light leading-relaxed">
                        And those reviews are a live signal about your business, which is where the ranking work started. It comes back around.
                    </p>
                </div>
            </section>

            {/* FAQ, on the page and in the schema */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8 bg-[#0A0A0E]">
                <div className="max-w-3xl mx-auto">
                    <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-12">
                        Straight answers.
                    </h2>
                    <div className="flex flex-col gap-8">
                        {FAQ.map(({ q, a }) => (
                            <div key={q} className="reveal border-b border-white/[0.07] pb-8 last:border-0">
                                <h3 className="text-white text-lg sm:text-xl font-medium mb-3">{q}</h3>
                                <p className="text-white/50 text-sm sm:text-base leading-relaxed">{a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 sm:py-28 md:py-36 px-5 sm:px-6 md:px-8 flex justify-center text-center">
                <div className="max-w-3xl flex flex-col items-center w-full">
                    <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-sans tracking-tight mb-6 text-white leading-tight">
                        Want to see what comes back today?
                    </h2>
                    <p className="reveal text-base sm:text-lg text-white/50 font-light mb-10 max-w-xl">
                        Book fifteen minutes. I will look your business up the way your customers do, on the call, and you can see it with me.
                    </p>
                    <button
                        onClick={openCalModal}
                        className="reveal group relative overflow-hidden bg-brand-accent text-brand-primary px-10 py-4 sm:py-5 rounded-[2.5rem] text-base sm:text-lg font-semibold tracking-wide transition-transform active:scale-[0.97] sm:hover:scale-[1.03] duration-300 shadow-[0_0_40px_rgba(201,168,76,0.3)] min-h-[52px] w-full sm:w-auto"
                    >
                        <span className="relative z-10">Book a Call</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 mix-blend-overlay"></div>
                    </button>
                </div>
            </section>
        </div>
    );
}
