import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import SEOHead from '../components/SEOHead';
import CallCatcher from '../components/features/CallCatcher';

gsap.registerPlugin(ScrollTrigger);

// Ranked by how well each one lands on a local owner. Speed first, because it
// is the one they feel immediately.
const BUILD = [
    {
        title: 'Live next week, not next quarter.',
        body: 'Most website projects turn into months of back and forth. Yours is up in days. Services, the areas you cover, proof, and a phone number nobody can miss on a phone screen.',
    },
    {
        title: 'Built to be found, by Google and by AI.',
        body: 'Your site loads fast and is built so Google, ChatGPT, and Perplexity can read it properly. When someone asks AI for a business like yours in your area, you want to be the answer.',
    },
    {
        title: 'Checked twice before it ships.',
        body: 'Every page and every feature gets a second review before it goes live. Most small shops do not review at all.',
    },
    {
        title: 'Built around how you actually work.',
        body: 'If your business books a certain way, quotes a certain way, or needs customers to send photos first, the site works that way too. You do not bend the business to fit a template.',
    },
];

const WORDPRESS = [
    {
        title: 'You are paying rent on a website.',
        body: 'The contact form, the page builder, the SEO add on. Each one has its own yearly bill and its own update that can break the site. You are paying a subscription to keep a website from breaking.',
    },
    {
        title: 'It is slow on phones, and phones are all your customers.',
        body: 'Every second it takes to load, people leave. Those are calls you never knew you missed. On the call I will pull up your real load time so you can see it yourself.',
    },
    {
        title: 'You cannot touch your own website.',
        body: 'If changing a price or adding a service means calling someone and waiting, that costs you every single time. You should be able to change your own prices.',
    },
];

const PHONE = [
    'Every call picked up, nights and weekends included',
    'The usual questions answered the way you would answer them',
    'The job put on your calendar while you are still on the last one',
    'Calls, texts, reviews, and bookings in one place on your phone',
];

const FAQ = [
    {
        q: 'How fast can I be live?',
        a: 'Days, not months. The biggest thing that slows it down is waiting on your logo, your photos, and your list of services, so I collect all of that with you on one call instead of chasing you by email for three weeks.',
    },
    {
        q: 'I already have a website. Do I need a new one?',
        a: 'Not always. If what you have loads fast, works on a phone, and can be read properly, I would rather work on getting it found. That is the Marketer side. If it is holding you back, I will show you why on the call and you can decide.',
    },
    {
        q: 'Do I have to learn new software?',
        a: 'No. It runs whether you open it or not. What changes on your end is that your phone shows conversations that used to be missed calls.',
    },
    {
        q: 'What happens when something needs changing?',
        a: 'You text me and you hear back from me. Not a ticket number and a week of silence.',
    },
    {
        q: 'What does it cost?',
        a: 'It depends on how many services and areas you cover and what you want the site to do. Pricing gets scoped on the call once I know which of those apply to you.',
    },
];

const PAGE_JSONLD = [
    {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Websites for Local Service Businesses',
        serviceType: 'Website design and development',
        provider: {
            '@type': 'ProfessionalService',
            name: 'AI Automation Kings',
            url: 'https://aiautomationkings.com',
        },
        areaServed: { '@type': 'Country', name: 'US' },
        description:
            'Fast websites for local service businesses, built in days and readable by Google and AI answer tools, with every inbound call answered and booked and calls, texts, reviews, and bookings in one account.',
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

export default function DeveloperPage() {
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
                title="Websites for Local Service Businesses, Live in Days | AIA Kings"
                description="No website, or one that is slowing you down? I build fast sites for local service businesses that Google and AI can read, make sure every call gets answered, and put it all in one place. Houston, Texas."
                canonical="https://aiautomationkings.com/developer"
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
                        Nate the Dev
                    </p>
                    <h1 className="text-[2rem] leading-[1.1] sm:text-4xl md:text-6xl font-sans font-medium tracking-tight text-white mb-5">
                        No website? <span className="drama-text text-brand-accent">I build it.</span>
                    </h1>
                    <p className="text-white/60 text-base sm:text-lg md:text-xl font-light max-w-2xl mb-10 leading-relaxed">
                        A site that gets people to call you, live in days. Then the part most builders skip: every call that comes in gets answered, even when you are on a job.
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

            {/* THE SITE */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8 bg-[#0A0A0E]">
                <div className="max-w-5xl mx-auto">
                    <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-4">
                        A website with <span className="drama-text text-brand-accent">one job.</span>
                    </h2>
                    <p className="reveal text-white/50 text-base sm:text-lg font-light max-w-2xl mb-12 leading-relaxed">
                        Not a brochure. Not a portfolio. Somebody who needs you finds it, trusts it, and calls.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {BUILD.map(({ title, body }) => (
                            <div key={title} className="reveal bg-[#15151A] border border-white/[0.07] rounded-[2rem] p-7 sm:p-9">
                                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">{title}</h3>
                                <p className="text-white/50 text-sm sm:text-base leading-relaxed">{body}</p>
                            </div>
                        ))}
                    </div>

                    <p className="reveal text-white/30 text-xs italic mt-8">
                        Hosted on Vercel or Netlify. Larger custom builds run on AWS.
                    </p>
                </div>
            </section>

            {/* WORDPRESS. Hit the platform, never the owner who bought it */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <p className="reveal text-brand-accent uppercase tracking-[0.2em] font-mono text-[10px] sm:text-xs mb-5">
                        Already on WordPress?
                    </p>
                    <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-6">
                        WordPress is a money pit <span className="drama-text text-brand-accent">for a business your size.</span>
                    </h2>
                    <p className="reveal text-white/50 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-12">
                        That is not on you. Whoever built it did it the way everybody does it. It is the default, not a decision.
                    </p>

                    <div className="flex flex-col gap-8 mb-12">
                        {WORDPRESS.map(({ title, body }) => (
                            <div key={title} className="reveal flex gap-4">
                                <Check className="w-5 h-5 text-brand-accent shrink-0 mt-1" strokeWidth={2.5} />
                                <div>
                                    <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
                                    <p className="text-white/50 text-sm sm:text-base leading-relaxed">{body}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="reveal text-xl sm:text-2xl md:text-3xl text-white font-light leading-relaxed">
                        You do not need a better WordPress site. You need to not be on it.
                    </p>
                </div>
            </section>

            {/* THE PHONE */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8 bg-[#0A0A0E]">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-center">
                    <div>
                        <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-8">
                            A website that makes the phone ring is worth nothing <span className="drama-text text-brand-accent">if nobody picks up.</span>
                        </h2>
                        <p className="reveal text-white/50 text-base sm:text-lg font-light leading-relaxed mb-10">
                            The call comes in at seven at night while you are finishing a job. By the time you hear the voicemail, they already booked someone else. So the site does not ship alone.
                        </p>
                        <ul className="flex flex-col gap-5">
                            {PHONE.map((line) => (
                                <li key={line} className="reveal flex items-start gap-4">
                                    <Check className="w-5 h-5 text-brand-accent shrink-0 mt-1" strokeWidth={2.5} />
                                    <span className="text-white/70 text-base sm:text-lg font-light">{line}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="reveal">
                        <CallCatcher />
                    </div>
                </div>
            </section>

            {/* HAND OFF TO THE MARKETER */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-6">
                        Already have a site that works? <span className="drama-text text-brand-accent">Then you need it found.</span>
                    </h2>
                    <p className="reveal text-white/50 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-8">
                        That is a different job. Getting your business named when customers search and when they ask AI, and getting the reviews that make them pick you.
                    </p>
                    <Link
                        to="/marketer"
                        className="reveal inline-block border border-white/20 text-white/80 hover:border-brand-accent/40 hover:text-white px-8 py-4 rounded-[2rem] font-medium tracking-wide transition-all active:scale-[0.97] duration-300 min-h-[48px]"
                    >
                        See Nate the Marketer
                    </Link>
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
                        Want to see your site the way a customer does?
                    </h2>
                    <p className="reveal text-base sm:text-lg text-white/50 font-light mb-10 max-w-xl">
                        Book fifteen minutes. I will pull up your business on a phone, next to whoever is showing up above you, and you can see it with me.
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
