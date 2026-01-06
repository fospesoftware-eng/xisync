import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ArrowRight, Calendar, MessageSquare } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

export function CTASection() {
  const { t, language } = useI18n();

  const features = [
    { label: language === 'zh' ? '14天免费试用' : '14-day free trial' },
    { label: language === 'zh' ? '无需信用卡' : 'No credit card required' },
    { label: language === 'zh' ? '随时取消' : 'Cancel anytime' },
  ];

  const cards = [
    {
      icon: Calendar,
      title: t.nav.bookDemo,
      description: language === 'zh' ? '获取XiSync个性化演示' : 'Get a personalized walkthrough of XiSync',
    },
    {
      icon: MessageSquare,
      title: language === 'zh' ? '联系销售' : 'Talk to Sales',
      description: language === 'zh' ? '与我们的团队讨论您的具体需求' : 'Discuss your specific needs with our team',
    },
    {
      icon: ArrowRight,
      title: language === 'zh' ? '免费开始' : 'Start Free',
      description: language === 'zh' ? '免费试用XiSync 14天，无需承诺' : 'Try XiSync free for 14 days, no commitment',
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-xisync-blue-900 via-xisync-blue-800 to-xisync-cyan-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-xisync-cyan-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-xisync-lime-400 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {language === 'zh' ? (
              <>
                准备好拓展您的
                <br />
                <span className="text-xisync-cyan-300">全球业务了吗？</span>
              </>
            ) : (
              <>
                Ready to Grow Your
                <br />
                <span className="text-xisync-cyan-300">Global Business?</span>
              </>
            )}
          </h2>
          <p className="text-lg text-xisync-blue-100 mb-10 max-w-2xl mx-auto">
            {t.cta.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/demo">
              <Button
                size="lg"
                className="bg-white text-xisync-blue-900 hover:bg-gray-100"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
              >
                {t.nav.startFreeTrial}
              </Button>
            </Link>
            <Link to="/demo">
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10"
                icon={<Calendar className="w-5 h-5" />}
              >
                {t.nav.bookDemo}
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-xisync-blue-200">
            {features.map((feature) => (
              <div key={feature.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-xisync-green-400" />
                <span>{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {cards.map((card) => (
            <div key={card.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                <card.icon className="w-6 h-6 text-xisync-cyan-300" />
              </div>
              <h3 className="font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-xisync-blue-200">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
