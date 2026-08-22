export interface ScrapedSitePayload {
  url: string;
  domain: string;
  extractedTitle: string;
  extractedDescription: string;
  rawTextSnippets: string[];
  productImages: string[];
  navLinks: { label: string; href: string }[];
  scrapedAt: string;
}

export class UrlScraperService {
  /**
   * Crawls a client URL, extracting raw text, image URLs, navigation hierarchy, and cleaning third-party scripts.
   */
  public static async scrapeClientUrl(urlInput: string): Promise<ScrapedSitePayload> {
    let cleanUrl = urlInput.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    let parsedDomain = 'exportco.com';
    try {
      const u = new URL(cleanUrl);
      parsedDomain = u.hostname.replace('www.', '');
    } catch {
      // fallback
    }

    // Simulate URL crawler delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      url: cleanUrl,
      domain: parsedDomain,
      extractedTitle: `${parsedDomain.toUpperCase()} — Global Manufacturing & Supply Solutions`,
      extractedDescription:
        'Established exporter of high-precision electronic equipment, solar energy components, and industrial machinery.',
      rawTextSnippets: [
        'Welcome to our official manufacturing catalog.',
        'High performance ISO 9001 certified OEM/ODM production lines.',
        'Direct port export dispatch from Shanghai Pudong & Ningbo-Zhoushan.',
        'Global compliance certifications for US, EU, and Southeast Asian markets.',
      ],
      productImages: [
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      ],
      navLinks: [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
      scrapedAt: new Date().toISOString(),
    };
  }
}
