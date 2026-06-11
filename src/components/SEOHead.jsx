import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'AI Automation Kings';
const DEFAULT_OG_IMAGE = 'https://aiautomationkings.com/favicon.png';

export default function SEOHead({ title, description, ogTitle, ogDescription, ogImage, canonical, type = 'website', jsonLd = [] }) {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            {canonical && <link rel="canonical" href={canonical} />}

            <meta property="og:type" content={type} />
            <meta property="og:title" content={ogTitle || title} />
            <meta property="og:description" content={ogDescription || description} />
            <meta property="og:image" content={ogImage || DEFAULT_OG_IMAGE} />
            {canonical && <meta property="og:url" content={canonical} />}
            <meta property="og:site_name" content={SITE_NAME} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle || title} />
            <meta name="twitter:description" content={ogDescription || description} />
            <meta name="twitter:image" content={ogImage || DEFAULT_OG_IMAGE} />

            {jsonLd.map((schema, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            ))}
        </Helmet>
    );
}
