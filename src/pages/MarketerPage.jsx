import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import { useReveal } from '../hooks/useReveal';
import { prefersReducedMotion } from '../lib/motion';
import SEOHead from '../components/SEOHead';
import CTAButton from '../components/motion/CTAButton';
import HeroGlow from '../components/motion/HeroGlow';
import BeamRing from '../components/motion/BeamRing';
import ParticleField from '../components/motion/ParticleField';
import CallSteps from '../components/sections/CallSteps';
import { Rows } from '../components/sections/PanelParts';
import MonthlyWork from '../components/sections/MonthlyWork';
import CinemaJourney from '../components/sections/CinemaJourney';
import ReviewLoop from '../components/features/ReviewLoop';
import WebSearchHero from '../components/features/WebSearchHero';
import FaqAccordion from '../components/sections/FaqAccordion';
import SiteAssembler from '../components/features/SiteAssembler';
import CallCatcher from '../components/features/CallCatcher';
import ReviewCompare from '../components/sections/ReviewCompare';
import TradeMarquee from '../components/dev/TradeMarquee';
import BuildList from '../components/dev/BuildList';
import ScreenGallery from '../components/dev/ScreenGallery';

// Nate the Marketer: everything a local service business buys. The website
// (built if there is none), AI SEO, every call answered, and the reviews.
// The agent work for bigger operations lives on the Dev page.

// Old search versus how the same customer behaves now. Kept as two plain
// columns so it stays readable when it stacks on a phone.
const SHIFT = [
    { then: 'Typed three words into a box', now: 'Asks a full question out loud' },
    { then: 'Got ten links and a map', now: 'Gets two or three names read back' },
    { then: 'Clicked around and compared', now: 'Calls the first one that sounds right' },
    { then: 'Page two still got some traffic', now: 'There is no page two' },
];

// The website, for a business that has none. Ranked by how well each one lands
// on a local owner. Speed first, because it is the one they feel immediately.
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

const PHONE = [
    'Every call picked up, nights and weekends included',
    'The usual questions answered the way you would answer them',
    'The job put on your calendar while you are still on the last one',
    'Calls, texts, reviews, and bookings in one place on your phone',
];

const FAQ = [
    {
        q: "What is AI SEO?",
        a: "It is the work of getting your business named by the tools people ask instead of scrolling search results, like ChatGPT and the AI answer at the top of Google. Rather than chasing a spot in a list of links, you are making sure that when something answers \"who should I call for this near me,\" your business is one it can see, trust, and has a reason to mention.",
    },
    {
        q: "Is this different from regular SEO?",
        a: "The groundwork overlaps, so this work makes normal Google search better too. The difference is where the weight goes. It leans much harder on pages that answer real questions, a site AI can read without guessing, the same details everywhere you are listed, and reviews that keep coming in. And the stakes are sharper, because an answer names two or three businesses rather than ten.",
    },
    {
        q: "Can you guarantee I will show up in AI answers?",
        a: "No, and be careful with anyone who does. Nobody controls what AI says, the same way nobody ever controlled a Google ranking. What I control is whether your business is findable, readable, consistent, current, and backed by a live review profile. Skip that work and you are not in the running at all.",
    },
    {
        q: "What if I do not have a website?",
        a: "Then that comes first, because there is nothing for anything to read. I build the site, live in days, and it gets built for this from the first line rather than patched later.",
    },
    {
        q: "How fast can I be live?",
        a: "Days, not months. The biggest thing that slows it down is waiting on your logo, your photos, and your list of services, so I collect all of that with you on one call instead of chasing you by email for three weeks.",
    },
    {
        q: "I already have a website. Do I need a new one?",
        a: "Not always. If what you have loads fast, works on a phone, and can be read properly, I would rather work on getting it found. If it is holding you back, I will show you why on the call and you can decide.",
    },
    {
        q: "How long does this take to show up?",
        a: "It is not a switch. The build happens up front, then the profile work, content, and reviews compound month over month. This is a stay-with-it service, not a one time project, and I will tell you that on the call rather than after you have paid.",
    },
    {
        q: "Do I have to learn new software?",
        a: "No. It runs whether you open it or not. What changes on your end is that your phone shows conversations that used to be missed calls.",
    },
    {
        q: "What happens when something needs changing?",
        a: "You text me and you hear back from me. Not a ticket number and a week of silence.",
    },
    {
        q: "What does it cost?",
        a: "It depends on whether you need a site built or already have one, how many services and areas you cover, and whether you want the phone and review side running too. Pricing gets scoped on the call once I know which of those apply to you.",
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
            'AI SEO and answer engine optimization for local service businesses. Question-shaped pages, structured data, listing consistency, business profile upkeep, and ongoing review collection, so Google and AI answer tools can read the business and have a reason to name it.',
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
    useReveal(rootRef);

    const jumpTo = (id) => (e) => {
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    };

    return (
        // overflow-x-clip rather than hidden, so the sticky card in "the work" still sticks
        <div ref={rootRef} className="seams min-h-screen text-brand-background overflow-x-clip">
            <SEOHead
                title="Websites, Reviews, and AI SEO for Local Service Businesses | AIA Kings"
                description="No website? I build one, live in days. Have one? I get it found on Google and in AI answers, make sure every call gets answered, and end every job with a review request. Houston, Texas."
                canonical="https://aiautomationkings.com/marketer"
                jsonLd={PAGE_JSONLD}
            />

            {/* HERO */}
            <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 px-5 sm:px-6 md:px-8 overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="aurora-blob aurora-blob-1 absolute w-[500px] h-[500px] rounded-full"
                         style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)', top: '-20%', right: '-10%' }} />
                    <div className="aurora-blob aurora-blob-2 absolute w-[460px] h-[460px] rounded-full"
                         style={{ background: 'radial-gradient(circle, rgba(91,123,213,0.14) 0%, rgba(91,123,213,0.04) 45%, transparent 70%)', bottom: '-25%', left: '-12%' }} />
                </div>
                <HeroGlow />
                {/* Three beams of light swaying over the headline, fine light drifting up
                    through the whole hero, and faint guide lines that draw in after it loads */}
                <div aria-hidden="true" className="hero-lines z-0">
                    {['20%', '38%', '68%', '86%'].map((y, n) => <span key={y} className="is-h" style={{ top: y, '--d': `${1.2 + n * 0.15}s` }} />)}
                    {['7%', '93%'].map((x) => <span key={x} className="is-v" style={{ left: x, '--d': '1s' }} />)}
                </div>
                <div aria-hidden="true" className="hero-spots z-0">
                    <span style={{ '--r': '-18deg', '--t': '17s' }} />
                    <span style={{ '--r': '16deg', '--t': '14s' }} />
                    <span style={{ '--r': '0deg', '--t': '21s' }} />
                </div>
                <ParticleField className="absolute inset-0 z-0 w-full h-full" />

                <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] gap-14 lg:gap-12 items-center">
                    <div>
                        <p className="focus-in text-brand-accent uppercase tracking-[0.2em] font-mono text-[10px] sm:text-xs mb-5">
                            Nate the Marketer
                        </p>
                        <h1 className="focus-in text-[2rem] leading-[1.1] sm:text-4xl md:text-6xl font-sans font-medium tracking-tight text-white mb-5 text-balance" style={{ '--d': '0.06s' }}>
                            Be the business it names.
                        </h1>
                        <p className="focus-in text-white/60 text-base sm:text-lg md:text-xl font-light max-w-2xl mb-10 leading-relaxed" style={{ '--d': '0.14s' }}>
                            No website? I build one, live in days. Have one? I make it something Google and AI can read, trust, and name. Then every call gets answered, and every job ends with a review request.
                        </p>
                        <div className="focus-in flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7" style={{ '--d': '0.22s' }}>
                            <CTAButton size="md" glint onClick={openCalModal} className="w-full sm:w-auto">
                                Book a 15-Minute Call
                            </CTAButton>
                            <a href="#builds" onClick={jumpTo('builds')} className="link-underline self-center sm:self-auto py-2 text-white/70 hover:text-white text-sm">
                                Or see sites I have built <span className="bob">&darr;</span>
                            </a>
                        </div>
                    </div>
                    <div className="focus-in" style={{ '--d': '0.3s' }}>
                        <WebSearchHero />
                    </div>
                </div>
            </section>

            {/* WHAT CHANGED */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8 bg-[#0A0A0E]/60">
                <div className="max-w-5xl mx-auto">
                    <h2 data-reveal="lines" className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-4">
                        The customer did not change. <span className="drama-text text-brand-accent">The search did.</span>
                    </h2>
                    <p data-reveal className="text-white/50 text-base sm:text-lg font-light max-w-2xl mb-12 leading-relaxed">
                        Same person, same problem, same urgency. Everything about how they go looking for you is different.
                    </p>

                    {/* The old way gets crossed out a row at a time, then the new way lands. */}
                    <div data-reveal data-inview className="grid grid-cols-2 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
                        <div className="bg-[#0A0A0E] px-4 py-3 sm:px-6 sm:py-4">
                            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white/25">A few years ago</span>
                        </div>
                        <div className="bg-[#0A0A0E] px-4 py-3 sm:px-6 sm:py-4">
                            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-brand-accent">Now</span>
                        </div>

                        {SHIFT.map(({ then, now }, i) => (
                            <div key={then} className="contents">
                                <div className="bg-[#15151A] px-4 py-4 sm:px-6 sm:py-5">
                                    <p className="text-white/35 text-[13px] sm:text-base font-light leading-snug">
                                        <span className="strike" style={{ '--d': `${0.5 + i * 0.3}s` }}>{then}</span>
                                    </p>
                                </div>
                                <div className="bg-[#15151A] px-4 py-4 sm:px-6 sm:py-5">
                                    <p className="after-strike text-white text-[13px] sm:text-base font-light leading-snug" style={{ '--d': `${0.5 + i * 0.3}s` }}>{now}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* START WHERE YOU ARE */}
            <CinemaJourney />
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <h2 data-reveal="lines" className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-12">
                        I start with <span className="drama-text text-brand-accent">what you have.</span>
                    </h2>

                    <div data-reveal-group className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div data-spotlight className="relative bg-[#15151A] border border-white/[0.07] rounded-[2rem] p-7 sm:p-9">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent">You have a website</span>
                            <h3 className="text-2xl font-semibold text-white mt-4 mb-4">No rebuild for the sake of a rebuild.</h3>
                            <p className="text-white/50 text-sm sm:text-base leading-relaxed">
                                I go through what you have, find what Google and AI cannot read or cannot trust, fix it, then start adding the pages and the profile work that give them something to name. If the site genuinely cannot get there, I will say so.
                            </p>
                        </div>

                        <div data-spotlight className="relative bg-[#15151A] border border-white/[0.07] rounded-[2rem] p-7 sm:p-9 flex flex-col">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">You do not have one yet</span>
                            <h3 className="text-2xl font-semibold text-white mt-4 mb-4">That comes first.</h3>
                            <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-6">
                                There is nothing for anything to read yet, so nothing else can start. I build it, and it is live in days.
                            </p>
                            <a href="#no-website" onClick={jumpTo('no-website')} className="group mt-auto inline-flex items-center gap-1.5 py-2 -mb-2 text-brand-accent hover:opacity-80 transition-opacity text-sm font-medium">
                                See how I build it
                                <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">&darr;</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE WEBSITE, for a business that has none */}
            <section id="no-website" className="scroll-mt-24 py-20 sm:py-28 px-5 sm:px-6 md:px-8 bg-[#0A0A0E]/60">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-12 lg:gap-14 items-start mb-10">
                        <div>
                            <p data-reveal className="text-brand-accent uppercase tracking-[0.2em] font-mono text-[10px] sm:text-xs mb-5">No website yet</p>
                            <h2 data-reveal="lines" className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-4">
                                A website with <span className="drama-text text-brand-accent">one job.</span>
                            </h2>
                            <p data-reveal className="text-white/50 text-base sm:text-lg font-light max-w-2xl leading-relaxed">
                                Not a brochure. Not a portfolio. Somebody who needs you finds it, trusts it, and calls.
                            </p>
                        </div>
                        <div data-reveal="scale">
                            <SiteAssembler />
                        </div>
                    </div>
                    <Rows items={BUILD} />
                    <div data-reveal className="mt-8 flex flex-col items-start gap-5">
                        <p className="text-white/30 text-xs italic">Hosted on Vercel or Netlify. Larger custom builds run on AWS.</p>
                        <CTAButton size="md" onClick={openCalModal} className="w-full sm:w-auto">
                            Book a 15-Minute Call
                        </CTAButton>
                    </div>
                </div>
            </section>

            {/* PROOF. Who it is for, the live sites, and every one on desktop and phone */}
            <TradeMarquee />
            <BuildList />
            <ScreenGallery onBook={openCalModal} />

            {/* WORDPRESS. Hit the platform, never the owner who bought it */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8 bg-[#0A0A0E]/60">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
                        <div>
                            <p data-reveal className="text-brand-accent uppercase tracking-[0.2em] font-mono text-[10px] sm:text-xs mb-5">Already on WordPress?</p>
                            <h2 data-reveal="lines" className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-6">
                                WordPress is a money pit <span className="drama-text text-brand-accent">for a business your size.</span>
                            </h2>
                            <p data-reveal className="text-white/50 text-base sm:text-lg md:text-xl font-light leading-relaxed">
                                That is not on you. Whoever built it did it the way everybody does it. It is the default, not a decision.
                            </p>
                        </div>
                        <ul className="border-t border-white/[0.07] self-start">
                            {WORDPRESS.map(({ title, body }) => (
                                <li key={title} data-reveal className="border-b border-white/[0.07] py-6">
                                    <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
                                    <p className="text-white/50 text-sm sm:text-base leading-relaxed">{body}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p data-scrub className="mt-10 sm:mt-14 text-2xl sm:text-3xl md:text-4xl text-white font-light leading-snug max-w-3xl">
                        You do not need a better WordPress site. You need to not be on it.
                    </p>
                </div>
            </section>

            {/* THE WORK. The list lights up item by item as it scrolls, with a
                picture of each piece beside it (MonthlyWork). */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 data-reveal="lines" className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-12">
                        What I actually do <span className="drama-text text-brand-accent">every month.</span>
                    </h2>

                    <MonthlyWork items={WORK} />

                    <div data-reveal className="mt-12">
                        <CTAButton size="md" glow={false} onClick={openCalModal} className="w-full sm:w-auto whitespace-nowrap max-sm:px-6">
                            See Where You Show Up Today
                        </CTAButton>
                    </div>
                </div>
            </section>

            {/* THE PHONE */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8 bg-[#0A0A0E]/60">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] gap-12 lg:gap-16 items-center">
                    <div data-reveal="scale" className="relative order-2 lg:order-1">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                            {[0, 1.5, 3].map((d) => (
                                <span key={d} className="ripple-ring" style={{ '--d': `${d}s` }} />
                            ))}
                        </div>
                        <div className="relative">
                            <CallCatcher />
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <p data-reveal className="text-brand-accent uppercase tracking-[0.2em] font-mono text-[10px] sm:text-xs mb-5">After hours</p>
                        <h2 data-reveal="lines" className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-6">
                            A website that makes the phone ring is worth nothing <span className="drama-text text-brand-accent">if nobody picks up.</span>
                        </h2>
                        <p data-reveal className="text-white/50 text-base sm:text-lg font-light leading-relaxed mb-8">
                            The call comes in at seven at night while you are finishing a job. By the time you hear the voicemail, they already booked someone else. So the site does not ship alone.
                        </p>
                        <ul data-reveal-group data-inview className="flex flex-col gap-4">
                            {PHONE.map((line, i) => (
                                <li key={line} className="flex items-start gap-4">
                                    <Check className="draw w-5 h-5 text-brand-accent shrink-0 mt-0.5" strokeWidth={2.5} style={{ '--d': `${0.35 + i * 0.12}s` }} />
                                    <span className="text-white/70 text-base sm:text-lg font-light">{line}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* REVIEWS */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-center">
                    <div>
                        <h2 data-reveal="lines" className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-8">
                            Getting found gets you on the list. <span className="drama-text text-brand-accent">Reviews get you picked.</span>
                        </h2>
                        <p data-reveal className="text-white/50 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-6">
                            You have done hundreds of good jobs, and the shop down the road with worse work has more reviews than you. Customers see that number before they ever see your work.
                        </p>
                        <p data-reveal className="text-white/50 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-6">
                            So every finished job ends with the same ask, sent for you, every time. No remembering, no awkward moment at the truck. Every customer gets the same request, with no filtering and no incentives, because that is how a profile stays clean.
                        </p>
                        <p data-reveal className="text-xl sm:text-2xl text-white font-light leading-relaxed">
                            And fresh reviews are part of what keeps you getting found. It comes back around.
                        </p>
                    </div>
                    <div data-reveal="scale">
                        <ReviewLoop />
                    </div>
                </div>

                <ReviewCompare />
                </div>
            </section>

            {/* HAND OFF TO THE DEV SIDE */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8 bg-[#0A0A0E]/60">
                <div className="max-w-4xl mx-auto">
                    <h2 data-reveal="lines" className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-6">
                        Running smooth and want your time back? <span className="drama-text text-brand-accent">That is the Dev side.</span>
                    </h2>
                    <p data-reveal className="text-white/50 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-8">
                        Once the site, the reviews, and the rankings are running, AI agents can take the busywork off your plate: following up on quotes, keeping your records straight, and bringing back past customers.
                    </p>
                    <div data-reveal>
                        <Link
                            to="/developer"
                            className="group inline-flex items-center gap-2 border border-white/20 text-white/80 hover:border-brand-accent/40 hover:text-white hover:bg-white/[0.03] px-8 py-4 rounded-[2rem] font-medium tracking-wide transition-[color,background-color,border-color,scale] active:scale-[0.97] duration-300 min-h-[48px]"
                        >
                            See Nate the Dev
                            <span className="inline-block text-brand-accent transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ, on the page and in the schema */}
            <section className="py-20 sm:py-28 px-5 sm:px-6 md:px-8">
                <div className="max-w-3xl mx-auto">
                    <h2 data-reveal="lines" className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white leading-tight mb-12">
                        Straight answers.
                    </h2>
                    <FaqAccordion items={FAQ} />
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 sm:py-28 md:py-36 px-5 sm:px-6 md:px-8 flex justify-center text-center bg-[#0A0A0E]/60">
                <div className="relative max-w-4xl w-full flex flex-col items-center rounded-[2.5rem] border border-white/[0.06] bg-[#111116]/70 px-5 py-14 sm:px-12 sm:py-16">
                    <BeamRing />
                    <h2 data-reveal="lines" className="text-3xl sm:text-4xl md:text-5xl font-sans tracking-tight mb-6 text-white leading-tight">
                        Want to see what comes back today?
                    </h2>
                    <p data-reveal className="text-base sm:text-lg text-white/50 font-light mb-10 max-w-xl">
                        I will look your business up the way your customers do, on the call, and you can see it with me.
                    </p>
                    <CallSteps className="mb-10" />
                    <div data-reveal className="w-full sm:w-auto">
                        <CTAButton size="xl" halo glint onClick={openCalModal} className="w-full sm:w-auto">
                            Book a 15-Minute Call
                        </CTAButton>
                    </div>
                </div>
            </section>
        </div>
    );
}
