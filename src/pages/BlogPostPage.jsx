import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import { useCalModal } from '../context/CalModalContext';
import { useQualForm } from '../context/QualFormContext';
import { BLOG_POSTS } from '../data/blogPosts';

export default function BlogPostPage() {
    const { slug } = useParams();
    const articleRef = useRef(null);
    const { openCalModal } = useCalModal();
    const { openQualForm } = useQualForm();

    const post = BLOG_POSTS.find((p) => p.slug === slug);

    const relatedPosts = post
        ? BLOG_POSTS.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 2)
        : [];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    useEffect(() => {
        if (!post || !articleRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.post-header',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
            );
            gsap.fromTo('.post-body',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 }
            );
        }, articleRef);
        return () => ctx.revert();
    }, [post]);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    if (!post) {
        return (
            <div className="bg-brand-primary min-h-screen text-brand-background flex items-center justify-center px-6">
                <div className="text-center">
                    <h1 className="text-4xl font-semibold text-white mb-4">Post not found</h1>
                    <p className="text-white/50 mb-8">The article you're looking for doesn't exist.</p>
                    <Link to="/blog" className="text-brand-accent hover:underline font-medium">
                        ← Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div ref={articleRef} className="bg-brand-primary min-h-screen text-brand-background overflow-x-hidden">

            {/* Article Header */}
            <section className="pt-36 sm:pt-40 pb-12 px-6 md:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Back link */}
                    <Link to="/blog" className="post-header inline-flex items-center gap-2 text-white/40 hover:text-brand-accent text-sm font-medium transition-colors duration-300 mb-8">
                        <ArrowLeft size={16} />
                        Back to Blog
                    </Link>

                    {/* Meta */}
                    <div className="post-header flex flex-wrap items-center gap-3 mb-6">
                        <span className="bg-brand-accent/15 text-brand-accent text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border border-brand-accent/20">
                            {post.category}
                        </span>
                        <span className="text-white/30 text-xs data-text">{formatDate(post.date)}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <div className="flex items-center gap-1 text-white/30 text-xs data-text">
                            <Clock size={12} />
                            <span>{post.readTime}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="post-header text-3xl sm:text-4xl md:text-5xl font-sans font-medium tracking-tight text-white leading-tight mb-8">
                        {post.title}
                    </h1>

                    {/* Cover */}
                    <div
                        className="post-header w-full h-64 sm:h-80 rounded-[2rem] overflow-hidden mb-12"
                        style={{
                            background: post.coverImage
                                ? `url(${post.coverImage}) center/cover`
                                : 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(13,13,18,0.9) 60%, rgba(13,13,18,1) 100%)',
                        }}
                    />
                </div>
            </section>

            {/* Article Body */}
            <section className="px-6 md:px-8 pb-20">
                <div className="post-body max-w-3xl mx-auto">
                    {post.content ? (
                        <div className="text-white/80 text-base sm:text-lg leading-[1.85] font-light space-y-6">
                            {post.content.split('\n\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[#15151A] border border-white/5 rounded-[2rem] p-8 sm:p-12 text-center">
                            <p className="text-white/40 text-lg">Content coming soon.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="py-20 px-6 md:px-8 bg-[#0A0A0E]">
                    <div className="max-w-5xl mx-auto">
                        <h3 className="text-brand-accent uppercase tracking-[0.2em] font-mono text-xs mb-8">More Posts</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {relatedPosts.map((rp) => (
                                <Link
                                    key={rp.slug}
                                    to={`/blog/${rp.slug}`}
                                    className="group bg-[#15151A] border border-white/5 rounded-[2rem] p-8 hover:-translate-y-1 transition-all duration-500 hover:border-brand-accent/20"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-brand-accent/15 text-brand-accent text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-brand-accent/20">
                                            {rp.category}
                                        </span>
                                        <span className="text-white/30 text-xs data-text">{rp.readTime}</span>
                                    </div>
                                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-accent transition-colors duration-300">
                                        {rp.title}
                                    </h4>
                                    <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-4">{rp.excerpt}</p>
                                    <div className="flex items-center gap-2 text-brand-accent/60 text-sm font-medium group-hover:gap-3 transition-all duration-300">
                                        <span>Read More</span>
                                        <ArrowRight size={14} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-24 sm:py-32 px-6 md:px-8 flex justify-center text-center">
                <div className="max-w-3xl flex flex-col items-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans tracking-tight mb-6 text-white">
                        Ready to get <span className="drama-text text-brand-accent">started?</span>
                    </h2>
                    <p className="text-base sm:text-lg text-white/50 font-light mb-10 max-w-xl">
                        Let's build the systems that grow your business on autopilot.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <button onClick={openCalModal} className="group relative overflow-hidden bg-brand-accent text-brand-primary px-8 py-4 rounded-[2rem] font-semibold tracking-wide transition-transform hover:scale-[1.03] active:scale-[0.97] duration-300 shadow-[0_0_30px_rgba(201,168,76,0.25)] min-h-[48px]">
                            <span className="relative z-10">Book Call Now</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                        </button>
                        <button onClick={() => openQualForm('gtm-audit')} className="border border-white/20 text-white/80 hover:border-brand-accent/40 hover:text-white px-8 py-4 rounded-[2rem] font-medium tracking-wide transition-all active:scale-[0.97] duration-300 min-h-[48px]">
                            Request Free Audit
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
