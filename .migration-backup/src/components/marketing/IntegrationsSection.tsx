import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

const integrations = [
  {
    name: 'WhatsApp Business',
    logo: 'https://images.pexels.com/photos/46924/pexels-photo-46924.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Messaging',
    description: 'Official WhatsApp Business API integration for reliable messaging.',
  },
  {
    name: 'WeChat',
    logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Messaging',
    description: 'Connect with Chinese businesses and consumers on WeChat.',
  },
  {
    name: 'Email',
    logo: 'https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Messaging',
    description: 'Gmail, Outlook, and custom SMTP/IMAP support.',
  },
  {
    name: 'Instagram',
    logo: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Social',
    description: 'Manage DMs and comments from your unified inbox.',
  },
  {
    name: 'Facebook',
    logo: 'https://images.pexels.com/photos/267399/pexels-photo-267399.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Social',
    description: 'Facebook Messenger and page management.',
  },
  {
    name: 'TikTok',
    logo: 'https://images.pexels.com/photos/5081930/pexels-photo-5081930.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Social',
    description: 'Engage with your TikTok audience and track leads.',
  },
];

const benefits = [
  'Single unified inbox for all channels',
  'Automatic contact syncing',
  'Real-time message delivery',
  'Smart routing and assignment',
  'Full conversation history',
  'Native mobile apps',
];

export function IntegrationsSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Connect All Your{' '}
              <span className="gradient-text">Communication Channels</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Meet your customers where they are. WhatsApp, WeChat, Email, Instagram,
              Facebook — all conversations in one place, with instant translation.
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-xisync-green-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-xisync-green-600" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link to="/integrations">
              <Button variant="secondary">View All Integrations</Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-xisync-cyan-200 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-100 mb-3 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-lg font-bold text-gray-500">
                    {integration.name.charAt(0)}
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm group-hover:text-xisync-blue-900">
                  {integration.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{integration.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
