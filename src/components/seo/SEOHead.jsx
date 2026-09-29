import { useEffect } from "react";

export const SITE_URL = "https://asaadmorman.com";
export const DEFAULT_IMAGE = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6887c5e144c3e560dc989c1b/fe7359ad6_1000003118.jpg";

// ─── Schema Generators ───────────────────────────────────────────────────────

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Emerging Defense Solutions",
  "url": SITE_URL,
  "logo": DEFAULT_IMAGE,
  "founder": { "@type": "Person", "name": "Asaad Morman" },
  "description": "Elite cybersecurity consulting, training, and defense services",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Fredericksburg",
    "addressRegion": "VA",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-657-658-5859",
    "contactType": "customer service",
    "email": "cyberdojosensai@gmail.com"
  },
  "sameAs": [
    "https://www.linkedin.com/in/asaadmorman",
    "https://blog.cyberdojosensai.org"
  ]
};

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Asaad Morman",
  "url": SITE_URL,
  "image": DEFAULT_IMAGE,
  "jobTitle": "Cybersecurity Entrepreneur & Tactical SME",
  "worksFor": { "@type": "Organization", "name": "Emerging Defense Solutions" },
  "description": "Elite Cybersecurity Professional & Entrepreneur with TS/SCI Clearance. CEO of Emerging Defense Solutions, with specialized divisions spanning cybersecurity consulting, tactical training, and defense services.",
  "sameAs": [
    "https://www.linkedin.com/in/asaadmorman",
    "https://blog.cyberdojosensai.org"
  ],
  "knowsAbout": [
    "Cybersecurity", "Penetration Testing", "Red Team Operations",
    "Threat Intelligence", "Security Architecture", "Tactical Training",
    "NOC/SOC Advisory", "SETA", "TS/SCI"
  ],
  "alumniOf": { "@type": "Organization", "name": "United States Marine Corps" }
};

export const generateBlogPostSchema = (post) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.meta_description || post.excerpt,
  "author": { "@type": "Person", "name": "Asaad Morman", "url": SITE_URL },
  "datePublished": post.created_date,
  "dateModified": post.updated_date || post.created_date,
  "mainEntityOfPage": { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.id}` },
  "publisher": {
    "@type": "Organization",
    "name": "Emerging Defense Solutions",
    "logo": { "@type": "ImageObject", "url": DEFAULT_IMAGE }
  },
  "image": DEFAULT_IMAGE,
  "keywords": post.tags?.join(", ") || post.category,
  "articleSection": post.category,
  "url": `${SITE_URL}/blog/${post.id}`
});

export const generateWebinarSchema = (webinar) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": webinar.title,
  "description": webinar.description,
  "startDate": `${webinar.date}T${webinar.time || "12:00"}`,
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
  "location": { "@type": "VirtualLocation", "url": webinar.meeting_link || SITE_URL },
  "organizer": { "@type": "Person", "name": "Asaad Morman", "url": SITE_URL }
});

export const generateServiceSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Asaad Morman Cybersecurity Services",
  "url": SITE_URL,
  "description": "Expert cybersecurity services including red team operations, penetration testing, security architecture, and tactical training.",
  "provider": { "@type": "Person", "name": "Asaad Morman" },
  "areaServed": "US",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Cybersecurity Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Red Team Operations" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Penetration Testing" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Security Architecture Consulting" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tactical Training" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "NOC/SOC Advisory (SETA)" } }
    ]
  }
});

// ─── SEOHead Component ────────────────────────────────────────────────────────

export default function SEOHead({
  title,
  description,
  type = "website",
  image,
  canonicalPath = "",
  blogPost = null,
  webinar = null,
  includePersonSchema = false,
  includeOrgSchema = false,
  includeServiceSchema = false,
  keywords = []
}) {
  useEffect(() => {
    const metaTitle = title || "Asaad Morman | Cybersecurity & Tactical SME";
    const metaDescription = description || "Elite Cybersecurity Professional & Entrepreneur dedicated to securing digital and physical frontiers. CEO of Emerging Defense Solutions, with specialized divisions spanning cybersecurity consulting, tactical training, and defense services.";
    const metaImage = image || DEFAULT_IMAGE;
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;

    // Title
    document.title = metaTitle;

    // Helper to upsert a meta tag
    const setMeta = (selector, attr, value) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        const [attrKey, attrVal] = attr.split("=").map(s => s.replace(/"/g, ""));
        tag.setAttribute(attrKey, attrVal);
        document.head.appendChild(tag);
      }
      tag.content = value;
    };

    // Helper to upsert a link tag
    const setLink = (rel, href) => {
      let tag = document.querySelector(`link[rel="${rel}"]`);
      if (!tag) { tag = document.createElement("link"); tag.rel = rel; document.head.appendChild(tag); }
      tag.href = href;
    };

    // Basic meta
    setMeta('meta[name="description"]', 'name="description"', metaDescription);
    if (keywords.length) setMeta('meta[name="keywords"]', 'name="keywords"', keywords.join(", "));
    setMeta('meta[name="robots"]', 'name="robots"', "index, follow");
    setMeta('meta[name="author"]', 'name="author"', "Asaad Morman");

    // Canonical
    setLink("canonical", canonicalUrl);

    // Open Graph
    const ogTags = {
      "og:title": metaTitle,
      "og:description": metaDescription,
      "og:type": type,
      "og:image": metaImage,
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:url": canonicalUrl,
      "og:site_name": "Asaad Morman",
      "og:locale": "en_US"
    };
    Object.entries(ogTags).forEach(([property, content]) => {
      setMeta(`meta[property="${property}"]`, `property="${property}"`, content);
    });

    // Twitter Card
    const twitterTags = {
      "twitter:card": "summary_large_image",
      "twitter:title": metaTitle,
      "twitter:description": metaDescription,
      "twitter:image": metaImage,
      "twitter:creator": "@asaadmorman"
    };
    Object.entries(twitterTags).forEach(([name, content]) => {
      setMeta(`meta[name="${name}"]`, `name="${name}"`, content);
    });

    // Schema.org JSON-LD
    document.querySelectorAll("script[data-seo-schema]").forEach(el => el.remove());
    const schemas = [];
    if (includeOrgSchema) schemas.push(organizationSchema);
    if (includePersonSchema) schemas.push(personSchema);
    if (includeServiceSchema) schemas.push(generateServiceSchema());
    if (blogPost) schemas.push(generateBlogPostSchema(blogPost));
    if (webinar) schemas.push(generateWebinarSchema(webinar));

    schemas.forEach((schema, i) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-schema", `schema-${i}`);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      document.querySelectorAll("script[data-seo-schema]").forEach(el => el.remove());
    };
  }, [title, description, type, image, canonicalPath, blogPost, webinar, includePersonSchema, includeOrgSchema, includeServiceSchema, keywords]);

  return null;
}