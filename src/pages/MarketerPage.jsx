import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import SEOHead from '../components/SEOHead';
import AnswerEngine from '../components/features/AnswerEngine';
import ReviewLoop from '../components/features/ReviewLoop';

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
        body: 'Every service you offer, every area you cover, and every question you get asked on the phone becomes a page that answers it directly. Nothing can recommend you for something you never put in writing.',
    },
    {
        title: 'The site gets made readable to AI',
        body: 'Clean headings, real hours, real service areas, and the behind the scenes labels that tell Google and AI exactly what you do and where. Most local sites are readable by people and close to invisible to anything else.',
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
        q: 'What is AI SEO?',
        a: 'It is the work of getting your business named by the tools people ask instead of scrolling search results, like ChatGPT and the AI answer at the top of Google. Rather than chasing a spot in a list of links, you are making sure that when something answers "who should I call for this near me," your business is one it can see, trust, and has a reason to mention.',
    },
    {
        q: 'Is this different from regular SEO?',
        a: 'The groundwork overlaps, so this work makes normal Google search better too. The difference is where the weight goes. It leans much harder on pages that answer real questions, a site AI can read without guessing, the same details everywhere you are listed, and reviews that keep coming in. And the stakes are sharper, because an answer names two or three businesses rather than ten.',
    },
    {
        q: 'Can you guarantee I will show up in AI answers?',
        a: 'No, and be careful with anyone who does. Nobody controls what AI says, the same way nobody ever controlled a Google ranking. What I control is whether your business is findable, readable, consistent, current, and backed by a live review profile. Skip that work and you are not in the running at all.',
    },
    {
        q: 'What if I do not have a website?',
        a: 'Then that comes first, because there is nothing for anything to read. That is the Dev side: I build the site, live in days, and it gets built for this from the first line rather than patched later.',
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
        name: 'AI SEO for Local Service Businesses',
        serviceType: 'Search Engine Optimization',
        provider: {
            '@type': 'ProfessionalService',
            name: 'AI Automation Kings',
            url: 'https://aiautomationkings.com',
        },
        areaServed: { '@type': 'Country', name: 'US' },
        description:
            'AI SEO and answer engine optimization for local service businesses that already have a website. Question-shaped pages, structured data, listing consistency, business profile upkeep, and ongoing review collection, so Google and AI answer tools can read the business and have a reason to name it.',
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

export default function MarketerPage() {
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
                title="AI SEO and Reviews for Local Service Businesses | AIA Kings"
                description="Already have a website? I get local service businesses named when customers search Google and ask AI, keep your listings current, and make sure every job ends with a review request. Houston, Texas."
                canonical="https://aiautomationkings.com/marketer"
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
                        Nate the Marketer
                    </p>
                    <h1 className="text-[2rem] leading-[1.1] sm:text-4xl md:text-6xl font-sans font-medium tracking-tight text-white mb-5">
                        Be the business it names.
                    </h1>
                    <p className="text-white/60 text-base sm:text-lg md:text-xl font-light max-w-2xl mb-10 leading-relaxed">
                        You already have a website. Your next customer is going to search, or ask AI, and get a short list back. This is the work that decides whether your business is one of the names on it, and whether they pick you once they see it.
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

            {/* WHERE I START */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-12">
                        I start with <span className="drama-text text-brand-accent">what you have.</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="reveal bg-[#15151A] border border-white/[0.07] rounded-[2rem] p-7 sm:p-9">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent">You have a website</span>
                            <h3 className="text-2xl font-semibold text-white mt-4 mb-4">No rebuild for the sake of a rebuild.</h3>
                            <p className="text-white/50 text-sm sm:text-base leading-relaxed">
                                I go through what you have, find what Google and AI cannot read or cannot trust, fix it, then start adding the pages and the profile work that give them something to name. If the site genuinely cannot get there, I will say so.
                            </p>
                        </div>

                        <div className="reveal bg-[#15151A] border border-white/[0.07] rounded-[2rem] p-7 sm:p-9 flex flex-col">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">You do not have one yet</span>
                            <h3 className="text-2xl font-semibold text-white mt-4 mb-4">That comes first.</h3>
                            <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-6">
                                There is nothing for anything to read yet, so nothing else can start. That is Nate the Dev, and it is live in days.
                            </p>
                            <Link to="/developer" className="mt-auto text-brand-accent hover:opacity-80 transition-opacity text-sm font-medium">
                                See Nate the Dev &rarr;
                            </Link>
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
                                Illustration, not a live result. Nobody controls what AI says, which is exactly why the work above is the part worth paying for.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* REVIEWS */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-center">
                    <div>
                        <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-8">
                            Getting found gets you on the list. <span className="drama-text text-brand-accent">Reviews get you picked.</span>
                        </h2>
                        <p className="reveal text-white/50 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-6">
                            You have done hundreds of good jobs, and the shop down the road with worse work has more reviews than you. Customers see that number before they ever see your work.
                        </p>
                        <p className="reveal text-white/50 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-6">
                            So every finished job ends with the same ask, sent for you, every time. No remembering, no awkward moment at the truck. Every customer gets the same request, with no filtering and no incentives, because that is how a profile stays clean.
                        </p>
                        <p className="reveal text-xl sm:text-2xl text-white font-light leading-relaxed">
                            And fresh reviews are part of what keeps you getting found. It comes back around.
                        </p>
                    </div>
                    <div className="reveal">
                        <ReviewLoop />
                    </div>
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
