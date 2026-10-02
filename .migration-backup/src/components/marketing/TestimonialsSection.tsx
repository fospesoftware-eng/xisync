import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      "XiSync transformed how we manage international buyers. The real-time translation alone saved us countless hours and prevented misunderstandings.",
    author: 'Zhang Wei',
    role: 'Export Manager',
    company: 'Shenzhen Electronics Co.',
    rating: 5,
    avatar: 'ZW',
  },
  {
    quote:
      "We reduced our response time from days to minutes. Our buyers love the customer portal — they can track everything themselves.",
    author: 'Li Ming',
    role: 'CEO',
    company: 'Hangzhou Textiles Ltd.',
    rating: 5,
    avatar: 'LM',
  },
  {
    quote:
      "The compliance center is a game-changer. No more scrambling for certificates at the last minute. Everything is organized and tracked.",
    author: 'Wang Fang',
    role: 'Operations Director',
    company: 'Guangzhou Auto Parts',
    rating: 5,
    avatar: 'WF',
  },
];

const logos = [
  'Alibaba', 'Made-in-China', 'Global Sources', 'DHgate', 'AliExpress', 'TradeKey'
];

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by{' '}
            <span className="gradient-text">10,000+ Exporters</span>
          </h2>
          <p className="text-lg text-gray-600">
            See how Chinese manufacturers are growing their global business with XiSync.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
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
              <Quote className="w-8 h-8 text-xisync-cyan-200 mb-3" />
              <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-xisync-blue-500 to-xisync-cyan-500 flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-12">
          <p className="text-center text-sm text-gray-500 mb-8">
            Integrates with leading B2B platforms
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {logos.map((logo) => (
              <div
                key={logo}
                className="text-xl font-bold text-gray-300 hover:text-gray-400 transition-colors"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
