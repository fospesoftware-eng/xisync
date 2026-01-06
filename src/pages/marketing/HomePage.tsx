import { Link } from 'react-router-dom';
import { Header } from '../../components/marketing/Header';
import { Footer } from '../../components/marketing/Footer';
import { Button } from '../../components/ui/Button';
import {
  ArrowRight,
  Users,
  MessageCircle,
  Share2,
  Package,
  FileCheck,
  LayoutDashboard,
  Play,
  Globe,
  TrendingUp,
  Shield,
  Zap,
  Star,
  Check,
} from 'lucide-react';

const stats = [
  { value: '10,000+', label: 'Active Exporters' },
  { value: '50+', label: 'Countries Reached' },
  { value: '$2B+', label: 'Trade Volume' },
  { value: '99.9%', label: 'Uptime' },
];

const modules = [
  {
    icon: Users,
    name: 'CRM',
    title: 'Customer Management',
    description: 'Manage leads, accounts, contacts, and deals. Track your entire sales pipeline.',
    href: '/product#crm',
    color: 'from-xisync-blue-500 to-xisync-blue-700',
  },
  {
    icon: MessageCircle,
    name: 'Connect',
    title: 'Omnichannel Messaging',
    description: 'WhatsApp, WeChat, Email, Instagram in one inbox with AI translation.',
    href: '/product#messaging',
    color: 'from-xisync-cyan-500 to-xisync-cyan-700',
  },
  {
    icon: Share2,
    name: 'Social',
    title: 'Social Media',
    description: 'Schedule posts, manage accounts, and convert social engagement to leads.',
    href: '/product#social',
    color: 'from-teal-500 to-teal-700',
  },
  {
    icon: Package,
    name: 'Logistics',
    title: 'Shipment Tracking',
    description: 'Track shipments from factory to destination with customer notifications.',
    href: '/product#logistics',
    color: 'from-xisync-green-500 to-xisync-green-700',
  },
  {
    icon: FileCheck,
    name: 'Compliance',
    title: 'Compliance Center',
    description: 'Manage certificates, track expirations, meet destination requirements.',
    href: '/product#compliance',
    color: 'from-xisync-lime-500 to-xisync-lime-700',
  },
  {
    icon: LayoutDashboard,
    name: 'Portal',
    title: 'Customer Portal',
    description: 'Branded self-service portal for buyers to track orders and documents.',
    href: '/product#portal',
    color: 'from-orange-500 to-orange-700',
  },
];

const pages = [
  {
    title: 'Product',
    description: 'Explore all six modules and see how they work together',
    href: '/product',
    icon: Zap,
  },
  {
    title: 'Integrations',
    description: 'Connect WhatsApp, WeChat, Shopify, Alibaba and more',
    href: '/integrations',
    icon: Globe,
  },
  {
    title: 'Pricing',
    description: 'Simple, transparent pricing with a 14-day free trial',
    href: '/pricing',
    icon: TrendingUp,
  },
  {
    title: 'Book Demo',
    description: 'Get a personalized walkthrough from our team',
    href: '/demo',
    icon: Play,
  },
];

const testimonials = [
  {
    quote: "XiSync transformed how we manage international buyers. The real-time translation alone saved us countless hours.",
    author: 'Zhang Wei',
    role: 'Export Manager, Shenzhen Electronics',
    rating: 5,
  },
  {
    quote: "We reduced our response time from days to minutes. Our buyers love the customer portal.",
    author: 'Li Ming',
    role: 'CEO, Hangzhou Textiles',
    rating: 5,
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-xisync-blue-50 via-white to-xisync-cyan-50" />
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
            <div className="absolute top-20 right-20 w-72 h-72 bg-xisync-cyan-300 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-40 w-96 h-96 bg-xisync-lime-300 rounded-full blur-3xl" />
          </div>

          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-xisync-blue-100 text-xisync-blue-900 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-xisync-green-500 animate-pulse" />
                AI powered CRM
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Export Smarter,{' '}
                <span className="gradient-text">Grow Globally</span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                The all-in-one platform for Chinese exporters. Manage customers,
                communicate across channels, track shipments, and ensure compliance.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <Link to="/demo">
                  <Button size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    View Demo Access
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Explore <span className="gradient-text">XiSync</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Navigate to different sections of our platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {pages.map((page) => (
                <Link
                  key={page.title}
                  to={page.href}
                  className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-xisync-cyan-300 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-xisync-blue-500 to-xisync-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <page.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-xisync-cyan-700">
                    {page.title}
                  </h3>
                  <p className="text-sm text-gray-600">{page.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-xisync-cyan-600 group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Six Powerful <span className="gradient-text">Modules</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Everything you need to manage your export business
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <Link
                  key={module.name}
                  to={module.href}
                  className="group card-hover"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <module.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-gray-500 bg-gray-100 mb-2">
                    {module.name}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="/product">
                <Button size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                  View All Features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Connect All Your{' '}
                  <span className="gradient-text">Channels</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Meet your customers where they are. WhatsApp, WeChat, Email, Instagram,
                  Facebook — all conversations in one place with instant AI translation.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Single unified inbox', 'Real-time translation', 'Smart reply suggestions', 'Full conversation history'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-xisync-green-100 flex items-center justify-center">
                        <Check className="w-3 h-3 text-xisync-green-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/integrations">
                  <Button variant="secondary">View All Integrations</Button>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['WhatsApp', 'WeChat', 'Email', 'Instagram', 'Facebook', 'TikTok'].map((channel) => (
                  <div
                    key={channel}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-xisync-cyan-200 transition-all text-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-100 mx-auto mb-2 flex items-center justify-center text-lg font-bold text-gray-400">
                      {channel.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{channel}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Trusted by <span className="gradient-text">10,000+ Exporters</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.author}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-xisync-blue-500 to-xisync-cyan-500 flex items-center justify-center text-white font-semibold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Simple, Transparent <span className="gradient-text">Pricing</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Start free for 14 days. No credit card required.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { name: 'Starter', price: '$49', desc: 'For small exporters', features: ['3 team members', '500 messages/mo', 'Email integration'] },
                { name: 'Pro', price: '$149', desc: 'For growing teams', features: ['10 team members', '5,000 messages/mo', 'All channels', 'AI translation'], popular: true },
                { name: 'Business', price: '$399', desc: 'For established exporters', features: ['25 team members', '25,000 messages/mo', 'Compliance center', 'API access'] },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-white rounded-2xl p-6 border-2 ${plan.popular ? 'border-xisync-cyan-500 shadow-xl' : 'border-gray-100'}`}
                >
                  {plan.popular && (
                    <span className="px-3 py-1 bg-xisync-cyan-500 text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mt-4">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">/mo</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{plan.desc}</p>
                  <ul className="mt-6 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-xisync-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/pricing" className="block mt-6">
                    <Button variant={plan.popular ? 'primary' : 'outline'} className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/pricing" className="text-xisync-cyan-600 font-medium hover:underline">
                Compare all plans and features
              </Link>
            </div>
          </div>
        </section>

        <section className="section-padding bg-gradient-to-br from-xisync-blue-900 via-xisync-blue-800 to-xisync-cyan-900">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Grow Your Global Business?
              </h2>
              <p className="text-lg text-xisync-blue-100 mb-10">
                Join thousands of exporters who are streamlining operations and growing sales.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/demo">
                  <Button size="lg" className="bg-white text-xisync-blue-900 hover:bg-gray-100">
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                    View Demo Access
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
