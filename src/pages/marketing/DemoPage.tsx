import { useState } from 'react';
import { Header } from '../../components/marketing/Header';
import { Footer } from '../../components/marketing/Footer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Check,
  Building2,
  Users,
  Globe,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

const benefits = [
  'See all features in action',
  'Get personalized recommendations',
  'Learn best practices for your industry',
  'No commitment required',
];

const industries = [
  'Manufacturing',
  'Consumer Goods',
  'Electronics',
  'Textiles',
  'Machinery',
  'Auto Parts',
  'Medical Devices',
  'Food & Beverage',
  'Other',
];

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '500+ employees',
];

export function DemoPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    industry: '',
    companySize: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="pt-32 pb-20 bg-gradient-to-br from-xisync-blue-50 via-white to-xisync-cyan-50">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  See XiSync{' '}
                  <span className="gradient-text">in Action</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Book a personalized demo with our team. We will show you how XiSync
                  can help you manage customers, communicate better, and grow your export business.
                </p>

                <div className="space-y-4 mb-12">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-xisync-green-100 flex items-center justify-center">
                        <Check className="w-4 h-4 text-xisync-green-600" />
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">What to expect</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-xisync-blue-100 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-xisync-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Discovery Call (15 min)</div>
                        <div className="text-sm text-gray-500">
                          We learn about your business and challenges
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-xisync-cyan-100 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-4 h-4 text-xisync-cyan-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Live Demo (30 min)</div>
                        <div className="text-sm text-gray-500">
                          See the platform in action with your use cases
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-xisync-green-100 flex items-center justify-center flex-shrink-0">
                        <ArrowRight className="w-4 h-4 text-xisync-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Next Steps (15 min)</div>
                        <div className="text-sm text-gray-500">
                          Get a customized plan and pricing
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-xisync-green-100 flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8 text-xisync-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
                    <p className="text-gray-600 mb-6">
                      We have received your request. Our team will contact you within 24 hours
                      to schedule your personalized demo.
                    </p>
                    <p className="text-sm text-gray-500">
                      Check your email for a confirmation message.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Book Your Demo</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          required
                        />
                        <Input
                          label="Last Name"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          required
                        />
                      </div>

                      <Input
                        label="Work Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        icon={<MessageSquare className="w-4 h-4" />}
                      />

                      <Input
                        label="Company Name"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        icon={<Building2 className="w-4 h-4" />}
                      />

                      <Input
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Industry
                        </label>
                        <select
                          value={formData.industry}
                          onChange={(e) =>
                            setFormData({ ...formData, industry: e.target.value })
                          }
                          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500"
                          required
                        >
                          <option value="">Select your industry</option>
                          {industries.map((industry) => (
                            <option key={industry} value={industry}>
                              {industry}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Company Size
                        </label>
                        <select
                          value={formData.companySize}
                          onChange={(e) =>
                            setFormData({ ...formData, companySize: e.target.value })
                          }
                          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500"
                          required
                        >
                          <option value="">Select company size</option>
                          {companySizes.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Anything else we should know? (Optional)
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          rows={3}
                          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500 resize-none"
                          placeholder="Tell us about your specific needs or challenges..."
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        Request Demo
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        By submitting this form, you agree to our{' '}
                        <a href="/privacy" className="text-xisync-cyan-600 hover:underline">
                          Privacy Policy
                        </a>{' '}
                        and{' '}
                        <a href="/terms" className="text-xisync-cyan-600 hover:underline">
                          Terms of Service
                        </a>
                        .
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Trusted by Leading Exporters
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <span className="text-xl font-bold text-gray-300">Logo {i}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
