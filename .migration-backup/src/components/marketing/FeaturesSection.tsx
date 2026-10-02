import {
  Users,
  MessageCircle,
  Package,
  FileCheck,
  LayoutDashboard,
  Share2,
  Zap,
  Languages,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';

export function FeaturesSection() {
  const { t, language } = useI18n();

  const modules = [
    {
      icon: Users,
      name: 'CRM',
      title: t.features.crm.title,
      description: t.features.crm.description,
      features: t.features.crm.features,
      gradient: 'from-xisync-blue-500 to-xisync-blue-700',
    },
    {
      icon: MessageCircle,
      name: 'Connect',
      title: t.features.connect.title,
      description: t.features.connect.description,
      features: t.features.connect.features,
      gradient: 'from-xisync-cyan-500 to-xisync-cyan-700',
    },
    {
      icon: Share2,
      name: 'Social',
      title: t.features.social.title,
      description: t.features.social.description,
      features: t.features.social.features,
      gradient: 'from-teal-500 to-teal-700',
    },
    {
      icon: Package,
      name: 'Logistics',
      title: t.features.logistics.title,
      description: t.features.logistics.description,
      features: t.features.logistics.features,
      gradient: 'from-xisync-green-500 to-xisync-green-700',
    },
    {
      icon: FileCheck,
      name: 'Compliance',
      title: t.features.compliance.title,
      description: t.features.compliance.description,
      features: t.features.compliance.features,
      gradient: 'from-xisync-lime-500 to-xisync-lime-700',
    },
    {
      icon: LayoutDashboard,
      name: 'Portal',
      title: t.features.portal.title,
      description: t.features.portal.description,
      features: t.features.portal.features,
      gradient: 'from-orange-500 to-orange-700',
    },
  ];

  const aiFeatures = [
    {
      icon: Languages,
      title: language === 'zh' ? '实时翻译' : 'Real-time Translation',
      description: language === 'zh'
        ? '用您的语言沟通，我们即时处理翻译。'
        : 'Communicate in your language, we handle the translation instantly.',
    },
    {
      icon: Zap,
      title: language === 'zh' ? '智能建议' : 'Smart Suggestions',
      description: language === 'zh'
        ? '基于上下文和历史的AI CRM回复建议。'
        : 'AI powered CRM reply suggestions based on context and history.',
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {language === 'zh' ? (
              <>
                出口成功{' '}
                <span className="gradient-text">所需一切</span>
              </>
            ) : (
              <>
                Everything You Need to{' '}
                <span className="gradient-text">Export Successfully</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div
              key={module.name}
              className="group card-hover"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <module.icon className="w-6 h-6 text-white" />
              </div>
              <div className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-gray-500 bg-gray-100 mb-2">
                {module.name}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{module.description}</p>
              <ul className="space-y-2">
                {module.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-xisync-cyan-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-r from-xisync-blue-900 via-xisync-blue-800 to-xisync-cyan-800 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xisync-cyan-300 text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                {language === 'zh' ? 'AI驱动' : 'AI-Powered'}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {language === 'zh' ? '用AI打破语言障碍' : 'Break Language Barriers with AI'}
              </h3>
              <p className="text-xisync-blue-100 mb-6">
                {language === 'zh'
                  ? '我们的AI理解上下文、行业术语和文化细微差别。在我们处理翻译的同时，与全球买家自然沟通。'
                  : 'Our AI understands context, industry terms, and cultural nuances. Communicate naturally with buyers worldwide while we handle the translation.'}
              </p>
              <div className="space-y-4">
                {aiFeatures.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-xisync-cyan-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{feature.title}</h4>
                      <p className="text-sm text-xisync-blue-200">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-xisync-cyan-500/20 flex items-center justify-center text-sm font-bold text-xisync-cyan-300">
                      EN
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg p-3">
                      <p className="text-white text-sm">
                        {language === 'zh'
                          ? 'Hello! I\'m interested in your products. What\'s the MOQ for the stainless steel water bottles?'
                          : 'Hello! I\'m interested in your products. What\'s the MOQ for the stainless steel water bottles?'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="px-3 py-1 rounded-full bg-xisync-cyan-500/20 text-xisync-cyan-300 text-xs">
                      {language === 'zh' ? 'AI翻译中...' : 'AI translating...'}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-xisync-lime-500/20 flex items-center justify-center text-sm font-bold text-xisync-lime-300">
                      CN
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg p-3">
                      <p className="text-white text-sm">
                        {language === 'zh'
                          ? '最低起订量1000件，交货期15-20天，可定制。订单超过5000件免费提供样品。'
                          : '1000pcs minimum. Lead time 15-20 days. Customization available. Free samples for orders over 5000pcs.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
