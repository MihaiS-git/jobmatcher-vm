import { Title, Meta, Link } from "react-head";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
}

const DEFAULT_SEO = {
  title: "Job Matcher",
  description: "The go-to platform for freelance jobs and gigs.",
  keywords: "freelance, jobs, remote work, gigs, Job Matcher",
  url: "https://www.netlify.jobmatcher.com",
  image: "https://www.netlify.jobmatcher.com/default-og-image.png",
};

const SEO = ({ title, description, keywords, url, image }: SEOProps) => {
  const seo = { ...DEFAULT_SEO, title, description, keywords, url, image };
  return (
    <>
      <Title>{seo.title}</Title>
      <Meta name="description" content={seo.description} />
      <Meta name="keywords" content={seo.keywords} />
      <Link rel="canonical" href={seo.url} />
      {/* Open Graph / Twitter */}
      <Meta property="og:title" content={seo.title} />
      <Meta property="og:description" content={seo.description} />
      <Meta property="og:url" content={seo.url} />
      {seo.image && <Meta property="og:image" content={seo.image} />}
      <Meta name="twitter:title" content={seo.title} />
      <Meta name="twitter:description" content={seo.description} />
      {seo.image && <Meta name="twitter:image" content={seo.image} />}
      {seo.image && <Meta name="twitter:card" content="summary_large_image" />}
    </>
  );
};

export default SEO;
