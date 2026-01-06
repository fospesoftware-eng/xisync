import { Header } from '../../components/marketing/Header';
import { Footer } from '../../components/marketing/Footer';
import { CTASection } from '../../components/marketing/CTASection';
import {
  Users,
  MessageCircle,
  Package,
  FileCheck,
  LayoutDashboard,
  Share2,
  ArrowRight,
  Check,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

const modules = [
  {
    id: 'crm',
    icon: Users,
    name: 'CRM',
    title: 'Customer Relationship Management',
    subtitle: 'Manage your entire buyer journey',
    description:
      'From first contact to repeat purchase, XiSync CRM helps you track every interaction, manage your sales pipeline, and build lasting relationships with global buyers.',
    features: [
      'Lead capture and qualification',
      'Account and contact management',
      'Visual sales pipeline',
      'Activity tracking and reminders',
      'Custom fields and tags',
      'Lead scoring with AI',
      'Quote and proposal builder',
      'Forecasting and reports',
    ],
    benefits: [
      { label: 'Increase conversion', value: '35%' },
      { label: 'Faster follow-up', value: '10x' },
      { label: 'Better retention', value: '50%' },
    ],
  },
  {
    id: 'messaging',
    icon: MessageCircle,
    name: 'Connect',
    title: 'Omnichannel Messaging',
    subtitle: 'One inbox, every channel',
    description:
      'WhatsApp, WeChat, Email, Instagram, Facebook — all conversations in one unified inbox. Real-time AI powered CRM breaks language barriers instantly.',
    features: [
      'Unified inbox across all channels',
      'Real-time AI powered CRM',
      'Smart reply suggestions',
      'Message templates',
      'SLA tracking and alerts',
      'Team assignment and routing',
      'Conversation history',
      'Sentiment analysis',
    ],
    benefits: [
      { label: 'Response time', value: '-80%' },
      { label: 'Customer satisfaction', value: '+45%' },
      { label: 'Messages handled', value: '3x' },
    ],
  },
  {
    id: 'social',
    icon: Share2,
    name: 'Social',
    title: 'Social Media Management',
    subtitle: 'Turn followers into buyers',
    description:
      'Schedule posts, manage multiple accounts, and convert social engagement into qualified leads. All from one dashboard.',
    features: [
      'Multi-platform posting',
      'Content calendar',
      'Post scheduling',
      'Comment management',
      'Lead capture from social',
      'Performance analytics',
      'Team collaboration',
      'AI content suggestions',
    ],
    benefits: [
      { label: 'Engagement', value: '+120%' },
      { label: 'Leads from social', value: '+200%' },
      { label: 'Time saved', value: '15hrs/week' },
    ],
  },
  {
    id: 'logistics',
    icon: Package,
    name: 'Logistics',
    title: 'Shipment Tracking',
    subtitle: 'Visibility from factory to destination',
    description:
      'Track every shipment across all modes — sea, air, express. Automated milestone updates keep your customers informed and reduce support inquiries.',
    features: [
      'Multi-modal tracking',
      'Milestone management',
      'Delay detection and alerts',
      'Customer tracking portal',
      'Document attachment',
      'Carrier integration',
      'Exception management',
      'Delivery confirmation',
    ],
    benefits: [
      { label: 'Support tickets', value: '-60%' },
      { label: 'On-time visibility', value: '100%' },
      { label: 'Customer trust', value: '+40%' },
    ],
  },
  {
    id: 'compliance',
    icon: FileCheck,
    name: 'Compliance',
    title: 'Compliance Center',
    subtitle: 'Never miss a document',
    description:
      'Manage certificates, track expirations, and ensure you have the right documents for every destination. AI helps you stay compliant.',
    features: [
      'Document library',
      'Expiration tracking',
      'Version control',
      'Country requirements',
      'Compliance checklists',
      'Audit trail',
      'Document sharing',
      'OCR extraction',
    ],
    benefits: [
      { label: 'Compliance issues', value: '-90%' },
      { label: 'Document retrieval', value: '10x faster' },
      { label: 'Audit readiness', value: '100%' },
    ],
  },
  {
    id: 'portal',
    icon: LayoutDashboard,
    name: 'Portal',
    title: 'Customer Self-Service',
    subtitle: 'Empower your buyers',
    description:
      'Give your buyers a branded portal to track orders, view shipments, download documents, and communicate with your team — in their language.',
    features: [
      'Branded portal',
      'Order tracking',
      'Shipment visibility',
      'Document downloads',
      'Messaging center',
      'Quote acceptance',
      'Multi-language',
      'Mobile-friendly',
    ],
    benefits: [
      { label: 'Self-service rate', value: '70%' },
      { label: 'Support volume', value: '-50%' },
      { label: 'Buyer satisfaction', value: '+60%' },
    ],
  },
];

export function ProductPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="pt-32 pb-20 bg-gradient-to-br from-xisync-blue-50 via-white to-xisync-cyan-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                One Platform,{' '}
                <span className="gradient-text">Everything You Need</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Six powerful modules that work together seamlessly.
                Start with what you need, add more as you grow.
              </p>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-4">
              {modules.map((module) => (
                <a
                  key={module.id}
                  href={`#${module.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 hover:border-xisync-cyan-300 hover:shadow-md transition-all"
                >
                  <module.icon className="w-4 h-4 text-xisync-cyan-600" />
                  <span className="text-sm font-medium text-gray-700">{module.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {modules.map((module, index) => (
          <section
            key={module.id}
            id={module.id}
            className={`section-padding ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="container-custom">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-xisync-cyan-100 text-xisync-cyan-700 text-sm font-medium mb-4">
                    <module.icon className="w-4 h-4" />
                    {module.name}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {module.title}
                  </h2>
                  <p className="text-lg text-xisync-cyan-600 font-medium mb-4">
                    {module.subtitle}
                  </p>
                  <p className="text-gray-600 mb-8">{module.description}</p>

                  <div className="grid sm:grid-cols-2 gap-3 mb-8">
                    {module.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-xisync-green-100 flex items-center justify-center">
                          <Check className="w-3 h-3 text-xisync-green-600" />
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-6">
                    {module.benefits.map((benefit) => (
                      <div key={benefit.label}>
                        <div className="text-2xl font-bold gradient-text">{benefit.value}</div>
                        <div className="text-sm text-gray-500">{benefit.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 aspect-square flex items-center justify-center">
                    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-xisync-blue-500 to-xisync-cyan-500 flex items-center justify-center">
                          <module.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{module.name}</div>
                          <div className="text-xs text-gray-500">XiSync Module</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100" />
                            <div className="flex-1">
                              <div className="h-2 bg-gray-200 rounded w-3/4 mb-1" />
                              <div className="h-2 bg-gray-100 rounded w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-xisync-lime-500" />
                            <span className="text-xs text-gray-500">AI powered CRM</span>
                          </div>
                          <div className="flex items-center gap-1 text-xisync-cyan-600 text-sm font-medium">
                            <span>Learn more</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
