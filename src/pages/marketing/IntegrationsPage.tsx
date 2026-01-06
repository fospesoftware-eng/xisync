import { Header } from '../../components/marketing/Header';
import { Footer } from '../../components/marketing/Footer';
import { CTASection } from '../../components/marketing/CTASection';
import {
  MessageSquare,
  Mail,
  Share2,
  Package,
  FileText,
  Zap,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

const integrationCategories = [
  {
    name: 'Messaging',
    icon: MessageSquare,
    description: 'Connect all your customer communication channels',
    integrations: [
      {
        name: 'WhatsApp Business',
        description: 'Official WhatsApp Business API for reliable, secure messaging at scale.',
        features: ['Template messages', 'Media sharing', 'Read receipts', 'Business profile'],
        status: 'available',
      },
      {
        name: 'WeChat',
        description: 'Connect with Chinese businesses and consumers through WeChat Official Account.',
        features: ['Service messages', 'Menu integration', 'Mini program links', 'QR codes'],
        status: 'available',
      },
      {
        name: 'Instagram',
        description: 'Manage Instagram DMs and comments from your unified inbox.',
        features: ['Direct messages', 'Comment replies', 'Story mentions', 'Lead capture'],
        status: 'available',
      },
      {
        name: 'Facebook Messenger',
        description: 'Connect Facebook pages and manage Messenger conversations.',
        features: ['Page messages', 'Automated responses', 'Comment-to-DM', 'Lead forms'],
        status: 'available',
      },
      {
        name: 'Telegram',
        description: 'Manage Telegram bot conversations and group notifications.',
        features: ['Bot integration', 'Group messages', 'Media support', 'Commands'],
        status: 'coming_soon',
      },
      {
        name: 'Line',
        description: 'Connect with customers in Japan, Taiwan, and Thailand via Line.',
        features: ['Official account', 'Rich messages', 'Stickers', 'Line Pay'],
        status: 'coming_soon',
      },
    ],
  },
  {
    name: 'Email',
    icon: Mail,
    description: 'Sync your email accounts for seamless communication',
    integrations: [
      {
        name: 'Gmail / Google Workspace',
        description: 'Full Gmail integration with OAuth authentication.',
        features: ['Two-way sync', 'Labels', 'Thread view', 'Search'],
        status: 'available',
      },
      {
        name: 'Outlook / Microsoft 365',
        description: 'Connect Outlook and Microsoft 365 email accounts.',
        features: ['Calendar sync', 'Contact sync', 'Categories', 'Search'],
        status: 'available',
      },
      {
        name: 'Custom IMAP/SMTP',
        description: 'Connect any email provider with IMAP/SMTP credentials.',
        features: ['Any provider', 'Custom domains', 'Full control', 'Aliases'],
        status: 'available',
      },
    ],
  },
  {
    name: 'Social Media',
    icon: Share2,
    description: 'Manage your social presence from one place',
    integrations: [
      {
        name: 'LinkedIn',
        description: 'Publish to LinkedIn pages and manage company updates.',
        features: ['Page posts', 'Analytics', 'Lead gen forms', 'InMail'],
        status: 'available',
      },
      {
        name: 'TikTok',
        description: 'Manage TikTok business account and track performance.',
        features: ['Video posting', 'Comment management', 'Analytics', 'Leads'],
        status: 'available',
      },
      {
        name: 'YouTube',
        description: 'Manage YouTube channel comments and community posts.',
        features: ['Comment replies', 'Community posts', 'Analytics', 'Playlists'],
        status: 'coming_soon',
      },
    ],
  },
  {
    name: 'E-commerce',
    icon: Package,
    description: 'Connect your online stores and marketplaces',
    integrations: [
      {
        name: 'Shopify',
        description: 'Sync orders, customers, and products from Shopify.',
        features: ['Order sync', 'Customer import', 'Product catalog', 'Fulfillment'],
        status: 'available',
      },
      {
        name: 'Alibaba.com',
        description: 'Connect your Alibaba.com store for lead and order sync.',
        features: ['Inquiry sync', 'RFQ management', 'Product sync', 'Order import'],
        status: 'available',
      },
      {
        name: 'Made-in-China',
        description: 'Sync inquiries and leads from Made-in-China.com.',
        features: ['Lead import', 'Inquiry sync', 'Product catalog', 'Analytics'],
        status: 'coming_soon',
      },
      {
        name: 'Amazon',
        description: 'Connect Amazon seller accounts for order management.',
        features: ['Order sync', 'Inventory', 'FBA tracking', 'Reviews'],
        status: 'coming_soon',
      },
    ],
  },
  {
    name: 'Documents & Storage',
    icon: FileText,
    description: 'Connect your file storage and document management',
    integrations: [
      {
        name: 'Google Drive',
        description: 'Store and share documents via Google Drive.',
        features: ['File sync', 'Folder structure', 'Sharing', 'Search'],
        status: 'available',
      },
      {
        name: 'Dropbox',
        description: 'Connect Dropbox for document storage and sharing.',
        features: ['File sync', 'Sharing links', 'Version history', 'Search'],
        status: 'available',
      },
      {
        name: 'OneDrive',
        description: 'Microsoft OneDrive integration for business documents.',
        features: ['File sync', 'Office integration', 'Sharing', 'Search'],
        status: 'available',
      },
    ],
  },
  {
    name: 'Productivity',
    icon: Zap,
    description: 'Connect your favorite productivity tools',
    integrations: [
      {
        name: 'Slack',
        description: 'Get notifications and updates in your Slack workspace.',
        features: ['Notifications', 'Commands', 'Threads', 'Search'],
        status: 'available',
      },
      {
        name: 'Zapier',
        description: 'Connect 5000+ apps through Zapier automations.',
        features: ['5000+ apps', 'Triggers', 'Actions', 'Multi-step'],
        status: 'available',
      },
      {
        name: 'Webhooks',
        description: 'Send events to any external system via webhooks.',
        features: ['Custom events', 'Retry logic', 'Logs', 'Security'],
        status: 'available',
      },
      {
        name: 'API',
        description: 'Full REST API for custom integrations.',
        features: ['REST API', 'Webhooks', 'OAuth', 'Rate limits'],
        status: 'available',
      },
    ],
  },
];

export function IntegrationsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="pt-32 pb-16 bg-gradient-to-br from-xisync-blue-50 via-white to-xisync-cyan-50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Connect Your{' '}
                <span className="gradient-text">Entire Stack</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                XiSync integrates with the tools you already use.
                Messaging, email, e-commerce, documents — all in one place.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/demo">
                  <Button>Start Free Trial</Button>
                </Link>
                <Link to="/docs/api">
                  <Button variant="outline">View API Docs</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {integrationCategories.map((category, index) => (
          <section
            key={category.name}
            className={`section-padding ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="container-custom">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-xisync-cyan-100 flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-xisync-cyan-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.integrations.map((integration) => (
                  <div
                    key={integration.name}
                    className="bg-white rounded-xl p-6 border border-gray-100 hover:border-xisync-cyan-200 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
                        {integration.name.charAt(0)}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          integration.status === 'available'
                            ? 'bg-xisync-green-100 text-xisync-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {integration.status === 'available' ? 'Available' : 'Coming Soon'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{integration.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                    <ul className="space-y-1">
                      {integration.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-3 h-3 text-xisync-cyan-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="section-padding bg-xisync-blue-900">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Need a Custom Integration?
              </h2>
              <p className="text-xisync-blue-200 mb-8">
                Our API and webhook system allows you to build any integration you need.
                Or talk to our team about enterprise integrations.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/docs/api">
                  <Button className="bg-white text-xisync-blue-900 hover:bg-gray-100">
                    API Documentation
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Contact Sales
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
