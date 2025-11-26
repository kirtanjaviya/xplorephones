import { Helmet } from "react-helmet-async";

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    schema?: object; // For JSON-LD structured data
}

const SEO = ({
    title,
    description,
    keywords,
    image = "https://efzkhwcpuvkwmiscjbuj.supabase.co/storage/v1/object/public/phone-images/hero-image.webp",
    url = "https://xplorephone.store",
    type = "website",
    schema
}: SEOProps) => {
    const siteTitle = "Xplore Phones";
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
    const fullUrl = url.startsWith("http") ? url : `https://xplorephone.store${url}`;
    const fullImage = image.startsWith("http") ? image : `https://xplorephone.store${image}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={fullUrl} />
            <meta name="robots" content="index, follow" />
            <meta name="author" content="Xplore Phones" />
            <meta name="publisher" content="Xplore Phones" />
            <meta httpEquiv="Content-Language" content="en" />

            {/* Local SEO */}
            <meta name="geo.region" content="IN-GJ" />
            <meta name="geo.placename" content="Surat" />
            <meta name="geo.position" content="21.2319;72.8363" />
            <meta name="ICBM" content="21.2319, 72.8363" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content="Xplore Phones" />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={fullImage} />

            {/* Structured Data (JSON-LD) */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
