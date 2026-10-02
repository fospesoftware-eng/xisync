/*
  # Populate Homepage CMS Content

  Inserts initial CMS data for the homepage with all sections that are currently hardcoded.
  
  1. Creates homepage page entry
  2. Populates all homepage sections:
     - hero (Hero banner with tagline)
     - stats (Statistics counters)
     - explore (Navigation cards section)
     - modules (Product modules grid)
     - channels (Omnichannel messaging section)
     - testimonials (Customer testimonials)
     - pricing (Pricing plans)
     - cta (Final call to action)
  
  3. All sections start as active and can be toggled in admin
*/

DO $$
DECLARE
  homepage_page_id uuid;
BEGIN
  INSERT INTO cms_pages (slug, title, description)
  VALUES ('home', 'XiSync Home Page', 'Main landing page for XiSync')
  ON CONFLICT (slug) DO UPDATE SET updated_at = now()
  RETURNING id INTO homepage_page_id;

  INSERT INTO cms_sections (page_id, section_type, section_key, content, "order", is_active)
  VALUES
    (
      homepage_page_id,
      'hero',
      'hero_banner',
      jsonb_build_object(
        'badge_text', 'AI powered CRM',
        'headline', 'Export Smarter, Grow Globally',
        'description', 'The all-in-one platform for Chinese exporters. Manage customers, communicate across channels, track shipments, and ensure compliance.',
        'cta_primary_text', 'Start Free Trial',
        'cta_primary_link', '/demo',
        'cta_secondary_text', 'View Demo Access',
        'cta_secondary_link', '/login'
      ),
      0,
      true
    ),
    (
      homepage_page_id,
      'stats',
      'statistics',
      jsonb_build_object(
        'items', jsonb_build_array(
          jsonb_build_object('value', '10,000+', 'label', 'Active Exporters'),
          jsonb_build_object('value', '50+', 'label', 'Countries Reached'),
          jsonb_build_object('value', '$2B+', 'label', 'Trade Volume'),
          jsonb_build_object('value', '99.9%', 'label', 'Uptime')
        )
      ),
      1,
      true
    ),
    (
      homepage_page_id,
      'navigation',
      'explore_section',
      jsonb_build_object(
        'title', 'Explore XiSync',
        'description', 'Navigate to different sections of our platform',
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Product', 'description', 'Explore all six modules and see how they work together', 'link', '/product'),
          jsonb_build_object('title', 'Integrations', 'description', 'Connect WhatsApp, WeChat, Shopify, Alibaba and more', 'link', '/integrations'),
          jsonb_build_object('title', 'Pricing', 'description', 'Simple, transparent pricing with a 14-day free trial', 'link', '/pricing'),
          jsonb_build_object('title', 'Book Demo', 'description', 'Get a personalized walkthrough from our team', 'link', '/demo')
        )
      ),
      2,
      true
    ),
    (
      homepage_page_id,
      'modules',
      'product_modules',
      jsonb_build_object(
        'title', 'Six Powerful Modules',
        'description', 'Everything you need to manage your export business',
        'items', jsonb_build_array(
          jsonb_build_object('name', 'CRM', 'title', 'Customer Management', 'description', 'Manage leads, accounts, contacts, and deals. Track your entire sales pipeline.', 'link', '/product#crm'),
          jsonb_build_object('name', 'Connect', 'title', 'Omnichannel Messaging', 'description', 'WhatsApp, WeChat, Email, Instagram in one inbox with AI translation.', 'link', '/product#messaging'),
          jsonb_build_object('name', 'Social', 'title', 'Social Media', 'description', 'Schedule posts, manage accounts, and convert social engagement to leads.', 'link', '/product#social'),
          jsonb_build_object('name', 'Logistics', 'title', 'Shipment Tracking', 'description', 'Track shipments from factory to destination with customer notifications.', 'link', '/product#logistics'),
          jsonb_build_object('name', 'Compliance', 'title', 'Compliance Center', 'description', 'Manage certificates, track expirations, meet destination requirements.', 'link', '/product#compliance'),
          jsonb_build_object('name', 'Portal', 'title', 'Customer Portal', 'description', 'Branded self-service portal for buyers to track orders and documents.', 'link', '/product#portal')
        )
      ),
      3,
      true
    ),
    (
      homepage_page_id,
      'messaging',
      'channels_section',
      jsonb_build_object(
        'title', 'Connect All Your Channels',
        'description', 'Meet your customers where they are. WhatsApp, WeChat, Email, Instagram, Facebook — all conversations in one place with instant AI translation.',
        'features', jsonb_build_array(
          'Single unified inbox',
          'Real-time translation',
          'Smart reply suggestions',
          'Full conversation history'
        ),
        'channels', jsonb_build_array(
          'WhatsApp',
          'WeChat',
          'Email',
          'Instagram',
          'Facebook',
          'TikTok'
        ),
        'cta_text', 'View All Integrations',
        'cta_link', '/integrations'
      ),
      4,
      true
    ),
    (
      homepage_page_id,
      'testimonials',
      'testimonials',
      jsonb_build_object(
        'title', 'Trusted by 10,000+ Exporters',
        'items', jsonb_build_array(
          jsonb_build_object(
            'quote', 'XiSync transformed how we manage international buyers. The real-time translation alone saved us countless hours.',
            'author', 'Zhang Wei',
            'role', 'Export Manager, Shenzhen Electronics',
            'rating', 5
          ),
          jsonb_build_object(
            'quote', 'We reduced our response time from days to minutes. Our buyers love the customer portal.',
            'author', 'Li Ming',
            'role', 'CEO, Hangzhou Textiles',
            'rating', 5
          )
        )
      ),
      5,
      true
    ),
    (
      homepage_page_id,
      'pricing',
      'pricing_plans',
      jsonb_build_object(
        'title', 'Simple, Transparent Pricing',
        'subtitle', 'Start free for 14 days. No credit card required.',
        'items', jsonb_build_array(
          jsonb_build_object(
            'name', 'Starter',
            'price', '$49',
            'description', 'For small exporters',
            'features', jsonb_build_array('3 team members', '500 messages/mo', 'Email integration'),
            'popular', false
          ),
          jsonb_build_object(
            'name', 'Pro',
            'price', '$149',
            'description', 'For growing teams',
            'features', jsonb_build_array('10 team members', '5,000 messages/mo', 'All channels', 'AI translation'),
            'popular', true
          ),
          jsonb_build_object(
            'name', 'Business',
            'price', '$399',
            'description', 'For established exporters',
            'features', jsonb_build_array('25 team members', '25,000 messages/mo', 'Compliance center', 'API access'),
            'popular', false
          )
        )
      ),
      6,
      true
    ),
    (
      homepage_page_id,
      'cta',
      'final_cta',
      jsonb_build_object(
        'title', 'Ready to Grow Your Global Business?',
        'description', 'Join thousands of exporters who are streamlining operations and growing sales.',
        'cta_primary_text', 'Start Free Trial',
        'cta_primary_link', '/demo',
        'cta_secondary_text', 'View Demo Access',
        'cta_secondary_link', '/login'
      ),
      7,
      true
    )
  ON CONFLICT (page_id, section_key) DO UPDATE SET
    content = EXCLUDED.content,
    updated_at = now();

END $$;
