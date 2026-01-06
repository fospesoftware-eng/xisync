import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ArrowRight, Play, Globe, MessageSquare, TrendingUp, Shield } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

export function HeroSection() {
  const { t, language } = useI18n();

  const stats = [
    { value: '10,000+', label: language === 'zh' ? '活跃出口商' : 'Active Exporters' },
    { value: '50+', label: language === 'zh' ? '覆盖国家' : 'Countries Reached' },
    { value: '$2B+', label: language === 'zh' ? '贸易额' : 'Trade Volume' },
    { value: '99.9%', label: language === 'zh' ? '正常运行' : 'Uptime' },
  ];

  const features = [
    { icon: Globe, label: language === 'zh' ? '多语言支持' : 'Multi-language Support' },
    { icon: MessageSquare, label: language === 'zh' ? '全渠道消息' : 'Omnichannel Messaging' },
    { icon: TrendingUp, label: language === 'zh' ? '智能分析' : 'Smart Analytics' },
    { icon: Shield, label: language === 'zh' ? '企业级安全' : 'Enterprise Security' },
  ];

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
            {language === 'zh' ? 'AI 驱动的 CRM' : 'AI powered CRM'}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            {language === 'zh' ? (
              <>
                智能出口，{' '}
                <span className="gradient-text">全球增长</span>
              </>
            ) : (
              <>
                Export Smarter,{' '}
                <span className="gradient-text">Grow Globally</span>
              </>
            )}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link to="/demo">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                {t.nav.startFreeTrial}
              </Button>
            </Link>
            <button className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-xisync-blue-900 transition-colors">
              <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-xisync-blue-900 ml-0.5" />
              </div>
              <span className="font-medium">{t.hero.demo}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
            {features.map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <feature.icon className="w-4 h-4 text-xisync-cyan-600" />
                <span>{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 relative">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mx-4 lg:mx-auto lg:max-w-5xl">
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-gray-500 max-w-md mx-auto text-center">
                  app.xisync.com/dashboard
                </div>
              </div>
            </div>
            <div className="aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 p-8 w-full max-w-3xl">
                <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-8 w-8 bg-xisync-cyan-100 rounded-lg" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-gray-100 rounded" />
                    <div className="h-2 w-3/4 bg-gray-100 rounded" />
                    <div className="h-2 w-1/2 bg-gray-100 rounded" />
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-10 w-10 bg-xisync-blue-100 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-2 w-20 bg-gray-200 rounded mb-2" />
                      <div className="h-2 w-32 bg-gray-100 rounded" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="h-3 w-16 bg-gray-200 rounded mb-3" />
                    <div className="text-2xl font-bold text-xisync-blue-900">$45.2K</div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-4 h-4 rounded-full bg-xisync-green-100 flex items-center justify-center">
                        <TrendingUp className="w-2.5 h-2.5 text-xisync-green-600" />
                      </div>
                      <span className="text-xs text-xisync-green-600">+12%</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="h-3 w-16 bg-gray-200 rounded mb-3" />
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-xisync-cyan-100 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-xisync-cyan-500 rounded-full" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">75%</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="h-3 w-16 bg-gray-200 rounded mb-3" />
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="flex-1 bg-xisync-lime-400 rounded"
                          style={{ height: `${20 + i * 8}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
  );
}
