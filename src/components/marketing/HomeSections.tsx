import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ArrowRight, Check, Star } from 'lucide-react';
import { CMSSection } from '../../lib/cms-service';

interface SectionProps {
  section: CMSSection;
}

export function HeroSection({ section }: SectionProps) {
  const content = section.content as any;
  return (
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
            {content.badge_text}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            {content.headline}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {content.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link to={content.cta_primary_link}>
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                {content.cta_primary_text}
              </Button>
            </Link>
            <Link to={content.cta_secondary_link}>
              <Button variant="outline" size="lg">
                {content.cta_secondary_text}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsSection({ section }: SectionProps) {
  const content = section.content as any;
  const stats = content.items || [];

  return (
    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
      {stats.map((stat: any) => (
        <div key={stat.label} className="text-center">
          <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
          <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export function ExploreSection({ section }: SectionProps) {
  const content = section.content as any;
  const items = content.items || [];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {content.title} <span className="gradient-text">Sections</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {content.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item: any) => (
            <Link
              key={item.title}
              to={item.link}
              className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-xisync-cyan-300 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-xisync-blue-500 to-xisync-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-white text-lg font-bold">{item.title.charAt(0)}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-xisync-cyan-700">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-xisync-cyan-600 group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ModulesSection({ section }: SectionProps) {
  const content = section.content as any;
  const items = content.items || [];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {content.title} <span className="gradient-text">Modules</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {content.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((module: any) => (
            <Link
              key={module.name}
              to={module.link}
              className="group card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-xisync-blue-500 to-xisync-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-white text-lg font-bold">{module.name.charAt(0)}</span>
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
  );
}

export function ChannelsSection({ section }: SectionProps) {
  const content = section.content as any;
  const features = content.features || [];
  const channels = content.channels || [];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {content.title} <span className="gradient-text">Channels</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {content.description}
            </p>
            <ul className="space-y-3 mb-8">
              {features.map((item: string) => (
                <li key={item} className="flex items-center gap-2 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-xisync-green-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-xisync-green-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link to={content.cta_link}>
              <Button variant="secondary">{content.cta_text}</Button>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {channels.map((channel: string) => (
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
  );
}

export function TestimonialsSection({ section }: SectionProps) {
  const content = section.content as any;
  const items = content.items || [];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {content.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {items.map((testimonial: any) => (
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
  );
}

export function PricingSection({ section }: SectionProps) {
  const content = section.content as any;
  const items = content.items || [];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {content.title} <span className="gradient-text">Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {content.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {items.map((plan: any) => (
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
              <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              <ul className="mt-6 space-y-2">
                {plan.features.map((feature: string) => (
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
  );
}

export function CTASection({ section }: SectionProps) {
  const content = section.content as any;

  return (
    <section className="section-padding bg-gradient-to-br from-xisync-blue-900 via-xisync-blue-800 to-xisync-cyan-900">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {content.title}
          </h2>
          <p className="text-lg text-xisync-blue-100 mb-10">
            {content.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={content.cta_primary_link}>
              <Button size="lg" className="bg-white text-xisync-blue-900 hover:bg-gray-100">
                {content.cta_primary_text}
              </Button>
            </Link>
            <Link to={content.cta_secondary_link}>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                {content.cta_secondary_text}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
