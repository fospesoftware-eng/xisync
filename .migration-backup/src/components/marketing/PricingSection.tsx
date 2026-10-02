import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

const plans = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    description: 'Perfect for small exporters getting started.',
    features: [
      { text: 'Up to 3 team members', included: true },
      { text: '500 messages/month', included: true },
      { text: 'CRM & Pipeline', included: true },
      { text: 'Email integration', included: true },
      { text: 'Basic reporting', included: true },
      { text: 'WhatsApp integration', included: false },
      { text: 'Customer portal', included: false },
      { text: 'API access', included: false },
    ],
    popular: false,
    cta: 'Start Free Trial',
  },
  {
    name: 'Pro',
    price: '$149',
    period: '/month',
    description: 'For growing teams that need more power.',
    features: [
      { text: 'Up to 10 team members', included: true },
      { text: '5,000 messages/month', included: true },
      { text: 'CRM & Pipeline', included: true },
      { text: 'All messaging channels', included: true },
      { text: 'AI translation', included: true },
      { text: 'Logistics tracking', included: true },
      { text: 'Customer portal', included: true },
      { text: 'Priority support', included: true },
    ],
    popular: true,
    cta: 'Start Free Trial',
  },
  {
    name: 'Business',
    price: '$399',
    period: '/month',
    description: 'For established exporters with complex needs.',
    features: [
      { text: 'Up to 25 team members', included: true },
      { text: '25,000 messages/month', included: true },
      { text: 'Everything in Pro', included: true },
      { text: 'Compliance center', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Custom workflows', included: true },
      { text: 'API access', included: true },
      { text: 'Dedicated support', included: true },
    ],
    popular: false,
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with custom requirements.',
    features: [
      { text: 'Unlimited team members', included: true },
      { text: 'Unlimited messages', included: true },
      { text: 'Everything in Business', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'On-premise option', included: true },
      { text: 'SLA guarantees', included: true },
      { text: 'Dedicated success manager', included: true },
      { text: 'Custom training', included: true },
    ],
    popular: false,
    cta: 'Contact Sales',
  },
];

export function PricingSection() {
  return (
    <section className="section-padding bg-gray-50" id="pricing">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent{' '}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-gray-600">
            Start with a 14-day free trial. No credit card required.
            Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative bg-white rounded-2xl p-6 border-2 transition-all
                ${plan.popular
                  ? 'border-xisync-cyan-500 shadow-xl shadow-xisync-cyan-100'
                  : 'border-gray-100 hover:border-gray-200'
                }
              `}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-gradient-to-r from-xisync-cyan-500 to-xisync-green-500 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-2">
                    {feature.included ? (
                      <div className="w-5 h-5 rounded-full bg-xisync-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-xisync-green-600" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="w-3 h-3 text-gray-400" />
                      </div>
                    )}
                    <span
                      className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to={plan.name === 'Enterprise' ? '/contact' : '/demo'}>
                <Button
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Need a custom plan?{' '}
            <Link to="/contact" className="text-xisync-cyan-600 font-medium hover:underline">
              Talk to our sales team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
