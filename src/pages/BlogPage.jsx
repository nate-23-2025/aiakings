import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';

gsap.registerPlugin(ScrollTrigger);

export default function BlogPage() {
    const heroRef = useRef(null);
    const gridRef = useRef(null);

    useEffect(() => {
        let heroCtx = gsap.context(() => {
            gsap.fromTo('.blog-hero-text',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
            );
        }, heroRef);

        let gridCtx = gsap.context(() => {
            gsap.fromTo('.blog-card',
                { y: 60, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out',
                    scrollTrigger: { trigger: gridRef.current, start: 'top 80%' }
                }
            );
        }, gridRef);

        return () => {
            heroCtx.revert();
            gridCtx.revert();
        };
    }, []);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-brand-primary min-h-screen text-brand-background overflow-x-hidden">

            <Helmet>
                <title>Blog | AI Automation Kings - Houston AI & GTM Insights</title>
                <meta name="description" content="Frameworks, strategies, and insights on AI automation, go-to-market systems, and business growth from Houston's leading AI automation agency." />
                <meta property="og:title" content="Blog | AI Automation Kings" />
                <meta property="og:description" content="Frameworks, strategies, and insights on AI automation, go-to-market systems, and business growth." />
                <link rel="canonical" href="https://aiautomationkings.com/blog" />
            </Helmet>

            {/* Hero */}
            <section ref={heroRef} className="pt-40 pb-16 sm:pb-20 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <span className="blog-hero-text block text-brand-accent tracking-[0.2em] text-xs font-semibold uppercase mb-4">
                        Insights
                    </span>
                    <h1 className="blog-hero-text text-4xl sm:text-5xl md:text-6xl font-sans font-medium tracking-tight text-white leading-tight max-w-3xl">
                        Perspectives on GTM, AI, and <span className="drama-text text-brand-accent">Growth.</span>
                    </h1>
                    <p className="blog-hero-text text-lg text-white/40 font-light mt-6 max-w-xl">
                        Frameworks, strategies, and insights from the team building Houston's most advanced go-to-market and AI systems.
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <section ref={gridRef} className="py-12 sm:py-16 px-6 md:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post) => (
                        <Link
                            key={post.slug}
                            to={`/blog/${post.slug}`}
                            className="blog-card group bg-[#15151A] border border-white/5 rounded-[2rem] overflow-hidden hover:-translate-y-1 transition-all duration-500 hover:border-brand-accent/20 flex flex-col"
                        >
                            {/* Cover area */}
                            <div
                                className="h-48 w-full relative"
                                style={{
                                    background: post.coverImage
                                        ? `url(${post.coverImage}) center/cover`
                                        : 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(13,13,18,0.8) 100%)',
                                }}
                            >
                                {/* Category badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-brand-accent/15 text-brand-accent text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border border-brand-accent/20">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-brand-accent transition-colors duration-300 leading-snug">
                                    {post.title}
                                </h3>
                                <p className="text-white/50 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                    {post.excerpt}
                                </p>

                                {/* Meta */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-white/30 text-xs data-text">
                                        <span>{formatDate(post.date)}</span>
                                        <span className="w-1 h-1 rounded-full bg-white/20" />
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            <span>{post.readTime}</span>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-white/20 group-hover:text-brand-accent group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

        </div>
    );
}
