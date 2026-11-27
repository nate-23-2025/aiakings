import ReactMarkdown from 'react-markdown';
import SEOHead from '../components/SEOHead';
import { LEGAL_PAGES } from '../data/legal';

export default function LegalPage({ kind }) {
    const page = LEGAL_PAGES[kind];
    return <article className="max-w-3xl mx-auto px-6 pt-32 pb-24 text-white/80 leading-relaxed break-words">
        <SEOHead title={`${page.title} | AIA Kings`} description={`${page.title} for AI Automation Kings, Houston, Texas.`} canonical={`https://aiautomationkings.com${page.path}`} />
        <h1 className="text-4xl sm:text-5xl text-white mb-10">{page.title}</h1>
        <ReactMarkdown components={{
            h3: ({ children }) => <h2 className="text-2xl text-white mt-10 mb-4">{children}</h2>,
            p: ({ children }) => <p className="my-4">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-6 space-y-3 my-4">{children}</ul>,
            a: ({ children, href }) => <a href={href} className="text-brand-accent underline underline-offset-4 focus-visible:outline focus-visible:outline-2">{children}</a>,
        }}>{page.body}</ReactMarkdown>
    </article>;
}
