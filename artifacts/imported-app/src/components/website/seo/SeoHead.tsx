import { useEffect } from 'react';

export interface SeoProductItem {
  name: string;
  description: string;
  image: string;
  sku: string;
  price: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
}

export interface SeoHeadProps {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  siteName: string;
  locale?: string;
  products?: SeoProductItem[];
  organization?: {
    name: string;
    url: string;
    logo: string;
    contactPhone?: string;
    address?: string;
  };
}

export function SeoHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  siteName,
  locale = 'en_US',
  products = [],
  organization,
}: SeoHeadProps) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // 2. Helper to set or create meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 3. Helper for link tags (canonical, alternate)
    const setLink = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]`;
      let el = document.querySelector(selector) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        if (hreflang) el.setAttribute('hreflang', hreflang);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Primary Meta Tags
    setMeta('description', description);
    setMeta('keywords', keywords.join(', '));
    setMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMeta('author', siteName);

    // Canonical & Hreflang Tags
    setLink('canonical', canonicalUrl);
    setLink('alternate', canonicalUrl, 'x-default');
    setLink('alternate', canonicalUrl, 'en');

    // Open Graph / Facebook Meta Tags
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', siteName, true);
    setMeta('og:locale', locale, true);

    // Twitter Card Meta Tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // 4. Inject JSON-LD Schema.org Structured Data
    const schemaId = 'seo-structured-data-json-ld';
    let scriptEl = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = schemaId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const jsonLdData: any = {
      '@context': 'https://schema.org',
      '@graph': [
        // Organization / Store Schema
        {
          '@type': 'OnlineStore',
          '@id': `${canonicalUrl}#organization`,
          name: organization?.name || siteName,
          url: canonicalUrl,
          logo: organization?.logo || ogImage,
          description: description,
          address: organization?.address || 'Ningbo & Shanghai Port Hub, China',
          telephone: organization?.contactPhone || '+1 (800) 492-7962',
          currenciesAccepted: 'USD, EUR, GBP, CNY',
          paymentAccepted: 'Credit Card, Wire Transfer (T/T), Letter of Credit (L/C)',
        },
        // WebSite Schema
        {
          '@type': 'WebSite',
          '@id': `${canonicalUrl}#website`,
          url: canonicalUrl,
          name: siteName,
          description: description,
          publisher: { '@id': `${canonicalUrl}#organization` },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${canonicalUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        // BreadcrumbList Schema
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: canonicalUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Catalog',
              item: `${canonicalUrl}#catalog`,
            },
          ],
        },
      ],
    };

    // If products exist, add ItemList of Product schemas for Google Rich Snippets
    if (products.length > 0) {
      jsonLdData['@graph'].push({
        '@type': 'ItemList',
        itemListElement: products.map((prod, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Product',
            name: prod.name,
            description: prod.description || prod.name,
            image: prod.image,
            sku: prod.sku,
            brand: {
              '@type': 'Brand',
              name: siteName,
            },
            offers: {
              '@type': 'Offer',
              price: prod.price,
              priceCurrency: prod.currency || 'USD',
              availability: 'https://schema.org/InStock',
              url: `${canonicalUrl}#${prod.sku}`,
            },
            ...(prod.rating
              ? {
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: prod.rating,
                    reviewCount: prod.reviewCount || 50,
                  },
                }
              : {}),
          },
        })),
      });
    }

    scriptEl.textContent = JSON.stringify(jsonLdData);

    return () => {
      // Clean up script if component unmounts
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [title, description, keywords, canonicalUrl, ogImage, siteName, locale, products, organization]);

  return null;
}
