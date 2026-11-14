import { Fragment, useState } from 'react';
import { Header } from '../../components/marketing/Header';
import { Footer } from '../../components/marketing/Footer';
import { Check, X, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 49,
    yearlyPrice: 39,
    description: 'Perfect for small exporters getting started with international sales.',
    cta: 'Start Free Trial',
    ctaLink: '/demo',
    popular: false,
  },
  {
    name: 'Pro',
    monthlyPrice: 149,
    yearlyPrice: 119,
    description: 'For growing teams that need more power and all messaging channels.',
    cta: 'Start Free Trial',
    ctaLink: '/demo',
    popular: true,
  },
  {
    name: 'Business',
    monthlyPrice: 399,
    yearlyPrice: 319,
    description: 'For established exporters with complex compliance and logistics needs.',
    cta: 'Start Free Trial',
    ctaLink: '/demo',
    popular: false,
  },
  {
    name: 'Enterprise',
    monthlyPrice: null,
    yearlyPrice: null,
    description: 'For large organizations with custom requirements and dedicated support.',
    cta: 'Contact Sales',
    ctaLink: '/contact',
    popular: false,
  },
];

const featureCategories = [
  {
    name: 'Core Features',
    features: [
      { name: 'Team members', starter: '3', pro: '10', business: '25', enterprise: 'Unlimited' },
      { name: 'Messages per month', starter: '500', pro: '5,000', business: '25,000', enterprise: 'Unlimited' },
      { name: 'Storage', starter: '1 GB', pro: '10 GB', business: '50 GB', enterprise: 'Unlimited' },
      { name: 'CRM (Leads, Accounts, Contacts)', starter: true, pro: true, business: true, enterprise: true },
      { name: 'Sales Pipeline', starter: true, pro: true, business: true, enterprise: true },
      { name: 'Basic Reporting', starter: true, pro: true, business: true, enterprise: true },
    ],
  },
  {
    name: 'Messaging',
    features: [
      { name: 'Email Integration', starter: true, pro: true, business: true, enterprise: true },
      { name: 'WhatsApp Business', starter: false, pro: true, business: true, enterprise: true },
      { name: 'WeChat', starter: false, pro: true, business: true, enterprise: true },
      { name: 'Instagram & Facebook', starter: false, pro: true, business: true, enterprise: true },
      { name: 'AI Translation', starter: false, pro: true, business: true, enterprise: true },
      { name: 'Smart Reply Suggestions', starter: false, pro: true, business: true, enterprise: true },
    ],
  },
  {
    name: 'Sales & Quotes',
    features: [
      { name: 'Quote Builder', starter: true, pro: true, business: true, enterprise: true },
      { name: 'Multi-currency Support', starter: true, pro: true, business: true, enterprise: true },
      { name: 'Quote Approval Workflow', starter: false, pro: true, business: true, enterprise: true },
      { name: 'Product Catalog', starter: 'Basic', pro: 'Full', business: 'Full', enterprise: 'Full' },
      { name: 'Order Management', starter: false, pro: true, business: true, enterprise: true },
    ],
  },
  {
    name: 'Logistics & Compliance',
    features: [
      { name: 'Shipment Tracking', starter: false, pro: true, business: true, enterprise: true },
      { name: 'Customer Tracking Portal', starter: false, pro: true, business: true, enterprise: true },
      { name: 'Compliance Center', starter: false, pro: false, business: true, enterprise: true },
      { name: 'Document Management', starter: 'Basic', pro: 'Full', business: 'Full', enterprise: 'Full' },
      { name: 'Expiration Alerts', starter: false, pro: false, business: true, enterprise: true },
    ],
  },
  {
    name: 'Portal & Self-Service',
    features: [
      { name: 'Customer Portal', starter: false, pro: true, business: true, enterprise: true },
      { name: 'Custom Branding', starter: false, pro: false, business: true, enterprise: true },
      { name: 'Custom Domain', starter: false, pro: false, business: true, enterprise: true },
    ],
  },
  {
    name: 'Analytics & Integration',
    features: [
      { name: 'Dashboard Analytics', starter: 'Basic', pro: 'Advanced', business: 'Advanced', enterprise: 'Custom' },
      { name: 'API Access', starter: false, pro: false, business: true, enterprise: true },
      { name: 'Webhooks', starter: false, pro: false, business: true, enterprise: true },
      { name: 'Custom Integrations', starter: false, pro: false, business: false, enterprise: true },
    ],
  },
  {
    name: 'Support',
    features: [
      { name: 'Email Support', starter: true, pro: true, business: true, enterprise: true },
      { name: 'Chat Support', starter: false, pro: true, business: true, enterprise: true },
      { name: 'Phone Support', starter: false, pro: false, business: true, enterprise: true },
      { name: 'Dedicated Success Manager', starter: false, pro: false, business: false, enterprise: true },
      { name: 'Custom Training', starter: false, pro: false, business: false, enterprise: true },
      { name: 'SLA Guarantee', starter: false, pro: false, business: '99.9%', enterprise: '99.99%' },
    ],
  },
];

const faqs = [
  {
    question: 'Can I try XiSync before committing?',
    answer: 'Yes! All plans come with a 14-day free trial. No credit card required. You can explore all features and upgrade anytime.',
  },
  {
    question: 'What happens when I exceed my message limit?',
    answer: 'We will notify you when you reach 80% of your limit. You can upgrade your plan anytime, or purchase additional message packs.',
  },
  {
    question: 'Can I change plans later?',
    answer: 'Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we prorate any differences.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use enterprise-grade encryption, are SOC 2 compliant, and store data in secure data centers. Your data is always yours.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes! Save 20% when you choose annual billing. All plans qualify for the annual discount.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, Alipay, WeChat Pay, and bank transfers for Enterprise plans.',
  },
];

export function PricingPage() {
  const [annual, setAnnual] = useState(true);

  const renderFeatureValue = (value: boolean | string) => {
    if (value === true) {
      return (
        <div className="w-5 h-5 rounded-full bg-xisync-green-100 flex items-center justify-center mx-auto">
          <Check className="w-3 h-3 text-xisync-green-600" />
        </div>
      );
    }
    if (value === false) {
      return (
        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
          <X className="w-3 h-3 text-gray-400" />
        </div>
      );
    }
    return <span className="text-sm text-gray-700">{value}</span>;
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="pt-32 pb-12 bg-gradient-to-br from-xisync-blue-50 via-white to-xisync-cyan-50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Simple, Transparent{' '}
                <span className="gradient-text">Pricing</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Start with a 14-day free trial. No credit card required.
                Choose the plan that fits your business.
              </p>

              <div className="inline-flex items-center gap-3 p-1 bg-gray-100 rounded-full">
                <button
                  onClick={() => setAnnual(false)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !annual ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    annual ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Annual
                  <span className="ml-2 text-xs text-xisync-green-600 font-semibold">Save 20%</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative bg-white rounded-2xl p-6 border-2 transition-all ${
                    plan.popular
                      ? 'border-xisync-cyan-500 shadow-xl shadow-xisync-cyan-100'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
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
                      {plan.monthlyPrice ? (
                        <>
                          <span className="text-4xl font-bold text-gray-900">
                            ${annual ? plan.yearlyPrice : plan.monthlyPrice}
                          </span>
                          <span className="text-gray-500">/month</span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-gray-900">Custom</span>
                      )}
                    </div>
                    {annual && plan.monthlyPrice && (
                      <p className="text-sm text-gray-500 mt-1">
                        Billed ${plan.yearlyPrice! * 12}/year
                      </p>
                    )}
                    <p className="mt-3 text-sm text-gray-500">{plan.description}</p>
                  </div>

                  <Link to={plan.ctaLink}>
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

            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <div className="p-6 bg-white border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Compare Plans</h2>
                <p className="text-gray-600">See which plan is right for your business</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 font-medium text-gray-500 w-1/3">Feature</th>
                      {plans.map((plan) => (
                        <th key={plan.name} className="p-4 text-center font-semibold text-gray-900">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {featureCategories.map((category) => (
                      <Fragment key={category.name}>
                        <tr className="bg-gray-100">
                          <td colSpan={5} className="p-4 font-semibold text-gray-900">
                            {category.name}
                          </td>
                        </tr>
                        {category.features.map((feature) => (
                          <tr key={feature.name} className="border-b border-gray-100">
                            <td className="p-4 text-sm text-gray-700">{feature.name}</td>
                            <td className="p-4 text-center">{renderFeatureValue(feature.starter)}</td>
                            <td className="p-4 text-center">{renderFeatureValue(feature.pro)}</td>
                            <td className="p-4 text-center">{renderFeatureValue(feature.business)}</td>
                            <td className="p-4 text-center">{renderFeatureValue(feature.enterprise)}</td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.question} className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 flex items-start gap-2">
                      <HelpCircle className="w-5 h-5 text-xisync-cyan-500 flex-shrink-0 mt-0.5" />
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-gray-600 pl-7">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
